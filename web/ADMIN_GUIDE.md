# Panduan Admin HIMADISTIK

Panel admin ada di **`/admin/login`** (mis. `https://namawebmu.netlify.app/admin/login`).
Data disimpan di **Supabase** (gratis). Login memakai akun Supabase Auth, dan hanya email yang
terdaftar di tabel `admins` yang bisa mengubah data.

## Yang bisa dikelola

| Menu | Fungsi |
|---|---|
| **Ringkasan** | Jumlah pesan belum dibaca, jumlah konten, dan kapan terakhir diubah |
| **Kritik & Saran** | Baca pesan dari pengunjung, tandai dibaca, hapus, cari/filter, unduh CSV |
| **Program Kerja** | Tambah/ubah/hapus/urutkan program, ubah status, **unggah foto dokumentasi** |
| **FAQ** | Kelola halaman QnA |
| **Pengurus** | Pembina, pengurus inti, departemen, bidang, dan anggota (satu nama per baris) |
| **Kabinet** | Riwayat kabinet dari masa ke masa |

Perubahan baru tampil di website setelah menekan **Simpan**. Kalau ada perubahan yang belum disimpan
lalu kamu pindah menu, website akan bertanya dulu. **Kembalikan ke bawaan** menghapus perubahanmu di
menu itu dan memakai data awal dari kode.

## Persiapan awal (sekali saja)

1. **Amankan kunci.** Website hanya memakai *URL* dan *publishable key*. **Secret key (`sb_secret_...`)
   tidak boleh dipakai di website.** Kalau pernah terbagi ke orang lain / chat, ganti di
   Supabase → Project Settings → API Keys.
2. **Jalankan SQL.** Buka `supabase/setup.sql`, ganti `GANTI_DENGAN_EMAIL_ADMIN@gmail.com` dengan email
   admin, lalu Supabase → **SQL Editor** → New query → tempel seluruh isinya → **Run**.
   (Aman dijalankan ulang.) Ini membuat tabel, aturan keamanan, dan bucket foto `dokumentasi`.
3. **Buat akun admin.** Supabase → **Authentication → Users → Add user → Create new user**.
   Isi email yang **sama** dengan langkah 2 + password kuat, centang *Auto Confirm User*.
4. **Matikan pendaftaran publik.** Supabase → Authentication → Sign In / Providers → Email →
   matikan *Allow new users to sign up*. Supaya orang lain tidak bisa membuat akun sendiri.
5. **Isi `.env.local`** (sudah berisi URL & publishable key project ini). Kalau memakai project lain,
   salin dari `.env.example`.
6. Jalankan `npm install` lalu `npm run dev`, buka `http://localhost:5173/admin/login`.

## Deploy

Nilai `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` ikut tertanam saat `npm run build`.

- **Netlify Drop / build lokal:** pastikan `.env.local` ada sebelum `npm run build`, lalu seret folder `dist`.
- **Vercel / Netlify / Cloudflare Pages (lewat GitHub):** isi dua variabel itu di menu
  *Environment variables* pada dashboard mereka. (`.env.local` tidak ikut ke GitHub.)

## Menambah admin lain

1. Authentication → Users → Add user (email + password).
2. SQL Editor: `insert into public.admins (email) values ('email.baru@gmail.com');`

Mencabut akses: `delete from public.admins where email = 'email.lama@gmail.com';`

## Lupa password

Supabase → Authentication → Users → klik pengguna → *Send password recovery* atau atur password baru.

## Keamanan (ringkas)

- Pengunjung hanya bisa **mengirim** kritik-saran; tidak bisa membaca, mengubah, atau menghapusnya.
- Konten (program, FAQ, dll.) bisa dibaca semua orang, tetapi hanya admin yang bisa menulis.
- Foto: siapa pun bisa melihat lewat URL-nya; hanya admin yang bisa mengunggah/menghapus
  (maks 5 MB, JPG/PNG/WebP; foto otomatis diperkecil ke maks 1600 px sebelum diunggah).
- Mode anonim di form kritik-saran benar-benar tidak mengirim nama/kontak.
- Kritik-saran ada batas 30 detik antar kiriman dan kolom jebakan untuk bot. Bila kelak dibanjiri spam,
  tambahkan CAPTCHA (mis. Cloudflare Turnstile).

## Masalah umum

| Gejala | Penyebab / solusi |
|---|---|
| "Supabase belum dihubungkan" | `.env.local` kosong / belum di-build ulang setelah mengisinya |
| "Akun ini bukan admin" | Email belum ada di tabel `admins` (langkah 2 / menambah admin) |
| "Akses ditolak" saat menyimpan | Sama seperti di atas, atau sesi habis → keluar lalu masuk lagi |
| Email atau password salah | Cek di Authentication → Users; pastikan *Auto Confirm* dicentang |
| Foto gagal diunggah | Bucket `dokumentasi` belum dibuat (jalankan ulang `setup.sql`), atau format bukan JPG/PNG/WebP (HEIC iPhone belum didukung) |
| Perubahan belum terlihat di website | Coba muat ulang; pengunjung lama memuat data terbaru saat kunjungan berikutnya |
| Kritik-saran dari pengunjung gagal | Pastikan `setup.sql` sudah dijalankan (tabel `feedback` + aturan insert) |

## Batas paket gratis Supabase

Project gratis yang tidak dipakai lama bisa di-*pause* otomatis oleh Supabase. Buka dashboard dan
tekan *Restore* bila itu terjadi. Cek batas terbaru di halaman harga Supabase.
