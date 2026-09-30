# 🎯 Panduan Sistem Admin - Bagaimana Perubahan Langsung Muncul di Frontend

## 📊 Alur Data: Admin → Database → Frontend

```
Admin Edit Data
    ↓
    ├→ useDraftContent Hook
    │   └→ Simpan ke Supabase (site_content table)
    │
    ├→ applyContent() dipanggil
    │   └→ Update Context global (ContentContext)
    │
    └→ Frontend otomatis update
        └→ useContent() hook re-render dengan data terbaru
```

---

## 🏗️ Arsitektur Sistem

### 1. **Database Layer** (`Supabase`)
**Tabel: `site_content`**
```javascript
{
  key: string              // 'programs', 'faqs', 'struktur', 'cabinets'
  value: JSON             // Data yang bisa diedit admin
  updated_at: timestamp   // Kapan terakhir diubah
  updated_by: string      // Siapa yang mengubah
}
```

**Tabel: `feedback`**
```javascript
{
  id: uuid
  message: text
  created_at: timestamp
  is_read: boolean
}
```

### 2. **API Layer** (`src/lib/adminApi.js`)
Fungsi-fungsi untuk CRUD data:

```javascript
// ✏️ SIMPAN KONTEN
await saveContentRow('programs', programsList)
await saveContentRow('faqs', faqsList)
await saveContentRow('struktur', strukturData)
await saveContentRow('cabinets', cabinetsList)

// 📖 BACA KONTEN
const row = await loadContentRow('programs')
const allRows = await listContentMeta()

// 🗑️ HAPUS KONTEN
await deleteContentRow('programs')

// 📸 KELOLA FOTO
const { url, path } = await uploadPhoto(file, 'programs')
await removePhotos([path1, path2, ...])

// 💬 FEEDBACK
const { unread, total } = await countFeedback()
const messages = await listFeedback()
await setFeedbackRead(id, isRead)
await deleteFeedback(id)
```

### 3. **State Management** (`src/lib/content.jsx`)
**ContentContext & useContent Hook**

```javascript
const { programs, faqs, struktur, cabinets, applyContent } = useContent()

// applyContent() = trigger perubahan real-time
applyContent('programs', updatedPrograms)
```

---

## 🔄 Flow Lengkap: Ketika Admin Mengubah Data

### Contoh: Edit Program Kerja

```
1️⃣ ADMIN EDIT DATA (AdminPrograms.jsx)
   - Input: nama program, deskripsi, foto
   - Disimpan di draft state lokal
   - Tampil badge "Ada perubahan yang belum disimpan"

2️⃣ ADMIN KLIK TOMBOL "SIMPAN"
   - Validasi data
   - Panggil: d.save({ transform: ..., afterSave: ... })
   
3️⃣ SIMPAN KE DATABASE (useDraftContent Hook)
   - await saveContentRow('programs', updatedPrograms)
   - Kirim ke Supabase database
   
4️⃣ UPDATE CONTEXT GLOBAL
   - applyContent('programs', updatedPrograms)
   - Ubah state di ContentContext
   - Write to localStorage cache
   
5️⃣ FRONTEND OTOMATIS UPDATE
   - Halaman ProgramKerja.jsx yang pake useContent()
   - Re-render dengan data terbaru
   - Toast notification: "Tersimpan. Website sudah diperbarui."
   
6️⃣ CLEANUP (afterSave)
   - Hapus foto lama dari storage
   - Clear temporary paths
```

---

## 📝 Modul Admin yang Bisa Edit Apa

| Halaman | Kunci | Apa yang Bisa Diedit | Frontend Ditampilkan di |
|---------|-------|-------------------|----------------------|
| **AdminPrograms** | `programs` | Nama, deskripsi, status, foto program | ProgramKerja.jsx |
| **AdminFaqs** | `faqs` | Pertanyaan, jawaban FAQ | QnA.jsx |
| **AdminStruktur** | `struktur` | Pimpinan, departemen, staff | HimadistikProfile.jsx |
| **AdminKabinet** | `cabinets` | Riwayat kabinet kepengurusan | HimadistikProfile.jsx |
| **AdminFeedback** | N/A | Baca/hapus pesan kritik saran | Dashboard |

