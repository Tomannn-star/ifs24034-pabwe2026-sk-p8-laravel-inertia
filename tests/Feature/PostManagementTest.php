<?php

namespace Tests\Feature;

use App\Features\Ai\Contracts\AiClientInterface;
use App\Features\Ai\DTO\GeneratedPostItem;
use App\Features\Post\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PostManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_member_can_view_post_dashboard_and_stats(): void
    {
        $user = User::factory()->create();

        // 2 published, 1 draft
        Post::factory()->create([
            'user_id' => $user->id,
            'is_published' => true,
            'category' => 'Teknologi',
            'title' => 'Artikel Satu',
        ]);
        Post::factory()->create([
            'user_id' => $user->id,
            'is_published' => true,
            'category' => 'Bisnis',
            'title' => 'Artikel Dua',
        ]);
        Post::factory()->create([
            'user_id' => $user->id,
            'is_published' => false,
            'category' => 'Pendidikan',
            'title' => 'Draf Tiga',
        ]);

        $response = $this->actingAs($user)->get('/dashboard/posts');

        $response->assertStatus(200);

        // Test filtering
        $responseFiltered = $this->actingAs($user)->get('/dashboard/posts?search=Satu&category=Teknologi&status=published');
        $responseFiltered->assertStatus(200);

        $responseDrafts = $this->actingAs($user)->get('/dashboard/posts?status=draft');
        $responseDrafts->assertStatus(200);
    }

    public function test_member_can_create_post_with_cover_and_publish(): void
    {
        $user = User::factory()->create();

        $cover = UploadedFile::fake()->image('cover.png', 800, 600);

        $response = $this->actingAs($user)->post('/dashboard/posts', [
            'title' => 'Belajar Inertia.js dan React',
            'category' => 'Teknologi',
            'excerpt' => 'Ringkasan panduan Inertia dan React.',
            'content' => '# Panduan Lengkap\n\nInertia.js sangat menyenangkan!',
            'cover_image' => $cover,
            'is_published' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'title' => 'Belajar Inertia.js dan React',
            'slug' => 'belajar-inertiajs-dan-react',
            'category' => 'Teknologi',
            'is_published' => true,
        ]);

        $post = Post::where('title', 'Belajar Inertia.js dan React')->first();
        $this->assertNotNull($post->cover_image_path);
        Storage::disk('public')->assertExists($post->cover_image_path);
        $this->assertNotNull($post->cover_url);
    }

    public function test_slug_generation_handles_duplicates(): void
    {
        $user = User::factory()->create();

        Post::factory()->create([
            'user_id' => $user->id,
            'title' => 'Artikel Duplikat',
            'slug' => 'artikel-duplikat',
        ]);

        $response = $this->actingAs($user)->post('/dashboard/posts', [
            'title' => 'Artikel Duplikat',
            'category' => 'Umum',
            'content' => 'Konten artikel kedua yang memiliki judul sama.',
            'is_published' => false,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('posts', [
            'title' => 'Artikel Duplikat',
            'slug' => 'artikel-duplikat-1',
        ]);
    }

    public function test_member_can_view_own_post_detail(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $repo = app(\App\Features\Post\Contracts\PostRepositoryInterface::class);
        $found = $repo->findById($post->id);
        $this->assertNotNull($found);
        $this->assertSame($post->id, $found->id);

        $response = $this->actingAs($user)->get("/dashboard/posts/{$post->id}");

        $response->assertStatus(200);
    }

    public function test_member_can_update_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create([
            'user_id' => $user->id,
            'title' => 'Judul Lama',
            'category' => 'Umum',
            'cover_image_path' => 'covers/old_cover.jpg',
        ]);
        Storage::disk('public')->put('covers/old_cover.jpg', 'old');

        $newCover = UploadedFile::fake()->image('updated_cover.png', 600, 400);

        $response = $this->actingAs($user)->put("/dashboard/posts/{$post->id}", [
            'title' => 'Judul Baru yang Diperbarui',
            'category' => 'Bisnis',
            'excerpt' => 'Ringkasan baru',
            'content' => 'Konten baru yang lebih segar',
            'cover_image' => $newCover,
            'is_published' => true,
        ]);

        $response->assertRedirect();
        $post->refresh();
        $this->assertSame('Judul Baru yang Diperbarui', $post->title);
        $this->assertSame('Bisnis', $post->category->value);
        $this->assertTrue($post->is_published);
        Storage::disk('public')->assertMissing('covers/old_cover.jpg');
        Storage::disk('public')->assertExists($post->cover_image_path);
    }

    public function test_post_cover_url_returns_null_when_path_is_null(): void
    {
        $post = new Post(['cover_image_path' => null]);
        $this->assertNull($post->cover_url);
    }

    public function test_slug_generation_falls_back_for_symbols_only_title(): void
    {
        $service = app(\App\Features\Post\Services\PostService::class);
        $slug = $service->generateUniqueSlug('???');

        $this->assertStringStartsWith('post-', $slug);
    }

    public function test_member_can_toggle_publish_status(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create([
            'user_id' => $user->id,
            'is_published' => false,
            'published_at' => null,
        ]);

        // Toggle to published
        $response = $this->actingAs($user)->patch("/dashboard/posts/{$post->id}/publish");
        $response->assertRedirect();
        $post->refresh();
        $this->assertTrue($post->is_published);
        $this->assertNotNull($post->published_at);

        // Toggle back to draft
        $response2 = $this->actingAs($user)->patch("/dashboard/posts/{$post->id}/publish");
        $response2->assertRedirect();
        $post->refresh();
        $this->assertFalse($post->is_published);
    }

    public function test_member_can_upload_and_delete_cover_image(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        // Upload
        $file = UploadedFile::fake()->image('banner.png', 1200, 630);
        $response = $this->actingAs($user)->post("/dashboard/posts/{$post->id}/cover", [
            'cover_image' => $file,
        ]);
        $response->assertRedirect();
        $post->refresh();
        $this->assertNotNull($post->cover_image_path);
        Storage::disk('public')->assertExists($post->cover_image_path);

        // Delete
        $responseDelete = $this->actingAs($user)->delete("/dashboard/posts/{$post->id}/cover");
        $responseDelete->assertRedirect();
        $post->refresh();
        $this->assertNull($post->cover_image_path);
    }

    public function test_member_can_delete_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create([
            'user_id' => $user->id,
            'cover_image_path' => 'posts/sample.jpg',
        ]);
        Storage::disk('public')->put('posts/sample.jpg', 'content');

        $response = $this->actingAs($user)->delete("/dashboard/posts/{$post->id}");

        $response->assertRedirect('/dashboard/posts');
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
        Storage::disk('public')->assertMissing('posts/sample.jpg');
    }

    public function test_member_cannot_modify_or_delete_other_users_post(): void
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($stranger)->get("/dashboard/posts/{$post->id}")->assertStatus(403);
        $this->actingAs($stranger)->put("/dashboard/posts/{$post->id}", [
            'title' => 'Hacked',
            'category' => 'Umum',
            'content' => 'Content',
        ])->assertStatus(403);
        $this->actingAs($stranger)->delete("/dashboard/posts/{$post->id}")->assertStatus(403);
        $this->actingAs($stranger)->patch("/dashboard/posts/{$post->id}/publish")->assertStatus(403);
    }

    public function test_member_can_export_posts_to_excel(): void
    {
        $user = User::factory()->create();
        Post::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get('/dashboard/posts/export');

        $response->assertStatus(200);
        $this->assertStringContainsString('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', $response->headers->get('Content-Type') ?? '');

        ob_start();
        $response->sendContent();
        $output = ob_get_clean();
        $this->assertNotEmpty($output);
    }

    public function test_member_can_import_posts_from_excel(): void
    {
        $user = User::factory()->create();

        // Create an excel file in memory using PhpSpreadsheet
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->fromArray([
            ['No', 'Judul Artikel', 'Kategori', 'Penulis', 'Status', 'Tanggal Publikasi', 'Cuplikan', 'Konten'],
            [1, 'Import Post 1', 'Teknologi', 'Author', 'Draf', '-', 'Cuplikan satu', 'Konten post 1 lengkap'],
            [2, 'Import Post 2', 'Bisnis', 'Author', 'Draf', '-', 'Cuplikan dua', 'Konten post 2 lengkap'],
            [3, '', 'Umum', 'Author', 'Draf', '-', '', ''], // empty title row to test skipping
        ]);

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $tempDir = storage_path('framework/testing');
        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0755, true);
        }
        $tempFile = $tempDir . '/test_import_' . uniqid() . '.xlsx';
        $writer->save($tempFile);

        $uploaded = new UploadedFile($tempFile, 'import.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', null, true);

        $response = $this->actingAs($user)->post('/dashboard/posts/import', [
            'file' => $uploaded,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'title' => 'Import Post 1',
            'category' => 'Teknologi',
            'is_published' => false,
        ]);
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'title' => 'Import Post 2',
            'category' => 'Bisnis',
            'is_published' => false,
        ]);

        if (file_exists($tempFile)) {
            @unlink($tempFile);
        }
    }

    public function test_ai_generate_endpoint_with_mocked_service(): void
    {
        $user = User::factory()->create();

        $mock = $this->createMock(AiClientInterface::class);
        $mock->expects($this->once())
            ->method('generatePosts')
            ->with('Kecerdasan Buatan', 2, 'Teknologi')
            ->willReturn([
                new GeneratedPostItem('AI Post 1', 'Teknologi', 'Ringkasan 1', 'Konten AI 1'),
                new GeneratedPostItem('AI Post 2', 'Teknologi', 'Ringkasan 2', 'Konten AI 2'),
            ]);

        $this->app->instance(AiClientInterface::class, $mock);

        $response = $this->actingAs($user)->postJson('/dashboard/posts/ai-generate', [
            'topic' => 'Kecerdasan Buatan',
            'count' => 2,
            'category' => 'Teknologi',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'data' => [
                ['title' => 'AI Post 1'],
                ['title' => 'AI Post 2'],
            ],
        ]);
    }

    public function test_ai_save_endpoint_creates_draft_posts(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/dashboard/posts/ai-save', [
            'posts' => [
                [
                    'title' => 'Hasil AI Satu',
                    'category' => 'Pendidikan',
                    'excerpt' => 'Ringkasan AI',
                    'content' => 'Konten AI Lengkap',
                ],
                [
                    'title' => 'Hasil AI Dua',
                    'category' => 'Umum',
                    'content' => 'Konten AI Dua Lengkap',
                ],
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'title' => 'Hasil AI Satu',
            'category' => 'Pendidikan',
            'is_published' => false,
        ]);
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'title' => 'Hasil AI Dua',
            'category' => 'Umum',
            'is_published' => false,
        ]);
    }

    public function test_ai_generate_endpoint_handles_exceptions_gracefully(): void
    {
        $user = User::factory()->create();

        $mock = $this->createMock(\App\Features\Ai\Contracts\AiClientInterface::class);
        $mock->expects($this->once())
            ->method('generatePosts')
            ->willThrowException(new \RuntimeException('Gagal memanggil API AI.'));

        $this->app->instance(\App\Features\Ai\Contracts\AiClientInterface::class, $mock);

        $response = $this->actingAs($user)->postJson('/dashboard/posts/ai-generate', [
            'topic' => 'Kecerdasan Buatan',
            'count' => 1,
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'message' => 'Gagal memanggil API AI.',
        ]);
    }
}
