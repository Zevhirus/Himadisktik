import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, DatabaseZap } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { Btn, Input } from './ui'

const loginError = (e) => {
  const m = String(e?.message || '')
  if (/invalid login credentials/i.test(m)) return 'Email atau password salah.'
  if (/email not confirmed/i.test(m)) return 'Email belum dikonfirmasi. Konfirmasi dulu lewat Supabase → Authentication → Users.'
  if (/rate limit|too many|429/i.test(m)) return 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.'
  if (/failed to fetch|network/i.test(m)) return 'Tidak bisa terhubung ke server. Periksa koneksi internet.'
  return m || 'Gagal masuk.'
}

export default function AdminLogin() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (auth.session && auth.isAdmin) return <Navigate to="/admin/dashboard" replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await auth.signIn(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(loginError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/images/logo-himadistik.png" alt="Logo HIMADISTIK" className="w-20 h-20 object-contain mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-1">HIMADISTIK Admin</h1>
          <p className="text-dark-300">Masuk untuk mengelola konten website</p>
        </div>

        <div className="bg-black border border-dark-800 rounded-xl p-8">
          {!auth.configured ? (
            <div className="text-center text-sm text-dark-300 space-y-3">
              <DatabaseZap className="mx-auto text-primary-500" size={32} />
              <p className="text-white font-semibold">Supabase belum dihubungkan</p>
              <p>Isi <code className="text-primary-400">.env.local</code> sesuai <code className="text-primary-400">ADMIN_GUIDE.md</code>, lalu jalankan ulang website.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="adm-email" className="block text-sm font-semibold text-dark-200 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
                  <Input id="adm-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-11 py-2.5" />
                </div>
              </div>
              <div>
                <label htmlFor="adm-pass" className="block text-sm font-semibold text-dark-200 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
                  <Input id="adm-pass" type={show ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-11 pr-11 py-2.5" />
                  <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {error && <p role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>}
              <Btn type="submit" variant="primary" disabled={loading || !email || !password} className="w-full py-2.5">
                {loading ? 'Memeriksa...' : 'Masuk'}
              </Btn>
            </form>
          )}
        </div>

        <p className="text-center text-dark-300 text-sm mt-6">
          Kembali ke <Link to="/" className="text-primary-500 hover:text-primary-400 font-semibold">Website Utama</Link>
        </p>
      </motion.div>
    </div>
  )
}
