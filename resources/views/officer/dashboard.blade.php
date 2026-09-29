@extends('layouts.app')

@section('content')
<div class="container">
    <h2 class="mb-4">Officer Dashboard</h2>

    @foreach ($queues as $slug => $queue)
        <div class="card mb-4 shadow-sm">
            <div class="card-header d-flex justify-content-between align-items-center">
                <strong>{{ $queue['label'] }}</strong>
                <form method="POST" action="{{ route('officer.call-next') }}" class="d-inline">
                    @csrf
                    <input type="hidden" name="service" value="{{ $slug }}">
                    <button class="btn btn-sm btn-primary">Call Next</button>
                </form>
            </div>

            @if ($queue['entries']->isEmpty())
                <div class="card-body text-muted">No one is currently in this queue.</div>
            @else
                <ul class="list-group list-group-flush">
                    @foreach ($queue['entries'] as $entry)
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{{ $entry->queue_number }}</strong> - {{ $entry->name }} ({{ $entry->email }})
                                @if ($entry->status === 'in_service')
                                    <span class="badge bg-warning text-dark ms-2">Now serving</span>
                                @else
                                    <span class="badge bg-secondary ms-2">Waiting</span>
                                @endif
                            </div>
                            @if ($entry->status === 'in_service')
                                <form method="POST" action="{{ route('officer.complete', $entry) }}">
                                    @csrf
                                    <button class="btn btn-sm btn-success">Mark as Complete</button>
                                </form>
                            @endif
                        </li>
                    @endforeach
                </ul>
            @endif
        </div>
    @endforeach
</div>
@endsection
