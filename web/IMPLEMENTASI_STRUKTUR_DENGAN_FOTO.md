# 📸 Implementasi: Struktur Organisasi dengan Foto Profil

**Menambahkan foto profil untuk SEMUA orang (pimpinan + semua staff)**

---

## 📋 Checklist Implementasi

- [ ] Update data structure di mockData.js
- [ ] Update validator di content.jsx
- [ ] Update AdminStruktur.jsx dengan photo upload
- [ ] Update HimadistikProfile.jsx untuk tampil foto
- [ ] Test di admin panel
- [ ] Deploy

---

## 🔧 Step-by-Step Implementation

### Step 1: Update Data Structure

**File:** `src/data/mockData.js`

Perubahan yang diperlukan:
1. Setiap `pimpinan` tambah field `photo: null`
2. Setiap staff di `bidang.staff` ubah dari string menjadi object `{ nama: '...', photo: null }`

**Contoh BEFORE:**
```javascript
{
  pimpinan: [
    { nama: 'John Doe', jabatan: 'Ketua Umum' }  // ← No photo
  ],
  departemen: [{
    bidang: [{
      staff: ['Andi', 'Budi']  // ← String saja
    }]
  }]
}
```

**Contoh AFTER:**
```javascript
{
  pimpinan: [
    { nama: 'John Doe', jabatan: 'Ketua Umum', photo: null }  // ← Added photo
  ],
  departemen: [{
    bidang: [{
      staff: [
        { nama: 'Andi', photo: null },  // ← Object with photo
        { nama: 'Budi', photo: null }
      ]
    }]
  }]
}
```

---

### Step 2: Update Validator & Normalizer

**File:** `src/lib/content.jsx`

Update validator untuk struktur yang baru:

```javascript
const validators = {
  struktur: (v) => {
    if (!v || !Array.isArray(v.pimpinan) || !Array.isArray(v.departemen)) 
      return false
    
    // Validasi pimpinan
    const pimpinanValid = v.pimpinan.every(p => 
      p && typeof p.nama === 'string' && typeof p.jabatan === 'string'
    )
    if (!pimpinanValid) return false
    
    // Harus ada Ketua Umum
    const hasKetum = v.pimpinan.some(p => p.jabatan === 'Ketua Umum')
    if (!hasKetum) return false
    
    // Validasi departemen & staff
    const depsValid = v.departemen.every(d =>
      d && typeof d.nama === 'string' && Array.isArray(d.bidang) &&
      d.bidang.every(b => 
        b && typeof b.nama === 'string' && Array.isArray(b.staff) &&
        b.staff.every(x => {
          // Support both old format (string) dan new format (object)
          if (typeof x === 'string') return true
          return x && typeof x.nama === 'string'
        })
      )
    )
    
    return depsValid
  }
}
```

Tambahkan normalizer untuk backward compatibility:

```javascript
// Di content.jsx, tambahkan function ini:
export const normalizeStruktur = (struktur) => {
  if (!struktur) return struktur
  
  return {
    pimpinan: (struktur.pimpinan || []).map(p => ({
      nama: p.nama || '',
      jabatan: p.jabatan || '',
      photo: p.photo || null  // Ensure photo field
    })),
    departemen: (struktur.departemen || []).map(d => ({
      nama: d.nama || '',
      bidang: (d.bidang || []).map(b => ({
        nama: b.nama || '',
        staff: (b.staff || []).map(x => ({
          // Convert string to object if needed
          nama: typeof x === 'string' ? x : (x.nama || ''),
          photo: typeof x === 'string' ? null : (x.photo || null)
        }))
      }))
    }))
  }
}
```

Gunakan normalizer saat load data:

```javascript
// Di ContentProvider useEffect:
const next = sanitize(Object.fromEntries(data.map((r) => [r.key, r.value])))

// Normalize struktur untuk backward compatibility
if (next.struktur) {
  next.struktur = normalizeStruktur(next.struktur)
}

remoteRef.current = next
```

---

### Step 3: Replace AdminStruktur.jsx

**File:** `src/pages/admin/AdminStruktur.jsx`

**Copy-paste file baru:** `AdminStruktur_WITH_PHOTOS.jsx` ke file ini.

**Fitur yang ditambahkan:**
- ✅ Photo upload untuk setiap pimpinan
- ✅ Photo upload untuk setiap staff
- ✅ Photo preview dengan thumbnail
- ✅ Delete photo button
- ✅ Handle cleanup foto saat delete staff/pimpinan
- ✅ Progress indicator saat upload

---

### Step 4: Update HimadistikProfile.jsx

**File:** `src/pages/admin/HimadistikProfile.jsx` (atau halaman public yang menampil struktur)

Option A: **Grid Layout** (modern)
```javascript
import { useContent } from '../../lib/content'

export default function HimadistikProfile() {
  const { struktur } = useContent()
  
  return (
    <>
      {/* Pimpinan */}
      <section>
        <h2>Pimpinan</h2>
        <div className="grid grid-cols-3 gap-8">
          {struktur.pimpinan?.map((p, i) => (
            <div key={i} className="text-center">
              {p.photo ? (
                <img 
                  src={p.photo.url} 
                  alt={p.nama}
                  className="w-48 h-48 rounded-lg object-cover mx-auto mb-4"
                />
              ) : (
                <div className="w-48 h-48 rounded-lg bg-gray-300 mx-auto mb-4" />
              )}
              <h3>{p.nama}</h3>
              <p>{p.jabatan}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Departemen & Staff */}
      {struktur.departemen?.map((dept, dIdx) => (
        <section key={dIdx}>
          <h2>{dept.nama}</h2>
          {dept.bidang?.map((bidang, bIdx) => (
            <div key={bIdx}>
              <h3>{bidang.nama}</h3>
              <div className="grid grid-cols-4 gap-4">
                {bidang.staff?.map((staff, sIdx) => (
                  <div key={sIdx} className="text-center">
                    {staff.photo ? (
                      <img 
                        src={staff.photo.url}
                        alt={staff.nama}
                        className="w-24 h-24 rounded object-cover mx-auto mb-2"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded bg-gray-300 mx-auto mb-2" />
                    )}
                    <p className="text-sm">{staff.nama}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </>
  )
}
```

