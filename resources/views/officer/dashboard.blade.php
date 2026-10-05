@extends('layouts.app')

@section('title', 'Officer Dashboard')

@section('content')
<div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
    <h2 class="mb-0 fw-bold">Officer Dashboard</h2>
    <a href="{{ route('board') }}" target="_blank" class="btn btn-outline-secondary btn-sm">Open display board</a>
</div>

{{-- Headline numbers --}}
<div class="row g-3 mb-4">
    @foreach ([
        ['Waiting', $stats['waiting']],
        ['At the counter', $stats['in_service']],
        ['Served today', $stats['served_today']],
        ['Avg. minutes today', $stats['average_today'] ?? '–'],
    ] as [$label, $value])
        <div class="col-6 col-lg-3">
            <div class="card stat-card shadow-sm p-3">
                <div class="label">{{ $label }}</div>
                <div class="value mt-2">{{ $value }}</div>
            </div>
        </div>
    @endforeach
</div>

@foreach ($queues as $slug => $queue)
    <div class="card mb-4 shadow-sm">
        <div class="card-header bg-white d-flex flex-wrap justify-content-between align-items-center gap-2 py-3">
            <div>
                <strong>{{ $queue['label'] }}</strong>
                <span class="text-muted small ms-2">
                    {{ $queue['entries']->where('status', 'waiting')->count() }} waiting ·
                    about {{ $queue['average'] }} min per person
                </span>
            </div>
            <form method="POST" action="{{ route('officer.call-next') }}" class="d-inline">
                @csrf
                <input type="hidden" name="service" value="{{ $slug }}">
                <button class="btn btn-sm btn-primary px-3">Call next</button>
            </form>
        </div>

        @if ($queue['entries']->isEmpty())
            <div class="card-body text-muted">No one is in this queue right now.</div>
        @else
            <ul class="list-group list-group-flush">
                @foreach ($queue['entries'] as $entry)
                    <li class="list-group-item d-flex flex-wrap justify-content-between align-items-center gap-2">
                        <div>
                            <strong class="me-2">{{ $entry->queue_number }}</strong>
                            {{ $entry->name }} <span class="text-muted small">({{ $entry->email }})</span>
                            @if ($entry->status === 'in_service')
                                <span class="badge bg-warning text-dark ms-2">At the counter</span>
                                <span class="text-muted small ms-1">since {{ $entry->called_at?->format('H:i') }}</span>
                            @else
                                <span class="badge bg-secondary ms-2">Waiting</span>
                                <span class="text-muted small ms-1">joined {{ $entry->created_at->diffForHumans() }}</span>
                            @endif
                        </div>
                        @if ($entry->status === 'in_service')
                            <form method="POST" action="{{ route('officer.complete', $entry) }}">
                                @csrf
                                <button class="btn btn-sm btn-success">Mark as complete</button>
                            </form>
                        @endif
                    </li>
                @endforeach
            </ul>
        @endif
    </div>
@endforeach
@endsection
