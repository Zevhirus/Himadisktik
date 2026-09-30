import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, CalendarCheck, HelpCircle, Users, Crown, ImageIcon, ArrowRight } from 'lucide-react'
import { useContent } from '../../lib/content'
import { countFeedback, listContentMeta } from '../../lib/adminApi'
import { humanError } from '../../lib/supabase'
import { PageHeader, Loading, ErrorBox } from './ui'

const fmt = (iso) =>
  iso ? new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : null

export default function AdminDashboard() {
  const { programs, faqs, struktur, cabinets } = useContent()
  const [stats, setStats] = useState(null)
  const [meta, setMeta] = useState({})
  const [error, setError] = useState(null)

  const load = async () => {
    setError(null)
    try {
      const [fb, rows] = await Promise.all([countFeedback(), listContentMeta()])
      setStats(fb)
      setMeta(Object.fromEntries(rows.map((r) => [r.key, r])))
    } catch (e) {
      setError(humanError(e))
    }
  }
  useEffect(() => { load() }, [])

  if (error) return <ErrorBox message={error} onRetry={load} />
  if (!stats) return <Loading />

  const photos = programs.reduce((n, p) => n + p.photos.length, 0)
  const staff = struktur.departemen.reduce((n, d) => n + d.bidang.reduce((m, b) => m + b.staff.length, 0), 0)
  const people = struktur.pimpinan.length + struktur.departemen.length + staff

  const cards = [
    {
      to: '/admin/kritik-saran', icon: MessageSquare, title: 'Kritik & Saran',
      big: stats.unread, bigLabel: 'belum dibaca', sub: `${stats.total} pesan masuk`, highlight: stats.unread > 0,
    },
    { to: '/admin/program-kerja', icon: CalendarCheck, title: 'Program Kerja', big: programs.length, bigLabel: 'program', sub: `${photos} foto dokumentasi`, key: 'programs' },
    { to: '/admin/faq', icon: HelpCircle, title: 'FAQ', big: faqs.length, bigLabel: 'pertanyaan', sub: 'Tampil di halaman QnA', key: 'faqs' },
    { to: '/admin/pengurus', icon: Users, title: 'Pengurus', big: people, bigLabel: 'orang', sub: `${struktur.departemen.length} departemen`, key: 'struktur' },
    { to: '/admin/kabinet', icon: Crown, title: 'Kabinet', big: cabinets.length, bigLabel: 'kabinet', sub: 'Riwayat kepengurusan', key: 'cabinets' },
  ]

  return (
    <>
      <PageHeader title="Ringkasan" subtitle="Kelola konten HIMADISTIK. Perubahan yang disimpan langsung tampil di website." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ to, icon: Icon, title, big, bigLabel, sub, key, highlight }) => (
          <Link
            key={to}
            to={to}
            className={`group p-6 rounded-xl border bg-black transition-colors hover:border-primary-500 ${highlight ? 'border-primary-500/60' : 'border-dark-800'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-lg bg-primary-500/20 text-primary-500 flex items-center justify-center"><Icon size={22} /></div>
              <ArrowRight size={18} className="text-dark-500 group-hover:text-primary-500 transition-colors" />
            </div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="mt-2">
              <span className={`text-4xl font-bold ${highlight ? 'text-primary-500' : 'text-white'}`}>{big}</span>{' '}
              <span className="text-dark-300 text-sm">{bigLabel}</span>
            </p>
            <p className="text-sm text-dark-400 mt-1">{sub}</p>
            {key && (
              <p className="text-xs text-dark-500 mt-3 pt-3 border-t border-dark-800">
                {meta[key] ? `Diubah ${fmt(meta[key].updated_at)}${meta[key].updated_by ? ` oleh ${meta[key].updated_by}` : ''}` : 'Masih memakai data bawaan'}
              </p>
            )}
          </Link>
        ))}
      </div>
      <p className="mt-8 text-sm text-dark-400 flex items-center gap-2">
        <ImageIcon size={16} /> Foto dokumentasi diunggah lewat menu <Link to="/admin/program-kerja" className="text-primary-500 hover:text-primary-400">Program Kerja</Link>.
      </p>
    </>
  )
}
