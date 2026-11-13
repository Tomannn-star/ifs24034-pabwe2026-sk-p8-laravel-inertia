<?php

namespace Tests\Unit;

use App\Features\Post\Enums\PostCategory;
use App\Features\Post\Models\Post;
use App\Features\Post\Services\PostService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PostServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_create_post_without_excerpt_auto_generates_from_content(): void
    {
        $user = User::factory()->create();
        $service = app(PostService::class);

        $post = $service->createPost($user->id, [
            'title' => 'Judul Tanpa Cuplikan',
            'category' => PostCategory::TEKNOLOGI->value,
            'content' => '<p>Ini adalah paragraf konten pertama yang cukup panjang untuk dijadikan cuplikan otomatis artikel.</p>',
            'is_published' => true,
        ]);

        $this->assertNotNull($post->excerpt);
        $this->assertStringContainsString('Ini adalah paragraf konten', $post->excerpt);
        $this->assertNotNull($post->published_at);
    }

    public function test_update_post_auto_generates_excerpt_when_empty_and_retains_published_at(): void
    {
        $user = User::factory()->create();
        $service = app(PostService::class);

        $originalPublishedAt = now()->subDays(5);
        $post = Post::factory()->create([
            'user_id' => $user->id,
            'title' => 'Artikel Kosong Cuplikan',
            'excerpt' => null,
            'content' => '',
            'is_published' => true,
            'published_at' => $originalPublishedAt,
        ]);

        $updated = $service->updatePost($post, [
            'content' => '<p>Konten baru diperbarui untuk cuplikan otomatis.</p>',
            'is_published' => true,
        ]);

        $this->assertNotNull($updated->excerpt);
        $this->assertStringContainsString('Konten baru diperbarui', $updated->excerpt);
        $this->assertSame($originalPublishedAt->toDateTimeString(), $updated->published_at->toDateTimeString());
    }

    public function test_update_post_with_new_title_and_cover_replacement(): void
    {
        $user = User::factory()->create();
        $service = app(PostService::class);

        $oldCover = UploadedFile::fake()->image('old.png', 400, 300);
        $post = $service->createPost($user->id, [
            'title' => 'Judul Asli',
            'category' => PostCategory::BISNIS->value,
            'content' => 'Konten asli',
            'is_published' => false,
        ], $oldCover);

        $oldCoverPath = $post->cover_image_path;
        Storage::disk('public')->assertExists($oldCoverPath);

        $newCover = UploadedFile::fake()->image('new.png', 400, 300);
        $updated = $service->updatePost($post, [
            'title' => 'Judul Baru Berubah',
            'category' => PostCategory::PENDIDIKAN->value,
            'content' => 'Konten diperbarui',
            'is_published' => true,
        ], $newCover);

        $this->assertSame('Judul Baru Berubah', $updated->title);
        $this->assertSame('judul-baru-berubah', $updated->slug);
        $this->assertTrue($updated->is_published);
        $this->assertNotNull($updated->published_at);
        Storage::disk('public')->assertMissing($oldCoverPath);
        Storage::disk('public')->assertExists($updated->cover_image_path);
    }

    public function test_delete_post_removes_cover_file_from_storage(): void
    {
        $user = User::factory()->create();
        $service = app(PostService::class);

        $cover = UploadedFile::fake()->image('hapus.png', 200, 200);
        $post = $service->createPost($user->id, [
            'title' => 'Artikel Akan Dihapus',
            'category' => PostCategory::UMUM->value,
            'content' => 'Konten',
        ], $cover);

        $coverPath = $post->cover_image_path;
        Storage::disk('public')->assertExists($coverPath);

        $deleted = $service->deletePost($post);
        $this->assertTrue($deleted);
        Storage::disk('public')->assertMissing($coverPath);
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    public function test_toggle_publish_cycles_status_and_retains_published_at(): void
    {
        $user = User::factory()->create();
        $service = app(PostService::class);

        $post = $service->createPost($user->id, [
            'title' => 'Siklus Publikasi',
            'category' => PostCategory::OPINI->value,
            'content' => 'Opini publikasi',
            'is_published' => false,
        ]);

        $published = $service->togglePublish($post);
        $this->assertTrue($published->is_published);
        $this->assertNotNull($published->published_at);
        $initialPublishedAt = $published->published_at;

        $draft = $service->togglePublish($published);
        $this->assertFalse($draft->is_published);
        $this->assertSame($initialPublishedAt->toDateTimeString(), $draft->published_at->toDateTimeString());
    }

    public function test_upload_cover_and_delete_cover(): void
    {
        $user = User::factory()->create();
        $service = app(PostService::class);

        $post = $service->createPost($user->id, [
            'title' => 'Kelola Cover',
            'category' => PostCategory::GAYA_HIDUP->value,
            'content' => 'Konten cover',
        ]);

        $cover1 = UploadedFile::fake()->image('cover1.png', 100, 100);
        $withCover1 = $service->uploadCover($post, $cover1);
        $path1 = $withCover1->cover_image_path;
        Storage::disk('public')->assertExists($path1);

        $cover2 = UploadedFile::fake()->image('cover2.png', 100, 100);
        $withCover2 = $service->uploadCover($withCover1, $cover2);
        Storage::disk('public')->assertMissing($path1);
        Storage::disk('public')->assertExists($withCover2->cover_image_path);

        $withoutCover = $service->deleteCover($withCover2);
        $this->assertNull($withoutCover->cover_image_path);
        Storage::disk('public')->assertMissing($withCover2->cover_image_path);
    }

    public function test_generate_unique_slug_handles_empty_title_and_slug_collisions(): void
    {
        $service = app(PostService::class);

        // Empty title or only symbols produces random slug
        $slugEmpty = $service->generateUniqueSlug('???');
        $this->assertStringStartsWith('post-', $slugEmpty);

        // Collisions
        $user = User::factory()->create();
        Post::factory()->create(['user_id' => $user->id, 'slug' => 'judul-duplikat']);
        Post::factory()->create(['user_id' => $user->id, 'slug' => 'judul-duplikat-1']);

        $newSlug = $service->generateUniqueSlug('Judul Duplikat');
        $this->assertSame('judul-duplikat-2', $newSlug);
    }
}
