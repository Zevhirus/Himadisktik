import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Info, ImagePlus, X, Loader2 } from 'lucide-react'
import { uploadPhoto, removePhotos } from '../../lib/adminApi'
import { humanError } from '../../lib/supabase'
import {
  PageHeader, Loading, ErrorBox, Btn, IconBtn, Field, Input, Textarea, Select, ItemCard, SaveBar,
  useDraftContent, moveItem, updateAt, removeAt,
} from './ui'
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react'

const JABATAN = ['Pembina', 'Ketua Umum', 'Wakil Ketua Umum', 'Sekretaris Umum', 'Bendahara Umum']

// Anggota struktur bisa berupa nama saja (data lama) atau { nama, foto, fotoPath } (data baru)
const preparePerson = (p) =>
  typeof p === 'string'
    ? { nama: p, foto: '', fotoPath: '' }
    : { nama: p?.nama || '', foto: p?.foto || '', fotoPath: p?.fotoPath || '' }
const cleanPerson = (p) => ({ nama: p.nama.trim(), foto: p.foto || '', fotoPath: p.fotoPath || '' })

const prepare = (s) => ({
  pimpinan: s.pimpinan.map((p) => ({ nama: p.nama || '', jabatan: p.jabatan || 'Pembina', foto: p.foto || '', fotoPath: p.fotoPath || '' })),
  departemen: s.departemen.map((d) => ({
    nama: d.nama || '',
    deskripsi: d.deskripsi || '',
    kepalaDepartemen: preparePerson(d.kepalaDepartemen),
    bidang: d.bidang.map((b) => ({ nama: b.nama || '', deskripsi: b.deskripsi || '', staff: (b.staff || []).map(preparePerson) })),
  })),
})

const clean = (s) => ({
  pimpinan: s.pimpinan.map((p) => ({ nama: p.nama.trim(), jabatan: p.jabatan, foto: p.foto || '', fotoPath: p.fotoPath || '' })).filter((p) => p.nama),
  departemen: s.departemen
    .map((d) => ({
      nama: d.nama.trim(),
      deskripsi: d.deskripsi.trim(),
      kepalaDepartemen: cleanPerson(d.kepalaDepartemen),
      bidang: d.bidang
        .map((b) => ({ nama: b.nama.trim(), deskripsi: b.deskripsi.trim(), staff: b.staff.map(cleanPerson).filter((x) => x.nama) }))
        .filter((b) => b.nama),
    }))
    .filter((d) => d.nama),
})

// Semua path foto storage yang terpakai dalam satu draf struktur (untuk dibersihkan saat hapus/reset)
const pathsOf = (s) =>
  [
    ...(s?.pimpinan || []).map((p) => p.fotoPath),
    ...(s?.departemen || []).flatMap((d) => [
      d.kepalaDepartemen?.fotoPath,
      ...(d.bidang || []).flatMap((b) => (b.staff || []).map((st) => st.fotoPath)),
    ]),
  ].filter(Boolean)

/** Kotak foto kecil (bukan lingkaran) untuk satu pengurus: unggah, ganti, atau hapus. */
function PhotoField({ url, uploading, onPick, onRemove, alt }) {
  return (
    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-dark-700 bg-dark-900 flex-shrink-0 group">
      {url ? (
        <>
          <img src={url} alt={alt || ''} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onRemove}
            aria-label="Hapus foto"
            className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center justify-center transition-opacity"
          >
            <X size={16} className="text-white" />
          </button>
        </>
      ) : (
        <label
          className="w-full h-full flex items-center justify-center cursor-pointer text-dark-500 hover:text-primary-400 transition-colors"
          title="Unggah foto"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label={`Unggah foto ${alt || ''}`} onChange={onPick} />
        </label>
      )}
    </div>
  )
}

