<?php

namespace App\Features\Post\Repositories;

use App\Features\Post\Contracts\PostRepositoryInterface;
use App\Features\Post\Models\Post;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class PostRepository implements PostRepositoryInterface
{
    private function likeOperator(): string
    {
        return DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
    }

    public function getPublishedPosts(?string $search = null, ?string $category = null, int $perPage = 9): LengthAwarePaginator
    {
        $query = Post::query()->with('user')->where('is_published', true);

        if ($search) {
            $like = $this->likeOperator();
            $query->where(function ($q) use ($search, $like) {
                $q->where('title', $like, "%{$search}%")
                    ->orWhere('excerpt', $like, "%{$search}%")
                    ->orWhere('content', $like, "%{$search}%");
            });
        }

        if ($category && $category !== 'Semua') {
            $query->where('category', $category);
        }

        return $query->latest('published_at')->paginate($perPage)->withQueryString();
    }

    public function findPublishedBySlug(string $slug): ?Post
    {
        return Post::query()->with('user')->where('is_published', true)->where('slug', $slug)->first();
    }

    public function getUserPosts(int $userId, ?string $search = null, ?string $category = null, ?string $status = null, int $perPage = 10): LengthAwarePaginator
    {
        $query = Post::query()->where('user_id', $userId);

        if ($search) {
            $like = $this->likeOperator();
            $query->where(function ($q) use ($search, $like) {
                $q->where('title', $like, "%{$search}%")
                    ->orWhere('excerpt', $like, "%{$search}%")
                    ->orWhere('content', $like, "%{$search}%");
            });
        }

        if ($category && $category !== 'Semua') {
            $query->where('category', $category);
        }

        if ($status === 'published') {
            $query->where('is_published', true);
        } elseif ($status === 'draft') {
            $query->where('is_published', false);
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function findById(int $id): ?Post
    {
        return Post::query()->with('user')->find($id);
    }

    public function create(array $data): Post
    {
        return Post::create($data);
    }

    public function update(Post $post, array $data): bool
    {
        return $post->update($data);
    }

    public function delete(Post $post): bool
    {
        return (bool) $post->delete();
    }

    public function getAllPosts(?string $search = null, ?string $category = null, ?int $userId = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Post::query()->with('user');

        if ($userId) {
            $query->where('user_id', $userId);
        }

        if ($search) {
            $like = $this->likeOperator();
            $query->where(function ($q) use ($search, $like) {
                $q->where('title', $like, "%{$search}%")
                    ->orWhere('excerpt', $like, "%{$search}%")
                    ->orWhere('content', $like, "%{$search}%");
            });
        }

        if ($category && $category !== 'Semua') {
            $query->where('category', $category);
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    /**
     * @return array{total: int, published: int, draft: int}
     */
    public function getUserStats(int $userId): array
    {
        $total = Post::where('user_id', $userId)->count();
        $published = Post::where('user_id', $userId)->where('is_published', true)->count();
        $draft = $total - $published;

        return [
            'total' => $total,
            'published' => $published,
            'draft' => $draft,
        ];
    }

    /**
     * @return Collection<int, Post>
     */
    public function getAllUserPostsForExport(int $userId): Collection
    {
        return Post::query()->where('user_id', $userId)->latest()->get();
    }

    /**
     * @return Collection<int, Post>
     */
    public function getAllPostsForExport(?int $userId = null): Collection
    {
        $query = Post::query()->with('user');
        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->latest()->get();
    }
}

