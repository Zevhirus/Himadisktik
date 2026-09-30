import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ArrowUp, ArrowDown, Trash2, Save, Undo2, RotateCcw, Loader2, AlertTriangle } from 'lucide-react'
import { useContent, DEFAULTS, isValidContent } from '../../lib/content'
import { loadContentRow, saveContentRow, deleteContentRow } from '../../lib/adminApi'
import { humanError } from '../../lib/supabase'

/* ---------- helper data ---------- */
export const DirtyContext = createContext({ setDirty: () => {} })
export const newId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
export const clone = (v) => JSON.parse(JSON.stringify(v))
export const moveItem = (arr, i, d) => {
  const j = i + d
  if (j < 0 || j >= arr.length) return arr
  const c = [...arr]
  ;[c[i], c[j]] = [c[j], c[i]]
  return c
}
export const updateAt = (arr, i, patch) => arr.map((x, k) => (k === i ? { ...x, ...patch } : x))
export const removeAt = (arr, i) => arr.filter((_, k) => k !== i)

/* ---------- elemen form ---------- */
const fieldCls =
  'px-3 py-2 rounded-lg text-sm bg-black text-white border border-dark-700 placeholder:text-dark-500 ' +
  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed'

// lebar penuh kecuali className menentukan lebarnya sendiri (w-...)
const width = (c) => (/(^|\s)w-/.test(c) ? '' : 'w-full')
export const Input = ({ className = '', ...p }) => <input {...p} className={`${fieldCls} ${width(className)} ${className}`} />
export const Textarea = ({ rows = 3, className = '', ...p }) => (
  <textarea rows={rows} {...p} className={`${fieldCls} ${width(className)} resize-y ${className}`} />
)
export const Select = ({ children, className = '', ...p }) => (
  <select {...p} className={`${fieldCls} ${width(className)} ${className}`}>{children}</select>
)
export function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-semibold text-dark-200 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-dark-400 mt-1">{hint}</span>}
    </label>
  )
}

