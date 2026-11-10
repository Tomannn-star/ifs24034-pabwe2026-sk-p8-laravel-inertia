<?php

namespace Tests\Unit;

use App\Features\Ai\Services\OpenAiPostGeneratorService;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Tests\TestCase;

class OpenAiPostGeneratorServiceTest extends TestCase
{
    public function test_constructor_handles_endpoint_normalization_and_swapped_values(): void
    {
        // Swapped endpoint and key
        $service = new OpenAiPostGeneratorService(
            endpoint: 'sk-test-key-123',
            apiKey: 'https://api.openai.com/v1',
            model: 'gpt-4o'
        );

        $reflection = new \ReflectionClass($service);
        $endpointProp = $reflection->getProperty('endpoint');
        $endpointProp->setAccessible(true);
        $apiKeyProp = $reflection->getProperty('apiKey');
        $apiKeyProp->setAccessible(true);

        $this->assertSame('https://api.openai.com/v1', $endpointProp->getValue($service));
        $this->assertSame('sk-test-key-123', $apiKeyProp->getValue($service));

        // Missing scheme in endpoint
        $service2 = new OpenAiPostGeneratorService(
            endpoint: 'api.groq.com/openai/v1/',
            apiKey: 'sk-groq-key'
        );
        $this->assertSame('https://api.groq.com/openai/v1', $endpointProp->getValue($service2));
    }

    public function test_generate_posts_throws_when_topic_is_empty(): void
    {
        $service = new OpenAiPostGeneratorService('https://api.openai.com/v1', 'key');

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Topik artikel tidak boleh kosong.');

        $service->generatePosts('   ');
    }

    public function test_generate_posts_successful_flow(): void
    {
        Http::fake([
            'https://api.openai.com/v1/chat/completions' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => json_encode([
                                'posts' => [
                                    [
                                        'title' => 'Masa Depan AI',
                                        'category' => 'Teknologi',
                                        'excerpt' => 'Artikel tentang AI.',
                                        'content' => '# AI Masa Depan...',
                                    ],
                                ],
                            ]),
                        ],
                    ],
                ],
            ], 200),
        ]);

        $service = new OpenAiPostGeneratorService('https://api.openai.com/v1', 'key', 'gpt-4o-mini');
        $results = $service->generatePosts('Kecerdasan Buatan', 1, 'Teknologi');

        $this->assertCount(1, $results);
        $this->assertSame('Masa Depan AI', $results[0]->title);
        $this->assertSame('Teknologi', $results[0]->category);
        $this->assertSame('Artikel tentang AI.', $results[0]->excerpt);
        $this->assertSame('# AI Masa Depan...', $results[0]->content);
    }

    public function test_generate_posts_throws_on_api_error(): void
    {
        Http::fake([
            'https://api.openai.com/v1/chat/completions' => Http::response([
                'error' => ['message' => 'Rate limit exceeded'],
            ], 429),
        ]);

        $service = new OpenAiPostGeneratorService('https://api.openai.com/v1', 'key');

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('OpenAI API Error: Rate limit exceeded');

        $service->generatePosts('Topik Apapun');
    }

    public function test_generate_posts_throws_default_message_on_unknown_error(): void
    {
        Http::fake([
            'https://api.openai.com/v1/chat/completions' => Http::response([], 500),
        ]);

        $service = new OpenAiPostGeneratorService('https://api.openai.com/v1', 'key');

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('OpenAI API Error: Request failed with status code 500');

        $service->generatePosts('Topik Apapun');
    }

    public function test_parse_content_strips_markdown_code_fences(): void
    {
        $service = new OpenAiPostGeneratorService();

        $raw = "```json\n{\"posts\": [{\"title\": \"Uji Judul\", \"category\": \"Bisnis\", \"excerpt\": \"Ringkasan\", \"content\": \"Konten\"}]}\n```";
        $results = $service->parseContent($raw);

        $this->assertCount(1, $results);
        $this->assertSame('Uji Judul', $results[0]->title);
        $this->assertSame('Bisnis', $results[0]->category);
    }

    public function test_parse_content_throws_on_invalid_json(): void
    {
        $service = new OpenAiPostGeneratorService();

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('AI mengembalikan format respon yang tidak valid.');

        $service->parseContent('bukan json');
    }

    public function test_parse_content_throws_on_empty_posts_list(): void
    {
        $service = new OpenAiPostGeneratorService();

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Tidak ada artikel yang berhasil di-generate dari AI.');

        $service->parseContent('{"posts": []}');
    }

    public function test_parse_content_supports_direct_json_list(): void
    {
        $service = new OpenAiPostGeneratorService();

        $raw = json_encode([
            [
                'title' => 'Daftar Langsung',
                'category' => 'InvalidCategory',
                'excerpt' => '',
                'content' => '',
            ],
        ]);

        $results = $service->parseContent($raw);

        $this->assertCount(1, $results);
        $this->assertSame('Daftar Langsung', $results[0]->title);
        $this->assertSame('Umum', $results[0]->category); // fallback to Umum
        $this->assertNull($results[0]->excerpt);
        $this->assertSame('Daftar Langsung', $results[0]->content); // fallback to title
    }

    public function test_parse_content_throws_if_all_items_invalid(): void
    {
        $service = new OpenAiPostGeneratorService();

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Format artikel yang dikembalikan AI tidak sesuai spesifikasi.');

        $service->parseContent(json_encode([
            'posts' => [
                ['title' => '', 'content' => 'tanpa judul'],
                'bukan array',
            ],
        ]));
    }
}
