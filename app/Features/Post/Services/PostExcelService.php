<?php

namespace App\Features\Post\Services;

use App\Features\Post\Contracts\PostRepositoryInterface;
use App\Features\Post\Enums\PostCategory;
use App\Features\Post\Models\Post;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PostExcelService
{
    public function __construct(
        protected PostRepositoryInterface $postRepository,
        protected PostService $postService
    ) {}

    /**
     * @param  Collection<int, Post>|array<int, Post>  $posts
     */
    public function export(Collection|array $posts, string $filename = 'posts.xlsx'): StreamedResponse
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Daftar Artikel');

        // Headers
        $headers = [
            'A1' => 'No',
            'B1' => 'Judul Artikel',
            'C1' => 'Kategori',
            'D1' => 'Penulis',
            'E1' => 'Status',
            'F1' => 'Tanggal Publikasi',
            'G1' => 'Ringkasan',
            'H1' => 'Isi Konten',
        ];

        foreach ($headers as $cell => $value) {
            $sheet->setCellValue($cell, $value);
        }

        // Header style
        $headerRange = 'A1:H1';
        $sheet->getStyle($headerRange)->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '2563EB'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        $row = 2;
        $no = 1;

        foreach ($posts as $post) {
            $categoryValue = $post->category instanceof PostCategory
                ? $post->category->value
                : (string) $post->category;

            $sheet->setCellValue("A{$row}", $no);
            $sheet->setCellValue("B{$row}", $post->title);
            $sheet->setCellValue("C{$row}", $categoryValue);
            $sheet->setCellValue("D{$row}", $post->user ? $post->user->name : '-');
            $sheet->setCellValue("E{$row}", $post->is_published ? 'Published' : 'Draft');
            $sheet->setCellValue("F{$row}", $post->published_at ? $post->published_at->format('Y-m-d H:i') : '-');
            $sheet->setCellValue("G{$row}", $post->excerpt ?? '-');
            $sheet->setCellValue("H{$row}", $post->content);

            $row++;
            $no++;
        }

        // Auto-size columns
        foreach (range('A', 'H') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $lastRow = max($row - 1, 1);
        $sheet->getStyle("A1:H{$lastRow}")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'D1D5DB'],
                ],
            ],
        ]);

        $response = new StreamedResponse(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        });

        $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->headers->set('Content-Disposition', 'attachment; filename="'.$filename.'"');
        $response->headers->set('Cache-Control', 'max-age=0');

        return $response;
    }

    public function import(int $userId, UploadedFile $file): int
    {
        $spreadsheet = IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        $count = 0;
        $validCategories = PostCategory::values();

        // Skip header row
        for ($i = 1; $i < count($rows); $i++) {
            $row = $rows[$i];
            $title = trim((string) ($row[1] ?? ''));
            $category = trim((string) ($row[2] ?? ''));
            $excerpt = isset($row[6]) ? trim((string) $row[6]) : null;
            $content = trim((string) ($row[7] ?? ''));

            if ($title === '' || $content === '') {
                continue;
            }

            if (! in_array($category, $validCategories, true)) {
                $category = PostCategory::UMUM->value;
            }

            $this->postService->createPost($userId, [
                'title' => $title,
                'category' => $category,
                'excerpt' => $excerpt !== '-' ? $excerpt : null,
                'content' => $content,
                'is_published' => false,
            ]);

            $count++;
        }

        return $count;
    }
}
