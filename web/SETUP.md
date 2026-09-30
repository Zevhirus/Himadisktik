# 🚀 SETUP GUIDE - HIMADISTIK Website

Panduan lengkap untuk setup dan menjalankan website HIMADISTIK.

## ✅ Prerequisites

Pastikan Anda memiliki:
- **Node.js** >= 16.0.0 ([Download](https://nodejs.org/))
- **npm** atau **yarn** (biasanya included dengan Node.js)
- **Git** (untuk version control)
- **Text Editor** (VSCode recommended)
- **Supabase Account** (untuk database) - [Daftar gratis](https://supabase.com)

### Cek versi

```bash
node --version    # v16.0.0 atau lebih tinggi
npm --version     # 7.0.0 atau lebih tinggi
git --version     # 2.0.0 atau lebih tinggi
```

## 📥 Instalasi

### 1. Clone Repository

```bash
# Jika dari GitHub
git clone https://github.com/your-org/himadistik-website.git
cd himadistik-website

# Atau download ZIP dan extract
```

### 2. Install Dependencies

```bash
# Menggunakan npm (recommended)
npm install

# Atau menggunakan yarn
yarn install

# Atau menggunakan pnpm
pnpm install
```

Proses ini akan mengunduh dan install semua dependencies dari `package.json`.

### 3. Setup Environment Variables

```bash
# Copy .env.example ke .env.local
cp .env.example .env.local

# Edit .env.local dengan editor favorit
# Isi dengan Supabase credentials Anda
```

Buka `.env.local` dan update values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anonymous_key_here
VITE_APP_URL=http://localhost:5173
VITE_CONTACT_EMAIL=himadistik@mail.com
VITE_INSTAGRAM_URL=https://instagram.com/himadistik
# ... update values lainnya
```

## 🗄️ Setup Database (Supabase)

### Step 1: Buat Supabase Account

1. Kunjungi [supabase.com](https://supabase.com)
2. Klik "Sign Up"
3. Daftar dengan email atau GitHub

### Step 2: Buat Project Baru

1. Klik "New Project"
2. Isi form:
   - **Name:** himadistik
   - **Database Password:** Buat password yang kuat
   - **Region:** Pilih region terdekat (asia-southeast1 untuk Indonesia)
3. Tunggu project dibuat (1-5 menit)

### Step 3: Setup Database Schema

1. Masuk ke Project
2. Klik menu **SQL Editor** di sidebar
3. Klik **"New Query"**
4. Copy-paste SQL dari `DATABASE_SCHEMA.md`
5. Klik **Run**

Atau import file SQL:

```bash
# Jika Supabase CLI sudah installed
supabase db push --db-url "postgresql://..."
```

### Step 4: Copy API Credentials

1. Klik menu **Settings** → **API**
2. Salin:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
3. Paste ke `.env.local`

### Step 5: Setup Storage Buckets

Untuk menyimpan file (logo, foto, dokumentasi):

1. Klik menu **Storage** di sidebar
2. Klik **Create a new bucket**
3. Buat bucket dengan nama:
   - `avatars` (untuk foto profil)
   - `program-docs` (untuk dokumentasi program)
   - `gallery` (untuk galeri)
   - `certificates` (untuk sertifikat)

4. Set setiap bucket ke **Public** (agar file bisa diakses)

### Step 6: Setup Authentication

1. Klik menu **Authentication** di sidebar
2. Klik **Providers**
3. Enable **Email** provider:
   - Toggle ON
   - Configure email templates (optional)

## 🏃 Menjalankan Project

### Development Mode

```bash
npm run dev
```

Output:
```
  ➜  Local:   http://localhost:5173/
  ➜  Press q to quit
```

Buka browser dan akses `http://localhost:5173/`

### Build untuk Production

```bash
npm run build
```

Ini akan create folder `dist/` dengan file production-ready.

### Preview Build

```bash
npm run preview
```

Preview hasil build sebelum deploy.

## 📝 Mengubah Konten

### Update Data Profil

Edit file `src/data/mockData.js`:

```javascript
export const HIMADISTIK_PROFILE = {
  name: 'HIMADISTIK',
  fullName: 'Himpunan Mahasiswa Program Studi Administrasi Bisnis',
  tagline: 'Bersama, Berkarya, Bertumbuh',
  description: 'Deskripsi organisasi...',
  foundedYear: 2015,
  // ... update data lainnya
}

export const CABINETS = [
  {
    id: 1,
    name: 'Kabinet Pradana',
    period: '2024-2025',
    theme: 'Innovation & Collaboration',
    // ... update data kabinet
  },
  // ... tambah kabinet lainnya
]

export const PROGRAMS = [
  // ... update program kerja
]

export const FAQS = [
  // ... update FAQ
]
```

### Update Konfigurasi Aplikasi

Edit file `src/config/app.config.js`:

```javascript
export const APP_CONFIG = {
  appName: 'HIMADISTIK',
  appFullName: 'Himpunan Mahasiswa Program Studi Administrasi Bisnis',
  tagline: 'Bersama, Berkarya, Bertumbuh',
  
  colors: {
    primary: '#0ea5e9',   // Primary color (Blue)
    accent: '#ec4899',    // Accent color (Pink)
  },
  
  contact: {
    email: 'himadistik@mail.com',
    whatsapp: '+62812345678',
    phone: '+62-274-xxx-xxx',
  },
  
  social: {
    instagram: 'https://instagram.com/himadistik',
    tiktok: 'https://tiktok.com/@himadistik',
    whatsapp: 'https://wa.me/62812345678',
    youtube: 'https://youtube.com/@himadistik',
  },
  
  // ... update config lainnya
}
```

### Update Warna Brand

Edit file `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#0ea5e9',  // Ubah warna primary
        // ... variants lainnya
      },
      accent: {
        500: '#ec4899',  // Ubah warna accent
        // ... variants lainnya
      },
    },
  },
},
```

## 🎯 Admin Dashboard

### Admin Login (Demo Mode)

1. Buka `http://localhost:5173/admin/login`
2. Gunakan kredensial demo:
    Login admin memakai akun Supabase asli — lihat **ADMIN_GUIDE.md** (tidak ada lagi password demo).

### Setup Real Authentication

Untuk production, implement auth dengan Supabase:

```javascript
// src/pages/admin/AdminLogin.jsx

import { useSupabaseAuth } from '../hooks/useSupabaseAuth'

function AdminLogin() {
  const { signIn } = useSupabaseAuth()
  
  const handleLogin = async (email, password) => {
    const { user, error } = await signIn(email, password)
    if (error) {
      toast.error('Login failed')
    } else {
      navigate('/admin/dashboard')
    }
  }
  
  // ... rest of component
}
```

## 🚀 Deployment

### Deploy ke Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel

# Production
vercel --prod
```

Vercel akan:
1. Automatically detect React project
2. Build `npm run build`
3. Deploy ke URL `https://[project].vercel.app`

Konfigurasi Environment Variables di Vercel:
1. Settings → Environment Variables
2. Add variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - dll

### Deploy ke Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Atau connect ke GitHub untuk auto-deploy
# 1. Push ke GitHub
# 2. Authorize Netlify di GitHub
# 3. Select repository
# 4. Auto-deploy setiap push
```

Build command: `npm run build`  
Publish directory: `dist`

### Deploy ke GitHub Pages

1. Push ke GitHub
2. Go to Settings → Pages
3. Set:
   - Source: Deploy from a branch
   - Branch: main (atau branch favorit)
   - Folder: /(root)
4. Save

Konfigurasi `package.json`:
```json
{
  "homepage": "https://username.github.io/himadistik-website"
}
```

### Deploy ke Own Server

#### Using PM2 + Nginx

```bash
# Build
npm run build

# Install PM2
npm i -g pm2

# Create ecosystem.config.js
pm2 start ecosystem.config.js

# Or manually
pm2 start "npm run preview" --name himadistik
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name himadistik.uny.ac.id;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 🐛 Troubleshooting

### Port 5173 Already in Use

```bash
# Cari process yang menggunakan port
lsof -i :5173

# Kill process
kill -9 <PID>

# Atau gunakan port lain
npm run dev -- --port 3000
```

### Build Error

```bash
# Clear node_modules
rm -rf node_modules

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Build lagi
npm run build
```

### Tailwind CSS Not Working

```bash
# Restart dev server
npm run dev

# Or rebuild
npm run build
```

### Supabase Connection Error

1. Check `.env.local` - pastikan URL dan key benar
2. Ping Supabase dashboard - pastikan project aktif
3. Check network - pastikan tidak ada firewall
4. Clear browser cache - Ctrl+Shift+Del

### Module Not Found Error

```bash
# Make sure all dependencies installed
npm install

# Check if file exists
ls src/components/UI/

# Clear cache
rm -rf node_modules/.vite
```

## 📚 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build production
npm run preview         # Preview build

# Code Quality
npm run lint            # Run eslint
npm run format          # Format code dengan prettier

# Database
npm run db:push         # Push schema ke Supabase
npm run db:pull         # Pull schema dari Supabase

# Utilities
npm run clean           # Clean build artifacts
npm run version         # Show version
```

## 📖 Learning Resources

- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Framer Motion:** https://www.framer.com/motion
- **Vite Docs:** https://vitejs.dev
- **React Router:** https://reactrouter.com
- **Supabase Docs:** https://supabase.com/docs

## 🆘 Getting Help

### Dokumentasi Lokal
- `README.md` - Overview project
- `DATABASE_SCHEMA.md` - Database structure
- `ADMIN_GUIDE.md` - Admin dashboard guide

### Online Resources
- GitHub Issues
- Stack Overflow
- React Community Discord
- Supabase Community

### Contact HIMADISTIK
- **Email:** himadistik@mail.com
- **WhatsApp:** +62812345678
- **Instagram:** @himadistik

## ✅ Checklist

- [ ] Node.js & npm installed
- [ ] Project cloned/extracted
- [ ] Dependencies installed
- [ ] `.env.local` configured
- [ ] Supabase project created
- [ ] Database schema imported
- [ ] Storage buckets created
- [ ] API credentials copied
- [ ] Dev server running (`npm run dev`)
- [ ] Website accessible at localhost
- [ ] Admin login working
- [ ] Ready to customize content!

---

**Selamat! Setup selesai. Mulai customize website Anda! 🎉**
