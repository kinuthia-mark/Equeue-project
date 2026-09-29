@extends('layouts.app')

@section('content')
<div class="row justify-content-center">
    <div class="col-md-6 text-center">
        <div class="card p-4 shadow-sm">
            <h3 class="mb-3 text-success">You're In Queue!</h3>

            <div class="alert alert-primary">
                <strong>Your Queue Number:</strong>
                <h1 class="display-4">{{ $entry->queue_number }}</h1>
            </div>

            <p><strong>Service:</strong> {{ $entry->serviceLabel() }}</p>
            <p><strong>Status:</strong> <span id="status">{{ str_replace('_', ' ', ucfirst($entry->status)) }}</span></p>
            <p><strong>People ahead of you:</strong> <span id="ahead">{{ $ahead }}</span></p>
            <p><strong>Now Serving:</strong> <span id="serving">{{ $nowServing->queue_number ?? 'N/A' }}</span></p>

            <a href="{{ route('home') }}" class="btn btn-secondary mt-4">Submit Another Request</a>
            <p class="text-muted mt-3 mb-0">This page updates automatically every 5 seconds.</p>
        </div>
    </div>
</div>

<script>
    const url = @json(route('status.json', $entry));
    setInterval(async () => {
        try {
            const r = await fetch(url, { headers: { Accept: 'application/json' } });
            if (!r.ok) return;
            const d = await r.json();
            document.getElementById('status').textContent = d.status_label;
            document.getElementById('ahead').textContent = d.ahead;
            document.getElementById('serving').textContent = d.now_serving ?? 'N/A';
        } catch (e) { /* keep showing the last known state */ }
    }, 5000);
</script>
@endsection
