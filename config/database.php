<?php

use Illuminate\Support\Str;

return [

    'default' => env('DB_CONNECTION', 'pgsql'),

    'connections' => [

        'sqlite' => [
            'driver' => 'sqlite',
            'url' => env('DB_URL'),
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            'prefix' => '',
            'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
            'busy_timeout' => null,
            'journal_mode' => null,
            'synchronous' => null,
            'transaction_mode' => 'DEFERRED',
        ],

        'pgsql' => [
            'driver' => 'pgsql',
            'url' => env('DB_URL', env('DATABASE_URL')),
            'host' => env('DB_HOST', env('PGHOST', '127.0.0.1')),
            'port' => env('DB_PORT', env('PGPORT', '5432')),
            'database' => env('DB_DATABASE', env('PGDATABASE', 'pabwe_p8_blog')),
            'username' => env('DB_USERNAME', env('PGUSER', 'postgres')),
            'password' => env('DB_PASSWORD', env('PGPASSWORD', 'postgres')),
            'charset' => env('DB_CHARSET', 'utf8'),
            'prefix' => '',
            'prefix_indexes' => true,
            'search_path' => 'public',
            'sslmode' => env('DB_SSLMODE', env('PGSSLMODE', 'prefer')),
        ],

        'mysql' => [
            'driver' => 'mysql',
            'url' => env('DB_URL'),
            'host' => env('MYSQL_HOST', '127.0.0.1'),
            'port' => env('MYSQL_PORT', '3306'),
            'database' => env('MYSQL_DATABASE', 'pabwe_p8_blog'),
            'username' => env('MYSQL_USERNAME', 'root'),
            'password' => env('MYSQL_PASSWORD', 'root'),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => env('DB_CHARSET', 'utf8mb4'),
            'collation' => env('DB_COLLATION', 'utf8mb4_unicode_ci'),
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
        ],

        'mariadb' => [
            'driver' => 'mariadb',
            'url' => env('DB_URL'),
            'host' => env('MARIADB_HOST', '127.0.0.1'),
            'port' => env('MARIADB_PORT', '3306'),
            'database' => env('MARIADB_DATABASE', 'pabwe_p8_blog'),
            'username' => env('MARIADB_USERNAME', 'root'),
            'password' => env('MARIADB_PASSWORD', 'root'),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => env('DB_CHARSET', 'utf8mb4'),
            'collation' => env('DB_COLLATION', 'utf8mb4_unicode_ci'),
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
        ],

    ],

    'migrations' => [
        'table' => 'migrations',
        'update_date_on_publish' => true,
    ],

];
