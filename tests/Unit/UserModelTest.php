<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_model_attributes_casts_relations_and_role_helpers(): void
    {
        $user = new User([
            'name' => 'Budi Santoso',
            'username' => 'budisantoso',
            'email' => 'budi@example.com',
            'password' => 'password123',
            'role' => 'member',
        ]);

        $casts = $user->getCasts();
        $this->assertArrayHasKey('email_verified_at', $casts);
        $this->assertArrayHasKey('password', $casts);

        // Role checks
        $this->assertTrue($user->isMember());
        $this->assertFalse($user->isAdmin());

        $user->role = 'admin';
        $this->assertTrue($user->isAdmin());
        $this->assertFalse($user->isMember());

        $user->role = 'guest';
        $this->assertFalse($user->isAdmin());
        $this->assertFalse($user->isMember());

        // Relation
        $this->assertInstanceOf(HasMany::class, $user->posts());
    }
}
