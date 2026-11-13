<?php

namespace Tests\Unit;

use App\Features\Post\Contracts\PostRepositoryInterface;
use App\Features\Post\Enums\PostCategory;
use App\Features\Post\Models\Post;
use App\Features\Post\Repositories\PostRepository;
use App\Features\Post\Services\PostExcelService;
use App\Features\Post\Services\PostService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Tests\TestCase;

class PostExcelServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_export_generates_valid_spreadsheet_stream(): void
    {
        $user1 = User::factory()->create(['name' => 'Penulis Satu']);
        $user2 = User::factory()->create(['name' => 'Penulis Dua']);

        $post1 = Post::factory()->create([
            'user_id' => $user1->id,
            'title' => 'Artikel Lengkap',
            'category' => PostCategory::TEKNOLOGI,
            'excerpt' => 'Cuplikan ringkas',
            'content' => 'Konten teks lengkap',
            'is_published' => true,
            'published_at' => now(),
        ]);

        $post2 = Post::factory()->create([
            'user_id' => $user2->id,
            'title' => 'Artikel Draf Tanpa Cuplikan',
            'category' => 'Bisnis',
            'excerpt' => null,
            'content' => 'Konten draf',
            'is_published' => false,
            'published_at' => null,
        ]);

        $postWithoutUser = new Post([
            'title' => 'Artikel Anonim',
            'category' => 'Umum',
            'excerpt' => 'Tanpa user',
            'content' => 'Konten anonim',
            'is_published' => false,
            'published_at' => null,
        ]);

        $service = app(PostExcelService::class);
        $response = $service->export([$post1, $post2, $postWithoutUser], 'uji-export.xlsx');

        $this->assertInstanceOf(StreamedResponse::class, $response);
        $this->assertSame('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', $response->headers->get('Content-Type'));

        ob_start();
        $response->sendContent();
        $binary = ob_get_clean();

        $this->assertNotEmpty($binary);
        $this->assertStringStartsWith('PK', $binary);
    }

    public function test_import_processes_valid_rows_and_skips_empty(): void
    {
        $user = User::factory()->create();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->fromArray([
            ['No', 'Judul Artikel', 'Kategori', 'Penulis', 'Status', 'Tanggal Publikasi', 'Ringkasan', 'Isi Konten'],
            [1, 'Judul Satu', 'Pendidikan', 'Penulis', 'Published', '2026-11-13', 'Ringkasan 1', 'Konten 1'],
            [2, 'Judul Dua Kategori Invalid', 'NonExistentCategory', 'Penulis', 'Draft', '-', '-', 'Konten 2'],
            [3, '', 'Umum', 'Penulis', 'Draft', '-', '', ''], // empty title & content skipped
            [4, 'Judul Tiga', 'Umum', 'Penulis', 'Draft', '-', '', ''], // empty content skipped
        ]);

        $tempPath = tempnam(sys_get_temp_dir(), 'test_import_') . '.xlsx';
        (new Xlsx($spreadsheet))->save($tempPath);

        $file = new UploadedFile($tempPath, 'uji.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', null, true);

        $service = app(PostExcelService::class);
        $importedCount = $service->import($user->id, $file);

        $this->assertSame(2, $importedCount);
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'title' => 'Judul Satu',
            'category' => 'Pendidikan',
            'excerpt' => 'Ringkasan 1',
        ]);
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'title' => 'Judul Dua Kategori Invalid',
            'category' => 'Umum',
            'excerpt' => 'Konten 2',
        ]);

        @unlink($tempPath);
    }
}
