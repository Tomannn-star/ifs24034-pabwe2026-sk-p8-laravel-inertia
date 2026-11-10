<?php

namespace App\Features\Post\Enums;

enum PostCategory: string
{
    case TEKNOLOGI = 'Teknologi';
    case PENDIDIKAN = 'Pendidikan';
    case GAYA_HIDUP = 'Gaya Hidup';
    case BISNIS = 'Bisnis';
    case OPINI = 'Opini';
    case UMUM = 'Umum';

    public function label(): string
    {
        return match ($this) {
            self::TEKNOLOGI => 'Teknologi & Koding',
            self::PENDIDIKAN => 'Pendidikan & Tutorial',
            self::GAYA_HIDUP => 'Gaya Hidup & Produktivitas',
            self::BISNIS => 'Bisnis & Karir',
            self::OPINI => 'Opini & Pemikiran',
            self::UMUM => 'Umum',
        };
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(fn (self $category) => [
            'value' => $category->value,
            'label' => $category->label(),
        ], self::cases());
    }
}