---

## 🎮 Detil Setiap Admin Panel

### 📅 AdminPrograms.jsx
**File: `src/pages/admin/AdminPrograms.jsx`**

```javascript
// STRUKTUR DATA
{
  id: 'uuid',
  name: 'Program Kerja 2024',
  status: 'Ongoing' | 'Completed' | 'Coming Soon',
  deskripsi: 'Deskripsi singkat',
  photos: [
    { url: 'https://...jpg', path: 'programs/123-abc.jpg', caption: '' }
  ]
}

// FITUR
✅ Tambah/edit/hapus program
✅ Upload foto dokumentasi (otomatis compress)
✅ Hapus foto dari storage
✅ Urutkan program (naik/turun)
✅ Validasi: Setiap program harus punya nama
✅ Toast notifications untuk feedback user
```

**Alur Upload Foto:**
```
1. User pilih file
2. Kompres di client (max 1600px, JPEG 82%)
3. Upload ke Supabase Storage
4. Simpan URL di program.photos
5. Simpan path untuk cleanup nanti
```

### ❓ AdminFaqs.jsx
**File: `src/pages/admin/AdminFaqs.jsx`**

```javascript
// STRUKTUR DATA
{
  pertanyaan: 'Apa itu HIMADISTIK?',
  jawaban: 'Himpunan Mahasiswa Informatika...'
}

// FITUR
✅ Tambah/edit/hapus FAQ
✅ Urutkan FAQ
✅ Real-time preview
✅ Setiap FAQ harus punya Q & A
```

### 👥 AdminStruktur.jsx
**File: `src/pages/admin/AdminStruktur.jsx`**

```javascript
// STRUKTUR DATA
{
  pimpinan: [
    { nama: 'John Doe', jabatan: 'Ketua Umum' },
    { nama: 'Jane Smith', jabatan: 'Wakil Ketua Umum' }
  ],
  departemen: [
    {
      nama: 'Departemen Internal',
      bidang: [
        {
          nama: 'Bidang A',
          staff: ['Staff 1', 'Staff 2']
        }
      ]
    }
  ]
}

// FITUR
✅ Edit pimpinan (nama, jabatan)
✅ Tambah/edit/hapus departemen
✅ Tambah/edit/hapus bidang dalam departemen
✅ Tambah/edit/hapus staff
✅ Validasi: Harus ada Ketua Umum
✅ Hierarchical tree view
```

### 👑 AdminKabinet.jsx
**File: `src/pages/admin/AdminKabinet.jsx`**

```javascript
// STRUKTUR DATA
{
  name: 'Kabinet 2024',
  ketuaUmum: 'John Doe',
  wakilKetuaUmum: 'Jane Smith',
  current: true  // Mark as current cabinet
}

// FITUR
✅ Tambah/edit/hapus kabinet
✅ Mark kabinet sebagai "current"
✅ Ketua & Wakil otomatis update dari struktur pengurus
```

### 💬 AdminFeedback.jsx
**File: `src/pages/admin/AdminFeedback.jsx`**

```javascript
// STRUKTUR DATA
{
  id: 'uuid',
  message: 'Saran untuk website...',
  created_at: '2024-09-24T10:30:00Z',
  is_read: false
}

// FITUR
✅ Lihat semua pesan kritik saran
✅ Mark sebagai read/unread
✅ Hapus pesan
✅ Filter: Belum dibaca / Semua
✅ Sort: Terbaru first
✅ Count badge di dashboard
```

---

## ⚡ Hook Penting untuk Frontend

### useContent() Hook
**File: `src/lib/content.jsx`**

