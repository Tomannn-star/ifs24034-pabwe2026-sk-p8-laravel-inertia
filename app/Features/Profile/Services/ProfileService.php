<?php

namespace App\Features\Profile\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProfileService
{
    /**
     * @param  array{name?: string, username?: string, email?: string}  $data
     */
    public function updateProfile(User $user, array $data, ?UploadedFile $photo = null): User
    {
        $updateData = [];

        if (isset($data['name'])) {
            $updateData['name'] = trim($data['name']);
        }

        if (isset($data['username'])) {
            $updateData['username'] = trim($data['username']);
        }

        if (isset($data['email'])) {
            $updateData['email'] = strtolower(trim($data['email']));
        }

        if ($photo) {
            if ($user->profile_photo_path && Storage::disk('public')->exists($user->profile_photo_path)) {
                Storage::disk('public')->delete($user->profile_photo_path);
            }
            $updateData['profile_photo_path'] = $photo->store('profile-photos', 'public');
        }

        $user->update($updateData);

        return $user->fresh();
    }

    public function updatePassword(User $user, string $currentPassword, string $newPassword): bool
    {
        if (! Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Password saat ini yang Anda masukkan tidak sesuai.'],
            ]);
        }

        return $user->update([
            'password' => Hash::make($newPassword),
        ]);
    }

    public function deletePhoto(User $user): User
    {
        if ($user->profile_photo_path && Storage::disk('public')->exists($user->profile_photo_path)) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }

        $user->update(['profile_photo_path' => null]);

        return $user->fresh();
    }
}
