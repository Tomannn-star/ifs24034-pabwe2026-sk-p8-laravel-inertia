<?php

namespace Tests\Unit;

use App\Features\Ai\DTO\GeneratedPostItem;
use PHPUnit\Framework\TestCase;

class GeneratedPostItemTest extends TestCase
{
    public function test_can_instantiate_and_convert_to_array(): void
    {
        $dto = new GeneratedPostItem(
            title: 'Judul Uji',
            category: 'Teknologi',
            excerpt: 'Ringkasan singkat uji',
            content: 'Isi konten uji yang panjang'
        );

        $this->assertSame('Judul Uji', $dto->title);
        $this->assertSame('Teknologi', $dto->category);
        $this->assertSame('Ringkasan singkat uji', $dto->excerpt);
        $this->assertSame('Isi konten uji yang panjang', $dto->content);

        $array = $dto->toArray();
        $this->assertSame([
            'title' => 'Judul Uji',
            'category' => 'Teknologi',
            'excerpt' => 'Ringkasan singkat uji',
            'content' => 'Isi konten uji yang panjang',
        ], $array);
    }

    public function test_can_create_from_array_with_defaults(): void
    {
        $dto = GeneratedPostItem::fromArray([]);

        $this->assertSame('', $dto->title);
        $this->assertSame('Umum', $dto->category);
        $this->assertNull($dto->excerpt);
        $this->assertSame('', $dto->content);

        $dto2 = GeneratedPostItem::fromArray([
            'title' => 'AI di Masa Depan',
            'category' => 'Bisnis',
            'excerpt' => 'Ringkasan bisnis',
            'content' => 'Konten lengkap bisnis',
        ]);

        $this->assertSame('AI di Masa Depan', $dto2->title);
        $this->assertSame('Bisnis', $dto2->category);
        $this->assertSame('Ringkasan bisnis', $dto2->excerpt);
        $this->assertSame('Konten lengkap bisnis', $dto2->content);
    }
}
