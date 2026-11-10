<?php

namespace App\Features\Admin\Controllers;

use App\Features\Admin\Services\AdminUserService;
use App\Features\Post\Contracts\PostRepositoryInterface;
use App\Features\Post\Services\PostExcelService;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminUserController extends Controller
{
    public function __construct(
        protected AdminUserService $adminUserService,
        protected PostRepositoryInterface $postRepository,
        protected PostExcelService $excelService
    ) {}

    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $role = $request->query('role');

        $users = $this->adminUserService->getAllUsers(
            search: $search ? (string) $search : null,
            role: $role ? (string) $role : null
        );

        return Inertia::render('Admin/UserList', [
            'users' => $users,
            'filters' => [
                'search' => $search ?? '',
                'role' => $role ?? 'Semua',
            ],
        ]);
    }

    public function userPosts(Request $request, User $user): Response
    {
        $search = $request->query('search');
        $category = $request->query('category');
        $status = $request->query('status');

        $posts = $this->postRepository->getUserPosts(
            userId: $user->id,
            search: $search ? (string) $search : null,
            category: $category ? (string) $category : null,
            status: $status ? (string) $status : null
        );

        $stats = $this->postRepository->getUserStats($user->id);

        return Inertia::render('Admin/UserPostList', [
            'author' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'profile_photo_url' => $user->profile_photo_path
                    ? asset('storage/'.$user->profile_photo_path)
                    : null,
            ],
            'posts' => $posts,
            'stats' => $stats,
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'Semua',
                'status' => $status ?? 'all',
            ],
        ]);
    }

    public function exportUserPosts(User $user): StreamedResponse
    {
        $posts = $this->postRepository->getAllUserPostsForExport($user->id);
        $filename = 'artikel-'.strtolower($user->username).'-'.date('YmdHis').'.xlsx';

        return $this->excelService->export($posts, $filename);
    }
}
