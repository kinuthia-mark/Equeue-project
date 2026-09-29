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
        return view('applicant.form', ['services' => config('services_list.services')]);
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
            'status_label' => str_replace('_', ' ', ucfirst($entry->status)),
            'ahead' => $data['ahead'],
            'now_serving' => $data['nowServing']?->queue_number,
        ]);
    }

    private function statusData(QueueEntry $entry): array
    {
        return [
            'entry' => $entry,
            'nowServing' => QueueEntry::nowServing($entry->service),
            'ahead' => $entry->peopleAhead(),
        ];
    }
}
