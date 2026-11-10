<?php

namespace App\Features\Post\Controllers;

use App\Features\Post\Contracts\PostRepositoryInterface;
use App\Features\Post\Enums\PostCategory;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicPostController extends Controller
{
    public function __construct(
        protected PostRepositoryInterface $postRepository
    ) {}

    public function home(Request $request): Response
    {
        $search = $request->query('search');
        $category = $request->query('category');

        $posts = $this->postRepository->getPublishedPosts(
            search: $search ? (string) $search : null,
            category: $category ? (string) $category : null,
            perPage: 6
        );

        return Inertia::render('Public/PostIndex', [
            'posts' => $posts,
            'categories' => PostCategory::options(),
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'Semua',
            ],
            'isHome' => true,
        ]);
    }

    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $category = $request->query('category');

        $posts = $this->postRepository->getPublishedPosts(
            search: $search ? (string) $search : null,
            category: $category ? (string) $category : null,
            perPage: 9
        );

        return Inertia::render('Public/PostIndex', [
            'posts' => $posts,
            'categories' => PostCategory::options(),
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'Semua',
            ],
            'isHome' => false,
        ]);
    }

    public function show(string $slug): Response
    {
        $post = $this->postRepository->findPublishedBySlug($slug);

        if (! $post) {
            abort(404, 'Artikel tidak ditemukan.');
        }

        return Inertia::render('Public/PostShow', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'category' => $post->category instanceof PostCategory ? $post->category->value : $post->category,
                'category_label' => $post->category instanceof PostCategory ? $post->category->label() : $post->category,
                'excerpt' => $post->excerpt,
                'content' => $post->content,
                'cover_url' => $post->cover_url,
                'published_at' => $post->published_at ? $post->published_at->translatedFormat('d F Y') : null,
                'author' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'username' => $post->user->username,
                    'profile_photo_url' => $post->user->profile_photo_path
                        ? asset('storage/'.$post->user->profile_photo_path)
                        : null,
                ],
            ],
        ]);
    }
}
