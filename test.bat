@echo off
if "%~1"=="" (
    php vendor/bin/phpunit --no-coverage
) else (
    php vendor/bin/phpunit %*
)
