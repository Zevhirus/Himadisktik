# 🎓 HIMADISTIK Website

**Himpunan Mahasiswa Program Studi Administrasi Bisnis**

Website profil dan pusat informasi organisasi mahasiswa HIMADISTIK dengan tampilan modern, profesional, dan elegan.

## ✨ Fitur Utama

- ✅ **Profil HIMADISTIK** - Sejarah, visi, misi, kabinet, dan struktur organisasi
- ✅ **Profil Sahitya Raksa** - Informasi divisi dengan struktur kepengurusan
- ✅ **Program Kerja** - Dokumentasi lengkap dengan filter status dan search
- ✅ **Informasi ABSP** - Detail program studi, kompetensi, dan prospek lulusan
- ✅ **FAQ/QnA** - Accordion interaktif untuk pertanyaan yang sering diajukan
- ✅ **Kritik & Saran** - Form feedback dengan opsi pengiriman anonim
- ✅ **Admin Dashboard** - Portal administrasi (demo mode)
- ✅ **Responsive Design** - Optimal di desktop, tablet, dan mobile
- ✅ **Smooth Animations** - Framer Motion untuk animasi halus
- ✅ **Dark Mode Ready** - Siap untuk implementasi dark mode

## 🚀 Tech Stack

### Frontend
- **React 18** - Library UI modern
- **Vite** - Build tool yang cepat
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Routing dan navigasi
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **React Hook Form** - Form management

### Backend (Siap Diintegrasikan)
- **Supabase** - PostgreSQL, Auth, Storage
- **Node.js** - Runtime server (optional)
- **Express** - Framework web (optional)

## 📋 Persiapan

### Prasyarat
- Node.js >= 16.0.0
- npm atau yarn
- Git

### Instalasi Dependencies

```bash
# Clone repository (jika dari git)
git clone <repository-url>
cd himadistik-website

# Install dependencies
npm install

# Atau menggunakan yarn
yarn install
```

## 🏃 Menjalankan Project

### Development Mode

```bash
npm run dev
```

Website akan terbuka di `http://localhost:5173`

### Build Production

```bash
npm run build
```

File build akan tersimpan di folder `dist/`

### Preview Build

```bash
npm run preview
```

## 📁 Struktur Project

```
himadistik-website/
├── src/
│   ├── components/          # Komponen React
│   │   ├── UI/             # Komponen UI reusable (Card, Badge, Tabs)
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── BackToTop.jsx
│   ├── pages/              # Halaman utama
│   │   ├── Home.jsx
│   │   ├── HimadistikProfile.jsx
│   │   ├── SahityaRaksaProfile.jsx
│   │   ├── InformasiAbsp.jsx
│   │   ├── ProgramKerja.jsx
│   │   ├── KritikSaran.jsx
│   │   ├── QnA.jsx
│   │   ├── NotFound.jsx
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       └── AdminDashboard.jsx
│   ├── layouts/            # Layout templates
│   │   └── MainLayout.jsx
│   ├── hooks/              # Custom React hooks
│   │   └── useCustomHooks.js
│   ├── utils/              # Utility functions
│   │   └── helpers.js
│   ├── config/             # Konfigurasi app
│   │   └── app.config.js
│   ├── data/               # Mock data & database
│   │   └── mockData.js
│   ├── styles/             # Global CSS
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── index.html              # Entry point HTML
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── README.md
├── SETUP.md
├── DATABASE_SCHEMA.md
└── ADMIN_GUIDE.md
```

## 🎨 Konfigurasi Warna

Edit file `tailwind.config.js` untuk mengubah warna brand HIMADISTIK:

```javascript
colors: {
  primary: {
    500: '#0ea5e9', // Ubah sesuai warna resmi
    // ... variant lainnya
  },
  accent: {
    500: '#ec4899', // Ubah warna accent
  }
}
```

Atau update `src/config/app.config.js`:

```javascript
colors: {
  primary: '#0ea5e9',    // Primary color
  accent: '#ec4899',     // Accent color
  dark: '#1f2937',       // Dark color
  light: '#f9fafb',      // Light color
}
```

