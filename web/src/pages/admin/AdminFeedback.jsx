import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Search, Download, CheckCheck, Eye, EyeOff, Trash2, UserX } from 'lucide-react'
import { listFeedback, setFeedbackRead, deleteFeedback, markAllFeedbackRead } from '../../lib/adminApi'
import { humanError } from '../../lib/supabase'
import { PageHeader, Loading, ErrorBox, Btn, Input, Select } from './ui'

const CAT_STYLE = {
  Kritik: 'bg-red-500/15 text-red-400',
  Saran: 'bg-blue-500/15 text-blue-400',
  Aspirasi: 'bg-green-500/15 text-green-400',
  Pertanyaan: 'bg-yellow-500/15 text-yellow-400',
}
const fmt = (iso) => new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })

// Cegah "CSV injection": sel yang diawali = + - @ dianggap rumus oleh Excel
const csvCell = (v) => {
  let s = String(v ?? '')
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return `"${s.replace(/"/g, '""')}"`
}

export default function AdminFeedback() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)
  const [show, setShow] = useState('all') // all | unread | read
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState(null)

  const load = async () => {
    setError(null)
    try { setItems(await listFeedback()) } catch (e) { setError(humanError(e)) }
  }
  useEffect(() => { load() }, [])

  const unread = useMemo(() => (items || []).filter((i) => !i.is_read).length, [items])
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return (items || []).filter((i) =>
      (show === 'all' || (show === 'unread' ? !i.is_read : i.is_read)) &&
      (cat === 'all' || i.category === cat) &&
      (!term || [i.message, i.name, i.contact].some((f) => (f || '').toLowerCase().includes(term)))
    )
  }, [items, show, cat, q])

  const run = async (id, fn) => {
    setBusy(id)
    try { await fn() } catch (e) { toast.error(humanError(e)) } finally { setBusy(null) }
  }
  const toggleRead = (it) =>
    run(it.id, async () => {
      await setFeedbackRead(it.id, !it.is_read)
      setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, is_read: !it.is_read } : x)))
    })
  const remove = (it) => {
    if (!window.confirm('Hapus pesan ini secara permanen?')) return
    run(it.id, async () => {
      await deleteFeedback(it.id)
      setItems((prev) => prev.filter((x) => x.id !== it.id))
      toast.success('Pesan dihapus.')
    })
  }
  const readAll = () =>
    run('all', async () => {
      await markAllFeedbackRead()
      setItems((prev) => prev.map((x) => ({ ...x, is_read: true })))
      toast.success('Semua pesan ditandai sudah dibaca.')
    })

  const exportCsv = () => {
    const head = ['Tanggal', 'Kategori', 'Nama', 'Kontak', 'Anonim', 'Status', 'Pesan']
    const rows = filtered.map((i) => [
      fmt(i.created_at), i.category, i.name || '', i.contact || '', i.anonymous ? 'Ya' : 'Tidak', i.is_read ? 'Dibaca' : 'Baru', i.message,
    ])
    const csv = '\uFEFF' + [head, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `kritik-saran-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (error) return <ErrorBox message={error} onRetry={load} />
  if (!items) return <Loading />

  return (
    <>
      <PageHeader
        title="Kritik & Saran"
        subtitle={`${items.length} pesan masuk, ${unread} belum dibaca.`}
        actions={
          <>
            <Btn variant="outline" icon={Download} onClick={exportCsv} disabled={!filtered.length}>Unduh CSV</Btn>
            <Btn variant="primary" icon={CheckCheck} onClick={readAll} disabled={!unread || busy === 'all'}>Tandai semua dibaca</Btn>
          </>
        }
      />

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={16} />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari isi pesan, nama, kontak..." className="pl-9" aria-label="Cari pesan" />
        </div>
        <Select value={show} onChange={(e) => setShow(e.target.value)} className="w-auto" aria-label="Filter status">
          <option value="all">Semua status</option>
          <option value="unread">Belum dibaca</option>
          <option value="read">Sudah dibaca</option>
        </Select>
        <Select value={cat} onChange={(e) => setCat(e.target.value)} className="w-auto" aria-label="Filter kategori">
          <option value="all">Semua kategori</option>
          {Object.keys(CAT_STYLE).map((c) => <option key={c}>{c}</option>)}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-dark-400 py-16 border border-dashed border-dark-800 rounded-xl">
          {items.length === 0 ? 'Belum ada pesan masuk.' : 'Tidak ada pesan yang cocok dengan filter.'}
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((it) => (
            <li
              key={it.id}
              className={`rounded-xl border p-5 bg-black ${it.is_read ? 'border-dark-800' : 'border-primary-500/50'}`}
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {!it.is_read && <span className="w-2.5 h-2.5 rounded-full bg-primary-500" aria-label="Belum dibaca" />}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${CAT_STYLE[it.category] || 'bg-dark-800 text-dark-200'}`}>{it.category}</span>
                <span className="text-xs text-dark-400">{fmt(it.created_at)}</span>
                <span className="flex-1" />
                <Btn variant="ghost" icon={it.is_read ? EyeOff : Eye} onClick={() => toggleRead(it)} disabled={busy === it.id} className="!px-3 !py-1.5">
                  {it.is_read ? 'Tandai belum dibaca' : 'Tandai dibaca'}
                </Btn>
                <Btn variant="danger" icon={Trash2} onClick={() => remove(it)} disabled={busy === it.id} className="!px-3 !py-1.5">Hapus</Btn>
              </div>
              <p className="text-white whitespace-pre-wrap break-words leading-relaxed">{it.message}</p>
              <p className="mt-3 text-sm text-dark-400 flex items-center gap-2">
                {it.anonymous ? (
                  <><UserX size={14} /> Anonim</>
                ) : (
                  <>Dari: <span className="text-dark-200">{it.name || '(tanpa nama)'}</span>{it.contact && <> · <span className="text-dark-200 break-all">{it.contact}</span></>}</>
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
