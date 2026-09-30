# 💻 Contoh Kode: Sistem Admin HIMADISTIK

Dokumentasi ini menunjukkan **cara kerja** sistem admin dengan contoh kode nyata dari proyek.

---

## 🔄 Alur Penyimpanan Data: Step-by-Step

### Step 1: Admin Mengedit Data (Di UI Component)

**File:** `src/pages/admin/AdminPrograms.jsx`

```javascript
// Admin mengedit program dalam form
const [programs, setPrograms] = useState([
  {
    id: 'prog-1',
    name: 'Seminar Teknologi 2024',
    status: 'Ongoing',
    deskripsi: 'Seminar tentang teknologi terkini',
    photos: [
      { url: 'https://...', path: 'programs/123.jpg', caption: '' }
    ]
  }
])

// Admin ubah nama program
const handleEditProgram = (index, field, value) => {
  setPrograms(prev => 
    prev.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    )
  )
}

// Misalnya admin ubah nama:
// handleEditProgram(0, 'name', 'Seminar AI & ML 2024')
// ✅ Langsung tampil di draft
```

### Step 2: Buat useDraftContent Hook

**File:** `src/pages/admin/ui.jsx` (Bagian hook)

```javascript
export function useDraftContent(key, prepare = (v) => v) {
  const { applyContent } = useContent()  // 👈 Penting!
  
  const [draft, setDraft] = useState(null)
  const [base, setBase] = useState(null)
  const [dirty, setDirty] = useState(false)
  
  // Load data dari database saat pertama kali
  useEffect(() => {
    loadContentRow(key).then(row => {
      const data = row ? row.value : DEFAULTS[key]
      setDraft(prepare(data))
      setBase(JSON.stringify(data))
    })
  }, [key])
  
  // Deteksi ada perubahan
  const isDirty = JSON.stringify(draft) !== base
  
  // 🔥 FUNGSI SIMPAN
  const save = async ({ transform = (v) => v, afterSave } = {}) => {
    const finalData = transform(draft)
    
    // 1️⃣ Simpan ke Supabase
    await saveContentRow(key, finalData)
    
    // 2️⃣ Update Context Global (PENTING!)
    applyContent(key, finalData)
    
    // 3️⃣ Update state lokal
    setBase(JSON.stringify(finalData))
    setDraft(finalData)
    
    // 4️⃣ Cleanup (hapus foto lama, dll)
    if (afterSave) await afterSave()
    
    toast.success('Tersimpan. Website sudah diperbarui.')
  }
  
  return { draft, setDraft, dirty: isDirty, save, revert: ... }
}
```

### Step 3: Admin Klik Tombol SIMPAN

**File:** `src/pages/admin/AdminPrograms.jsx`

```javascript
const save = () => {
  // ✅ Validasi
  const hasMissingName = programs.some(p => !p.name.trim())
  if (hasMissingName) {
    toast.error('Semua program harus punya nama')
    return
  }
  
  // 🔥 SIMPAN dengan transform & cleanup
  return d.save({
    // Transform: bersihkan whitespace sebelum disimpan
    transform: (list) => list.map(p => ({
      ...p,
      name: p.name.trim(),
      deskripsi: p.deskripsi.trim()
    })),
    
    // Cleanup: hapus foto yang dihapus di draft tapi belum dihapus dari storage
    afterSave: async () => {
      if (removedPaths.current.length > 0) {
        await removePhotos(removedPaths.current)
        removedPaths.current = []
      }
    }
  })
}

// Di button:
// <button onClick={save}>SIMPAN</button>
```

---

## 📡 Database Layer: adminApi.js

**File:** `src/lib/adminApi.js`

Semua operasi database lewat sini:

### Simpan Konten

```javascript
// ✅ SAVE
export async function saveContentRow(key, value) {
  const { error } = await supabase
    .from('site_content')
    .upsert({ key, value }, { onConflict: 'key' })
  
  if (error) throw error
  // ✅ Data tersimpan ke database
}

// Contoh penggunaan:
await saveContentRow('programs', [
  { id: '1', name: 'Program A', photos: [...] },
  { id: '2', name: 'Program B', photos: [...] }
])
```

### Baca Konten

