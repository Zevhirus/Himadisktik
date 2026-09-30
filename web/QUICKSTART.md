# ⚡ QUICKSTART - Mulai dalam 5 Menit

Panduan singkat untuk memulai website HIMADISTIK dengan cepat.

## 1️⃣ Install Dependencies (1 menit)

```bash
cd himadistik-website
npm install
```

## 2️⃣ Setup Environment (1 menit)

```bash
cp .env.example .env.local
```

Edit `.env.local` dan ubah:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

(Tidak punya Supabase? Lewati untuk sekarang, akan pakai mock data)

## 3️⃣ Start Dev Server (30 detik)

```bash
npm run dev
```

Browser otomatis terbuka ke `http://localhost:5173`

## 4️⃣ Edit Content (2 menit)

Edit `src/data/mockData.js` untuk ubah:

```javascript
// Ubah nama organisasi
export const HIMADISTIK_PROFILE = {
  name: 'HIMADISTIK',
  fullName: 'Himpunan Mahasiswa Program Studi Administrasi Bisnis',
  // ... ubah data lainnya
}

// Ubah data kabinet
export const CABINETS = [
  {
    name: 'Nama Kabinet Anda',
    period: '2024-2025',
    // ... ubah data lainnya
  }
]

// Ubah program kerja
export const PROGRAMS = [
  // ... ubah data program
]
```

## 5️⃣ Kustomisasi Warna (30 detik)

Edit `src/config/app.config.js`:

```javascript
colors: {
  primary: '#0ea5e9',   // Ubah warna primary
  accent: '#ec4899',    // Ubah warna accent
}
```

## ✅ Done!

Website sudah berjalan dengan data Anda! 🎉

---

## 🔗 Navigasi Cepat

- **Beranda:** http://localhost:5173
- **Profil:** http://localhost:5173/himadistik
- **Admin Login:** http://localhost:5173/admin/login
   Login admin memakai akun Supabase asli — lihat **ADMIN_GUIDE.md** (tidak ada lagi password demo).

## 📝 File yang Sering Diubah

```
src/
├── data/mockData.js          ← DATA PROFIL
├── config/app.config.js      ← KONFIGURASI
├── pages/Home.jsx            ← HALAMAN UTAMA
└── styles/globals.css        ← STYLING GLOBAL
```

## 🎨 Ubah Warna

**Option 1: Config File**
```javascript
// src/config/app.config.js
colors: {
  primary: '#YOUR_COLOR',
  accent: '#YOUR_COLOR'
}
```

**Option 2: Tailwind Config**
```javascript
// tailwind.config.js
colors: {
  primary: { 500: '#YOUR_COLOR' },
  accent: { 500: '#YOUR_COLOR' }
}
```

## 🚀 Deploy

### Vercel (Recommended - 1 klik)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### GitHub Pages
```bash
# Update package.json
"homepage": "https://username.github.io/himadistik"

# Push ke GitHub
git push
```

## 🆘 Bantuan

- **Setup Lebih Detail:** Baca `SETUP.md`
- **Database:** Baca `DATABASE_SCHEMA.md`
- **Admin:** Baca `ADMIN_GUIDE.md`
- **Full Guide:** Baca `README.md`

## 📞 Support

- Email: himadistik@mail.com
- WhatsApp: +62812345678
- Instagram: @himadistik

---

**Selamat menggunakan HIMADISTIK Website! 🎉**
