<?php

namespace Tests\Feature;

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class HandleInertiaRequestsTest extends TestCase
{
    use RefreshDatabase;

    public function test_shared_props_for_guest(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);

        $middleware = new HandleInertiaRequests();
        $request = Request::create('/');
        $request->setLaravelSession(app('session.store'));

        $props = $middleware->share($request);

        $this->assertNull($props['auth']['user']);
        $this->assertSame('BlogVerse Pro', $props['appName']);
        $this->assertArrayHasKey('flash', $props);
        $this->assertNull($props['flash']['success']());
        $this->assertNull($props['flash']['error']());
    }

    public function test_shared_props_for_authenticated_user_with_photo(): void
    {
        $user = User::factory()->create([
            'profile_photo_path' => 'avatars/sample.jpg',
        ]);

        $middleware = new HandleInertiaRequests();
        $request = Request::create('/dashboard/posts');
        $request->setUserResolver(fn () => $user);

        $session = app('session.store');
        $session->put('success', 'Operasi berhasil!');
        $session->put('error', 'Ada kendala');
        $request->setLaravelSession($session);

        $version = $middleware->version($request);

        $props = $middleware->share($request);

        $this->assertNotNull($props['auth']['user']);
        $this->assertSame($user->id, $props['auth']['user']['id']);
        $this->assertSame($user->name, $props['auth']['user']['name']);
        $this->assertSame($user->username, $props['auth']['user']['username']);
        $this->assertSame($user->email, $props['auth']['user']['email']);
        $this->assertSame($user->role, $props['auth']['user']['role']);
        $this->assertStringContainsString('storage/avatars/sample.jpg', $props['auth']['user']['profile_photo_url']);
        $this->assertSame('Operasi berhasil!', $props['flash']['success']());
        $this->assertSame('Ada kendala', $props['flash']['error']());
    }
}