```javascript
// ✅ LOAD
export async function loadContentRow(key) {
  const { data, error } = await supabase
    .from('site_content')
    .select('value, updated_at, updated_by')
    .eq('key', key)
    .maybeSingle()  // null kalau tidak ada
  
  if (error) throw error
  return data // { value: {...}, updated_at: '...', updated_by: 'admin@...' }
}

// Contoh penggunaan:
const row = await loadContentRow('programs')
const programs = row?.value || DEFAULT_PROGRAMS
```

### Upload Foto

```javascript
// ✅ UPLOAD dengan compress di client
export async function uploadPhoto(file, folder = 'programs') {
  // 1. Validasi
  if (!file.type.startsWith('image/')) 
    throw new Error(`"${file.name}" bukan file gambar`)
  if (file.size > 25 * 1024 * 1024) 
    throw new Error(`"${file.name}" terlalu besar (maks 25 MB)`)
  
  // 2. Kompres (max 1600px, JPEG 82% quality)
  const blob = await compressImage(file)
  
  // 3. Upload ke Supabase Storage
  const path = `${folder}/${Date.now()}-${randomId()}.jpg`
  const { error } = await supabase.storage
    .from('photos')
    .upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' })
  
  if (error) throw error
  
  // 4. Ambil public URL
  const { data } = supabase.storage.from('photos').getPublicUrl(path)
  
  return { 
    url: data.publicUrl,  // "https://cdn.../photos/1234567-abc.jpg"
    path: path             // "programs/1234567-abc.jpg" (untuk cleanup)
  }
}

// Contoh penggunaan:
const { url, path } = await uploadPhoto(fileFromInput, 'programs')
// ✅ Foto siap digunakan, path disimpan untuk cleanup nanti
```

---

## 🌍 State Management: content.jsx

**File:** `src/lib/content.jsx`

Tempat keajaiban terjadi! ContentProvider & useContent hook.

### ContentProvider Setup

```javascript
// ✅ GLOBAL CONTEXT
const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  // 1️⃣ Cek cache lokal di localStorage
  const cached = useMemo(() => readCache(), [])
  const [remote, setRemote] = useState(cached || {})
  const remoteRef = useRef(remote)
  
  // 2️⃣ Fetch dari database di background (max 2.5 dtk)
  useEffect(() => {
    if (!isSupabaseConfigured) return
    
    ;(async () => {
      try {
        const { data } = await supabase
          .from('site_content')
          .select('key,value')
        
        if (data) {
          const next = sanitize(
            Object.fromEntries(data.map(r => [r.key, r.value]))
          )
          remoteRef.current = next
          setRemote(next)
          writeCache(next)  // Update cache
        }
      } catch { /* offline, pakai cache */ }
    })()
  }, [])
  
  // 3️⃣ applyContent = dipanggil admin setelah simpan
  // Trigger instant update tanpa tunggu refresh database
  const applyContent = useCallback((key, value) => {
    const next = { ...remoteRef.current }
    if (value == null) delete next[key]
    else next[key] = value
    
    remoteRef.current = next
    setRemote(next)              // 🔥 Update state
    writeCache(next)             // 🔥 Update cache
  }, [])
  
  // 4️⃣ Compute derived data
  const value = useMemo(() => {
    const programs = normalizePrograms(
      remote.programs ?? DEFAULTS.programs
    )
    const faqs = remote.faqs ?? DEFAULTS.faqs
    const struktur = remote.struktur ?? DEFAULTS.struktur
    
    return { programs, faqs, struktur, applyContent }
  }, [remote, applyContent])
  
  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  )
}
```

### useContent Hook (Dipakai di Frontend)

```javascript
// ✅ HOOK untuk ambil data di frontend
export const useContent = () => {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent harus di dalam <ContentProvider>')
  return ctx
}

// Contoh penggunaan di halaman public:
function ProgramKerja() {
  const { programs } = useContent()  // 🔄 Auto-update!
  
  return (
    <>
      {programs.map(prog => (
        <div key={prog.id}>
          <h3>{prog.name}</h3>
          <p>{prog.deskripsi}</p>
          {prog.photos.map(photo => (
            <img key={photo.path} src={photo.url} />
          ))}
        </div>
      ))}
    </>
  )
}

// Kalau admin ubah 1 program dan klik Simpan:
// 1. applyContent('programs', [...updatedList])
// 2. State di ContentContext berubah
// 3. ProgramKerja.jsx re-render dengan data baru
// ✅ User lihat perubahan LANGSUNG!
```

