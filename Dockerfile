# eQueue container: PHP 8.3 on Apache, serving Laravel's public/ folder,
# with SQLite for storage. Config, routes and views are cached at start-up.

# Stage 1: install Composer dependencies (no dev packages). Composer runs on
# the same PHP version as the runtime so the lock file resolves the same way.
FROM php:8.3-cli-alpine AS vendor
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN apk add --no-cache unzip
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-scripts --prefer-dist --no-autoloader
COPY . .
RUN composer dump-autoload --no-dev --optimize --no-scripts

# Stage 2: runtime.
FROM php:8.3-apache

# Serve public/ on port 8000, honour Laravel's .htaccess, hide the
# Apache and PHP versions, and use PHP's production settings with OPcache.
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN docker-php-ext-install opcache \
    && a2enmod rewrite headers \
    && sed -ri 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri 's/Listen 80$/Listen 8000/' /etc/apache2/ports.conf \
    && sed -ri 's/<VirtualHost \*:80>/<VirtualHost *:8000>/' /etc/apache2/sites-available/000-default.conf \
    && sed -ri 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf \
    && printf 'ServerTokens Prod\nServerSignature Off\n' > /etc/apache2/conf-enabled/hardening.conf \
    && cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && printf 'expose_php=Off\nopcache.enable=1\nopcache.validate_timestamps=0\n' > "$PHP_INI_DIR/conf.d/app.ini"

WORKDIR /var/www/html
COPY --from=vendor /app /var/www/html
COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint \
    && rm -f bootstrap/cache/*.php \
    && mkdir -p storage/db storage/logs storage/framework/cache storage/framework/sessions storage/framework/views \
    && chown -R www-data:www-data /var/www/html

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -fs http://127.0.0.1:8000/up > /dev/null || exit 1

ENTRYPOINT ["entrypoint"]
CMD ["apache2-foreground"]
