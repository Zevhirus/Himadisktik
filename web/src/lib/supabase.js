import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Nilai contoh / kosong dianggap "belum diisi"
const filled = (v) => typeof v === 'string' && v.trim() !== '' && !/your[-_ ]|your_/i.test(v)

export const isSupabaseConfigured = filled(url) && filled(key) && /^https?:\/\//.test(url)

// Kalau env belum diisi, website tetap jalan memakai data bawaan (supabase = null).
export const supabase = isSupabaseConfigured
  ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true } })
  : null

export const PHOTO_BUCKET = 'dokumentasi'

// Ubah error teknis jadi pesan yang bisa dimengerti admin
export function humanError(e) {
  const msg = String(e?.message || e || '')
  if (/row-level security|violates row|permission denied|not allowed/i.test(msg))
    return 'Akses ditolak. Pastikan emailmu terdaftar di tabel "admins".'
  if (/jwt expired|invalid jwt|not authenticated/i.test(msg)) return 'Sesi habis. Silakan login ulang.'
  if (/failed to fetch|networkerror|network request failed|load failed/i.test(msg))
    return 'Tidak bisa terhubung ke server. Periksa koneksi internet.'
  if (/duplicate key/i.test(msg)) return 'Data sudah ada.'
  return msg || 'Terjadi kesalahan.'
}
