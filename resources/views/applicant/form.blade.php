@extends('layouts.app')

@section('content')
<div class="row justify-content-center">
    <div class="col-md-6">
        <div class="card p-4 shadow-sm">
            <h3 class="text-center mb-4">Join the Queue</h3>

            <form method="POST" action="{{ route('submit') }}">
                @csrf
                <div class="mb-3">
                    <label class="form-label" for="name">Full Name</label>
                    <input id="name" name="name" value="{{ old('name') }}" class="form-control @error('name') is-invalid @enderror" required>
                    @error('name')<div class="invalid-feedback">{{ $message }}</div>@enderror
                </div>

                <div class="mb-3">
                    <label class="form-label" for="email">Email</label>
                    <input id="email" name="email" type="email" value="{{ old('email') }}" class="form-control @error('email') is-invalid @enderror" required>
                    @error('email')<div class="invalid-feedback">{{ $message }}</div>@enderror
                </div>

                <div class="mb-3">
                    <label class="form-label" for="service">Select Service</label>
                    <select id="service" name="service" class="form-select @error('service') is-invalid @enderror" required>
                        @foreach ($services as $slug => $service)
                            <option value="{{ $slug }}" @selected(old('service') === $slug)>{{ $service['label'] }}</option>
                        @endforeach
                    </select>
                    @error('service')<div class="invalid-feedback">{{ $message }}</div>@enderror
                </div>

                <button class="btn btn-primary w-100">Get Your Number</button>
            </form>
        </div>
    </div>
</div>
@endsection
