@extends('layouts.app')

@section('title', $entry->queue_number)

@section('content')
<div class="row justify-content-center">
    <div class="col-md-7 col-lg-6">
        <div class="card p-4 shadow-sm text-center">
            <p class="text-muted mb-1">{{ $entry->serviceLabel() }}</p>
            <div class="queue-number" aria-label="Your queue number">{{ $entry->queue_number }}</div>

            {{-- One headline that changes with the status --}}
            <h4 id="headline" class="mt-2 mb-4 fw-bold"
                data-waiting="Please wait, we will call you"
                data-in_service="It's your turn. Please go to the counter."
                data-completed="Thank you, you have been served."
                data-cancelled="You have left this queue.">
            </h4>

            <div class="row g-3 mb-4">
                <div class="col-4">
                    <div class="stat-card bg-light rounded-3 p-3">
                        <div class="value" id="ahead">{{ $ahead }}</div>
                        <div class="label mt-1">Ahead of you</div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="stat-card bg-light rounded-3 p-3">
                        <div class="value" id="estimate">{{ $estimate !== null ? '~'.$estimate : '–' }}</div>
                        <div class="label mt-1">Minutes left</div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="stat-card bg-light rounded-3 p-3">
                        <div class="value" id="serving">{{ $nowServing->queue_number ?? '–' }}</div>
                        <div class="label mt-1">Now serving</div>
                    </div>
                </div>
            </div>

            <p class="mb-1"><strong>Status:</strong> <span id="status" class="badge bg-secondary">{{ $entry->statusLabel() }}</span></p>
            <p class="text-muted small">We will also email <strong>{{ $entry->email }}</strong> when it is your turn.</p>

            <div class="d-flex flex-wrap gap-2 justify-content-center mt-3">
                <a href="{{ route('home') }}" class="btn btn-outline-secondary">Join another queue</a>
                <form method="POST" action="{{ route('status.leave', $entry) }}" id="leave-form"
                      onsubmit="return confirm('Leave the queue? You will lose your place.');"
                      @class(['d-none' => $entry->status !== 'waiting'])>
                    @csrf
                    <button class="btn btn-outline-danger">Leave the queue</button>
                </form>
            </div>

            <p class="text-muted small mt-4 mb-0">
                Bookmark this page to come back to it. It updates by itself every 5 seconds.
            </p>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    const url = @json(route('status.json', $entry));
    const badgeClass = { waiting: 'bg-secondary', in_service: 'bg-warning text-dark', completed: 'bg-success', cancelled: 'bg-dark' };
    const headline = document.getElementById('headline');

    function render(d) {
        headline.textContent = headline.dataset[d.status] ?? '';
        const status = document.getElementById('status');
        status.textContent = d.status_label;
        status.className = 'badge ' + (badgeClass[d.status] ?? 'bg-secondary');
        document.getElementById('ahead').textContent = d.ahead;
        document.getElementById('estimate').textContent = d.estimated_wait_minutes === null ? '–' : '~' + d.estimated_wait_minutes;
        document.getElementById('serving').textContent = d.now_serving ?? '–';
        document.getElementById('leave-form').classList.toggle('d-none', d.status !== 'waiting');
    }

    render({
        status: @json($entry->status),
        status_label: @json($entry->statusLabel()),
        ahead: @json($ahead),
        estimated_wait_minutes: @json($estimate),
        now_serving: @json($nowServing?->queue_number),
    });

    setInterval(async () => {
        try {
            const r = await fetch(url, { headers: { Accept: 'application/json' } });
            if (r.ok) render(await r.json());
        } catch (e) { /* keep showing the last known state */ }
    }, 5000);
</script>
@endpush
