<?php

namespace Tests\Unit;

use App\Features\Post\Enums\PostCategory;
use PHPUnit\Framework\TestCase;

class PostCategoryTest extends TestCase
{
    public function test_post_category_enum_has_expected_cases_and_values(): void
    {
        $cases = PostCategory::cases();
        $this->assertCount(6, $cases);
        $this->assertSame('Teknologi', PostCategory::TEKNOLOGI->value);
        $this->assertSame('Pendidikan', PostCategory::PENDIDIKAN->value);
        $this->assertSame('Gaya Hidup', PostCategory::GAYA_HIDUP->value);
        $this->assertSame('Bisnis', PostCategory::BISNIS->value);
        $this->assertSame('Opini', PostCategory::OPINI->value);
        $this->assertSame('Umum', PostCategory::UMUM->value);
    }

    public function test_label_returns_correct_human_readable_string(): void
    {
        $this->assertSame('Teknologi & Koding', PostCategory::TEKNOLOGI->label());
        $this->assertSame('Pendidikan & Tutorial', PostCategory::PENDIDIKAN->label());
        $this->assertSame('Gaya Hidup & Produktivitas', PostCategory::GAYA_HIDUP->label());
        $this->assertSame('Bisnis & Karir', PostCategory::BISNIS->label());
        $this->assertSame('Opini & Pemikiran', PostCategory::OPINI->label());
        $this->assertSame('Umum', PostCategory::UMUM->label());
    }

    public function test_values_returns_all_category_string_values(): void
    {
        $values = PostCategory::values();
        $this->assertSame([
            'Teknologi',
            'Pendidikan',
            'Gaya Hidup',
            'Bisnis',
            'Opini',
            'Umum',
        ], $values);
    }

    public function test_options_returns_array_of_value_and_label_pairs(): void
    {
        $options = PostCategory::options();
        $this->assertCount(6, $options);
        $this->assertSame([
            ['value' => 'Teknologi', 'label' => 'Teknologi & Koding'],
            ['value' => 'Pendidikan', 'label' => 'Pendidikan & Tutorial'],
            ['value' => 'Gaya Hidup', 'label' => 'Gaya Hidup & Produktivitas'],
            ['value' => 'Bisnis', 'label' => 'Bisnis & Karir'],
            ['value' => 'Opini', 'label' => 'Opini & Pemikiran'],
            ['value' => 'Umum', 'label' => 'Umum'],
        ], $options);
    }
}