---

## 🎯 Cara Kerja Setiap Admin Panel

### AdminPrograms.jsx: Edit Program Kerja

**What it does:**
- Tambah/edit/hapus program
- Upload & hapus foto
- Validasi: setiap program harus punya nama
- Urutkan program

**Data Structure:**
```javascript
[
  {
    id: 'uuid',
    name: 'Program Kerja 2024',
    status: 'Ongoing' | 'Completed' | 'Coming Soon',
    deskripsi: 'Deskripsi singkat',
    photos: [
      {
        url: 'https://...',
        path: 'programs/123-abc.jpg',
        caption: ''
      }
    ]
  }
]
```

**Diagram Alur Upload Foto:**
```
User pilih file
    ↓
Validasi (tipe, size)
    ↓
Kompres di client (1600px max, JPEG 82%)
    ↓
Upload ke Supabase Storage
    ↓
Simpan URL + path di draft
    ↓
User klik "Simpan program"
    ↓
Simpan program list ke site_content table
    ↓
Hapus foto lama (yg di-remove) dari storage
    ↓
applyContent() → update context global
    ↓
Frontend langsung tampil foto terbaru
```

---

### AdminFaqs.jsx: Edit FAQ

**What it does:**
- Tambah/edit/hapus FAQ
- Urutkan FAQ
- Real-time preview

**Data Structure:**
```javascript
[
  {
    pertanyaan: 'Apa itu HIMADISTIK?',
    jawaban: 'Himpunan Mahasiswa Informatika adalah...'
  },
  {
    pertanyaan: 'Kapan HIMADISTIK didirikan?',
    jawaban: 'HIMADISTIK didirikan pada tahun 2010...'
  }
]
```

**Contoh Component:**
```javascript
export default function AdminFaqs() {
  const d = useDraftContent('faqs', prepareFaqs)
  
  // State faqs = draft yang sedang diedit
  const faqs = d.draft
  
  const addFaq = () => {
    d.setDraft(prev => [...prev, {
      pertanyaan: '',
      jawaban: ''
    }])
  }
  
  const updateFaq = (index, field, value) => {
    d.setDraft(prev => 
      prev.map((f, i) => 
        i === index ? { ...f, [field]: value } : f
      )
    )
  }
  
  const removeFaq = (index) => {
    d.setDraft(prev => prev.filter((_, i) => i !== index))
  }
  
  const save = () => {
    if (faqs.some(f => !f.pertanyaan.trim() || !f.jawaban.trim())) {
      toast.error('Semua FAQ harus punya pertanyaan dan jawaban')
      return
    }
    d.save({
      transform: (list) => list.map(f => ({
        pertanyaan: f.pertanyaan.trim(),
        jawaban: f.jawaban.trim()
      }))
    })
  }
  
  return (
    <>
      <PageHeader title="FAQ" subtitle="Edit pertanyaan & jawaban" />
      
      {faqs.map((faq, i) => (
        <ItemCard
          key={i}
          index={i}
          total={faqs.length}
          title={faq.pertanyaan || '(tanpa judul)'}
          onMove={(d) => d.setDraft(prev => moveItem(prev, i, d))}
          onDelete={() => removeFaq(i)}
        >
          <Field label="Pertanyaan">
            <Input
              value={faq.pertanyaan}
              onChange={(e) => updateFaq(i, 'pertanyaan', e.target.value)}
            />
          </Field>
          <Field label="Jawaban">
            <Textarea
              value={faq.jawaban}
              onChange={(e) => updateFaq(i, 'jawaban', e.target.value)}
              rows={5}
            />
          </Field>
        </ItemCard>
      ))}
      
      <Btn onClick={addFaq}>+ Tambah FAQ</Btn>
      
      <SaveBar
        dirty={d.dirty}
        saving={d.saving}
        hasRemote={d.hasRemote}
        onSave={save}
        onRevert={() => d.revert()}
        onReset={() => d.resetToDefault()}
      />
    </>
  )
}
```