Option B: **Card Layout** (classic)
```javascript
// Lihat HimadistikProfile_WITH_PHOTOS_EXAMPLE.jsx
// Ada contoh ProfileCardsWithPhotos component
```

---

## 🧪 Testing

### Test di Admin Panel

1. **Run development server:**
   ```bash
   npm run dev
   ```

2. **Pergi ke admin:**
   ```
   http://localhost:5173/admin/pengurus
   ```

3. **Test pimpinan:**
   - Edit nama pimpinan
   - Upload foto
   - Lihat preview
   - Simpan
   - Check halaman public

4. **Test staff:**
   - Tambah staff baru
   - Upload foto
   - Edit nama
   - Simpan
   - Check halaman public

5. **Test delete:**
   - Delete staff
   - Delete foto
   - Simpan
   - Verify foto hilang dari storage

---

## 📊 Data Structure Reference

### Pimpinan:
```javascript
{
  nama: string,
  jabatan: string,
  photo: {
    url: string,      // URL foto dari Supabase
    path: string      // Path di storage (untuk cleanup)
  } | null
}
```

### Staff:
```javascript
{
  nama: string,
  photo: {
    url: string,
    path: string
  } | null
}
```

---

## 🔄 Migration dari Format Lama

Jika sudah ada data struktur lama (staff berupa string), normalizer akan otomatis convert ke format baru.

**Tidak perlu manual edit database!**

Normalizer akan:
1. Convert `"Andi"` → `{ nama: "Andi", photo: null }`
2. Simpan dengan format baru saat admin click Simpan

---

## ⚠️ Important Notes

### 1. Photo Upload Location
Photos disimpan di Supabase Storage bucket: `struktur/`
(beda dengan program kerja yang di `programs/`)

### 2. Photo Cleanup
Saat delete staff atau pimpinan, foto lama akan:
- Dihapus dari localStorage draft
- Dihapus dari Supabase Storage setelah save

### 3. Photo Compression
Photo otomatis di-compress di client:
- Max 1600px
- JPEG 82% quality
- Reduce upload time & storage

### 4. Backward Compatibility
Sistem support data lama maupun baru. Tidak ada breaking changes.

---

## 🎨 Styling Tips

### Grid untuk Pimpinan (3 kolom):
```css
grid-cols-1 md:grid-cols-3
```

### Grid untuk Staff (4 kolom):
```css
grid-cols-2 md:grid-cols-4
```

### Photo Size:
- Pimpinan: 48x48 atau 192x192 (tergantung layout)
- Staff: 24x24 atau 96x96

### Fallback:
```jsx
{photo ? (
  <img src={photo.url} alt={nama} />
) : (
  <div className="bg-gray-300 text-gray-500">No Photo</div>
)}
```

---

## 📁 File-File yang Perlu Diupdate

| File | Action | Priority |
|------|--------|----------|
| src/data/mockData.js | Add `photo: null` fields | High |
| src/lib/content.jsx | Add validator & normalizer | High |
| src/pages/admin/AdminStruktur.jsx | Replace dengan baru | High |
| src/pages/admin/HimadistikProfile.jsx | Add photo display | High |
| src/pages/SahityaRaksaProfile.jsx | (kalau ada) Add photo display | Medium |
| Komponen lain yang tampil struktur | Add photo display | Medium |

---

## 🚀 Deployment

### Before Deploy:
- [ ] Test semua modul di local
- [ ] Test upload foto
- [ ] Test delete photo
- [ ] Test save & reload
- [ ] Check photo appear di frontend

### Deploy Steps:
```bash
git add .
git commit -m "Add photo upload untuk struktur"
git push
# Vercel akan auto-deploy
```

### After Deploy:
- [ ] Test login admin
- [ ] Test upload foto
- [ ] Verify foto tampil di production

---

## 💡 Future Enhancements

- [ ] Photo crop/resize tool
- [ ] Batch photo upload
- [ ] Photo gallery
- [ ] Social media links per person
- [ ] Bio/description per person
- [ ] Contact info per person

---

## 🆘 Troubleshooting

### ❌ Photo tidak bisa diupload
**Solusi:** Check Supabase RLS policies. Storage bucket harus allow admin upload.

### ❌ Photo muncul tapi tidak menyimpan
**Solusi:** Check afterSave cleanup. Ensure removePhotos() call berhasil.

### ❌ Old data tidak bisa diedit
**Solusi:** Normalizer akan convert otomatis saat save. Coba edit & save ulang.

### ❌ Photo URL error di production
**Solusi:** Check CORS settings di Supabase. Public bucket harus allow origin Anda.

---

## 📞 Support

Lihat file-file yang sudah dibuat:
- `STRUKTUR_WITH_PHOTOS.js` - Data structure baru
- `AdminStruktur_WITH_PHOTOS.jsx` - Admin component
- `HimadistikProfile_WITH_PHOTOS_EXAMPLE.jsx` - Frontend examples

---

**🎉 Semuanya siap! Tinggal copy-paste dan test! 🚀**
