<?php

namespace Tests\Feature;

use App\Features\Ai\Contracts\AiClientInterface;
use App\Features\Ai\Services\OpenAiPostGeneratorService;
use App\Features\Post\Contracts\PostRepositoryInterface;
use App\Features\Post\Repositories\PostRepository;
use App\Providers\AppServiceProvider;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class AppServiceProviderTest extends TestCase
{
    public function test_service_bindings_resolve_expected_classes(): void
    {
        $provider = new AppServiceProvider($this->app);
        $provider->register();

        $this->assertInstanceOf(PostRepository::class, app(PostRepositoryInterface::class));
        $this->assertInstanceOf(OpenAiPostGeneratorService::class, app(AiClientInterface::class));
    }

    public function test_boot_respects_force_https_configuration(): void
    {
        // When force_https is false
        config(['app.force_https' => false]);
        $provider = new AppServiceProvider($this->app);
        $provider->boot();

        // When force_https is true
        config(['app.force_https' => true]);
        $provider->boot();

        $this->assertSame('https', parse_url(URL::to('/'), PHP_URL_SCHEME));
    }
}
