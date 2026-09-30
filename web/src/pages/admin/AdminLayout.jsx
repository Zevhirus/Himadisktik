import React, { useCallback, useEffect, useRef } from 'react'
import { Link, NavLink, Navigate, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, MessageSquare, CalendarCheck, HelpCircle, Users, Crown, LogOut, ExternalLink, ShieldAlert, DatabaseZap,
} from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { DirtyContext, Btn, Loading } from './ui'

const NAV = [
  { to: 'dashboard', label: 'Ringkasan', icon: LayoutDashboard },
  { to: 'kritik-saran', label: 'Kritik & Saran', icon: MessageSquare },
  { to: 'program-kerja', label: 'Program Kerja', icon: CalendarCheck },
  { to: 'faq', label: 'FAQ', icon: HelpCircle },
  { to: 'pengurus', label: 'Pengurus', icon: Users },
  { to: 'kabinet', label: 'Kabinet', icon: Crown },
]

const Screen = ({ icon: Icon, title, children }) => (
  <div className="min-h-screen bg-black flex items-center justify-center px-4">
    <div className="max-w-lg w-full text-center border border-dark-800 rounded-xl p-8">
      <Icon className="mx-auto text-primary-500 mb-4" size={40} />
      <h1 className="text-2xl font-bold text-white mb-3">{title}</h1>
      <div className="text-dark-300 space-y-3 text-sm leading-relaxed">{children}</div>
    </div>
  </div>
)

export default function AdminLayout() {
  const auth = useAuth()
  const dirtyRef = useRef(false)
  const setDirty = useCallback((v) => { dirtyRef.current = v }, [])

  // peringatan bila menutup tab saat ada perubahan belum disimpan
  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (dirtyRef.current) { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [])

  const guard = (e) => {
    if (dirtyRef.current && !window.confirm('Ada perubahan yang belum disimpan. Tinggalkan halaman ini?')) e.preventDefault()
  }

  if (!auth.configured) {
    return (
      <Screen icon={DatabaseZap} title="Supabase belum dihubungkan">
        <p>Panel admin membutuhkan database Supabase. Isi <code className="text-primary-400">VITE_SUPABASE_URL</code> dan <code className="text-primary-400">VITE_SUPABASE_ANON_KEY</code> di file <code className="text-primary-400">.env.local</code>, lalu jalankan ulang.</p>
        <p>Langkah lengkapnya ada di <code className="text-primary-400">ADMIN_GUIDE.md</code>.</p>
        <Link to="/" className="inline-block text-primary-500 hover:text-primary-400 font-semibold">← Kembali ke website</Link>
      </Screen>
    )
  }
  if (auth.loading || (auth.session && auth.adminState === 'unknown')) {
    return <div className="min-h-screen bg-black"><Loading text="Memeriksa akses..." /></div>
  }
  if (!auth.session) return <Navigate to="/admin/login" replace />
  if (!auth.isAdmin) {
    return (
      <Screen icon={ShieldAlert} title="Akun ini bukan admin">
        <p><strong className="text-white">{auth.user?.email}</strong> berhasil login, tetapi emailnya belum terdaftar di tabel <code className="text-primary-400">admins</code>.</p>
        <p>Minta admin utama menambahkannya, atau keluar dan masuk dengan akun lain.</p>
        <Btn variant="primary" onClick={() => auth.signOut()}>Keluar</Btn>
      </Screen>
    )
  }

  return (
    <DirtyContext.Provider value={{ setDirty }}>
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-dark-800 bg-black sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center gap-3">
            <img src="/images/logo-himadistik.png" alt="" className="w-9 h-9 object-contain" />
            <span className="font-bold hidden sm:block">Admin HIMADISTIK</span>
            <span className="flex-1" />
            <span className="text-xs text-dark-400 hidden md:block truncate max-w-[220px]">{auth.user?.email}</span>
            <Link
              to="/"
              onClick={guard}
              className="inline-flex items-center gap-1.5 text-sm text-dark-200 hover:text-primary-400 px-2 py-1"
            >
              <ExternalLink size={15} /> <span className="hidden sm:inline">Lihat website</span>
            </Link>
            <Btn variant="outline" icon={LogOut} onClick={(e) => { if (dirtyRef.current && !window.confirm('Ada perubahan yang belum disimpan. Tetap keluar?')) return; auth.signOut() }}>
              Keluar
            </Btn>
          </div>
          <nav className="max-w-6xl mx-auto px-4 md:px-8 flex gap-1 overflow-x-auto" aria-label="Menu admin">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={guard}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    isActive ? 'border-primary-500 text-primary-400' : 'border-transparent text-dark-300 hover:text-white'
                  }`
                }
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 pb-32">
          <Outlet />
        </main>
      </div>
    </DirtyContext.Provider>
  )
}
