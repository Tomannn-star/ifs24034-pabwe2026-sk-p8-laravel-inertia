<?php

namespace App\Features\Ai\DTO;

class GeneratedPostItem
{
    public function __construct(
        public string $title,
        public string $category,
        public ?string $excerpt,
        public string $content
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            title: (string) ($data['title'] ?? ''),
            category: (string) ($data['category'] ?? 'Umum'),
            excerpt: isset($data['excerpt']) ? (string) $data['excerpt'] : null,
            content: (string) ($data['content'] ?? '')
        );
    }

    /**
     * @return array{title: string, category: string, excerpt: ?string, content: string}
     */
    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'category' => $this->category,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
        ];
    }
}
