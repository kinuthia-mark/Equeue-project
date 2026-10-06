#!/bin/sh
# Prepares the app on first start, then hands over to Apache:
#   - creates .env (production settings) and an app key if missing
#   - creates the SQLite file and runs migrations
#   - loads demo data when DEMO_DATA=1
#   - caches config, routes and views for speed
set -e
cd /var/www/html

run() { su -s /bin/sh www-data -c "$*"; }   # run artisan as the web user

if [ ! -f .env ]; then
    cp .env.example .env
    sed -i 's/^APP_ENV=.*/APP_ENV=production/; s/^APP_DEBUG=.*/APP_DEBUG=false/' .env
    chown www-data:www-data .env
fi

if ! grep -q '^APP_KEY=base64:' .env; then
    run "php artisan key:generate --force"
fi

DB_FILE="${DB_DATABASE:-database/database.sqlite}"
mkdir -p "$(dirname "$DB_FILE")"
touch "$DB_FILE"
chown -R www-data:www-data "$(dirname "$DB_FILE")"

run "php artisan package:discover --ansi > /dev/null"
run "php artisan migrate --force"

if [ "${DEMO_DATA:-0}" = "1" ]; then
    run "APP_ENV=local php artisan db:seed --force"
fi

run "php artisan config:cache && php artisan route:cache && php artisan view:cache"

exec "$@"
