# Panduan Deploy BlogVerse Pro ke Vercel

Panduan ini berisi langkah-langkah lengkap untuk mempublikasikan (deploy) aplikasi **BlogVerse Pro** ke **Vercel** menggunakan database cloud **Neon.tech**.

---

## 1. Status Database Cloud (Neon.tech)
Database cloud Anda di Neon sudah **100% siap, ter-migrasi, dan ter-seeding**:
- **Host**: `ep-muddy-sunset-b3i3scmu-pooler.c-4.ap-southeast-1.aws.neon.tech`
- **Database**: `neondb`
- **Username**: `neondb_owner`
- **Password**: `npg_U2fJ4etobIzp`
- **Port**: `5432`
- **SSL Mode**: `require`
- **Data Tersedia**: 10 tabel (`posts`, `users`, `sessions`, dll.) dengan akun admin, member, dan 5 artikel blog.

---

## 2. Push Kode ke GitHub
Pastikan seluruh perubahan terbaru di repositori ini sudah ter-push ke GitHub:
```powershell
git push origin main
```

---

## 3. Langkah Deploy di Vercel Dashboard
1. Buka [https://vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **Add New...** > **Project**.
3. Pilih repositori GitHub proyek ini (`ifs24034-pabwe2026-sk-p8-laravel-inertia`), lalu klik **Import**.
4. Di bagian **Configure Project**:
   - **Framework Preset**: Biarkan **Other** (karena menggunakan konfigurasi `vercel.json`).
   - **Root Directory**: `./` (default).
   - **Build Command**: `npm run build`
   - **Output Directory**: biarkan kosong / default.

5. Buka bagian **Environment Variables**, lalu salin dan tempel variabel berikut:

| Key | Value |
| :--- | :--- |
| `APP_NAME` | `BlogVerse Pro` |
| `APP_ENV` | `production` |
| `APP_KEY` | `base64:Af/6yy68DUgYZDl2JrHYHqDyiWWdsa/gAZfPreXIi78=` |
| `APP_DEBUG` | `false` |
| `APP_URL` | `https://nama-project-anda.vercel.app` *(sesuaikan dengan domain vercel yang dibuat)* |
| `LOG_CHANNEL` | `stderr` |
| `DB_CONNECTION` | `pgsql` |
| `DB_HOST` | `ep-muddy-sunset-b3i3scmu-pooler.c-4.ap-southeast-1.aws.neon.tech` |
| `DB_PORT` | `5432` |
| `DB_DATABASE` | `neondb` |
| `DB_USERNAME` | `neondb_owner` |
| `DB_PASSWORD` | `npg_U2fJ4etobIzp` |
| `DB_SSLMODE` | `require` |
| `SESSION_DRIVER` | `database` |
| `CACHE_STORE` | `database` |
| `QUEUE_CONNECTION` | `database` |
| `VIEW_COMPILED_PATH` | `/tmp/storage/framework/views` |

> *Tips*: Anda bisa menyalin seluruh blok di bawah ini sekaligus ke kolom input Vercel:
```text
APP_NAME=BlogVerse Pro
APP_ENV=production
APP_KEY=base64:Af/6yy68DUgYZDl2JrHYHqDyiWWdsa/gAZfPreXIi78=
APP_DEBUG=false
LOG_CHANNEL=stderr
DB_CONNECTION=pgsql
DB_HOST=ep-muddy-sunset-b3i3scmu-pooler.c-4.ap-southeast-1.aws.neon.tech
DB_PORT=5432
DB_DATABASE=neondb
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_U2fJ4etobIzp
DB_SSLMODE=require
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
VIEW_COMPILED_PATH=/tmp/storage/framework/views
```

6. Klik tombol **Deploy**.
7. Tunggu build selesai (~1-2 menit). Begitu selesai, klik domain `.vercel.app` Anda dan aplikasi langsung live di internet!

---

## 4. Akun Demo untuk Pengujian di Vercel:
- **Admin**:
  - Username: `admin`
  - Password: `password`
- **Member / Penulis**:
  - Username: `member`
  - Password: `password`
