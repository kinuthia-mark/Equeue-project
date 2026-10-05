# eQueue

[![tests](https://github.com/kinuthia-mark/Equeue-project/actions/workflows/tests.yml/badge.svg)](https://github.com/kinuthia-mark/Equeue-project/actions/workflows/tests.yml)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4?logo=php&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)

A digital queue management system for government service offices (passports, visas, permits).
Applicants join a queue from their phone and watch their place in line update live.
Officers call the next person from a dashboard, and the applicant is emailed when it is their turn.

Built with **Laravel 12**, **Bootstrap 5** and **SQLite**.

## Features

- **Join a queue online.** Pick a service, get a number such as `PR-004`.
- **Live status page.** Shows your number, how many people are ahead of you, and who is being served now. It refreshes itself every 5 seconds.
- **Officer dashboard.** One queue per service, with *Call Next* and *Mark as Complete*.
- **Email notification** when you are called (queued, so a mail problem never blocks the officer).
- **Secure by default.** No public sign-up, unguessable status links, CSRF protection, rate-limited joining.
- **Tested.** 14 feature tests run on every push through GitHub Actions, on PHP 8.2 and 8.3.

## How it works

Two kinds of people use the system. Applicants need no account. Officers log in.

```mermaid
flowchart LR
    A[Applicant] -->|1. Join queue| S[eQueue app]
    S -->|2. Queue number| A
    A -->|3. Watch status page| S
    O[Officer] -->|4. Call next| S
    S -->|5. Email: it is your turn| A
    O -->|6. Mark complete| S
```

### Step by step

```mermaid
sequenceDiagram
    actor A as Applicant
    participant W as Web app
    participant D as Database
    actor O as Officer

    A->>W: Submit name, email, service
    W->>D: Create entry (waiting)
    W-->>A: Redirect to status page
    loop every 5 seconds
        A->>W: Ask for status
        W-->>A: Position and now serving
    end
    O->>W: Press Call Next
    W->>D: Oldest waiting becomes in service
    W-->>A: Email: it is your turn
    O->>W: Press Mark as Complete
    W->>D: Entry becomes completed
```

### Life of a queue entry

```mermaid
stateDiagram-v2
    [*] --> waiting: applicant joins
    waiting --> in_service: officer presses Call Next
    in_service --> completed: officer presses Mark as Complete
    completed --> [*]
```

## Data model

```mermaid
erDiagram
    USERS {
        bigint id PK
        string name
        string email UK
        string password
    }
    QUEUE_ENTRIES {
        bigint id PK
        uuid token UK
        string name
        string email
        string service
        int service_number
        string queue_number UK
        string status
    }
```

`users` are officers. `queue_entries` are applicants waiting or being served. The two tables are intentionally independent: applicants never have an account.

## Project layout

```mermaid
flowchart TD
    R[routes/web.php] --> AC[ApplicantController]
    R --> OC[OfficerController]
    AC --> M[QueueEntry model]
    OC --> M
    OC --> MAIL[NowServing mail]
    AC --> V1[applicant views]
    OC --> V2[officer views]
    M --> DB[(SQLite)]
```

| Path | Purpose |
|------|---------|
| `routes/web.php` | All routes |
| `app/Http/Controllers/ApplicantController.php` | Join queue and status pages |
| `app/Http/Controllers/OfficerController.php` | Dashboard, call next, complete |
| `app/Models/QueueEntry.php` | Statuses, queue position logic |
| `app/Mail/NowServing.php` | The "it's your turn" email |
| `app/Console/Commands/CreateOfficer.php` | `php artisan officer:create` |
| `config/services_list.php` | The services offered and their number prefixes |
| `tests/Feature/QueueTest.php` | Feature tests |

## Getting started

Requirements: PHP 8.2+ with the `sqlite3` extension, and Composer.

```bash
git clone https://github.com/kinuthia-mark/Equeue-project.git
cd Equeue-project

composer install
cp .env.example .env
php artisan key:generate

touch database/database.sqlite
php artisan migrate --seed

php artisan serve
```

Open <http://localhost:8000>.

### Officer accounts

Public registration is disabled so that strangers cannot control your queues.

- **Local development:** `--seed` creates a demo officer, `officer@example.com` / `password`. This account is only created when `APP_ENV=local`.
- **Anywhere else:** create an officer from the command line. You will be asked for a password.

```bash
php artisan officer:create jane@office.go.ke --name="Jane Wanjiru"
```

Officers log in at `/login` and land on `/officer`.

## Configuration

**Services.** Edit `config/services_list.php`. The key is stored in the database, `label` is shown to people, and `prefix` starts the queue number.

```php
'visa-application' => ['label' => 'Visa application', 'prefix' => 'VA'],
```

**Email.** By default `MAIL_MAILER=log`, so emails are written to `storage/logs/laravel.log`. For real email, set the `MAIL_*` values in `.env`.

**Queue driver.** `QUEUE_CONNECTION=sync` sends mail immediately, which is fine for development. In production use `database` and keep a worker running so emails never slow down the officer:

```bash
php artisan queue:work
```

## Tests

```bash
php artisan test
```

The tests cover joining, validation, per-service numbering, unguessable status links, disabled registration, login, calling the oldest entry, email, completing, and mail failures.

## Design decisions

| Problem | What the app does |
|---------|-------------------|
| Anyone could register as an officer | Registration route removed, officers created by command |
| Status URL used `/status/1`, so others' entries could be browsed | Links use a random UUID token |
| Two applicants could get the same number | Numbers are issued inside a database transaction, sequential per service |
| Two officers could call the same person | The next entry is locked while it is being called |
| A mail error could break "Call Next" | Email is queued and failures are logged, not fatal |

## Ideas for next steps

- Estimated waiting time from average service duration
- SMS notifications
- Multiple counters, so each officer serves from their own desk
- A public "now serving" display board for the waiting room
- Admin screen to manage services and officers

## License

MIT. See [LICENSE](LICENSE).

## Author

**Mark Kinuthia** - [github.com/kinuthia-mark](https://github.com/kinuthia-mark)
