<?php

namespace App\Features\Post\Contracts;

use App\Features\Post\Models\Post;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface PostRepositoryInterface
{
    public function getPublishedPosts(?string $search = null, ?string $category = null, int $perPage = 9): LengthAwarePaginator;

    public function findPublishedBySlug(string $slug): ?Post;

    public function getUserPosts(int $userId, ?string $search = null, ?string $category = null, ?string $status = null, int $perPage = 10): LengthAwarePaginator;

    public function findById(int $id): ?Post;

    public function create(array $data): Post;

    public function update(Post $post, array $data): bool;

    public function delete(Post $post): bool;

    public function getAllPosts(?string $search = null, ?string $category = null, ?int $userId = null, int $perPage = 15): LengthAwarePaginator;

    /**
     * @return array{total: int, published: int, draft: int}
     */
    public function getUserStats(int $userId): array;

    /**
     * @return Collection<int, Post>
     */
    public function getAllUserPostsForExport(int $userId): Collection;

    /**
     * @return Collection<int, Post>
     */
    public function getAllPostsForExport(?int $userId = null): Collection;
}
