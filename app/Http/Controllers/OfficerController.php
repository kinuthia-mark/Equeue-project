<?php

namespace App\Http\Controllers;

use App\Mail\NowServing;
use App\Models\QueueEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class OfficerController extends Controller
{
    public function dashboard()
    {
        $queues = [];

        foreach (config('services_list.services') as $slug => $service) {
            $queues[$slug] = [
                'label' => $service['label'],
                'entries' => QueueEntry::where('service', $slug)
                    ->whereIn('status', [QueueEntry::WAITING, QueueEntry::IN_SERVICE])
                    ->orderBy('id')
                    ->get(),
                'average' => QueueEntry::averageServiceMinutes($slug),
            ];
        }

        // Headline numbers for the top of the dashboard.
        $stats = [
            'waiting' => QueueEntry::where('status', QueueEntry::WAITING)->count(),
            'in_service' => QueueEntry::where('status', QueueEntry::IN_SERVICE)->count(),
            'served_today' => QueueEntry::where('status', QueueEntry::COMPLETED)
                ->where('completed_at', '>=', now()->startOfDay())
                ->count(),
            'average_today' => $this->averageMinutesToday(),
        ];

        return view('officer.dashboard', compact('queues', 'stats'));
    }

    public function callNext(Request $request)
    {
        $service = $request->validate([
            'service' => ['required', Rule::in(array_keys(config('services_list.services')))],
        ])['service'];

        // Lock the row so two officers pressing the button together
        // never call the same person.
        $next = DB::transaction(function () use ($service) {
            $entry = QueueEntry::where('service', $service)
                ->where('status', QueueEntry::WAITING)
                ->orderBy('id')
                ->lockForUpdate()
                ->first();

            $entry?->update(['status' => QueueEntry::IN_SERVICE, 'called_at' => now()]);

            return $entry;
        });

        if (! $next) {
            return back()->with('error', 'No one is currently waiting in this queue.');
        }

        // A mail failure must not undo the call.
        try {
            Mail::to($next->email)->send(new NowServing($next));
        } catch (\Throwable $e) {
            Log::warning('Could not send now-serving email', ['entry' => $next->id, 'error' => $e->getMessage()]);
        }

        return back()->with('success', "Called {$next->queue_number} ({$next->name}).");
    }

    public function complete(QueueEntry $entry)
    {
        if ($entry->status !== QueueEntry::IN_SERVICE) {
            return back()->with('error', 'Only someone who is being served can be completed.');
        }

        $entry->update(['status' => QueueEntry::COMPLETED, 'completed_at' => now()]);

        return back()->with('success', "{$entry->queue_number} marked as complete.");
    }

    /** Average minutes at the counter for everyone completed today, or null. */
    private function averageMinutesToday(): ?float
    {
        $today = QueueEntry::where('status', QueueEntry::COMPLETED)
            ->where('completed_at', '>=', now()->startOfDay())
            ->whereNotNull('called_at')
            ->get(['called_at', 'completed_at']);

        return $today->isEmpty() ? null : round($today->avg(fn ($e) => $e->serviceMinutes()), 1);
    }
}
