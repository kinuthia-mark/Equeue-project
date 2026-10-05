<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'eQueue') · eQueue Kenya</title>
    <meta name="description" content="Join a government service queue from your phone and follow your place in line live.">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">

    <style>
        :root {
            --eq-green: #007a33;
            --eq-green-dark: #004d1a;
            --eq-red: #bb0000;
        }

        body {
            background-color: #f4f6f9;
            font-family: 'Nunito', sans-serif;
            font-size: 16px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        main { flex: 1; }

        .navbar { background-color: var(--eq-green-dark); }
        .navbar-brand, .navbar .nav-link { color: #fff !important; }
        .navbar .nav-link { opacity: .85; }
        .navbar .nav-link:hover, .navbar .nav-link.active { opacity: 1; }
        .navbar-brand img { height: 24px; margin-right: 8px; border-radius: 2px; }

        /* Thin Kenyan-flag stripe under the navbar */
        .flag-stripe {
            height: 5px;
            background: linear-gradient(to right, #000 0 33%, var(--eq-red) 33% 66%, var(--eq-green) 66%);
        }

        .btn-primary { background-color: var(--eq-green); border: none; }
        .btn-primary:hover, .btn-primary:focus { background-color: #005e26; }

        .card { border: none; border-radius: 14px; }
        .stat-card .value { font-size: 2rem; font-weight: 800; line-height: 1; }
        .stat-card .label { color: #6c757d; font-size: .85rem; text-transform: uppercase; letter-spacing: .04em; }

        .queue-number {
            font-size: clamp(3rem, 12vw, 5rem);
            font-weight: 800;
            letter-spacing: .05em;
            color: var(--eq-green-dark);
        }

        footer {
            background: #fff;
            text-align: center;
            padding: 20px 0;
            color: #6c757d;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
        }
    </style>
    @stack('head')
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark px-4 py-2">
        <a class="navbar-brand d-flex align-items-center" href="{{ route('home') }}">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Kenya.svg/40px-Flag_of_Kenya.svg.png" alt="">
            <span class="fw-bold">eQueue Kenya</span>
        </a>

        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav align-items-lg-center gap-lg-2">
                <li class="nav-item"><a class="nav-link @if(request()->routeIs('home')) active @endif" href="{{ route('home') }}">Join a queue</a></li>
                <li class="nav-item"><a class="nav-link" href="{{ route('board') }}" target="_blank">Display board</a></li>
                @guest
                    <li class="nav-item"><a class="nav-link" href="{{ route('login') }}">Officer login</a></li>
                @else
                    <li class="nav-item"><a class="nav-link @if(request()->routeIs('officer.*')) active @endif" href="{{ route('officer.dashboard') }}">Dashboard</a></li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">{{ Auth::user()->name }}</a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <form action="{{ route('logout') }}" method="POST">
                                    @csrf
                                    <button class="dropdown-item">Log out</button>
                                </form>
                            </li>
                        </ul>
                    </li>
                @endguest
            </ul>
        </div>
    </nav>
    <div class="flag-stripe"></div>

    <main class="container py-5">
        @if (session('success'))<div class="alert alert-success">{{ session('success') }}</div>@endif
        @if (session('error'))<div class="alert alert-danger">{{ session('error') }}</div>@endif
        @yield('content')
    </main>

    <footer>
        &copy; {{ date('Y') }} eQueue · Queue management for government service offices
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    @stack('scripts')
</body>
</html>
