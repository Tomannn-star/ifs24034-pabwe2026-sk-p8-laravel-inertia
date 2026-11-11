<?php

use App\Features\Admin\Controllers\AdminUserController;
use App\Features\Auth\Controllers\AuthController;
use App\Features\Post\Controllers\AdminPostController;
use App\Features\Post\Controllers\PostController;
use App\Features\Post\Controllers\PublicPostController;
use App\Features\Profile\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (Guest)
|--------------------------------------------------------------------------
*/
Route::get('/', [PublicPostController::class, 'home'])->name('public.home');
Route::get('/articles', [PublicPostController::class, 'index'])->name('public.articles.index');
Route::get('/articles/{slug}', [PublicPostController::class, 'show'])->name('public.articles.show');

/*
|--------------------------------------------------------------------------
| Authentication Routes (Guest)
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'createLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'storeLogin']);
    Route::get('/register', [AuthController::class, 'createRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'storeRegister']);
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');
    Route::get('/dashboard', [PostController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
    Route::delete('/profile/photo', [ProfileController::class, 'destroyPhoto'])->name('profile.photo.destroy');

    // Member Dashboard (Posts)
    Route::prefix('dashboard/posts')->name('dashboard.posts.')->group(function () {
        Route::get('/export', [PostController::class, 'export'])->name('export');
        Route::post('/import', [PostController::class, 'import'])->name('import');
        Route::post('/ai-generate', [PostController::class, 'aiGenerate'])->name('ai.generate');
        Route::post('/ai-save', [PostController::class, 'aiSave'])->name('ai.save');

        Route::get('/', [PostController::class, 'index'])->name('index');
        Route::post('/', [PostController::class, 'store'])->name('store');
        Route::get('/{post}', [PostController::class, 'show'])->name('show');
        Route::put('/{post}', [PostController::class, 'update'])->name('update');
        Route::delete('/{post}', [PostController::class, 'destroy'])->name('destroy');
        Route::patch('/{post}/publish', [PostController::class, 'togglePublish'])->name('publish');
        Route::post('/{post}/cover', [PostController::class, 'uploadCover'])->name('cover.upload');
        Route::delete('/{post}/cover', [PostController::class, 'deleteCover'])->name('cover.delete');
    });

    // Admin Routes
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::get('/users/{user}/posts', [AdminUserController::class, 'userPosts'])->name('users.posts');
        Route::get('/users/{user}/posts/export', [AdminUserController::class, 'exportUserPosts'])->name('users.posts.export');

        Route::get('/posts', [AdminPostController::class, 'index'])->name('posts.index');
        Route::get('/posts/export', [AdminPostController::class, 'export'])->name('posts.export');
    });
});
