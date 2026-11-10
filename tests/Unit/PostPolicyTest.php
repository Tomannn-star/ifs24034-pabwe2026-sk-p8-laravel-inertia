<?php

namespace Tests\Unit;

use App\Features\Post\Models\Post;
use App\Features\Post\Policies\PostPolicy;
use App\Models\User;
use PHPUnit\Framework\TestCase;

class PostPolicyTest extends TestCase
{
    public function test_view_any_returns_true(): void
    {
        $policy = new PostPolicy();
        $user = new User();
        $this->assertTrue($policy->viewAny($user));
    }

    public function test_create_returns_true(): void
    {
        $policy = new PostPolicy();
        $user = new User();
        $this->assertTrue($policy->create($user));
    }

    public function test_view_returns_true_for_admin_or_owner(): void
    {
        $policy = new PostPolicy();

        $admin = new User(['role' => 'admin']);
        $admin->id = 1;

        $member = new User(['role' => 'member']);
        $member->id = 2;

        $other = new User(['role' => 'member']);
        $other->id = 3;

        $post = new Post();
        $post->user_id = 2;

        // Admin can view any post
        $this->assertTrue($policy->view($admin, $post));

        // Owner can view own post
        $this->assertTrue($policy->view($member, $post));

        // Other member cannot view
        $this->assertFalse($policy->view($other, $post));
    }

    public function test_update_returns_true_only_for_owner(): void
    {
        $policy = new PostPolicy();

        $owner = new User();
        $owner->id = 10;

        $other = new User();
        $other->id = 11;

        $post = new Post();
        $post->user_id = 10;

        $this->assertTrue($policy->update($owner, $post));
        $this->assertFalse($policy->update($other, $post));
    }

    public function test_delete_returns_true_only_for_owner(): void
    {
        $policy = new PostPolicy();

        $owner = new User();
        $owner->id = 20;

        $other = new User();
        $other->id = 21;

        $post = new Post();
        $post->user_id = 20;

        $this->assertTrue($policy->delete($owner, $post));
        $this->assertFalse($policy->delete($other, $post));
    }
}
