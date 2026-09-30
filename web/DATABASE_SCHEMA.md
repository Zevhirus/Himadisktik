# Skema Database

Sumber kebenaran: **`supabase/setup.sql`** (aman dijalankan ulang).

| Objek | Isi | Siapa boleh apa |
|---|---|---|
| `admins(email)` | Daftar email admin | Tidak bisa diakses lewat API; hanya dicek fungsi `is_admin()` |
| `feedback` | Kritik & saran (`category, name, contact, message, anonymous, is_read`) | Pengunjung: **hanya kirim**. Admin: baca/ubah/hapus |
| `site_content(key, value jsonb)` | Konten: `programs`, `faqs`, `struktur`, `cabinets` | Semua: baca. Admin: tulis |
| Storage bucket `dokumentasi` | Foto dokumentasi program | Semua: lihat lewat URL. Admin: unggah/hapus |

Kalau baris `site_content` belum ada, website memakai data bawaan di `src/data/mockData.js`.
`updated_at` dan `updated_by` diisi server (tidak bisa dipalsukan dari browser).

Bentuk `value`:

- `programs`: `[{ id, name, status: 'Ongoing'|'Completed'|'Coming Soon', deskripsi, photos: [{ url, path, caption }] }]`
- `faqs`: `[{ id, pertanyaan, jawaban }]`
- `struktur`: `{ pimpinan: [{ nama, jabatan }], departemen: [{ nama, deskripsi, kepalaDepartemen, bidang: [{ nama, deskripsi, staff: [string] }] }] }`
- `cabinets`: `[{ id, year, name, ketuaUmum, wakilKetuaUmum, current }]`