```javascript
// PENGGUNAAN DI FRONTEND
import { useContent } from '../../lib/content'

function ProgramKerja() {
  const { programs } = useContent()  // 🔄 Auto-update saat admin edit!
  
  return (
    <>
      {programs.map(prog => (
        <div key={prog.id}>
          <h3>{prog.name}</h3>
          <p>{prog.deskripsi}</p>
          {prog.photos.map(photo => (
            <img src={photo.url} />
          ))}
        </div>
      ))}
    </>
  )
}
```

**Data yang Dikembalikan:**
```javascript
{
  programs: Array,           // List program kerja
  faqs: Array,              // List FAQ
  struktur: Object,         // Struktur organisasi
  cabinets: Array,          // List kabinet
  sahitya: Object,          // Sahitya Raksa data (derived)
  applyContent: Function    // Trigger update (hanya untuk admin)
}
```

### useDraftContent() Hook (Admin Only)
**File: `src/pages/admin/ui.jsx`**

```javascript
const d = useDraftContent('programs', prepare)

// Properties
d.status          // { state: 'loading|ready|error', message? }
d.draft           // Data yang sedang diedit
d.dirty           // Ada perubahan belum tersimpan?
d.hasRemote       // Sudah pernah disimpan ke database?
d.saving          // Sedang menyimpan?

// Methods
d.setDraft(fn)         // Update draft
d.save({...})          // Simpan ke database
d.revert()             // Batalkan perubahan
d.resetToDefault(fn)   // Kembalikan ke data bawaan
d.reload()             // Reload dari database
d.baseValue()          // Ambil nilai tersimpan terakhir
```

---

## 🔐 Security & RLS (Row Level Security)

**Supabase RLS Policy:**
```sql
-- Admin users hanya bisa edit konten mereka sendiri
-- (setup di dashboard Supabase)
```

**Authentication:**
- Admin login via `AdminLogin.jsx`
- Check user credentials
- Protect routes dengan `AuthShell.jsx`

---

## 💾 Cache Strategy

### Local Storage
**Key: `himadistik:content:v1`**

```javascript
// Save
localStorage.setItem(CACHE_KEY, JSON.stringify({ data }))

// Load (cepat, instant render)
const cached = JSON.parse(localStorage.getItem(CACHE_KEY))
```

**Kenapa cache?**
- ✅ Halaman langsung tampil (tidak tunggu fetch database)
- ✅ Offline support
- ✅ Performa lebih cepat

**Flow:**
1. App load → tampilkan dari cache
2. Fetch database di background (max 2.5 detik)
3. Update state & cache jika ada perubahan

---

## 🚨 Validasi Data

**Validator untuk setiap tipe konten:**

```javascript
// PROGRAMS
✅ Array
✅ Setiap item punya `name` (string)
✅ Boleh kosong jika belum custom

// FAQS
✅ Array
✅ Setiap item punya `pertanyaan` & `jawaban` (string)

// STRUKTUR
✅ Object dengan `pimpinan` & `departemen` (array)
✅ Pimpinan harus ada yang `jabatan === 'Ketua Umum'`
✅ Departemen punya `bidang`, bidang punya `staff`

// CABINETS
✅ Array
✅ Setiap item punya `name` (string)
```

**Jika data invalid:**
- ❌ Diabaikan (tidak crash website)
- 📡 Fallback ke data bawaan (mockData.js)

---

## 📱 User Flow: Menggunakan Admin Panel

```
1. Buka https://himadistik.id/admin
   ↓
2. Login dengan kredensial admin
   ↓
3. Lihat dashboard (Admin Dashboard)
   - Ringkasan jumlah data (programs, FAQ, staff, etc.)
   - Timestamp perubahan terakhir
   - Tombol akses ke setiap modul
   ↓
4. Edit data di modul pilihan
   - Contoh: Admin Programs
   - Edit / tambah / hapus program
   - Upload foto
   ↓
5. Lihat preview perubahan
   - Draft bertanda "Ada perubahan belum tersimpan"
   ↓
6. Klik tombol "SIMPAN"
   ↓
7. Toast: "Tersimpan. Website sudah diperbarui."
   ↓
8. Website public langsung berubah
   - Visitor lihat data terbaru
   - Refresh halaman untuk lihat perubahan
```