## 📊 Integrasi Supabase

### Setup Database

1. Buat akun di [Supabase](https://supabase.com)
2. Buat project baru
3. Salin URL dan API key ke file `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### SQL Schema

Lihat `DATABASE_SCHEMA.md` untuk struktur tabel lengkap.

Jalankan SQL queries di Supabase Editor:

```sql
-- Tabel Users (untuk admin)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  role TEXT,
  created_at TIMESTAMP
);

-- Tabel untuk feedback
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  category TEXT,
  message TEXT,
  anonymous BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ... dan tabel lainnya
```

## 🔐 Admin Access

### Demo Login (Development)

Login admin memakai akun Supabase asli — lihat **ADMIN_GUIDE.md** (tidak ada lagi password demo).

Login di `/admin/login`

### Setup Real Authentication

1. Enable Authentication di Supabase
2. Implement Auth di `src/pages/admin/AdminLogin.jsx`
3. Protect routes dengan middleware

## 🎯 Fitur yang Dapat Dikembangkan

### Phase 1 (Foundation) ✅
- [x] Halaman utama dengan hero section
- [x] Profil HIMADISTIK & Kabinet
- [x] Profil Sahitya Raksa
- [x] Informasi ABSP
- [x] Program Kerja
- [x] FAQ/QnA
- [x] Kritik & Saran
- [x] Admin Login

### Phase 2 (Enhancement)
- [ ] Real admin dashboard CRUD
- [ ] Supabase integration
- [ ] Image upload storage
- [ ] Email notifications
- [ ] Gallery & Lightbox
- [ ] Search advanced
- [ ] Dark mode
- [ ] Multi-language support

### Phase 3 (Advanced)
- [ ] Blog/Article section
- [ ] Event management
- [ ] Member directory
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] PWA features

## 📝 Mengubah Konten

### Mock Data

Semua data disimpan di `src/data/mockData.js`. Edit file ini untuk mengubah:

```javascript
// src/data/mockData.js

export const HIMADISTIK_PROFILE = {
  name: 'HIMADISTIK',
  fullName: 'Himpunan Mahasiswa Program Studi Administrasi Bisnis',
  tagline: 'Bersama, Berkarya, Bertumbuh',
  // ... ubah sesuai data asli
}

export const CABINETS = [
  // Tambah/edit data kabinet
]

export const PROGRAMS = [
  // Tambah/edit program kerja
]

// ... dan data lainnya
```

### Konfigurasi Aplikasi

Edit `src/config/app.config.js`:

```javascript
export const APP_CONFIG = {
  appName: 'HIMADISTIK',
  contact: {
    email: 'himadistik@mail.com',
    whatsapp: '+62812345678',
  },
  social: {
    instagram: 'https://instagram.com/himadistik',
    // ... ubah sesuai media sosial resmi
  },
  // ...
}
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### GitHub Pages

```bash
# Add to package.json
"homepage": "https://username.github.io/himadistik"

# Deploy
npm run build
# Push dist folder ke gh-pages branch
```

## 🐛 Troubleshooting

### Port 5173 Already in Use
```bash
# Kill process
lsof -ti:5173 | xargs kill -9

# Atau gunakan port lain
npm run dev -- --port 3000
```

### Build Error
```bash
# Clear node_modules dan reinstall
rm -rf node_modules
npm install

# Clear cache
npm cache clean --force
```

### Tailwind CSS Not Working
```bash
# Rebuild Tailwind
npm run build
# Atau restart dev server
npm run dev
```

## 📚 Dokumentasi Lanjutan

- **[SETUP.md](./SETUP.md)** - Panduan setup lengkap
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Struktur database
- **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** - Panduan admin dashboard

## 📞 Support & Contact

**Email:** himadistik@mail.com  
**WhatsApp:** +62812345678  
**Instagram:** @himadistik

## 📄 License

© 2024 HIMADISTIK. All Rights Reserved.

---

**Dibuat dengan ❤️ untuk HIMADISTIK UNY**
