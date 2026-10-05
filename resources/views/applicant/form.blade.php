@extends('layouts.app')

@section('title', 'Join the Queue')

@section('content')
<div class="row justify-content-center g-4">
    <div class="col-lg-5">
        <h1 class="fw-bold mb-3">Skip the line, not your turn.</h1>
        <p class="lead text-muted">
            Join the queue from your phone, then wait wherever you like. Your status page
            shows how many people are ahead of you and roughly how long you have left,
            and we email you the moment you are called.
        </p>
        <ol class="text-muted ps-3">
            <li>Pick the service you need</li>
            <li>Get a number such as <strong>PR-004</strong></li>
            <li>Come to the counter when your number is called</li>
        </ol>
    </div>

    <div class="col-lg-5">
        <div class="card p-4 shadow-sm">
            <h3 class="text-center mb-4 fw-bold">Join the Queue</h3>

            <form method="POST" action="{{ route('submit') }}">
                @csrf
                <div class="mb-3">
                    <label class="form-label" for="name">Full name</label>
                    <input id="name" name="name" value="{{ old('name') }}" autocomplete="name" class="form-control @error('name') is-invalid @enderror" required>
                    @error('name')<div class="invalid-feedback">{{ $message }}</div>@enderror
                </div>

                <div class="mb-3">
                    <label class="form-label" for="email">Email</label>
                    <input id="email" name="email" type="email" value="{{ old('email') }}" autocomplete="email" class="form-control @error('email') is-invalid @enderror" required>
                    @error('email')<div class="invalid-feedback">{{ $message }}</div>@enderror
                </div>

                <div class="mb-4">
                    <label class="form-label" for="service">Service</label>
                    <select id="service" name="service" class="form-select @error('service') is-invalid @enderror" required>
                        @foreach ($services as $slug => $service)
                            <option value="{{ $slug }}" @selected(old('service') === $slug)>
                                {{ $service['label'] }} ({{ $service['waiting'] }} waiting, about {{ $service['estimate'] }} min)
                            </option>
                        @endforeach
                    </select>
                    @error('service')<div class="invalid-feedback">{{ $message }}</div>@enderror
                </div>

                <button class="btn btn-primary btn-lg w-100">Get your number</button>
            </form>
        </div>
    </div>
</div>
@endsection
