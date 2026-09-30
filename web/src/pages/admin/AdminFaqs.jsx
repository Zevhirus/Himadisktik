import React from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import {
  PageHeader, Loading, ErrorBox, Btn, Field, Input, Textarea, ItemCard, SaveBar,
  useDraftContent, newId, moveItem, updateAt, removeAt,
} from './ui'

const prepare = (list) =>
  list.map((f) => ({ id: f.id ?? newId(), pertanyaan: f.pertanyaan || '', jawaban: f.jawaban || '' }))

export default function AdminFaqs() {
  const d = useDraftContent('faqs', prepare)
  if (d.status.state === 'loading') return <Loading />
  if (d.status.state === 'error') return <ErrorBox message={d.status.message} onRetry={d.reload} />

  const faqs = d.draft
  const set = (fn) => d.setDraft((prev) => fn(prev))

  const save = () => {
    const bad = faqs.findIndex((f) => !f.pertanyaan.trim() || !f.jawaban.trim())
    if (bad >= 0) return toast.error(`Pertanyaan nomor ${bad + 1} belum lengkap (pertanyaan dan jawaban wajib diisi).`)
    return d.save({ transform: (list) => list.map((f) => ({ ...f, pertanyaan: f.pertanyaan.trim(), jawaban: f.jawaban.trim() })) })
  }
  const reset = () => {
    if (window.confirm('Kembalikan FAQ ke data bawaan? Semua perubahanmu akan hilang.')) d.resetToDefault()
  }

  return (
    <>
      <PageHeader
        title="FAQ (QnA)"
        subtitle="Pertanyaan yang sering diajukan, tampil di halaman QnA sesuai urutan di sini."
        actions={<Btn variant="primary" icon={Plus} onClick={() => set((p) => [...p, { id: newId(), pertanyaan: '', jawaban: '' }])}>Tambah pertanyaan</Btn>}
      />
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <ItemCard
            key={f.id}
            index={i}
            total={faqs.length}
            title={f.pertanyaan}
            onMove={(dir) => set((p) => moveItem(p, i, dir))}
            onDelete={() => {
              if (window.confirm('Hapus pertanyaan ini?')) set((p) => removeAt(p, i))
            }}
          >
            <Field label="Pertanyaan">
              <Input value={f.pertanyaan} onChange={(e) => set((p) => updateAt(p, i, { pertanyaan: e.target.value }))} maxLength={200} />
            </Field>
            <Field label="Jawaban">
              <Textarea rows={4} value={f.jawaban} onChange={(e) => set((p) => updateAt(p, i, { jawaban: e.target.value }))} maxLength={2000} />
            </Field>
          </ItemCard>
        ))}
        {faqs.length === 0 && <p className="text-center text-dark-400 py-12 border border-dashed border-dark-800 rounded-xl">Belum ada pertanyaan.</p>}
      </div>
      <SaveBar dirty={d.dirty} saving={d.saving} hasRemote={d.hasRemote} onSave={save} onRevert={d.revert} onReset={reset} />
    </>
  )
}
