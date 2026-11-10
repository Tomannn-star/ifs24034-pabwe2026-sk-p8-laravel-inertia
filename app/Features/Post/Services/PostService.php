<?php

namespace App\Features\Post\Services;

use App\Features\Post\Contracts\PostRepositoryInterface;
use App\Features\Post\Models\Post;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostService
{
    public function __construct(
        protected PostRepositoryInterface $postRepository
    ) {}

    public function createPost(int $userId, array $data, ?UploadedFile $coverImage = null): Post
    {
        $slug = $this->generateUniqueSlug($data['title']);

        $isPublished = (bool) ($data['is_published'] ?? false);
        $publishedAt = $isPublished ? now() : null;

        $coverImagePath = null;
        if ($coverImage) {
            $coverImagePath = $coverImage->store('covers', 'public');
        }

        $excerpt = $data['excerpt'] ?? null;
        if (! $excerpt && ! empty($data['content'])) {
            $excerpt = Str::limit(strip_tags((string) $data['content']), 160);
        }

        return $this->postRepository->create([
            'user_id' => $userId,
            'title' => $data['title'],
            'slug' => $slug,
            'category' => $data['category'],
            'excerpt' => $excerpt,
            'content' => $data['content'],
            'cover_image_path' => $coverImagePath,
            'is_published' => $isPublished,
            'published_at' => $publishedAt,
        ]);
    }

    public function updatePost(Post $post, array $data, ?UploadedFile $coverImage = null): Post
    {
        $updateData = [];

        if (isset($data['title']) && $data['title'] !== $post->title) {
            $updateData['title'] = $data['title'];
            $updateData['slug'] = $this->generateUniqueSlug($data['title'], $post->id);
        }

        if (isset($data['category'])) {
            $updateData['category'] = $data['category'];
        }

        if (array_key_exists('excerpt', $data)) {
            $updateData['excerpt'] = $data['excerpt'];
        }

        if (isset($data['content'])) {
            $updateData['content'] = $data['content'];
            if (empty($updateData['excerpt']) && empty($post->excerpt)) {
                $updateData['excerpt'] = Str::limit(strip_tags((string) $data['content']), 160);
            }
        }

        if (array_key_exists('is_published', $data)) {
            $isPublished = (bool) $data['is_published'];
            $updateData['is_published'] = $isPublished;
            if ($isPublished && ! $post->published_at) {
                $updateData['published_at'] = now();
            }
        }

        if ($coverImage) {
            if ($post->cover_image_path && Storage::disk('public')->exists($post->cover_image_path)) {
                Storage::disk('public')->delete($post->cover_image_path);
            }
            $updateData['cover_image_path'] = $coverImage->store('covers', 'public');
        }

        $this->postRepository->update($post, $updateData);

        return $post->fresh();
    }

    public function deletePost(Post $post): bool
    {
        if ($post->cover_image_path && Storage::disk('public')->exists($post->cover_image_path)) {
            Storage::disk('public')->delete($post->cover_image_path);
        }

        return $this->postRepository->delete($post);
    }

    public function togglePublish(Post $post): Post
    {
        $newStatus = ! $post->is_published;
        $publishedAt = $newStatus ? ($post->published_at ?? now()) : $post->published_at;

        $this->postRepository->update($post, [
            'is_published' => $newStatus,
            'published_at' => $publishedAt,
        ]);

        return $post->fresh();
    }

    public function uploadCover(Post $post, UploadedFile $coverImage): Post
    {
        if ($post->cover_image_path && Storage::disk('public')->exists($post->cover_image_path)) {
            Storage::disk('public')->delete($post->cover_image_path);
        }

        $path = $coverImage->store('covers', 'public');
        $this->postRepository->update($post, ['cover_image_path' => $path]);

        return $post->fresh();
    }

    public function deleteCover(Post $post): Post
    {
        if ($post->cover_image_path && Storage::disk('public')->exists($post->cover_image_path)) {
            Storage::disk('public')->delete($post->cover_image_path);
        }

        $this->postRepository->update($post, ['cover_image_path' => null]);

        return $post->fresh();
    }

    public function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title);
        if ($baseSlug === '') {
            $baseSlug = 'post-'.Str::random(6);
        }

        $slug = $baseSlug;
        $counter = 1;

        while (
            Post::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
