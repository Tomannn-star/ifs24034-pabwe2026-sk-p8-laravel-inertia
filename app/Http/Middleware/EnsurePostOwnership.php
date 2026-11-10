<?php

namespace App\Http\Middleware;

use App\Features\Post\Models\Post;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePostOwnership
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $post = $request->route('post');

        if (! $user) {
            abort(401);
        }

        if ($post instanceof Post) {
            if (! $user->isAdmin() && $post->user_id !== $user->id) {
                abort(403, 'Anda bukan pemilik artikel ini.');
            }
        }

        return $next($request);
    }
}
