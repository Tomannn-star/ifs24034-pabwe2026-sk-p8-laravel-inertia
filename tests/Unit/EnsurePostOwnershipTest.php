<?php

namespace Tests\Unit;

use App\Features\Post\Models\Post;
use App\Http\Middleware\EnsurePostOwnership;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class EnsurePostOwnershipTest extends TestCase
{
    public function test_ensure_post_ownership_passes_for_owner(): void
    {
        $middleware = new EnsurePostOwnership();
        $user = new User(['role' => 'member']);
        $user->id = 5;

        $post = new Post();
        $post->user_id = 5;

        $request = Request::create('/dashboard/posts/1');
        $request->setUserResolver(fn () => $user);
        $route = new \Illuminate\Routing\Route('GET', '/dashboard/posts/{post}', []);
        $route->bind($request);
        $route->setParameter('post', $post);
        $request->setRouteResolver(fn () => $route);

        $response = $middleware->handle($request, function () {
            return new Response('passed');
        });

        $this->assertSame('passed', $response->getContent());
    }

    public function test_ensure_post_ownership_passes_for_admin(): void
    {
        $middleware = new EnsurePostOwnership();
        $admin = new User(['role' => 'admin']);
        $admin->id = 99;

        $post = new Post();
        $post->user_id = 5;

        $request = Request::create('/dashboard/posts/1');
        $request->setUserResolver(fn () => $admin);
        $route = new \Illuminate\Routing\Route('GET', '/dashboard/posts/{post}', []);
        $route->bind($request);
        $route->setParameter('post', $post);
        $request->setRouteResolver(fn () => $route);

        $response = $middleware->handle($request, function () {
            return new Response('passed');
        });

        $this->assertSame('passed', $response->getContent());
    }

    public function test_ensure_post_ownership_aborts_401_when_unauthenticated(): void
    {
        $middleware = new EnsurePostOwnership();
        $request = Request::create('/dashboard/posts/1');
        $request->setUserResolver(fn () => null);

        try {
            $middleware->handle($request, function () {
                return new Response();
            });
            $this->fail('Expected HttpException was not thrown.');
        } catch (HttpException $e) {
            $this->assertSame(401, $e->getStatusCode());
        }
    }

    public function test_ensure_post_ownership_aborts_403_when_not_owner_and_not_admin(): void
    {
        $middleware = new EnsurePostOwnership();
        $user = new User(['role' => 'member']);
        $user->id = 10;

        $post = new Post();
        $post->user_id = 99; // belongs to someone else

        $request = Request::create('/dashboard/posts/1');
        $request->setUserResolver(fn () => $user);
        $route = new \Illuminate\Routing\Route('GET', '/dashboard/posts/{post}', []);
        $route->bind($request);
        $route->setParameter('post', $post);
        $request->setRouteResolver(fn () => $route);

        try {
            $middleware->handle($request, function () {
                return new Response();
            });
            $this->fail('Expected HttpException was not thrown.');
        } catch (HttpException $e) {
            $this->assertSame(403, $e->getStatusCode());
        }
    }

    public function test_ensure_post_ownership_passes_when_post_not_model_instance(): void
    {
        $middleware = new EnsurePostOwnership();
        $user = new User(['role' => 'member']);
        $user->id = 10;

        $request = Request::create('/dashboard/posts');
        $request->setUserResolver(fn () => $user);
        $route = new \Illuminate\Routing\Route('GET', '/dashboard/posts', []);
        $route->bind($request);
        $request->setRouteResolver(fn () => $route);

        $response = $middleware->handle($request, function () {
            return new Response('ok');
        });

        $this->assertSame('ok', $response->getContent());
    }
}
