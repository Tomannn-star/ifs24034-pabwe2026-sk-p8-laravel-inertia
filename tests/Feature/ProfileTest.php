<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_profile_page_can_be_rendered(): void
    {
        $user = User::factory()->create([
            'profile_photo_path' => 'avatars/avatar.jpg',
        ]);

        $response = $this->actingAs($user)->get('/profile');

        $response->assertStatus(200);
    }

    public function test_user_can_update_profile_information_and_photo(): void
    {
        $user = User::factory()->create([
            'name' => 'Old Name',
            'username' => 'olduser',
            'email' => 'old@example.com',
            'profile_photo_path' => 'avatars/old.jpg',
        ]);
        Storage::disk('public')->put('avatars/old.jpg', 'old image data');

        $newPhoto = UploadedFile::fake()->image('new-photo.png', 300, 300);

        $response = $this->actingAs($user)->put('/profile', [
            'name' => 'New Name',
            'username' => 'newuser',
            'email' => 'new@example.com',
            'photo' => $newPhoto,
        ]);

        $response->assertRedirect();
        $user->refresh();

        $this->assertSame('New Name', $user->name);
        $this->assertSame('newuser', $user->username);
        $this->assertSame('new@example.com', $user->email);
        $this->assertNotNull($user->profile_photo_path);
        Storage::disk('public')->assertMissing('avatars/old.jpg');
        Storage::disk('public')->assertExists($user->profile_photo_path);
    }

    public function test_profile_update_validation_fails_on_duplicate_username_or_email(): void
    {
        $existing = User::factory()->create([
            'username' => 'existuser',
            'email' => 'exist@example.com',
        ]);

        $user = User::factory()->create();

        $response = $this->actingAs($user)->put('/profile', [
            'name' => 'Name',
            'username' => 'existuser',
            'email' => 'exist@example.com',
        ]);

        $response->assertSessionHasErrors(['username', 'email']);
    }

    public function test_user_can_update_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('current-password-123'),
        ]);

        $response = $this->actingAs($user)->put('/profile/password', [
            'current_password' => 'current-password-123',
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ]);

        $response->assertRedirect();
        $user->refresh();

        $this->assertTrue(Hash::check('new-secure-password', $user->password));
    }

    public function test_password_update_fails_with_incorrect_current_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('correct-password'),
        ]);

        $response = $this->actingAs($user)->put('/profile/password', [
            'current_password' => 'wrong-password',
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ]);

        $response->assertSessionHasErrors('current_password');
    }

    public function test_user_can_delete_profile_photo(): void
    {
        $user = User::factory()->create([
            'profile_photo_path' => 'avatars/delete-me.jpg',
        ]);
        Storage::disk('public')->put('avatars/delete-me.jpg', 'avatar data');

        $response = $this->actingAs($user)->delete('/profile/photo');

        $response->assertRedirect();
        $user->refresh();

        $this->assertNull($user->profile_photo_path);
        Storage::disk('public')->assertMissing('avatars/delete-me.jpg');
    }
}