const btnVariants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  ghost: 'bg-dark-800 hover:bg-dark-700 text-white',
  outline: 'border border-dark-700 hover:border-primary-500 text-dark-100 hover:text-primary-400',
  danger: 'bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30',
}
export function Btn({ variant = 'ghost', icon: Icon, children, className = '', ...p }) {
  return (
    <button
      type="button"
      {...p}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${btnVariants[variant]} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}
export function IconBtn({ icon: Icon, label, danger, ...p }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      {...p}
      className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        danger ? 'text-red-400 hover:bg-red-500/15' : 'text-dark-300 hover:text-white hover:bg-dark-800'
      }`}
    >
      <Icon size={16} />
    </button>
  )
}

/* ---------- kerangka halaman ---------- */
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-dark-300 mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
export const Loading = ({ text = 'Memuat...' }) => (
  <div className="flex items-center justify-center gap-3 py-20 text-dark-300">
    <Loader2 className="animate-spin" size={20} /> {text}
  </div>
)
export function ErrorBox({ message, onRetry }) {
  return (
    <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/10 text-center">
      <AlertTriangle className="mx-auto text-red-400 mb-2" />
      <p className="text-red-300 mb-4">{message}</p>
      {onRetry && <Btn onClick={onRetry}>Coba lagi</Btn>}
    </div>
  )
}

/** Kartu satu item daftar, dengan nomor + tombol naik/turun/hapus */
export function ItemCard({ index, total, title, onMove, onDelete, children }) {
  return (
    <div className="rounded-xl border border-dark-800 bg-black">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-dark-800">
        <span className="w-7 h-7 rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
          {index + 1}
        </span>
        <p className="flex-1 min-w-0 truncate font-semibold text-white">{title || <span className="text-dark-500">(belum diberi nama)</span>}</p>
        {onMove && (
          <>
            <IconBtn icon={ArrowUp} label="Pindah ke atas" disabled={index === 0} onClick={() => onMove(-1)} />
            <IconBtn icon={ArrowDown} label="Pindah ke bawah" disabled={index === total - 1} onClick={() => onMove(1)} />
          </>
        )}
        <IconBtn icon={Trash2} label="Hapus" danger onClick={onDelete} />
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  )
}

/** Bilah simpan menempel di bawah layar */
export function SaveBar({ dirty, saving, busy, hasRemote, onSave, onRevert, onReset }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-30 border-t border-dark-800 bg-black/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex flex-wrap items-center gap-3">
        <p className={`text-sm flex-1 min-w-[200px] ${dirty ? 'text-yellow-400' : 'text-dark-400'}`}>
          {dirty
            ? 'Ada perubahan yang belum disimpan'
            : hasRemote
              ? 'Semua perubahan sudah tersimpan'
              : 'Menampilkan data bawaan (belum pernah disimpan)'}
        </p>
        {hasRemote && (
          <Btn variant="outline" icon={RotateCcw} onClick={onReset} disabled={saving || busy}>
            Kembalikan ke bawaan
          </Btn>
        )}
        <Btn variant="outline" icon={Undo2} onClick={onRevert} disabled={!dirty || saving}>
          Batalkan
        </Btn>
        <Btn variant="primary" icon={saving ? Loader2 : Save} onClick={onSave} disabled={!dirty || saving || busy}>
          {saving ? 'Menyimpan...' : busy ? 'Menunggu unggahan...' : 'Simpan'}
        </Btn>
      </div>
    </div>
  )
}

/**
 * Draf konten: memuat dari database (atau data bawaan bila belum pernah disimpan),
 * melacak perubahan, menyimpan (upsert), membatalkan, dan mengembalikan ke bawaan.
 */
export function useDraftContent(key, prepare = (v) => v) {
  const { applyContent } = useContent()
  const { setDirty } = useContext(DirtyContext)
  const [status, setStatus] = useState({ state: 'loading' })
  const [draft, setDraft] = useState(null)
  const [base, setBase] = useState(null) // JSON teks dari versi tersimpan
  const [hasRemote, setHasRemote] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setStatus({ state: 'loading' })
    try {
      const row = await loadContentRow(key)
      const raw = row && isValidContent(key, row.value) ? row.value : DEFAULTS[key]
      const v = prepare(clone(raw))
      setDraft(v)
      setBase(JSON.stringify(v))
      setHasRemote(!!row)
      setStatus({ state: 'ready' })
    } catch (e) {
      setStatus({ state: 'error', message: humanError(e) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  useEffect(() => { load() }, [load])

  const dirty = base !== null && draft !== null && JSON.stringify(draft) !== base
  useEffect(() => {
    setDirty(dirty)
    return () => setDirty(false)
  }, [dirty, setDirty])

  // transform: bersihkan data sebelum disimpan. afterSave: tugas susulan (mis. hapus foto lama)
  const save = async ({ transform = (v) => v, afterSave } = {}) => {
    setSaving(true)
    try {
      const value = transform(clone(draft))
      await saveContentRow(key, value)
      applyContent(key, value)
      setDraft(value)
      setBase(JSON.stringify(value))
      setHasRemote(true)
      toast.success('Tersimpan. Website sudah diperbarui.')
      if (afterSave) await afterSave()
      return true
    } catch (e) {
      toast.error(humanError(e))
      return false
    } finally {
      setSaving(false)
    }
  }
  const revert = () => setDraft(JSON.parse(base))
  const resetToDefault = async (afterReset) => {
    setSaving(true)
    try {
      await deleteContentRow(key)
      applyContent(key, null)
      const v = prepare(clone(DEFAULTS[key]))
      setDraft(v)
      setBase(JSON.stringify(v))
      setHasRemote(false)
      toast.success('Dikembalikan ke data bawaan.')
      if (afterReset) await afterReset()
    } catch (e) {
      toast.error(humanError(e))
    } finally {
      setSaving(false)
    }
  }
  const baseValue = () => (base ? JSON.parse(base) : null)

  return { status, draft, setDraft, dirty, hasRemote, saving, save, revert, resetToDefault, baseValue, reload: load }
}
