<?php

namespace App\Features\Ai\Services;

use App\Features\Ai\Contracts\AiClientInterface;
use App\Features\Ai\DTO\GeneratedPostItem;
use App\Features\Post\Enums\PostCategory;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenAiPostGeneratorService implements AiClientInterface
{
    protected string $endpoint;

    protected string $apiKey;

    protected string $model;

    public function __construct(
        ?string $endpoint = null,
        ?string $apiKey = null,
        ?string $model = null,
    ) {
        $resolvedEndpoint = (string) ($endpoint ?? config('openai.endpoint', 'https://api.openai.com/v1'));
        $resolvedKey = (string) ($apiKey ?? config('openai.key', ''));

        // Toleransi jika nilai OPENAI_ENDPOINT dan OPENAI_KEY tertukar di .env
        if ((str_starts_with($resolvedKey, 'http://') || str_starts_with($resolvedKey, 'https://')) &&
            (! str_starts_with($resolvedEndpoint, 'http://') && ! str_starts_with($resolvedEndpoint, 'https://'))) {
            $temp = $resolvedEndpoint;
            $resolvedEndpoint = $resolvedKey;
            $resolvedKey = $temp;
        }

        // Pastikan scheme http:// atau https:// selalu ada
        if (! empty($resolvedEndpoint) && ! str_starts_with($resolvedEndpoint, 'http://') && ! str_starts_with($resolvedEndpoint, 'https://')) {
            $resolvedEndpoint = 'https://'.$resolvedEndpoint;
        }

        $this->endpoint = rtrim($resolvedEndpoint, '/');
        $this->apiKey = $resolvedKey;
        $this->model = $model ?? (string) config('openai.model', 'gpt-4o-mini');
    }

    /**
     * @return list<GeneratedPostItem>
     *
     * @throws RuntimeException
     */
    public function generatePosts(string $topic, int $count = 1, ?string $category = null): array
    {
        $topic = trim($topic);
        if ($topic === '') {
            throw new RuntimeException('Topik artikel tidak boleh kosong.');
        }

        $count = max(1, min(5, $count));
        $categoryHint = $category && in_array($category, PostCategory::values(), true)
            ? "Pilih kategori '{$category}'."
            : 'Pilih kategori yang paling sesuai dari: Teknologi, Pendidikan, Gaya Hidup, Bisnis, Opini, Umum.';

        $systemPrompt = <<<SYS
Anda adalah asisten penulis konten blog profesional. Tugas Anda adalah menghasilkan tepat {$count} draf artikel blog yang kaya, edukatif, dan menarik berdasarkan topik dari pengguna.
{$categoryHint}

Format respon WAJIB berupa JSON valid murni sesuai skema berikut:
{
  "posts": [
    {
      "title": "Judul artikel yang menarik dan relevan",
      "category": "Teknologi / Pendidikan / Gaya Hidup / Bisnis / Opini / Umum",
      "excerpt": "Ringkasan 1-2 kalimat yang memikat pembaca",
      "content": "Isi artikel lengkap dalam format Markdown dengan heading, list, dan paragraf berbobot minimal 200 kata."
    }
  ]
}

Jangan tambahkan teks apapun di luar blok JSON.
SYS;

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->apiKey}",
            'Content-Type' => 'application/json',
        ])->timeout(45)->post("{$this->endpoint}/chat/completions", [
            'model' => $this->model,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $topic],
            ],
            'temperature' => 0.7,
        ]);

        if (! $response->successful()) {
            $errorMessage = $response->json('error.message') ?? "Request failed with status code {$response->status()}";
            throw new RuntimeException("OpenAI API Error: {$errorMessage}");
        }

        $rawContent = (string) $response->json('choices.0.message.content');

        return $this->parseContent($rawContent);
    }

    /**
     * @return list<GeneratedPostItem>
     */
    public function parseContent(string $rawContent): array
    {
        $cleanContent = trim($rawContent);

        // Remove Markdown code fences if present
        if (str_starts_with($cleanContent, '```')) {
            $cleanContent = preg_replace('/^```(?:json)?\s*/i', '', $cleanContent);
            $cleanContent = preg_replace('/\s*```$/', '', $cleanContent);
            $cleanContent = trim((string) $cleanContent);
        }

        $decoded = json_decode($cleanContent, true);

        if (! is_array($decoded)) {
            throw new RuntimeException('AI mengembalikan format respon yang tidak valid.');
        }

        // Support both {"posts": [...]} and [...]
        $items = isset($decoded['posts']) && is_array($decoded['posts'])
            ? $decoded['posts']
            : (array_is_list($decoded) ? $decoded : []);

        if (empty($items)) {
            throw new RuntimeException('Tidak ada artikel yang berhasil di-generate dari AI.');
        }

        $results = [];
        $validCategories = PostCategory::values();

        foreach ($items as $item) {
            if (! is_array($item) || empty($item['title'])) {
                continue;
            }

            $title = trim((string) $item['title']);
            $cat = trim((string) ($item['category'] ?? 'Umum'));
            if (! in_array($cat, $validCategories, true)) {
                $cat = PostCategory::UMUM->value;
            }

            $excerpt = isset($item['excerpt']) && trim((string) $item['excerpt']) !== ''
                ? trim((string) $item['excerpt'])
                : null;

            $content = trim((string) ($item['content'] ?? ''));
            if ($content === '') {
                $content = $excerpt ?? $title;
            }

            $results[] = new GeneratedPostItem(
                title: $title,
                category: $cat,
                excerpt: $excerpt,
                content: $content
            );
        }

        if (empty($results)) {
            throw new RuntimeException('Format artikel yang dikembalikan AI tidak sesuai spesifikasi.');
        }

        return $results;
    }
}
