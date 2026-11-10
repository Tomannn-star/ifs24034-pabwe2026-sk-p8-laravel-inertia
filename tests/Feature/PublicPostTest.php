<?php

namespace Tests\Feature;

use App\Features\Post\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicPostTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_can_be_rendered(): void
    {
        $user = User::factory()->create();

        // Create published posts and draft post
        $post1 = Post::factory()->create([
            'user_id' => $user->id,
            'is_published' => true,
            'published_at' => now(),
            'category' => 'Teknologi',
        ]);

        $draft = Post::factory()->create([
            'user_id' => $user->id,
            'is_published' => false,
            'published_at' => null,
            'category' => 'Bisnis',
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_articles_index_with_search_and_category_filter(): void
    {
        $user = User::factory()->create();

        Post::factory()->create([
            'user_id' => $user->id,
            'title' => 'Panduan Belajar Laravel 13',
            'category' => 'Pendidikan',
            'is_published' => true,
            'published_at' => now(),
        ]);

        Post::factory()->create([
            'user_id' => $user->id,
            'title' => 'Tips Produktivitas Harian',
            'category' => 'Gaya Hidup',
            'is_published' => true,
            'published_at' => now(),
        ]);

        // Search for Laravel
        $response = $this->get('/articles?search=Laravel');
        $response->assertStatus(200);

        // Filter by category
        $response2 = $this->get('/articles?category=Pendidikan');
        $response2->assertStatus(200);
    }

    public function test_published_article_can_be_viewed_by_slug(): void
    {
        $user = User::factory()->create();

        $post = Post::factory()->create([
            'user_id' => $user->id,
            'title' => 'Inovasi Cloud Computing',
            'slug' => 'inovasi-cloud-computing',
            'category' => 'Teknologi',
            'is_published' => true,
            'published_at' => now(),
        ]);

        // Create related post
        Post::factory()->create([
            'user_id' => $user->id,
            'title' => 'Keamanan Jaringan Cloud',
            'category' => 'Teknologi',
            'is_published' => true,
            'published_at' => now(),
        ]);

        $response = $this->get('/articles/inovasi-cloud-computing');

        $response->assertStatus(200);
    }

    public function test_draft_article_returns_404_for_guest(): void
    {
        $user = User::factory()->create();

        $post = Post::factory()->create([
            'user_id' => $user->id,
            'title' => 'Artikel Rahasia',
            'slug' => 'artikel-rahasia',
            'is_published' => false,
        ]);

        $response = $this->get('/articles/artikel-rahasia');

        $response->assertStatus(404);
    }

    public function test_non_existent_article_slug_returns_404(): void
    {
        $response = $this->get('/articles/slug-yang-tidak-pernah-ada');

        $response->assertStatus(404);
    }
}
