<?php

putenv('VERCEL=1');
$_ENV['VERCEL'] = '1';
$_SERVER['VERCEL'] = '1';

// Provide robust fallback environment variables on Vercel
if (empty($_ENV['APP_NAME']) && !getenv('APP_NAME')) {
    putenv('APP_NAME=BlogVerse Pro');
    $_ENV['APP_NAME'] = 'BlogVerse Pro';
    $_SERVER['APP_NAME'] = 'BlogVerse Pro';
}

if (empty($_ENV['APP_ENV']) && !getenv('APP_ENV')) {
    putenv('APP_ENV=production');
    $_ENV['APP_ENV'] = 'production';
    $_SERVER['APP_ENV'] = 'production';
}

if (!isset($_ENV['APP_DEBUG']) && getenv('APP_DEBUG') === false) {
    putenv('APP_DEBUG=false');
    $_ENV['APP_DEBUG'] = 'false';
    $_SERVER['APP_DEBUG'] = 'false';
}

if (empty($_ENV['APP_KEY']) && !getenv('APP_KEY')) {
    $fallbackKey = 'base64:Af/6yy68DUgYZDl2JrHYHqDyiWWdsa/gAZfPreXIi78=';
    putenv("APP_KEY=$fallbackKey");
    $_ENV['APP_KEY'] = $fallbackKey;
    $_SERVER['APP_KEY'] = $fallbackKey;
}

// Map Neon PG* environment variables to standard DB_* variables if needed
if (getenv('PGHOST') && !getenv('DB_HOST')) {
    putenv('DB_HOST=' . getenv('PGHOST'));
    $_ENV['DB_HOST'] = getenv('PGHOST');
    $_SERVER['DB_HOST'] = getenv('PGHOST');
}
if (getenv('PGDATABASE') && !getenv('DB_DATABASE')) {
    putenv('DB_DATABASE=' . getenv('PGDATABASE'));
    $_ENV['DB_DATABASE'] = getenv('PGDATABASE');
    $_SERVER['DB_DATABASE'] = getenv('PGDATABASE');
}
if (getenv('PGUSER') && !getenv('DB_USERNAME')) {
    putenv('DB_USERNAME=' . getenv('PGUSER'));
    $_ENV['DB_USERNAME'] = getenv('PGUSER');
    $_SERVER['DB_USERNAME'] = getenv('PGUSER');
}
if (getenv('PGPASSWORD') && !getenv('DB_PASSWORD')) {
    putenv('DB_PASSWORD=' . getenv('PGPASSWORD'));
    $_ENV['DB_PASSWORD'] = getenv('PGPASSWORD');
    $_SERVER['DB_PASSWORD'] = getenv('PGPASSWORD');
}
if (getenv('PGSSLMODE') && !getenv('DB_SSLMODE')) {
    putenv('DB_SSLMODE=' . getenv('PGSSLMODE'));
    $_ENV['DB_SSLMODE'] = getenv('PGSSLMODE');
    $_SERVER['DB_SSLMODE'] = getenv('PGSSLMODE');
}

// Fallback to Neon cloud PostgreSQL credentials if not configured in Vercel UI
if (empty($_ENV['DB_HOST']) && !getenv('DB_HOST') && !getenv('PGHOST')) {
    $neonHost = 'ep-muddy-sunset-b3i3scmu-pooler.c-4.ap-southeast-1.aws.neon.tech';
    putenv("DB_CONNECTION=pgsql");
    $_ENV['DB_CONNECTION'] = 'pgsql';
    $_SERVER['DB_CONNECTION'] = 'pgsql';

    putenv("DB_HOST=$neonHost");
    $_ENV['DB_HOST'] = $neonHost;
    $_SERVER['DB_HOST'] = $neonHost;

    putenv("DB_PORT=5432");
    $_ENV['DB_PORT'] = '5432';
    $_SERVER['DB_PORT'] = '5432';

    putenv("DB_DATABASE=neondb");
    $_ENV['DB_DATABASE'] = 'neondb';
    $_SERVER['DB_DATABASE'] = 'neondb';

    putenv("DB_USERNAME=neondb_owner");
    $_ENV['DB_USERNAME'] = 'neondb_owner';
    $_SERVER['DB_USERNAME'] = 'neondb_owner';

    putenv("DB_PASSWORD=npg_U2fJ4etobIzp");
    $_ENV['DB_PASSWORD'] = 'npg_U2fJ4etobIzp';
    $_SERVER['DB_PASSWORD'] = 'npg_U2fJ4etobIzp';

    putenv("DB_SSLMODE=require");
    $_ENV['DB_SSLMODE'] = 'require';
    $_SERVER['DB_SSLMODE'] = 'require';
}

// Stateless Vercel serverless: avoid cross-request session/cache DB round-trips
putenv('SESSION_DRIVER=cookie');
$_ENV['SESSION_DRIVER'] = 'cookie';
$_SERVER['SESSION_DRIVER'] = 'cookie';

putenv('CACHE_STORE=array');
$_ENV['CACHE_STORE'] = 'array';
$_SERVER['CACHE_STORE'] = 'array';
if (empty($_ENV['QUEUE_CONNECTION']) && !getenv('QUEUE_CONNECTION')) {
    putenv('QUEUE_CONNECTION=database');
    $_ENV['QUEUE_CONNECTION'] = 'database';
    $_SERVER['QUEUE_CONNECTION'] = 'database';
}

// Prepare /tmp directories for Laravel on Vercel serverless
$tmpDirs = [
    '/tmp/storage',
    '/tmp/storage/app',
    '/tmp/storage/app/public',
    '/tmp/storage/framework',
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/cache',
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/logs',
    '/tmp/bootstrap',
    '/tmp/bootstrap/cache',
];

foreach ($tmpDirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

putenv('VIEW_COMPILED_PATH=/tmp/storage/framework/views');
$_ENV['VIEW_COMPILED_PATH'] = '/tmp/storage/framework/views';
$_SERVER['VIEW_COMPILED_PATH'] = '/tmp/storage/framework/views';

putenv('APP_CONFIG_CACHE=/tmp/bootstrap/cache/config.php');
$_ENV['APP_CONFIG_CACHE'] = '/tmp/bootstrap/cache/config.php';
$_SERVER['APP_CONFIG_CACHE'] = '/tmp/bootstrap/cache/config.php';

putenv('APP_SERVICES_CACHE=/tmp/bootstrap/cache/services.php');
$_ENV['APP_SERVICES_CACHE'] = '/tmp/bootstrap/cache/services.php';
$_SERVER['APP_SERVICES_CACHE'] = '/tmp/bootstrap/cache/services.php';

putenv('APP_PACKAGES_CACHE=/tmp/bootstrap/cache/packages.php');
$_ENV['APP_PACKAGES_CACHE'] = '/tmp/bootstrap/cache/packages.php';
$_SERVER['APP_PACKAGES_CACHE'] = '/tmp/bootstrap/cache/packages.php';

putenv('APP_ROUTES_CACHE=/tmp/bootstrap/cache/routes.php');
$_ENV['APP_ROUTES_CACHE'] = '/tmp/bootstrap/cache/routes.php';
$_SERVER['APP_ROUTES_CACHE'] = '/tmp/bootstrap/cache/routes.php';

putenv('APP_EVENTS_CACHE=/tmp/bootstrap/cache/events.php');
$_ENV['APP_EVENTS_CACHE'] = '/tmp/bootstrap/cache/events.php';
$_SERVER['APP_EVENTS_CACHE'] = '/tmp/bootstrap/cache/events.php';

require __DIR__ . '/../public/index.php';
