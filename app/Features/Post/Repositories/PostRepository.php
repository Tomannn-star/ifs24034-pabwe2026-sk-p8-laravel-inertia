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
        $row = Post::query()
            ->where('user_id', $userId)
            ->selectRaw('COUNT(*) as total, COALESCE(SUM(CASE WHEN is_published THEN 1 ELSE 0 END), 0) as published')
            ->first();

        $total = (int) ($row->total ?? 0);
        $published = (int) ($row->published ?? 0);

        return [
            'total' => $total,
            'published' => $published,
            'draft' => max(0, $total - $published),
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

