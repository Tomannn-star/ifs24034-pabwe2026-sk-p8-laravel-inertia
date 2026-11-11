<?php

namespace App\Features\Admin\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class AdminUserService
{
    public function getAllUsers(?string $search = null, ?string $role = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = User::query()->withCount('posts');
        $like = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        if ($search) {
            $query->where(function ($q) use ($search, $like) {
                $q->where('name', $like, "%{$search}%")
                    ->orWhere('username', $like, "%{$search}%")
                    ->orWhere('email', $like, "%{$search}%");
            });
        }

        if ($role && $role !== 'Semua') {
            $query->where('role', $role);
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function getUserById(int $id): ?User
    {
        return User::query()->withCount('posts')->find($id);
    }

    public function updateUserRole(User $user, string $role): User
    {
        $user->update(['role' => $role]);

        return $user->fresh();
    }

    public function deleteUser(User $user): bool
    {
        return (bool) $user->delete();
    }
}

