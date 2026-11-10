<?php

namespace Database\Seeders;

use App\Features\Post\Enums\PostCategory;
use App\Features\Post\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrator BlogVerse',
                'username' => 'admin',
                'password' => Hash::make('admin'),
                'role' => 'admin',
            ]
        );

        $member = User::firstOrCreate(
            ['email' => 'member@example.com'],
            [
                'name' => 'John Doe',
                'username' => 'member',
                'password' => Hash::make('member'),
                'role' => 'member',
            ]
        );

        $samplePosts = [
            [
                'user_id' => $member->id,
                'title' => 'Panduan Memulai Modern Web Development dengan Laravel 13 dan Inertia.js',
                'category' => PostCategory::TEKNOLOGI->value,
                'excerpt' => 'Pelajari bagaimana mengombinasikan kekuatan Laravel 13 di backend dan React di frontend secara mulus tanpa membuat API terpisah.',
                'content' => "# Membangun Aplikasi Modern dengan Laravel 13 & Inertia.js\n\nInertia.js adalah monolith modern yang memungkinkan kita membuat Single Page Application (SPA) berbasis React atau Vue tanpa kerumitan membangun RESTful API secara terpisah.\n\n## Keunggulan Inertia.js:\n- **Routing Sisi Server**: Menggunakan routing bawaan Laravel yang kuat.\n- **State Management Sederhana**: Data dilewatkan langsung sebagai props React.\n- **Pengalaman SPA**: Navigasi halaman cepat tanpa reload penuh.",
                'is_published' => true,
                'published_at' => now()->subDays(2),
            ],
            [
                'user_id' => $member->id,
                'title' => 'Tips Manajemen Waktu dan Produktivitas untuk Mahasiswa Teknik Informatika',
                'category' => PostCategory::GAYA_HIDUP->value,
                'excerpt' => 'Kiat praktis menyusun jadwal belajar pemrograman, menyelesaikan tugas proyek, dan menjaga kesehatan fisik serta mental.',
                'content' => "# Menjaga Produktivitas di Tengah Kesibukan Koding\n\nMenjadi mahasiswa teknik informatika seringkali dihadapkan pada deadline tugas praktikum yang beruntun.\n\n### 3 Strategi Kunci:\n1. **Teknik Pomodoro**: Fokus 25 menit koding dan 5 menit istirahat.\n2. **Time Boxing**: Alokasikan slot waktu khusus untuk riset dan debugging.\n3. **Cukup Tidur**: Otak yang lelah menulis lebih banyak bug daripada kode yang bersih.",
                'is_published' => true,
                'published_at' => now()->subDay(),
            ],
            [
                'user_id' => $member->id,
                'title' => 'Mengenal Prinsip Clean Architecture dalam Pengembangan Web Berbasis Fitur',
                'category' => PostCategory::PENDIDIKAN->value,
                'excerpt' => 'Memahami pembagian tanggung jawab kode berdasarkan domain fitur (Feature-First) agar aplikasi mudah dirawat dan diuji.',
                'content' => "# Mengapa Feature-First Architecture?\n\nDalam Feature-First Architecture, kode dikelompokkan berdasarkan fungsionalitas bisnis (misalnya Auth, Post, Admin) bukan semata-mata jenis berkasnya (seperti Controller atau Model).\n\nKeuntungan utama:\n- Kode yang saling terkait berada di direktori yang sama.\n- Mudah diskalakan saat tim bertambah besar.\n- Pengujian unit dan fitur lebih terfokus.",
                'is_published' => true,
                'published_at' => now()->subHours(5),
            ],
            [
                'user_id' => $member->id,
                'title' => 'Draf Rencana Riset: Potensi AI dalam Mengotomatisasi Pembuatan Konten Edukasi',
                'category' => PostCategory::OPINI->value,
                'excerpt' => 'Catatan draf pemikiran awal mengenai peluang dan tantangan etis pemanfaatan Large Language Models.',
                'content' => "# Catatan Riset AI\n\nArtikel ini masih dalam tahap draf awal untuk meneliti efektivitas asisten AI dalam membantu pembuatan draf konten edukasi.",
                'is_published' => false,
                'published_at' => null,
            ],
            [
                'user_id' => $admin->id,
                'title' => 'Selamat Datang di BlogVerse Pro: Ruang Kreasi dan Kolaborasi Tulisan Digital',
                'category' => PostCategory::UMUM->value,
                'excerpt' => 'Pengumuman resmi peluncuran platform BlogVerse Pro untuk komunitas penulis dan pembaca di seluruh dunia.',
                'content' => "# Selamat Datang di BlogVerse Pro!\n\nKami sangat senang menyambut Anda di platform publikasi artikel multi-tier yang dirancang untuk memberikan pengalaman membaca dan menulis terbaik.\n\nBergabunglah menjadi penulis hari ini dan bagikan wawasan berharga Anda!",
                'is_published' => true,
                'published_at' => now()->subDays(3),
            ],
        ];

        foreach ($samplePosts as $postData) {
            $slug = Str::slug($postData['title']);
            Post::firstOrCreate(
                ['slug' => $slug],
                [
                    ...$postData,
                    'slug' => $slug,
                ]
            );
        }
    }
}
