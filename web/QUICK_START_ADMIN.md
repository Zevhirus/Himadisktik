# ⚡ Quick Start: Admin Panel yang Mengubah Frontend

Ini adalah ringkasan **paling singkat** tentang bagaimana sistem admin bekerja di HIMADISTIK.

---

## 🎯 Yang Terjadi Ketika Admin Mengubah Data

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Admin edit Program Kerja di AdminPrograms.jsx            │
│    ↓                                                         │
│ 2. Klik tombol "SIMPAN"                                     │
│    ↓                                                         │
│ 3. saveContentRow() → simpan ke Supabase database           │
│    ↓                                                         │
│ 4. applyContent() → update Context Global                   │
│    ↓                                                         │
│ 5. Semua komponen yang pakai useContent() langsung update   │
│    ↓                                                         │
│ ✅ Website public langsung berubah (tanpa refresh!)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ File-File Penting

| File | Fungsi |
|------|--------|
| `src/lib/adminApi.js` | CRUD database (saveContentRow, loadContentRow, dll) |
| `src/lib/content.jsx` | **Context global & applyContent** (magic happens here!) |
| `src/pages/admin/ui.jsx` | **useDraftContent hook** (state management untuk admin) |
| `src/pages/admin/AdminPrograms.jsx` | Edit program kerja |
| `src/pages/admin/AdminFaqs.jsx` | Edit FAQ |
| `src/pages/admin/AdminStruktur.jsx` | Edit struktur organisasi |
| `src/pages/admin/AdminKabinet.jsx` | Edit kabinet |
| `src/pages/admin/AdminFeedback.jsx` | Baca kritik saran |

---

## 🔄 Alur Penyimpanan (PALING PENTING)

### Step 1: useDraftContent Hook
```javascript
const d = useDraftContent('programs', prepare)
// d.draft = data yang sedang diedit
// d.dirty = ada perubahan belum disimpan?
// d.save() = simpan ke database
```

### Step 2: Klik Simpan
```javascript
const save = () => {
  d.save({
    transform: (data) => { /* bersihkan data */ },
    afterSave: async () => { /* cleanup, hapus foto lama */ }
  })
}
```

### Step 3: Simpan ke Database
```javascript
// Di dalam d.save():
await saveContentRow('programs', finalData)  // ke Supabase
```

### Step 4: Update Context Global (PENTING!)
```javascript
// Di dalam d.save():
applyContent('programs', finalData)  // 🔥 MAGIC!
// ↓
// Semua komponen dengan useContent() langsung re-render
// ↓
// Website public langsung tampil data terbaru
```

### Step 5: Update Cache
```javascript
// Di dalam d.save():
writeCache(finalData)  // localStorage
// ↓
// Next visit, data langsung tampil dari cache (instant!)
```

---

## 🚀 Kode Minimal untuk Admin Baru

Kalau mau tambah admin untuk "Kontak" misalnya:

### 1. Definisikan Data
```javascript
// src/lib/content.jsx
export const CONTENT_KEYS = [..., 'kontak']
export const DEFAULTS = {
  ...,
  kontak: [
    { channel: 'Email', value: 'contact@himadistik.id' }
  ]
}
```

### 2. Buat Component Admin
```javascript
// src/pages/admin/AdminKontak.jsx
import { useDraftContent } from './ui'

export default function AdminKontak() {
  const d = useDraftContent('kontak', k => k)
  
  const kontak = d.draft
  
  return (
    <>
      <PageHeader title="Kontak" />
      {kontak.map((k, i) => (
        <div key={i}>
          <Input value={k.channel} onChange={...} />
          <Input value={k.value} onChange={...} />
        </div>
      ))}
      <button onClick={() => d.save()}>Simpan</button>
    </>
  )
}
```

### 3. Pakai di Frontend
```javascript
// src/pages/SomePublicPage.jsx
function Contact() {
  const { kontak } = useContent()  // 🔄 Auto-update!
  
  return kontak.map(k => (
    <a href={k.value}>{k.channel}</a>
  ))
}
```

Done! ✅

---

## 📊 Data Flow Diagram

