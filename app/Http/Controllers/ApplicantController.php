<?php

namespace App\Http\Controllers;

use App\Models\QueueEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ApplicantController extends Controller
{
    public function showForm()
    {
        $services = config('services_list.services');

        // Show how long each queue is before someone picks a service.
        foreach ($services as $slug => &$service) {
            $service['waiting'] = QueueEntry::where('service', $slug)->where('status', QueueEntry::WAITING)->count();
            $service['estimate'] = (int) round($service['waiting'] * QueueEntry::averageServiceMinutes($slug));
        }
        unset($service);

        return view('applicant.form', ['services' => $services]);
    }

    public function submit(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'service' => ['required', Rule::in(array_keys(config('services_list.services')))],
        ]);

        // The transaction keeps "next number" and "insert" together so two
        // people joining at the same moment cannot receive the same number.
        $entry = DB::transaction(function () use ($data) {
            $next = QueueEntry::where('service', $data['service'])->lockForUpdate()->max('service_number') + 1;
            $prefix = config("services_list.services.{$data['service']}.prefix");

            return QueueEntry::create($data + [
                'service_number' => $next,
                'queue_number' => sprintf('%s-%03d', $prefix, $next),
                'status' => QueueEntry::WAITING,
            ]);
        });

        return redirect()->route('status', $entry);
    }

    public function status(QueueEntry $entry)
    {
        return view('applicant.status', $this->statusData($entry));
    }

    /** Small JSON endpoint polled by the status page. */
    public function statusJson(QueueEntry $entry)
    {
        $data = $this->statusData($entry);

        return response()->json([
            'status' => $entry->status,
            'status_label' => $entry->statusLabel(),
            'ahead' => $data['ahead'],
            'now_serving' => $data['nowServing']?->queue_number,
            'estimated_wait_minutes' => $data['estimate'],
        ]);
    }

    /** Lets an applicant give up their place so the queue moves faster for others. */
    public function leave(QueueEntry $entry)
    {
        if ($entry->status !== QueueEntry::WAITING) {
            return back()->with('error', 'You can only leave the queue while you are still waiting.');
        }

        $entry->update(['status' => QueueEntry::CANCELLED]);

        return redirect()->route('status', $entry)->with('success', 'You have left the queue.');
    }

    private function statusData(QueueEntry $entry): array
    {
        return [
            'entry' => $entry,
            'nowServing' => QueueEntry::nowServing($entry->service),
            'ahead' => $entry->peopleAhead(),
            'estimate' => $entry->estimatedWaitMinutes(),
        ];
    }
}