export default function AdminStruktur() {
  const d = useDraftContent('struktur', prepare)
  const [uploading, setUploading] = useState({}) // { [key]: true }
  const removedPaths = useRef([]) // foto yang dihapus dari draf → dihapus dari storage SETELAH simpan
  const uploadedPaths = useRef([]) // foto yang diunggah sesi ini dan belum disimpan
  const uploadingCount = Object.values(uploading).filter(Boolean).length

  if (d.status.state === 'loading') return <Loading />
  if (d.status.state === 'error') return <ErrorBox message={d.status.message} onRetry={d.reload} />

  const s = d.draft
  const set = (fn) => d.setDraft((prev) => fn(prev))
  const setPimpinan = (fn) => set((prev) => ({ ...prev, pimpinan: fn(prev.pimpinan) }))
  const setDept = (fn) => set((prev) => ({ ...prev, departemen: fn(prev.departemen) }))
  const setBidang = (di, fn) => setDept((deps) => deps.map((dp, k) => (k === di ? { ...dp, bidang: fn(dp.bidang) } : dp)))
  const setStaff = (di, bi, fn) => setBidang(di, (arr) => arr.map((b, k) => (k === bi ? { ...b, staff: fn(b.staff) } : b)))

  const uploadFor = async (key, file, apply) => {
    if (!file) return
    setUploading((u) => ({ ...u, [key]: true }))
    try {
      const { url, path } = await uploadPhoto(file, 'pengurus')
      uploadedPaths.current.push(path)
      apply(url, path)
    } catch (e) {
      toast.error(humanError(e))
    } finally {
      setUploading((u) => ({ ...u, [key]: false }))
    }
  }
  const pickFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    return file
  }

  const save = () => {
    const c = clean(s)
    const ketum = c.pimpinan.filter((p) => p.jabatan === 'Ketua Umum').length
    const wakil = c.pimpinan.filter((p) => p.jabatan === 'Wakil Ketua Umum').length
    if (ketum !== 1) return toast.error('Harus ada tepat satu Ketua Umum.')
    if (wakil > 1) return toast.error('Wakil Ketua Umum hanya boleh satu orang.')
    const noHead = c.departemen.find((dp) => !dp.kepalaDepartemen.nama)
    if (noHead) return toast.error(`Departemen "${noHead.nama}" belum punya Kepala Departemen.`)
    if (!c.departemen.length) return toast.error('Minimal harus ada satu departemen.')
    return d.save({
      transform: clean,
      afterSave: async () => {
        await removePhotos(removedPaths.current).catch(() => {})
        removedPaths.current = []
        uploadedPaths.current = []
      },
    })
  }
  const revert = async () => {
    await removePhotos(uploadedPaths.current).catch(() => {})
    uploadedPaths.current = []
    removedPaths.current = []
    d.revert()
  }
  const reset = () => {
    if (!window.confirm('Kembalikan struktur pengurus ke data bawaan? Semua perubahan dan foto yang sudah diunggah akan hilang.')) return
    const all = [...pathsOf(d.baseValue()), ...uploadedPaths.current]
    d.resetToDefault(async () => {
      await removePhotos(all).catch(() => {})
      removedPaths.current = []
      uploadedPaths.current = []
    })
  }

  return (
    <>
      <PageHeader title="Pengurus" subtitle="Susunan pembina, pengurus inti, departemen, bidang, dan anggota Kabinet Sahitya Raksa." />
      <div className="mb-6 flex gap-3 p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 text-sm text-blue-300">
        <Info size={18} className="flex-shrink-0 mt-0.5" />
        <p>
          Nama Ketua & Wakil Ketua Umum di sini otomatis dipakai di halaman Beranda dan Perjalanan Kabinet. Foto sebaiknya
          persegi dan close-up wajah (boleh dengan atau tanpa latar belakang) agar rapi saat ditampilkan.
        </p>
      </div>

      {/* Pembina & pengurus inti */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-white">Pembina & pengurus inti</h2>
          <Btn variant="outline" icon={Plus} onClick={() => setPimpinan((p) => [...p, { nama: '', jabatan: 'Pembina', foto: '', fotoPath: '' }])}>Tambah</Btn>
        </div>
        <div className="rounded-xl border border-dark-800 divide-y divide-dark-800">
          {s.pimpinan.map((p, i) => (
            <div key={i} className="flex flex-wrap md:flex-nowrap items-center gap-3 p-3">
              <PhotoField
                url={p.foto}
                uploading={!!uploading[`pimpinan-${i}`]}
                alt={p.nama}
                onPick={(e) => {
                  const file = pickFile(e)
                  uploadFor(`pimpinan-${i}`, file, (url, path) => setPimpinan((arr) => updateAt(arr, i, { foto: url, fotoPath: path })))
                }}
                onRemove={() => {
                  if (p.fotoPath) removedPaths.current.push(p.fotoPath)
                  setPimpinan((arr) => updateAt(arr, i, { foto: '', fotoPath: '' }))
                }}
              />
              <Select value={p.jabatan} onChange={(e) => setPimpinan((arr) => updateAt(arr, i, { jabatan: e.target.value }))} className="md:w-56" aria-label="Jabatan">
                {JABATAN.map((j) => <option key={j}>{j}</option>)}
              </Select>
              <Input value={p.nama} onChange={(e) => setPimpinan((arr) => updateAt(arr, i, { nama: e.target.value }))} placeholder="Nama lengkap (beserta gelar)" maxLength={100} aria-label="Nama" className="flex-1 min-w-[180px]" />
              <div className="flex">
                <IconBtn icon={ArrowUp} label="Naik" disabled={i === 0} onClick={() => setPimpinan((arr) => moveItem(arr, i, -1))} />
                <IconBtn icon={ArrowDown} label="Turun" disabled={i === s.pimpinan.length - 1} onClick={() => setPimpinan((arr) => moveItem(arr, i, 1))} />
                <IconBtn
                  icon={Trash2}
                  label="Hapus"
                  danger
                  onClick={() => {
                    if (p.fotoPath) removedPaths.current.push(p.fotoPath)
                    setPimpinan((arr) => removeAt(arr, i))
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Departemen */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-white">Departemen</h2>
          <Btn
            variant="outline"
            icon={Plus}
            onClick={() => setDept((arr) => [...arr, { nama: '', deskripsi: '', kepalaDepartemen: { nama: '', foto: '', fotoPath: '' }, bidang: [] }])}
          >
            Tambah departemen
          </Btn>
        </div>
        <div className="space-y-5">
          {s.departemen.map((dp, di) => (
            <ItemCard
              key={di}
              index={di}
              total={s.departemen.length}
              title={dp.nama}
              onMove={(dir) => setDept((arr) => moveItem(arr, di, dir))}
              onDelete={() => {
                if (window.confirm(`Hapus departemen "${dp.nama || 'ini'}" beserta seluruh bidang dan anggotanya?`)) {
                  removedPaths.current.push(...pathsOf({ pimpinan: [], departemen: [dp] }))
                  setDept((arr) => removeAt(arr, di))
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nama departemen" hint="Format: SINGKATAN (Nama Lengkap), mis. PSDM (Pengembangan Sumber Daya Manusia)">
                  <Input value={dp.nama} onChange={(e) => setDept((arr) => updateAt(arr, di, { nama: e.target.value }))} maxLength={120} />
                </Field>
                <Field label="Kepala departemen">
                  <div className="flex items-center gap-3">
                    <PhotoField
                      url={dp.kepalaDepartemen.foto}
                      uploading={!!uploading[`kepala-${di}`]}
                      alt={dp.kepalaDepartemen.nama}
                      onPick={(e) => {
                        const file = pickFile(e)
                        uploadFor(`kepala-${di}`, file, (url, path) =>
                          setDept((arr) => updateAt(arr, di, { kepalaDepartemen: { ...dp.kepalaDepartemen, foto: url, fotoPath: path } }))
                        )
                      }}
                      onRemove={() => {
                        if (dp.kepalaDepartemen.fotoPath) removedPaths.current.push(dp.kepalaDepartemen.fotoPath)
                        setDept((arr) => updateAt(arr, di, { kepalaDepartemen: { ...dp.kepalaDepartemen, foto: '', fotoPath: '' } }))
                      }}
                    />
                    <Input
                      value={dp.kepalaDepartemen.nama}
                      onChange={(e) => setDept((arr) => updateAt(arr, di, { kepalaDepartemen: { ...dp.kepalaDepartemen, nama: e.target.value } }))}
                      maxLength={100}
                      className="flex-1"
                      aria-label="Nama kepala departemen"
                    />
                  </div>
                </Field>
              </div>
              <Field label="Penjelasan departemen">
                <Textarea rows={3} value={dp.deskripsi} onChange={(e) => setDept((arr) => updateAt(arr, di, { deskripsi: e.target.value }))} maxLength={1200} />
              </Field>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-dark-400">Bidang</span>
                  <Btn variant="outline" icon={Plus} className="!px-3 !py-1.5" onClick={() => setBidang(di, (arr) => [...arr, { nama: '', deskripsi: '', staff: [] }])}>Tambah bidang</Btn>
                </div>
                <div className="space-y-4">
                  {dp.bidang.map((b, bi) => (
                    <div key={bi} className="rounded-lg border border-dark-800 p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Input value={b.nama} onChange={(e) => setBidang(di, (arr) => updateAt(arr, bi, { nama: e.target.value }))} placeholder="Nama bidang, mis. Bidang Personalia" maxLength={100} aria-label="Nama bidang" />
                        <IconBtn
                          icon={Trash2}
                          label="Hapus bidang"
                          danger
                          onClick={() => {
                            if (window.confirm(`Hapus ${b.nama || 'bidang ini'} beserta anggotanya?`)) {
                              removedPaths.current.push(...b.staff.map((st) => st.fotoPath).filter(Boolean))
                              setBidang(di, (arr) => removeAt(arr, bi))
                            }
                          }}
                        />
                      </div>
                      <Textarea rows={2} value={b.deskripsi} onChange={(e) => setBidang(di, (arr) => updateAt(arr, bi, { deskripsi: e.target.value }))} placeholder="Penjelasan bidang" maxLength={1000} aria-label="Penjelasan bidang" />

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-dark-200">Anggota / staff ({b.staff.length} orang)</span>
                          <Btn variant="outline" icon={Plus} className="!px-3 !py-1.5" onClick={() => setBidang(di, (arr) => updateAt(arr, bi, { staff: [...b.staff, { nama: '', foto: '', fotoPath: '' }] }))}>
                            Tambah anggota
                          </Btn>
                        </div>
                        <div className="rounded-lg border border-dark-800 divide-y divide-dark-800">
                          {b.staff.map((st, si) => (
                            <div key={si} className="flex items-center gap-3 p-2">
                              <PhotoField
                                url={st.foto}
                                uploading={!!uploading[`staff-${di}-${bi}-${si}`]}
                                alt={st.nama}
                                onPick={(e) => {
                                  const file = pickFile(e)
                                  uploadFor(`staff-${di}-${bi}-${si}`, file, (url, path) =>
                                    setStaff(di, bi, (arr) => updateAt(arr, si, { foto: url, fotoPath: path }))
                                  )
                                }}
                                onRemove={() => {
                                  if (st.fotoPath) removedPaths.current.push(st.fotoPath)
                                  setStaff(di, bi, (arr) => updateAt(arr, si, { foto: '', fotoPath: '' }))
                                }}
                              />
                              <Input
                                value={st.nama}
                                onChange={(e) => setStaff(di, bi, (arr) => updateAt(arr, si, { nama: e.target.value }))}
                                placeholder="Nama anggota"
                                maxLength={100}
                                aria-label="Nama anggota"
                                className="flex-1 min-w-[140px]"
                              />
                              <div className="flex">
                                <IconBtn icon={ArrowUp} label="Naik" disabled={si === 0} onClick={() => setStaff(di, bi, (arr) => moveItem(arr, si, -1))} />
                                <IconBtn icon={ArrowDown} label="Turun" disabled={si === b.staff.length - 1} onClick={() => setStaff(di, bi, (arr) => moveItem(arr, si, 1))} />
                                <IconBtn
                                  icon={Trash2}
                                  label="Hapus"
                                  danger
                                  onClick={() => {
                                    if (st.fotoPath) removedPaths.current.push(st.fotoPath)
                                    setStaff(di, bi, (arr) => removeAt(arr, si))
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                          {b.staff.length === 0 && <p className="text-sm text-dark-500 text-center py-3">Belum ada anggota.</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {dp.bidang.length === 0 && <p className="text-sm text-dark-500 text-center py-3">Belum ada bidang.</p>}
                </div>
              </div>
            </ItemCard>
          ))}
        </div>
      </section>

      <SaveBar dirty={d.dirty} saving={d.saving} busy={uploadingCount > 0} hasRemote={d.hasRemote} onSave={save} onRevert={revert} onReset={reset} />
    </>
  )
}
