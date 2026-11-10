<?php

namespace App\Features\Post\Controllers;

use App\Features\Ai\Contracts\AiClientInterface;
use App\Features\Post\Contracts\PostRepositoryInterface;
use App\Features\Post\Enums\PostCategory;
use App\Features\Post\Models\Post;
use App\Features\Post\Services\PostExcelService;
use App\Features\Post\Services\PostService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PostController extends Controller
{
    public function __construct(
        protected PostRepositoryInterface $postRepository,
        protected PostService $postService,
        protected PostExcelService $excelService,
        protected AiClientInterface $aiClient
    ) {}

    public function index(Request $request): Response
    {
        $userId = $request->user()->id;
        $search = $request->query('search');
        $category = $request->query('category');
        $status = $request->query('status');

        $posts = $this->postRepository->getUserPosts(
            userId: $userId,
            search: $search ? (string) $search : null,
            category: $category ? (string) $category : null,
            status: $status ? (string) $status : null
        );

        $stats = $this->postRepository->getUserStats($userId);

        return Inertia::render('Post/Index', [
            'posts' => $posts,
            'stats' => $stats,
            'categories' => PostCategory::options(),
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'Semua',
                'status' => $status ?? 'all',
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(PostCategory::values())],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'is_published' => ['nullable', 'boolean'],
            'cover_image' => ['nullable', 'image', 'max:3072'],
        ], [
            'title.required' => 'Judul artikel wajib diisi.',
            'category.required' => 'Kategori artikel wajib dipilih.',
            'content.required' => 'Konten artikel wajib diisi.',
            'cover_image.image' => 'Berkas sampul harus berupa gambar.',
            'cover_image.max' => 'Ukuran gambar sampul maksimal 3 MB.',
        ]);

        $this->postService->createPost(
            userId: $request->user()->id,
            data: $validated,
            coverImage: $request->file('cover_image')
        );

        return redirect()->route('dashboard.posts.index')->with('success', 'Artikel berhasil disimpan.');
    }

    public function show(Post $post): Response
    {
        Gate::authorize('view', $post);

        $post->load('user');

        return Inertia::render('Post/Show', [
            'post' => [
                'id' => $post->id,
                'user_id' => $post->user_id,
                'title' => $post->title,
                'slug' => $post->slug,
                'category' => $post->category instanceof PostCategory ? $post->category->value : $post->category,
                'category_label' => $post->category instanceof PostCategory ? $post->category->label() : $post->category,
                'excerpt' => $post->excerpt,
                'content' => $post->content,
                'cover_url' => $post->cover_url,
                'is_published' => $post->is_published,
                'published_at' => $post->published_at ? $post->published_at->translatedFormat('d F Y, H:i') : null,
                'created_at' => $post->created_at->translatedFormat('d F Y, H:i'),
                'updated_at' => $post->updated_at->translatedFormat('d F Y, H:i'),
                'author' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'username' => $post->user->username,
                ],
            ],
            'categories' => PostCategory::options(),
        ]);
    }

    public function update(Request $request, Post $post): RedirectResponse
    {
        Gate::authorize('update', $post);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(PostCategory::values())],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'is_published' => ['nullable', 'boolean'],
            'cover_image' => ['nullable', 'image', 'max:3072'],
        ], [
            'title.required' => 'Judul artikel wajib diisi.',
            'category.required' => 'Kategori artikel wajib dipilih.',
            'content.required' => 'Konten artikel wajib diisi.',
            'cover_image.image' => 'Berkas sampul harus berupa gambar.',
            'cover_image.max' => 'Ukuran gambar sampul maksimal 3 MB.',
        ]);

        $this->postService->updatePost(
            post: $post,
            data: $validated,
            coverImage: $request->file('cover_image')
        );

        return redirect()->route('dashboard.posts.index')->with('success', 'Artikel berhasil diperbarui.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        Gate::authorize('delete', $post);

        $this->postService->deletePost($post);

        return redirect()->route('dashboard.posts.index')->with('success', 'Artikel berhasil dihapus.');
    }

    public function togglePublish(Post $post): RedirectResponse
    {
        Gate::authorize('update', $post);

        $updated = $this->postService->togglePublish($post);
        $statusText = $updated->is_published ? 'dipublikasikan' : 'dijadikan draf';

        return back()->with('success', "Artikel berhasil {$statusText}.");
    }

    public function uploadCover(Request $request, Post $post): RedirectResponse
    {
        Gate::authorize('update', $post);

        $request->validate([
            'cover_image' => ['required', 'image', 'max:3072'],
        ], [
            'cover_image.required' => 'Berkas gambar sampul wajib diunggah.',
            'cover_image.image' => 'Berkas sampul harus berupa gambar.',
            'cover_image.max' => 'Ukuran gambar sampul maksimal 3 MB.',
        ]);

        $this->postService->uploadCover($post, $request->file('cover_image'));

        return back()->with('success', 'Foto sampul berhasil diunggah.');
    }

    public function deleteCover(Post $post): RedirectResponse
    {
        Gate::authorize('update', $post);

        $this->postService->deleteCover($post);

        return back()->with('success', 'Foto sampul berhasil dihapus.');
    }

    public function export(Request $request): StreamedResponse
    {
        $posts = $this->postRepository->getAllUserPostsForExport($request->user()->id);
        $filename = 'artikel-saya-'.date('YmdHis').'.xlsx';

        return $this->excelService->export($posts, $filename);
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:5120'],
        ], [
            'file.required' => 'Berkas Excel wajib dipilih.',
            'file.mimes' => 'Format berkas harus berupa Excel (.xlsx, .xls) atau CSV.',
            'file.max' => 'Ukuran berkas maksimal 5 MB.',
        ]);

        $count = $this->excelService->import(
            userId: $request->user()->id,
            file: $request->file('file')
        );

        return back()->with('success', "Berhasil mengimpor {$count} artikel dari berkas Excel.");
    }

    public function aiGenerate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'topic' => ['required', 'string', 'max:255'],
            'count' => ['required', 'integer', 'min:1', 'max:5'],
            'category' => ['nullable', 'string'],
        ], [
            'topic.required' => 'Topik artikel wajib diisi.',
            'count.required' => 'Jumlah artikel wajib ditentukan.',
            'count.min' => 'Jumlah minimal adalah 1.',
            'count.max' => 'Jumlah maksimal adalah 5.',
        ]);

        try {
            $generated = $this->aiClient->generatePosts(
                topic: $validated['topic'],
                count: (int) $validated['count'],
                category: $validated['category'] ?? null
            );

            return response()->json([
                'success' => true,
                'data' => array_map(fn ($item) => $item->toArray(), $generated),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function aiSave(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'posts' => ['required', 'array', 'min:1'],
            'posts.*.title' => ['required', 'string', 'max:255'],
            'posts.*.category' => ['required', Rule::in(PostCategory::values())],
            'posts.*.excerpt' => ['nullable', 'string'],
            'posts.*.content' => ['required', 'string'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $userId = $request->user()->id;
        $isPublished = (bool) ($validated['is_published'] ?? false);
        $savedCount = 0;

        foreach ($validated['posts'] as $item) {
            $this->postService->createPost($userId, [
                'title' => $item['title'],
                'category' => $item['category'],
                'excerpt' => $item['excerpt'] ?? null,
                'content' => $item['content'],
                'is_published' => $isPublished,
            ]);
            $savedCount++;
        }

        return redirect()->route('dashboard.posts.index')->with('success', "Berhasil menyimpan {$savedCount} artikel hasil generasi AI.");
    }
}
