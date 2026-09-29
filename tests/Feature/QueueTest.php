<?php

namespace Tests\Feature;

use App\Mail\NowServing;
use App\Models\QueueEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class QueueTest extends TestCase
{
    use RefreshDatabase;

    private function join(string $service = 'passport-renewal', string $name = 'Jane Doe')
    {
        return $this->post('/submit', ['name' => $name, 'email' => 'jane@example.com', 'service' => $service]);
    }

    public function test_home_page_loads(): void
    {
        $this->get('/')->assertOk()->assertSee('Join the Queue');
    }

    public function test_applicant_can_join_and_is_redirected_to_a_token_status_page(): void
    {
        $response = $this->join();

        $entry = QueueEntry::firstOrFail();
        $response->assertRedirect(route('status', $entry));
        $this->assertMatchesRegularExpression('/^[0-9a-f-]{36}$/', $entry->token);
        $this->assertSame('PR-001', $entry->queue_number);
        $this->assertSame(QueueEntry::WAITING, $entry->status);
        $this->get(route('status', $entry))->assertOk()->assertSee('PR-001');
    }

    public function test_status_page_cannot_be_guessed_with_a_numeric_id(): void
    {
        $this->join();
        $this->get('/status/1')->assertNotFound();
    }

    public function test_queue_numbers_are_sequential_per_service(): void
    {
        $this->join('passport-renewal');
        $this->join('passport-renewal');
        $this->join('visa-application');

        $this->assertEquals(
            ['PR-001', 'PR-002', 'VA-001'],
            QueueEntry::orderBy('id')->pluck('queue_number')->all()
        );
    }

    public function test_invalid_input_is_rejected(): void
    {
        $this->post('/submit', ['name' => '', 'email' => 'nope', 'service' => 'made-up'])
            ->assertSessionHasErrors(['name', 'email', 'service']);
        $this->assertDatabaseCount('queue_entries', 0);
    }

    public function test_status_shows_people_ahead(): void
    {
        $this->join(name: 'First');
        $this->join(name: 'Second');
        $second = QueueEntry::where('name', 'Second')->first();

        $this->getJson(route('status.json', $second))
            ->assertOk()
            ->assertJson(['ahead' => 1, 'status' => 'waiting', 'now_serving' => null]);
    }

    public function test_guests_cannot_reach_the_officer_area(): void
    {
        $this->get('/officer')->assertRedirect('/login');
        $this->post('/officer/call-next', ['service' => 'passport-renewal'])->assertRedirect('/login');
    }

    public function test_public_registration_is_disabled(): void
    {
        $this->get('/register')->assertNotFound();
        $this->post('/register', ['name' => 'x', 'email' => 'x@x.com', 'password' => 'password', 'password_confirmation' => 'password'])
            ->assertStatus(404);
        $this->assertDatabaseCount('users', 0);
    }

    public function test_officer_can_log_in_and_see_the_dashboard(): void
    {
        $user = User::factory()->create(['password' => 'password']);

        $this->post('/login', ['email' => $user->email, 'password' => 'password'])->assertRedirect('/officer');
        $this->get('/officer')->assertOk()->assertSee('Officer Dashboard');
    }

    public function test_call_next_serves_the_oldest_waiting_entry_and_emails_them(): void
    {
        Mail::fake();
        $this->join(name: 'First');
        $this->join(name: 'Second');

        $this->actingAs(User::factory()->create())
            ->post('/officer/call-next', ['service' => 'passport-renewal'])
            ->assertSessionHas('success');

        $this->assertSame(QueueEntry::IN_SERVICE, QueueEntry::where('name', 'First')->value('status'));
        $this->assertSame(QueueEntry::WAITING, QueueEntry::where('name', 'Second')->value('status'));
        Mail::assertQueued(NowServing::class, fn ($m) => $m->hasTo('jane@example.com'));
    }

    public function test_call_next_on_an_empty_queue_shows_an_error(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/officer/call-next', ['service' => 'passport-renewal'])
            ->assertSessionHas('error');
    }

    public function test_call_next_rejects_unknown_services(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/officer/call-next', ['service' => 'nope'])
            ->assertSessionHasErrors('service');
    }

    public function test_only_someone_in_service_can_be_completed(): void
    {
        $officer = User::factory()->create();
        $this->join();
        $entry = QueueEntry::first();

        $this->actingAs($officer)->post(route('officer.complete', $entry))->assertSessionHas('error');
        $this->assertSame(QueueEntry::WAITING, $entry->fresh()->status);

        $entry->update(['status' => QueueEntry::IN_SERVICE]);
        $this->actingAs($officer)->post(route('officer.complete', $entry))->assertSessionHas('success');
        $this->assertSame(QueueEntry::COMPLETED, $entry->fresh()->status);
    }

    public function test_a_mail_failure_does_not_undo_the_call(): void
    {
        Mail::shouldReceive('to')->andThrow(new \RuntimeException('smtp down'));
        $this->join();

        $this->actingAs(User::factory()->create())
            ->post('/officer/call-next', ['service' => 'passport-renewal'])
            ->assertSessionHas('success');

        $this->assertSame(QueueEntry::IN_SERVICE, QueueEntry::first()->status);
    }
}
