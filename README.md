# Sistem Manajemen Perpustakaan Kampus

Aplikasi web manajemen perpustakaan kampus untuk mengelola buku, kategori, pengumuman, serta alur peminjaman, perpanjangan, dan denda. Dibuat sebagai **Tugas Final Praktikum Pemrograman Web 2026** (tema: Manajemen Perpustakaan).

- Nama: Muh. Faiz Ilyas
- NIM: H071251083
- Program Studi: Sistem Informasi

## Teknologi

| Bagian | Teknologi |
|---|---|
| Framework | Next.js (App Router, JSX) |
| Styling | Tailwind CSS |
| Database | PostgreSQL, raw SQL lewat library `pg` (tanpa ORM) |
| Autentikasi | Password di-hash dengan `bcryptjs`, sesi berupa cookie `httpOnly` bertanda tangan (`jose`) |

## Peran Pengguna

| Peran | Hak akses utama |
|---|---|
| **Guest** | Melihat beranda, katalog, detail buku, dan pengumuman |
| **Mahasiswa** | Mengajukan peminjaman dan perpanjangan, melihat riwayat dan denda, memberi ulasan |
| **Pegawai Perpustakaan** | Mengelola buku, memproses peminjaman, pengembalian, dan perpanjangan |
| **Admin** | Kelola buku dan pengumuman, memantau seluruh transaksi (hanya lihat), ditambah manajemen user dan kategori |

## Fitur dan Progres

- [x] Skema database dan data awal (seed)
- [x] Login, register mahasiswa (validasi email kampus), logout
- [x] Proteksi halaman berdasarkan role (dicek di server)
- [x] Manajemen kategori (admin)
- [x] Manajemen buku (admin & pegawai)
- [x] Manajemen user (admin): daftar + filter role, tambah, edit, hapus dengan proteksi
- [x] Manajemen pengumuman (Draft / Published), daftar dan detail pengumuman publik
- [x] Beranda (5 buku terpopuler, pengumuman terbaru, pencarian cepat)
- [x] Katalog (filter kategori, urut tahun / rating) dan detail buku dengan ulasan
- [x] Alur peminjaman (pengajuan, persetujuan / penolakan, pengembalian)
- [x] Perpanjangan dan perhitungan denda
- [x] Ulasan dan rating buku
- [x] Dashboard ringkasan Mahasiswa, Pegawai, dan Admin (data dari database)

## Aturan Bisnis yang Diterapkan

- Email dan NIM pengguna bersifat unik; register hanya untuk mahasiswa berdomain email kampus.
- Role pengguna ditentukan di server, bukan dari input form.
- Kategori dengan nama atau kode yang sama ditolak; kategori yang masih memiliki buku tidak dapat dihapus.
- Stok buku berubah di dalam transaksi SQL (`BEGIN` / `COMMIT`) saat peminjaman disetujui atau buku dikembalikan.
- Mahasiswa dengan denda berstatus *Tertunggak* tidak dapat mengajukan peminjaman baru.
- User tidak dapat dihapus jika masih punya transaksi aktif atau denda tertunggak; admin tidak dapat menghapus atau mengubah role/status akunnya sendiri.

## Cara Menjalankan

### 1. Prasyarat

- Node.js 20 atau lebih baru
- PostgreSQL (disarankan versi 14 ke atas) dan pgAdmin

### 2. Clone dan install

```bash
git clone <url-repository-ini>
cd <nama-folder-repository>
npm install
```

### 3. Siapkan database

1. Buat database baru bernama `perpustakaan` (lewat pgAdmin atau `createdb perpustakaan`).
2. Jalankan `database/schema.sql` pada database tersebut, lalu `database/seed.sql`.

   Dengan `psql`:

   ```bash
   psql -U postgres -d perpustakaan -f database/schema.sql
   psql -U postgres -d perpustakaan -f database/seed.sql
   ```

   `schema.sql` dapat dijalankan ulang kapan saja (menghapus dan membuat ulang semua tabel).

### 4. Konfigurasi environment

Salin `.env.example` menjadi `.env.local`, lalu isi:

```env
DATABASE_URL=postgresql://postgres:PASSWORD_KAMU@localhost:5432/perpustakaan
SESSION_SECRET=isi_dengan_teks_acak_minimal_32_karakter
```

Membuat `SESSION_SECRET` acak:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Jika password PostgreSQL memuat karakter khusus, ubah dengan URL-encoding (`@` menjadi `%40`, `#` menjadi `%23`).

### 5. Jalankan

```bash
npm run dev
```

Buka <http://localhost:3000>. Restart server setiap kali `.env.local` diubah.

## Akun Demo (dari seed)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@kampus.ac.id` | `admin123` |
| Pegawai | `pegawai1@kampus.ac.id` | `pegawai123` |
| Mahasiswa | `budi@student.kampus.ac.id` | `mahasiswa123` |

Akun `andi@student.kampus.ac.id` (password `mahasiswa123`) sengaja memiliki denda *Tertunggak* untuk menguji pemblokiran peminjaman.

## Struktur Folder

```
database/          schema.sql dan seed.sql (di luar folder app)
src/
  actions/         Server Actions (auth, kategori, buku, loan, pengumuman, user)
  app/             halaman dan route (App Router)
    login/ register/
    katalog/ buku/[id]/ pengumuman/ pengumuman/[id]/   halaman publik
    dashboard/     admin/ pegawai/ mahasiswa/ buku/ transaksi/ pengumuman/
  components/      komponen UI (form, tombol, ...)
  lib/             db.js (pool PostgreSQL), session.js, auth.js, validation.js
```

## Catatan Keamanan

- Semua query memakai parameter (`$1`, `$2`) untuk mencegah SQL injection.
- Password tidak pernah disimpan sebagai teks asli.
- Setiap Server Action memeriksa role pengguna sendiri, tidak hanya mengandalkan guard halaman.
- File `.env.local` tidak ikut di-commit.