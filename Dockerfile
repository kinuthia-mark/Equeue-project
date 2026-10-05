# eQueue container: PHP 8.3 with SQLite, served by `php artisan serve`.
# Good for demos and evaluation. For production, put PHP-FPM behind Nginx.

# Stage 1: install Composer dependencies (no dev packages).
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-scripts --prefer-dist --no-autoloader
COPY . .
RUN composer dump-autoload --no-dev --optimize --no-scripts

# Stage 2: runtime.
FROM php:8.3-cli-alpine
WORKDIR /app

COPY --from=vendor /app /app
COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint \
    && rm -f bootstrap/cache/*.php \
    && addgroup -S app && adduser -S app -G app \
    && mkdir -p database storage/db storage/logs storage/framework/cache storage/framework/sessions storage/framework/views \
    && chown -R app:app database storage bootstrap/cache

USER app
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8000/up >/dev/null || exit 1

ENTRYPOINT ["entrypoint"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