---

### AdminStruktur.jsx: Edit Struktur Organisasi

**What it does:**
- Edit pimpinan (nama, jabatan)
- Tambah/edit/hapus departemen
- Tambah/edit/hapus bidang dalam departemen
- Tambah/edit/hapus staff
- Validasi: harus ada Ketua Umum

**Data Structure:**
```javascript
{
  pimpinan: [
    { nama: 'John Doe', jabatan: 'Ketua Umum' },
    { nama: 'Jane Smith', jabatan: 'Wakil Ketua Umum' },
    { nama: 'Bob Johnson', jabatan: 'Bendahara' }
  ],
  departemen: [
    {
      nama: 'Departemen Internal',
      bidang: [
        {
          nama: 'Bidang Kesekretariatan',
          staff: ['Andi', 'Budi', 'Citra']
        },
        {
          nama: 'Bidang Keanggotaan',
          staff: ['Doni', 'Eka']
        }
      ]
    },
    {
      nama: 'Departemen Eksternal',
      bidang: [...]
    }
  ]
}
```

**Validasi:**
```javascript
const isValidStruktur = (v) => {
  // Harus punya pimpinan & departemen array
  if (!v || !Array.isArray(v.pimpinan) || !Array.isArray(v.departemen)) 
    return false
  
  // Pimpinan harus ada yang jadi Ketua Umum
  const hasKetum = v.pimpinan.some(p => p.jabatan === 'Ketua Umum')
  if (!hasKetum) return false
  
  // Departemen harus punya bidang, bidang harus punya staff
  const depsValid = v.departemen.every(d =>
    d.nama && Array.isArray(d.bidang) &&
    d.bidang.every(b => b.nama && Array.isArray(b.staff))
  )
  
  return depsValid
}
```

---

### AdminKabinet.jsx: Edit Kabinet Kepengurusan

**What it does:**
- Tambah/edit/hapus kabinet
- Mark kabinet sebagai "current"
- Ketua & Wakil otomatis update dari struktur

**Data Structure:**
```javascript
[
  {
    name: 'Kabinet 2023',
    ketuaUmum: 'Previous Ketum',
    wakilKetuaUmum: 'Previous Wakil',
    current: false
  },
  {
    name: 'Kabinet 2024 (Current)',
    ketuaUmum: 'John Doe',
    wakilKetuaUmum: 'Jane Smith',
    current: true
  }
]
```

**Special Logic:**
```javascript
// Ketua & Wakil kabinet aktif SELALU mengikuti struktur pengurus
// Jika struktur berubah, otomatis update kabinet yang ditandai "current"

function deriveLeaders(struktur, cabinets) {
  const find = (jabatan) => struktur.pimpinan.find(p => p.jabatan === jabatan)?.nama
  
  const ketum = find('Ketua Umum')
  const wakil = find('Wakil Ketua Umum')
  
  // Update kabinet yang ditandai current dengan leader terbaru
  const idx = cabinets.findIndex(c => c.current)
  const currentIdx = idx >= 0 ? idx : cabinets.length - 1
  
  const next = cabinets.map((c, i) =>
    i === currentIdx 
      ? { ...c, ketuaUmum: ketum || c.ketuaUmum, wakilKetuaUmum: wakil || c.wakilKetuaUmum }
      : c
  )
  
  return { ketum, wakil, cabinets: next }
}
```

---

### AdminFeedback.jsx: Kelola Kritik & Saran

**What it does:**
- Lihat semua pesan kritik saran
- Mark sebagai read/unread
- Hapus pesan
- Filter & sort

**Data Structure:**
```javascript
{
  id: 'uuid',
  message: 'Saran untuk website...',
  created_at: '2024-09-24T10:30:00Z',
  is_read: false
}
```

