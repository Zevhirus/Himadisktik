import React from 'react'
import toast from 'react-hot-toast'
import { Plus, Info } from 'lucide-react'
import { useContent } from '../../lib/content'
import {
  PageHeader, Loading, ErrorBox, Btn, Field, Input, ItemCard, SaveBar,
  useDraftContent, newId, moveItem, updateAt, removeAt,
} from './ui'

const prepare = (list) =>
  list.map((c) => ({
    id: c.id ?? newId(),
    year: String(c.year ?? ''),
    name: c.name || '',
    ketuaUmum: c.ketuaUmum || '',
    wakilKetuaUmum: c.wakilKetuaUmum || '',
    current: !!c.current,
  }))

export default function AdminKabinet() {
  const d = useDraftContent('cabinets', prepare)
  const { struktur } = useContent()
  if (d.status.state === 'loading') return <Loading />
  if (d.status.state === 'error') return <ErrorBox message={d.status.message} onRetry={d.reload} />

  const list = d.draft
  const set = (fn) => d.setDraft((prev) => fn(prev))
  const currentIdx = list.findIndex((c) => c.current) >= 0 ? list.findIndex((c) => c.current) : list.length - 1
  const find = (j) => struktur.pimpinan.find((p) => p.jabatan === j)?.nama || ''

  const save = () => {
    if (!list.length) return toast.error('Minimal harus ada satu kabinet.')
    const bad = list.findIndex((c) => !c.year.trim() || !c.name.trim())
    if (bad >= 0) return toast.error(`Kabinet nomor ${bad + 1} belum lengkap (periode dan nama wajib diisi).`)
    return d.save({
      transform: (arr) => {
        const ci = arr.findIndex((c) => c.current) >= 0 ? arr.findIndex((c) => c.current) : arr.length - 1
        return arr.map((c, i) => ({
          ...c,
          year: c.year.trim(), name: c.name.trim(), ketuaUmum: c.ketuaUmum.trim(), wakilKetuaUmum: c.wakilKetuaUmum.trim(),
          current: i === ci,
        }))
      },
    })
  }
  const reset = () => {
    if (window.confirm('Kembalikan Kabinet ke data bawaan? Semua perubahanmu akan hilang.')) d.resetToDefault()
  }
  const makeCurrent = (i) => set((prev) => prev.map((c, k) => ({ ...c, current: k === i })))

  return (
    <>
      <PageHeader
        title="Kabinet"
        subtitle="Riwayat kepengurusan HIMADISTIK dari masa ke masa (tampil di halaman HIMADISTIK → Perjalanan Kabinet)."
        actions={<Btn variant="primary" icon={Plus} onClick={() => set((p) => [...p, { id: newId(), year: '', name: '', ketuaUmum: '', wakilKetuaUmum: '', current: false }])}>Tambah kabinet</Btn>}
      />
      <div className="mb-6 flex gap-3 p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 text-sm text-blue-300">
        <Info size={18} className="flex-shrink-0 mt-0.5" />
        <p>Ketua Umum dan Wakil Ketua Umum untuk <strong>kabinet yang sedang berjalan</strong> otomatis mengikuti menu <strong>Pengurus</strong>, jadi cukup diubah di sana.</p>
      </div>
      <div className="space-y-4">
        {list.map((c, i) => {
          const isCur = i === currentIdx
          return (
            <ItemCard
              key={c.id}
              index={i}
              total={list.length}
              title={`${c.year ? c.year + ' · ' : ''}${c.name}`}
              onMove={(dir) => set((p) => moveItem(p, i, dir))}
              onDelete={() => {
                if (list.length === 1) return toast.error('Minimal harus ada satu kabinet.')
                if (window.confirm(`Hapus ${c.name || 'kabinet ini'}?`)) set((p) => removeAt(p, i))
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Periode"><Input value={c.year} onChange={(e) => set((p) => updateAt(p, i, { year: e.target.value }))} placeholder="mis. 2026 atau 2023-2024" maxLength={20} /></Field>
                <Field label="Nama kabinet" className="md:col-span-2"><Input value={c.name} onChange={(e) => set((p) => updateAt(p, i, { name: e.target.value }))} placeholder="mis. Kabinet Sahitya Raksa" maxLength={80} /></Field>
                <Field label="Ketua Umum" hint={isCur ? 'Mengikuti menu Pengurus' : undefined}>
                  <Input value={isCur ? find('Ketua Umum') || c.ketuaUmum : c.ketuaUmum} disabled={isCur} onChange={(e) => set((p) => updateAt(p, i, { ketuaUmum: e.target.value }))} maxLength={100} />
                </Field>
                <Field label="Wakil Ketua Umum" hint={isCur ? 'Mengikuti menu Pengurus' : undefined}>
                  <Input value={isCur ? find('Wakil Ketua Umum') || c.wakilKetuaUmum : c.wakilKetuaUmum} disabled={isCur} onChange={(e) => set((p) => updateAt(p, i, { wakilKetuaUmum: e.target.value }))} maxLength={100} />
                </Field>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-dark-200 cursor-pointer pb-2">
                    <input type="radio" name="kabinet-aktif" checked={isCur} onChange={() => makeCurrent(i)} className="accent-orange-500" />
                    Kabinet yang sedang berjalan
                  </label>
                </div>
              </div>
            </ItemCard>
          )
        })}
      </div>
      <SaveBar dirty={d.dirty} saving={d.saving} hasRemote={d.hasRemote} onSave={save} onRevert={d.revert} onReset={reset} />
    </>
  )
}
