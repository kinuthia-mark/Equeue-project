<?php

namespace App\Http\Controllers;

use App\Models\QueueEntry;

/**
 * The public "now serving" board, meant for a TV screen in the waiting room.
 * It needs no login and shows only queue numbers, never names or emails.
 */
class BoardController extends Controller
{
    public function show()
    {
        return view('board', ['services' => $this->snapshot()]);
    }

    /** Polled by the board page every few seconds. */
    public function json()
    {
        return response()->json(['services' => $this->snapshot(), 'updated_at' => now()->toIso8601String()]);
    }

    private function snapshot(): array
    {
        $services = [];

        foreach (config('services_list.services') as $slug => $service) {
            $services[] = [
                'slug' => $slug,
                'label' => $service['label'],
                'now_serving' => QueueEntry::nowServing($slug)?->queue_number,
                'up_next' => QueueEntry::upNext($slug)->pluck('queue_number')->all(),
                'waiting' => QueueEntry::where('service', $slug)->where('status', QueueEntry::WAITING)->count(),
            ];
        }

        return $services;
    }
}