---

## 🔄 Real-time Update (Tanpa Refresh)

**Bagaimana frontend tahu ada perubahan tanpa refresh?**

1. Admin klik Simpan
2. `saveContentRow('programs', data)` ke Supabase
3. `applyContent('programs', data)` dipanggil
4. Context state berubah: `remoteRef.current = next`
5. Semua komponen yang pake `useContent()` re-render
6. Frontend sudah menampilkan data terbaru

**Di browser yang sama (Admin & Halaman):**
- Jika admin membuka admin panel + halaman public di tab terpisah
- Edit di admin panel
- Klik Simpan
- Pindah ke tab halaman public
- Data sudah berubah (walau belum refresh)

---

## 🛠️ Development: Cara Menambah Fitur Admin Baru

### Misal: Menambah Admin untuk "Kontak"

**Step 1: Definisikan struktur data**
```javascript
// src/lib/content.jsx
export const CONTENT_KEYS = ['programs', 'faqs', 'struktur', 'cabinets', 'kontak']
export const DEFAULTS = {
  // ...
  kontak: [
    { channel: 'Email', value: 'contact@himadistik.id' },
    { channel: 'Instagram', value: '@himadistik' }
  ]
}

const validators = {
  kontak: (v) => isArr(v) && v.every((k) => k && typeof k.channel === 'string')
}
```

**Step 2: Buat halaman admin**
```javascript
// src/pages/admin/AdminKontak.jsx
import { useDraftContent } from './ui'

export default function AdminKontak() {
  const d = useDraftContent('kontak', prepare)
  
  return (
    // ... form untuk edit kontak
  )
}
```

**Step 3: Tambah route**
```javascript
// Di AdminLayout.jsx
<Route path="kontak" element={<AdminKontak />} />
```

**Step 4: Tampilkan di frontend**
```javascript
// src/pages/SomePublicPage.jsx
const { kontak } = useContent()
// Render kontak...
```

---

## 📚 File Structure

```
src/
├── lib/
│   ├── content.jsx          👈 State management & hooks
│   ├── adminApi.js          👈 Database operations
│   └── supabase.js          👈 Supabase client
│
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminPrograms.jsx
│   │   ├── AdminFaqs.jsx
│   │   ├── AdminStruktur.jsx
│   │   ├── AdminKabinet.jsx
│   │   ├── AdminFeedback.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── AuthShell.jsx
│   │   ├── AdminLayout.jsx
│   │   └── ui.jsx           👈 Reusable components & hooks
│   │
│   └── [public pages yang pake useContent()]
│       ├── ProgramKerja.jsx
│       ├── QnA.jsx
│       └── HimadistikProfile.jsx
│
└── data/
    └── mockData.js          👈 Default data jika belum ada di database
```

---

## ✅ Checklist: Sistem Admin Sudah Siap

- ✅ Database schema ready (Supabase `site_content` table)
- ✅ API functions untuk CRUD (adminApi.js)
- ✅ Context global untuk state management (content.jsx)
- ✅ Admin panel untuk 5 modul (Programs, FAQ, Struktur, Kabinet, Feedback)
- ✅ Authentication & authorization
- ✅ Photo upload & compression
- ✅ Cache strategy (localStorage)
- ✅ Validation & error handling
- ✅ Real-time update tanpa refresh
- ✅ Toast notifications

---

## 🎯 Next Steps

1. **Test Admin Panel**
   - Login ke admin
   - Edit salah satu modul
   - Simpan
   - Cek halaman public → data berubah?

2. **Customization**
   - Warna, font, layout
   - Tambah fitur baru
   - Integrasi dengan sistem lain

3. **Deployment**
   - Deploy ke production
   - Setup Supabase (RLS, policies)
   - Monitor usage

---

**Dibuat dengan ❤️ untuk HIMADISTIK**
