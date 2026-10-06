#!/bin/sh
# Prepares the app on first start: .env, app key, SQLite file, migrations.
# Set DEMO_DATA=1 to load the demo officer and sample queues.
set -e

if [ ! -f .env ]; then
    cp .env.example .env
fi

if ! grep -q '^APP_KEY=base64:' .env; then
    php artisan key:generate --force
fi

DB_FILE="${DB_DATABASE:-database/database.sqlite}"
mkdir -p "$(dirname "$DB_FILE")"
touch "$DB_FILE"
php artisan package:discover --ansi > /dev/null
php artisan migrate --force

if [ "${DEMO_DATA:-0}" = "1" ]; then
    APP_ENV=local php artisan db:seed --force
fi

exec "$@"