**Contoh Operasi:**
```javascript
// ✅ BACA SEMUA PESAN
const messages = await listFeedback()
// Dikembalikan: sorted by created_at desc, max 500 messages

// ✅ HITUNG BELUM DIBACA
const { total, unread } = await countFeedback()
// { total: 42, unread: 3 }

// ✅ MARK SEBAGAI READ
await setFeedbackRead(messageId, true)

// ✅ HAPUS PESAN
await deleteFeedback(messageId)

// ✅ MARK SEMUA SEBAGAI READ
await markAllFeedbackRead()
```

---

## 🔐 Authentication & Authorization

**File:** `src/pages/admin/AdminLogin.jsx` & `AuthShell.jsx`

```javascript
// Login check
async function loginAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data.user
}

// Protect routes
export function AuthShell() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [])
  
  if (loading) return <Loading />
  if (!user) return <Redirect to="/admin/login" />
  
  return <Outlet />  // Tampilkan admin routes
}
```

---

## 💡 Tips & Tricks

### 1. **Debounce Save**

Jika admin mengedit banyak field, jangan simpan setiap kali. Tunggu user selesai edit:

```javascript
const [saveTimer, setSaveTimer] = useState(null)

const handleChange = (value) => {
  setDraft(value)
  
  // Clear timer lama
  if (saveTimer) clearTimeout(saveTimer)
  
  // Set timer baru: simpan setelah 3 detik tidak ada perubahan
  const newTimer = setTimeout(() => {
    d.save()
  }, 3000)
  
  setSaveTimer(newTimer)
}
```

### 2. **Optimistic Update**

Update UI sebelum response dari server:

```javascript
const optimisticSave = async (newData) => {
  // 1. Update state lokal LANGSUNG
  applyContent(key, newData)
  setDraft(newData)
  
  // 2. Save ke server di background
  try {
    await saveContentRow(key, newData)
  } catch (e) {
    // 3. Kalau gagal, revert
    applyContent(key, oldData)
    toast.error('Gagal menyimpan')
  }
}
```

### 3. **Validate on Client**

Jangan kirim ke server kalau data invalid:

```javascript
const validateData = (data) => {
  const errors = []
  
  if (!data.name?.trim()) errors.push('Nama harus diisi')
  if (data.photos.length === 0) errors.push('Minimal 1 foto')
  if (data.status && !VALID_STATUSES.includes(data.status)) errors.push('Status invalid')
  
  return errors
}

const save = () => {
  const errors = validateData(draft)
  if (errors.length > 0) {
    errors.forEach(e => toast.error(e))
    return
  }
  
  d.save()  // ✅ Baru simpan kalau valid
}
```

### 4. **Handle Upload Progress**

Show progress bar saat upload foto:

```javascript
const [uploadProgress, setUploadProgress] = useState({}) // { photoId: 45 }

const uploadWithProgress = async (file, programId) => {
  const totalBytes = file.size
  let uploadedBytes = 0
  
  const { url, path } = await uploadPhoto(file, 'programs', {
    onProgress: (event) => {
      uploadedBytes = event.detail.uploadedBytes
      const percent = Math.round((uploadedBytes / totalBytes) * 100)
      setUploadProgress(prev => ({ ...prev, [programId]: percent }))
    }
  })
  
  return { url, path }
}
```

---

## 🧪 Testing Admin Features

### Unit Test untuk useDraftContent

```javascript
test('dirty detection works', () => {
  const { result } = renderHook(() => useDraftContent('programs'))
  
  act(() => {
    result.current.setDraft([{ name: 'Updated' }])
  })
  
  expect(result.current.dirty).toBe(true)
})

test('save updates context', async () => {
  const mockApply = jest.fn()
  const { result } = renderHook(() => useDraftContent('programs'))
  
  act(() => {
    result.current.setDraft([{ name: 'Updated' }])
  })
  
  await act(async () => {
    await result.current.save()
  })
  
  expect(mockApply).toHaveBeenCalledWith('programs', expect.any(Array))
})
```

---

## 🚀 Deployment Checklist

- ✅ Supabase credentials di `.env`
- ✅ Database migrations sudah run
- ✅ RLS policies sudah setup
- ✅ Storage bucket permissions sudah set
- ✅ Admin email & password sudah dibuat
- ✅ Test login ke admin panel
- ✅ Test simpan data
- ✅ Test upload foto
- ✅ Verify data muncul di frontend

---

**Happy Coding! 🎉**
