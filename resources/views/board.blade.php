<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Now Serving · eQueue Kenya</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;800&display=swap" rel="stylesheet">
    <style>
        /* Built for a TV in the waiting room: big type, high contrast, no scrolling. */
        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            background: #0b1f14;
            color: #fff;
            font-family: 'Nunito', sans-serif;
            display: flex;
            flex-direction: column;
        }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2.5rem;
            border-bottom: 6px solid;
            border-image: linear-gradient(to right, #000 0 33%, #bb0000 33% 66%, #007a33 66%) 1;
        }
        header h1 { margin: 0; font-size: 2.2rem; font-weight: 800; }
        #clock { font-size: 2rem; font-weight: 800; font-variant-numeric: tabular-nums; }
        main {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            padding: 2rem 2.5rem;
        }
        .service {
            background: #12301f;
            border-radius: 18px;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
        }
        .service h2 { margin: 0 0 .75rem; font-size: 1.3rem; color: #9fd9b4; font-weight: 600; }
        .serving-label { text-transform: uppercase; letter-spacing: .1em; font-size: .85rem; color: #9fb3a8; }
        .serving { font-size: 4.5rem; font-weight: 800; line-height: 1.1; }
        .serving.flash { animation: flash 1s ease-in-out 3; }
        @keyframes flash { 50% { color: #ffd54a; } }
        .next { margin-top: auto; padding-top: 1rem; color: #cfe3d6; font-size: 1.15rem; }
        .next span { display: inline-block; background: #1d4630; padding: .2rem .6rem; border-radius: 8px; margin: .2rem .3rem 0 0; }
        footer { text-align: center; padding: 1rem; color: #9fb3a8; }
    </style>
</head>
<body>
    <header>
        <h1>Now Serving</h1>
        <div id="clock"></div>
    </header>

    <main id="board">
        @foreach ($services as $s)
            <section class="service" data-slug="{{ $s['slug'] }}">
                <h2>{{ $s['label'] }}</h2>
                <div class="serving-label">Please go to the counter</div>
                <div class="serving">{{ $s['now_serving'] ?? '—' }}</div>
                <div class="next">
                    Next:
                    @forelse ($s['up_next'] as $n)<span>{{ $n }}</span>@empty <em>no one waiting</em>@endforelse
                </div>
            </section>
        @endforeach
    </main>

    <footer>Join the queue from your phone at {{ url('/') }}</footer>

    <script>
        const url = @json(route('board.json'));

        function tick() {
            document.getElementById('clock').textContent =
                new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        tick();
        setInterval(tick, 10000);

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        async function refresh() {
            try {
                const r = await fetch(url, { headers: { Accept: 'application/json' } });
                if (!r.ok) return;
                const { services } = await r.json();
                for (const s of services) {
                    const card = document.querySelector(`[data-slug="${s.slug}"]`);
                    if (!card) continue;
                    const serving = card.querySelector('.serving');
                    const value = s.now_serving ?? '—';
                    // Flash the number when a new person is called.
                    if (serving.textContent.trim() !== value) {
                        serving.textContent = value;
                        serving.classList.remove('flash');
                        void serving.offsetWidth;
                        serving.classList.add('flash');
                    }
                    card.querySelector('.next').innerHTML = 'Next: ' + (s.up_next.length
                        ? s.up_next.map(n => `<span>${escapeHtml(n)}</span>`).join('')
                        : '<em>no one waiting</em>');
                }
            } catch (e) { /* keep the last known state on screen */ }
        }
        setInterval(refresh, 4000);
    </script>
</body>
</html>