```
Admin Panel (AdminPrograms.jsx)
    ↓ (useDraftContent hook)
    ↓
Database (Supabase site_content table)
    ↓ (saveContentRow)
    ↓
Context Global (ContentContext)
    ↓ (applyContent)
    ↓
Frontend Components (ProgramKerja.jsx, dll)
    ↓ (useContent hook)
    ↓
✅ Website Public (Updated instantly!)
```

---

## 🔑 Key Concepts

### `applyContent(key, value)`
**The magic function!** Dipanggil setelah data tersimpan ke database. Langsung update Context, cache, dan trigger re-render semua komponen yang pakai `useContent()`.

```javascript
// Ini yang bikin perubahan di admin langsung muncul di frontend:
applyContent('programs', updatedPrograms)
```

### `useContent()`
Hook untuk frontend. Ambil data dari Context, otomatis update kalau admin ubah.

```javascript
const { programs, faqs, struktur } = useContent()
```

### `useDraftContent(key)`
Hook untuk admin. Manage draft state, detect perubahan, simpan ke database.

```javascript
const d = useDraftContent('programs')
d.draft   // data sedang diedit
d.dirty   // ada perubahan?
d.save()  // simpan ke database
```

---

## ⚠️ Common Mistakes & Fixes

### ❌ Mistake 1: Lupa panggil applyContent
```javascript
// ❌ WRONG
await saveContentRow('programs', data)
// Frontend tidak tahu ada perubahan!

// ✅ CORRECT
await saveContentRow('programs', data)
applyContent('programs', data)  // HARUS!
```

### ❌ Mistake 2: Validasi di server aja
```javascript
// ❌ Pengguna tidak tahu error sampai klik Simpan
// ✅ Validasi di client dulu, sebelum kirim ke server
const errors = validateData(draft)
if (errors.length > 0) {
  toast.error('Data tidak valid')
  return
}
d.save()
```

### ❌ Mistake 3: Lupa handle offline
```javascript
// ❌ WRONG: Crash kalau internet mati
// ✅ CORRECT: Selalu wrap dalam try-catch
try {
  await d.save()
} catch (e) {
  toast.error('Gagal menyimpan: ' + e.message)
}
```

---

## ✅ Checklist: Admin Panel Siap Pakai

- [x] Supabase database `site_content` table sudah ada
- [x] adminApi.js dengan fungsi CRUD
- [x] ContentProvider & useContent hook
- [x] useDraftContent hook untuk admin
- [x] AdminDashboard, AdminPrograms, AdminFaqs, AdminStruktur, AdminKabinet, AdminFeedback
- [x] Authentication & authorization
- [x] Photo upload & compression
- [x] Local cache (localStorage)
- [x] Validation
- [x] Error handling & toast notifications

---

## 🧪 Test Admin System

### 1. Login ke Admin
```
https://himadistik.id/admin
username: admin@himadistik.id
password: [your password]
```

### 2. Edit Program Kerja
- Ubah nama program
- Upload foto
- Klik "SIMPAN"

### 3. Check Frontend
- Buka halaman ProgramKerja di tab baru
- Lihat perubahan langsung muncul (tanpa refresh!)

---

## 📚 Full Documentation

Untuk detail lengkap, baca:
- **ADMIN_SYSTEM_GUIDE.md** - Dokumentasi lengkap sistem
- **ADMIN_CODE_EXAMPLES.md** - Contoh kode untuk setiap modul

---

## 🚀 Next Steps

1. **Test Admin Panel**
   - Login
   - Edit data
   - Lihat perubahan di frontend
   
2. **Customize**
   - Warna, font, layout
   - Tambah field baru
   - Integrasi dengan sistem lain
   
3. **Deploy**
   - Setup Supabase production
   - Configure RLS policies
   - Launch! 🎉

---

## 📞 Need Help?

Sistem ini menggunakan:
- **Supabase** (database & auth)
- **React Context** (state management)
- **React Hot Toast** (notifications)
- **Tailwind CSS** (styling)

Baca dokumentasi mereka untuk detail lebih lanjut!

---

**Dibuat dengan ❤️ untuk HIMADISTIK**

*Last Updated: September 2024*
