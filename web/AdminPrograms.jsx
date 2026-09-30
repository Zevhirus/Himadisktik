import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, ImagePlus, X, Loader2 } from 'lucide-react'
import { uploadPhoto, removePhotos } from '../../lib/adminApi'
import { humanError } from '../../lib/supabase'
import {
  PageHeader, Loading, ErrorBox, Btn, Field, Input, Textarea, Select, ItemCard, SaveBar,
  useDraftContent, newId, moveItem, updateAt, removeAt,
} from './ui'

const STATUS = [
  ['Ongoing', 'Sedang Berlangsung'],
  ['Completed', 'Selesai'],
  ['Coming Soon', 'Coming Soon'],
]

const prepare = (list) =>
  list.map((p) => ({
    id: p.id ?? newId(),
    name: p.name || '',
    status: p.status || 'Coming Soon',
    deskripsi: p.deskripsi || '',
    photos: Array.isArray(p.photos) ? p.photos : [],
  }))

const pathsOf = (list) => (list || []).flatMap((p) => (p.photos || []).map((x) => x.path))

export default function AdminPrograms() {
  const d = useDraftContent('programs', prepare)
  const [uploading, setUploading] = useState({}) // { [programId]: jumlah yang sedang diunggah }
  const removedPaths = useRef([]) // foto yang dihapus dari draf → dihapus dari storage SETELAH simpan
  const uploadedPaths = useRef([]) // foto yang diunggah sesi ini dan belum disimpan
  const uploadingCount = Object.values(uploading).reduce((a, b) => a + b, 0)

  if (d.status.state === 'loading') return <Loading />
  if (d.status.state === 'error') return <ErrorBox message={d.status.message} onRetry={d.reload} />

  const programs = d.draft
  const set = (fn) => d.setDraft((prev) => fn(prev))

  const add = () =>
    set((p) => [...p, { id: newId(), name: '', status: 'Coming Soon', deskripsi: '', photos: [] }])

  const removeProgram = (i) => {
    const prog = programs[i]
    if (!window.confirm(`Hapus program "${prog.name || 'tanpa nama'}"${prog.photos.length ? ` beserta ${prog.photos.length} fotonya` : ''}?`)) return
    removedPaths.current.push(...pathsOf([prog]))
    set((p) => removeAt(p, i))
  }

  const onFiles = async (id, fileList, input) => {
    const files = Array.from(fileList || [])
    if (input) input.value = ''
    if (!files.length) return
    setUploading((u) => ({ ...u, [id]: (u[id] || 0) + files.length }))
    for (const f of files) {
      try {
        const { url, path } = await uploadPhoto(f, 'programs')
        uploadedPaths.current.push(path)
        set((prev) => prev.map((p) => (p.id === id ? { ...p, photos: [...p.photos, { url, path, caption: '' }] } : p)))
      } catch (e) {
        toast.error(humanError(e))
      } finally {
        setUploading((u) => ({ ...u, [id]: Math.max(0, (u[id] || 1) - 1) }))
      }
    }
  }

  const removePhoto = (pid, pi) => {
    const path = programs.find((p) => p.id === pid)?.photos[pi]?.path
    if (path) removedPaths.current.push(path)
    set((prev) => prev.map((p) => (p.id === pid ? { ...p, photos: removeAt(p.photos, pi) } : p)))
  }

  const save = () => {
    const bad = programs.findIndex((p) => !p.name.trim())
    if (bad >= 0) return toast.error(`Program nomor ${bad + 1} belum diberi nama.`)
    return d.save({
      transform: (list) => list.map((p) => ({ ...p, name: p.name.trim(), deskripsi: p.deskripsi.trim() })),
      afterSave: async () => {
        await removePhotos(removedPaths.current).catch(() => {})
        removedPaths.current = []
        uploadedPaths.current = []
      },
    })
  }

  const revert = async () => {
    // foto yang baru diunggah tapi tidak jadi disimpan ikut dibersihkan
    await removePhotos(uploadedPaths.current).catch(() => {})
    uploadedPaths.current = []
    removedPaths.current = []
    d.revert()
  }

  const reset = () => {
    if (!window.confirm('Kembalikan Program Kerja ke data bawaan?\n\nSemua perubahan dan SEMUA foto dokumentasi program akan dihapus permanen.')) return
    const all = [...pathsOf(d.baseValue()), ...uploadedPaths.current]
    d.resetToDefault(async () => {
      await removePhotos(all).catch(() => {})
      removedPaths.current = []
      uploadedPaths.current = []
    })
  }

  return (
    <>
      <PageHeader
        title="Program Kerja"
        subtitle="Tambah, ubah, atur urutan, dan unggah foto dokumentasi. Klik Simpan agar tampil di website."
        actions={<Btn variant="primary" icon={Plus} onClick={add}>Tambah program</Btn>}
      />

      <div className="space-y-5">
        {programs.map((p, i) => (
          <ItemCard
            key={p.id}
            index={i}
            total={programs.length}
            title={p.name}
            onMove={(dir) => set((prev) => moveItem(prev, i, dir))}
            onDelete={() => removeProgram(i)}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Nama program" className="md:col-span-2">
                <Input value={p.name} onChange={(e) => set((prev) => updateAt(prev, i, { name: e.target.value }))} placeholder="mis. HIMABER (Buka Bersama)" maxLength={120} />
              </Field>
              <Field label="Status">
                <Select value={p.status} onChange={(e) => set((prev) => updateAt(prev, i, { status: e.target.value }))}>
                  {STATUS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </Select>
              </Field>
            </div>
            <Field label="Deskripsi">
              <Textarea rows={4} value={p.deskripsi} onChange={(e) => set((prev) => updateAt(prev, i, { deskripsi: e.target.value }))} maxLength={2000} />
            </Field>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-dark-200">Foto dokumentasi ({p.photos.length})</span>
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border border-dark-700 hover:border-primary-500 hover:text-primary-400 text-dark-100 cursor-pointer transition-colors">
                  {uploading[p.id] ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                  {uploading[p.id] ? `Mengunggah ${uploading[p.id]}...` : 'Tambah foto'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
                    multiple
                    className="sr-only"
                    aria-label={`Unggah foto untuk ${p.name || 'program'}`}
                    onChange={(e) => onFiles(p.id, e.target.files, e.target)}
                  />
                </label>
              </div>
              {p.photos.length === 0 ? (
                <p className="text-sm text-dark-500 border border-dashed border-dark-800 rounded-lg py-6 text-center">Belum ada foto.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {p.photos.map((ph, pi) => (
                    <div key={ph.url} className="rounded-lg border border-dark-800 overflow-hidden bg-black">
                      <div className="relative aspect-video">
                        <img src={ph.url} alt={ph.caption || 'Foto dokumentasi'} className="w-full h-full object-cover" loading="lazy" />
                        <button
                          type="button"
                          onClick={() => removePhoto(p.id, pi)}
                          aria-label="Hapus foto"
                          className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/80 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <Input
                        value={ph.caption || ''}
                        onChange={(e) =>
                          set((prev) => prev.map((x) => (x.id === p.id ? { ...x, photos: updateAt(x.photos, pi, { caption: e.target.value }) } : x)))
                        }
                        placeholder="Keterangan (opsional)"
                        maxLength={140}
                        aria-label="Keterangan foto"
                        className="!rounded-none !border-0 !border-t !border-dark-800 !text-xs"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ItemCard>
        ))}
        {programs.length === 0 && <p className="text-center text-dark-400 py-12 border border-dashed border-dark-800 rounded-xl">Belum ada program. Klik "Tambah program".</p>}
      </div>

      <SaveBar dirty={d.dirty} saving={d.saving} busy={uploadingCount > 0} hasRemote={d.hasRemote} onSave={save} onRevert={revert} onReset={reset} />
    </>
  )
}
