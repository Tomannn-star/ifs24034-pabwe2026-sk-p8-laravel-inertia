<?php

namespace Tests\Unit;

use App\Http\Middleware\EnsureRole;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class EnsureRoleTest extends TestCase
{
    public function test_ensure_role_passes_when_user_has_matching_role(): void
    {
        $middleware = new EnsureRole();
        $user = new User(['role' => 'admin']);
        $request = Request::create('/admin/users');
        $request->setUserResolver(fn () => $user);

        $response = $middleware->handle($request, function ($req) {
            return new Response('passed');
        }, 'admin');

        $this->assertSame('passed', $response->getContent());
    }

    public function test_ensure_role_aborts_403_when_no_user(): void
    {
        $middleware = new EnsureRole();
        $request = Request::create('/admin/users');
        $request->setUserResolver(fn () => null);

        try {
            $middleware->handle($request, function () {
                return new Response();
            }, 'admin');
            $this->fail('Expected HttpException was not thrown.');
        } catch (HttpException $e) {
            $this->assertSame(403, $e->getStatusCode());
        }
    }

    public function test_ensure_role_aborts_403_when_role_does_not_match(): void
    {
        $middleware = new EnsureRole();
        $user = new User(['role' => 'member']);
        $request = Request::create('/admin/users');
        $request->setUserResolver(fn () => $user);

        try {
            $middleware->handle($request, function () {
                return new Response();
            }, 'admin');
            $this->fail('Expected HttpException was not thrown.');
        } catch (HttpException $e) {
            $this->assertSame(403, $e->getStatusCode());
        }
    }
}
