<?php

namespace Tests\Feature;

use App\Features\Post\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get('/admin/users')->assertRedirect('/login');
        $this->get('/admin/posts')->assertRedirect('/login');
    }

    public function test_member_cannot_access_admin_routes(): void
    {
        $member = User::factory()->create(['role' => 'member']);

        $this->actingAs($member)->get('/admin/users')->assertStatus(403);
        $this->actingAs($member)->get('/admin/posts')->assertStatus(403);
    }

    public function test_admin_can_view_users_list_and_filter(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user1 = User::factory()->create(['name' => 'Alice Member', 'role' => 'member']);
        $user2 = User::factory()->create(['name' => 'Bob Admin', 'role' => 'admin']);

        // Base listing
        $response = $this->actingAs($admin)->get('/admin/users');
        $response->assertStatus(200);

        // Search filter
        $responseSearch = $this->actingAs($admin)->get('/admin/users?search=Alice');
        $responseSearch->assertStatus(200);

        // Role filter
        $responseRole = $this->actingAs($admin)->get('/admin/users?role=member');
        $responseRole->assertStatus(200);
    }

    public function test_admin_can_view_specific_user_posts(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $author = User::factory()->create(['role' => 'member']);

        Post::factory()->create([
            'user_id' => $author->id,
            'title' => 'Artikel Karya Author',
            'category' => 'Teknologi',
            'is_published' => true,
        ]);
        Post::factory()->create([
            'user_id' => $author->id,
            'title' => 'Draf Karya Author',
            'category' => 'Bisnis',
            'is_published' => false,
        ]);

        $response = $this->actingAs($admin)->get("/admin/users/{$author->id}/posts");
        $response->assertStatus(200);

        // Filter status
        $responseDrafts = $this->actingAs($admin)->get("/admin/users/{$author->id}/posts?status=draft");
        $responseDrafts->assertStatus(200);

        $responsePublished = $this->actingAs($admin)->get("/admin/users/{$author->id}/posts?status=published");
        $responsePublished->assertStatus(200);
    }

    public function test_admin_can_export_specific_user_posts_to_excel(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $author = User::factory()->create(['role' => 'member']);

        Post::factory()->count(2)->create(['user_id' => $author->id]);

        $response = $this->actingAs($admin)->get("/admin/users/{$author->id}/posts/export");

        $response->assertStatus(200);
        $this->assertStringContainsString('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', $response->headers->get('Content-Type') ?? '');
    }

    public function test_admin_can_view_all_posts_list_and_filter(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $author = User::factory()->create(['role' => 'member']);

        Post::factory()->create([
            'user_id' => $author->id,
            'title' => 'Artikel Semua',
            'category' => 'Pendidikan',
        ]);

        $response = $this->actingAs($admin)->get('/admin/posts');
        $response->assertStatus(200);

        $responseFilter = $this->actingAs($admin)->get('/admin/posts?search=Semua&category=Pendidikan');
        $responseFilter->assertStatus(200);
    }

    public function test_admin_can_export_all_posts_to_excel(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Post::factory()->count(3)->create();

        $response = $this->actingAs($admin)->get('/admin/posts/export');

        $response->assertStatus(200);
        $this->assertStringContainsString('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', $response->headers->get('Content-Type') ?? '');
    }

    public function test_admin_user_service_methods(): void
    {
        $service = app(\App\Features\Admin\Services\AdminUserService::class);
        $user = User::factory()->create(['role' => 'member']);

        $found = $service->getUserById($user->id);
        $this->assertNotNull($found);
        $this->assertSame($user->id, $found->id);

        $updated = $service->updateUserRole($user, 'admin');
        $this->assertSame('admin', $updated->role);
        $this->assertTrue($updated->isAdmin());
        $this->assertFalse($updated->isMember());

        $deleted = $service->deleteUser($user);
        $this->assertTrue($deleted);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
