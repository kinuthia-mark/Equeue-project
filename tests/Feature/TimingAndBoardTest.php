<?php

namespace Tests\Feature;

use App\Models\QueueEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

/**
 * Covers wait estimates, service timing, leaving the queue and the public
 * display board.
 */
class TimingAndBoardTest extends TestCase
{
    use RefreshDatabase;

    private function entry(array $attributes = []): QueueEntry
    {
        return QueueEntry::factory()->create(['service' => 'passport-renewal'] + $attributes);
    }

    public function test_calling_and_completing_record_timestamps(): void
    {
        Mail::fake();
        $officer = User::factory()->create();
        $entry = $this->entry();

        $this->travelTo(now()->setTime(9, 0));
        $this->actingAs($officer)->post('/officer/call-next', ['service' => 'passport-renewal']);
        $this->travelTo(now()->setTime(9, 6));
        $this->actingAs($officer)->post(route('officer.complete', $entry));

        $entry->refresh();
        $this->assertSame('09:00', $entry->called_at->format('H:i'));
        $this->assertSame('09:06', $entry->completed_at->format('H:i'));
        $this->assertEquals(6.0, $entry->serviceMinutes());
    }

    public function test_average_falls_back_to_the_configured_default(): void
    {
        config(['services_list.default_service_minutes' => 7]);

        $this->assertEquals(7.0, QueueEntry::averageServiceMinutes('passport-renewal'));
    }

    public function test_average_uses_recent_completed_entries(): void
    {
        $start = now()->subHour();
        $this->entry(['status' => QueueEntry::COMPLETED, 'called_at' => $start, 'completed_at' => $start->copy()->addMinutes(4)]);
        $this->entry(['status' => QueueEntry::COMPLETED, 'called_at' => $start, 'completed_at' => $start->copy()->addMinutes(8)]);
        // A different service must not affect the average.
        QueueEntry::factory()->create([
            'service' => 'visa-application', 'status' => QueueEntry::COMPLETED,
            'called_at' => $start, 'completed_at' => $start->copy()->addMinutes(60),
        ]);

        $this->assertEquals(6.0, QueueEntry::averageServiceMinutes('passport-renewal'));
    }

    public function test_estimated_wait_counts_people_ahead_and_the_person_at_the_counter(): void
    {
        config(['services_list.default_service_minutes' => 5]);
        $this->entry(['status' => QueueEntry::IN_SERVICE, 'called_at' => now()]);
        $this->entry();
        $this->entry();
        $me = $this->entry();

        // 2 ahead + 1 at the counter, 5 minutes each.
        $this->assertSame(15, $me->estimatedWaitMinutes());
        $this->getJson(route('status.json', $me))->assertJson(['estimated_wait_minutes' => 15, 'ahead' => 2]);
    }

    public function test_no_estimate_once_called(): void
    {
        $entry = $this->entry(['status' => QueueEntry::IN_SERVICE, 'called_at' => now()]);

        $this->assertNull($entry->estimatedWaitMinutes());
    }

    public function test_applicant_can_leave_the_queue(): void
    {
        $first = $this->entry();
        $second = $this->entry();

        $this->post(route('status.leave', $first))->assertRedirect(route('status', $first));

        $this->assertSame(QueueEntry::CANCELLED, $first->fresh()->status);
        $this->assertSame(0, $second->peopleAhead());
    }

    public function test_cannot_leave_after_being_called(): void
    {
        $entry = $this->entry(['status' => QueueEntry::IN_SERVICE, 'called_at' => now()]);

        $this->post(route('status.leave', $entry))->assertSessionHas('error');
        $this->assertSame(QueueEntry::IN_SERVICE, $entry->fresh()->status);
    }

    public function test_call_next_skips_people_who_left(): void
    {
        Mail::fake();
        $left = $this->entry(['status' => QueueEntry::CANCELLED]);
        $waiting = $this->entry();

        $this->actingAs(User::factory()->create())->post('/officer/call-next', ['service' => 'passport-renewal']);

        $this->assertSame(QueueEntry::CANCELLED, $left->fresh()->status);
        $this->assertSame(QueueEntry::IN_SERVICE, $waiting->fresh()->status);
    }

    public function test_board_is_public_and_shows_numbers_but_no_personal_data(): void
    {
        $this->entry(['name' => 'Secret Person', 'email' => 'secret@example.com', 'queue_number' => 'PR-007',
            'status' => QueueEntry::IN_SERVICE, 'called_at' => now()]);
        $this->entry(['name' => 'Another Person', 'queue_number' => 'PR-008']);

        $this->get('/board')
            ->assertOk()
            ->assertSee('PR-007')
            ->assertSee('PR-008')
            ->assertDontSee('Secret Person')
            ->assertDontSee('secret@example.com');

        $json = $this->getJson('/board/json')->assertOk()->json('services');
        $renewal = collect($json)->firstWhere('slug', 'passport-renewal');
        $this->assertSame('PR-007', $renewal['now_serving']);
        $this->assertSame(['PR-008'], $renewal['up_next']);
        $this->assertSame(1, $renewal['waiting']);
        $this->assertStringNotContainsString('Secret', json_encode($json));
    }

    public function test_dashboard_shows_todays_stats(): void
    {
        $this->entry(['status' => QueueEntry::COMPLETED, 'called_at' => now()->subMinutes(10), 'completed_at' => now()->subMinutes(6)]);
        $this->entry();

        $this->actingAs(User::factory()->create())
            ->get('/officer')
            ->assertOk()
            ->assertSee('Served today')
            ->assertViewHas('stats', fn ($s) => $s['waiting'] === 1 && $s['served_today'] === 1 && $s['average_today'] == 4.0);
    }

    public function test_join_form_shows_queue_length(): void
    {
        $this->entry();
        $this->entry();

        $this->get('/')->assertOk()->assertSee('2 waiting', false);
    }
}
