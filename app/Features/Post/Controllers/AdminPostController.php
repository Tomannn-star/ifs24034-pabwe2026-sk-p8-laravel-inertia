<?php

namespace App\Features\Post\Controllers;

use App\Features\Post\Contracts\PostRepositoryInterface;
use App\Features\Post\Enums\PostCategory;
use App\Features\Post\Services\PostExcelService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminPostController extends Controller
{
    public function __construct(
        protected PostRepositoryInterface $postRepository,
        protected PostExcelService $excelService
    ) {}

    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $category = $request->query('category');

        $posts = $this->postRepository->getAllPosts(
            search: $search ? (string) $search : null,
            category: $category ? (string) $category : null
        );

        return Inertia::render('Admin/PostList', [
            'posts' => $posts,
            'categories' => PostCategory::options(),
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'Semua',
            ],
        ]);
    }

    public function export(): StreamedResponse
    {
        $posts = $this->postRepository->getAllPostsForExport();
        $filename = 'semua-artikel-blogverse-'.date('YmdHis').'.xlsx';

        return $this->excelService->export($posts, $filename);
    }
}
