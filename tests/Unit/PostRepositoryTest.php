<?php

namespace Tests\Unit;

use App\Features\Post\Contracts\PostRepositoryInterface;
use App\Features\Post\Enums\PostCategory;
use App\Features\Post\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostRepositoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_post_repository_crud_and_query_branches(): void
    {
        /** @var PostRepositoryInterface $repo */
        $repo = app(PostRepositoryInterface::class);

        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $post1 = $repo->create([
            'user_id' => $user1->id,
            'title' => 'Teknologi Modern Laravel',
            'slug' => 'teknologi-modern-laravel',
            'category' => PostCategory::TEKNOLOGI->value,
            'excerpt' => 'Ringkasan artikel laravel',
            'content' => 'Konten lengkap mengenai framework Laravel.',
            'is_published' => true,
            'published_at' => now(),
        ]);

        $post2 = $repo->create([
            'user_id' => $user1->id,
            'title' => 'Bisnis Digital Startup',
            'slug' => 'bisnis-digital-startup',
            'category' => PostCategory::BISNIS->value,
            'excerpt' => 'Ringkasan startup',
            'content' => 'Konten seputar bisnis digital modern.',
            'is_published' => false,
            'published_at' => null,
        ]);

        $post3 = $repo->create([
            'user_id' => $user2->id,
            'title' => 'Opini Masa Depan',
            'slug' => 'opini-masa-depan',
            'category' => PostCategory::OPINI->value,
            'excerpt' => 'Ringkasan opini',
            'content' => 'Konten tulisan opini.',
            'is_published' => true,
            'published_at' => now(),
        ]);

        // findById & findPublishedBySlug
        $this->assertNotNull($repo->findById($post1->id));
        $this->assertNull($repo->findById(99999));
        $this->assertNotNull($repo->findPublishedBySlug('teknologi-modern-laravel'));
        $this->assertNull($repo->findPublishedBySlug('bisnis-digital-startup')); // draft
        $this->assertNull($repo->findPublishedBySlug('non-existent'));

        // getPublishedPosts branches
        $publishedAll = $repo->getPublishedPosts(category: 'Semua');
        $this->assertCount(2, $publishedAll);

        $publishedSearch = $repo->getPublishedPosts(search: 'Laravel');
        $this->assertCount(1, $publishedSearch);

        $publishedCategory = $repo->getPublishedPosts(category: PostCategory::OPINI->value);
        $this->assertCount(1, $publishedCategory);

        // getUserPosts branches
        $user1PostsAll = $repo->getUserPosts($user1->id, category: 'Semua');
        $this->assertCount(2, $user1PostsAll);

        $user1PostsSearch = $repo->getUserPosts($user1->id, search: 'Startup');
        $this->assertCount(1, $user1PostsSearch);

        $user1PostsPublished = $repo->getUserPosts($user1->id, status: 'published');
        $this->assertCount(1, $user1PostsPublished);

        $user1PostsDraft = $repo->getUserPosts($user1->id, status: 'draft');
        $this->assertCount(1, $user1PostsDraft);

        $user1PostsCategory = $repo->getUserPosts($user1->id, category: PostCategory::BISNIS->value);
        $this->assertCount(1, $user1PostsCategory);

        // getAllPosts branches (including with userId)
        $allPosts = $repo->getAllPosts();
        $this->assertCount(3, $allPosts);

        $allPostsForUser2 = $repo->getAllPosts(userId: $user2->id);
        $this->assertCount(1, $allPostsForUser2);

        $allPostsSearch = $repo->getAllPosts(search: 'Opini');
        $this->assertCount(1, $allPostsSearch);

        $allPostsCategory = $repo->getAllPosts(category: PostCategory::BISNIS->value);
        $this->assertCount(1, $allPostsCategory);

        // Export collections
        $user1Exports = $repo->getAllUserPostsForExport($user1->id);
        $this->assertCount(2, $user1Exports);

        $allExportsWithoutUser = $repo->getAllPostsForExport();
        $this->assertCount(3, $allExportsWithoutUser);

        $allExportsWithUser = $repo->getAllPostsForExport($user2->id);
        $this->assertCount(1, $allExportsWithUser);

        // getUserStats
        $stats = $repo->getUserStats($user1->id);
        $this->assertSame(2, $stats['total']);
        $this->assertSame(1, $stats['published']);
        $this->assertSame(1, $stats['draft']);

        // update & delete
        $updated = $repo->update($post1, ['title' => 'Judul Baru Update']);
        $this->assertTrue($updated);

        $deleted = $repo->delete($post1);
        $this->assertTrue($deleted);
        $this->assertNull($repo->findById($post1->id));
    }
}
