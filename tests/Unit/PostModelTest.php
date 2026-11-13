<?php

namespace Tests\Unit;

use App\Features\Post\Enums\PostCategory;
use App\Features\Post\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PostModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_post_model_attributes_relationships_and_scopes(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $post = Post::factory()->create([
            'user_id' => $user->id,
            'title' => 'Judul Post Model',
            'category' => PostCategory::TEKNOLOGI,
            'cover_image_path' => 'covers/sampul.png',
            'is_published' => true,
        ]);

        $this->assertInstanceOf(User::class, $post->user);
        $this->assertSame($user->id, $post->user->id);

        $this->assertInstanceOf(PostCategory::class, $post->category);
        $this->assertSame('Teknologi', $post->category->value);

        $this->assertNotNull($post->cover_url);
        $this->assertStringContainsString('storage/covers/sampul.png', $post->cover_url);

        // Without cover image
        $postNoCover = Post::factory()->create([
            'cover_image_path' => null,
            'is_published' => false,
        ]);
        $this->assertNull($postNoCover->cover_url);

        // Scope published
        $publishedCount = Post::published()->count();
        $this->assertSame(1, $publishedCount);

        // Factory and casts
        $factory = Post::newFactory();
        $this->assertInstanceOf(\Database\Factories\PostFactory::class, $factory);

        $casts = $post->getCasts();
        $this->assertArrayHasKey('is_published', $casts);
        $this->assertArrayHasKey('published_at', $casts);
        $this->assertArrayHasKey('category', $casts);
    }
}
