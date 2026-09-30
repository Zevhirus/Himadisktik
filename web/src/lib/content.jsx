import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'
import { PROGRAMS, FAQS, CABINETS, SAHITYA_RAKSA } from '../data/mockData'

/**
 * Konten yang bisa diedit admin: programs, faqs, struktur, cabinets.
 * Sumber: tabel `site_content` di Supabase. Kalau belum ada / gagal dimuat,
 * website otomatis memakai data bawaan di src/data/mockData.js.
 */
export const CONTENT_KEYS = ['programs', 'faqs', 'struktur', 'cabinets']
export const DEFAULTS = {
  programs: PROGRAMS,
  faqs: FAQS,
  struktur: SAHITYA_RAKSA.struktur,
  cabinets: CABINETS,
}

const isArr = Array.isArray
// Anggota struktur bisa berupa nama saja (data lama) atau { nama, foto } (data baru, dengan foto)
const isPerson = (x) => typeof x === 'string' || (x && typeof x === 'object' && typeof x.nama === 'string')
const validators = {
  programs: (v) => isArr(v) && v.every((p) => p && typeof p.name === 'string'),
  faqs: (v) => isArr(v) && v.every((f) => f && typeof f.pertanyaan === 'string' && typeof f.jawaban === 'string'),
  cabinets: (v) => isArr(v) && v.every((c) => c && typeof c.name === 'string'),
  struktur: (v) =>
    !!v && isArr(v.pimpinan) && isArr(v.departemen) &&
    v.pimpinan.every((p) => p && typeof p.nama === 'string' && typeof p.jabatan === 'string') &&
    v.pimpinan.some((p) => p.jabatan === 'Ketua Umum') &&
    v.departemen.every(
      (d) =>
        d && typeof d.nama === 'string' && isPerson(d.kepalaDepartemen) && isArr(d.bidang) &&
        d.bidang.every((b) => b && typeof b.nama === 'string' && isArr(b.staff) && b.staff.every(isPerson))
    ),
}
// Data yang bentuknya rusak diabaikan supaya website tidak crash
export const isValidContent = (key, value) => !!validators[key]?.(value)

// Anggota struktur (pimpinan/kepala departemen/staff) bisa berupa string nama (data lama)
// atau { nama, foto } (data baru). Dua helper ini membaca keduanya dengan aman.
export const personName = (x) => (typeof x === 'string' ? x : x?.nama || '')
export const personFoto = (x) => (x && typeof x === 'object' ? x.foto || '' : '')

const sanitize = (raw) => {
  const out = {}
  for (const k of CONTENT_KEYS) if (raw && isValidContent(k, raw[k])) out[k] = raw[k]
  return out
}

const normalizePrograms = (list) =>
  list.map((p) => ({
    ...p,
    name: String(p.name),
    deskripsi: typeof p.deskripsi === 'string' ? p.deskripsi : '',
    status: p.status || 'Coming Soon',
    photos: isArr(p.photos) ? p.photos.filter((x) => x && typeof x.url === 'string') : [],
  }))

// Ketua & Wakil Ketua Umum kabinet aktif selalu mengikuti struktur pengurus
export function deriveLeaders(struktur, cabinets) {
  const find = (j) => struktur.pimpinan.find((p) => p.jabatan === j)?.nama
  const ketum = find('Ketua Umum')
  const wakil = find('Wakil Ketua Umum')
  const idx = cabinets.findIndex((c) => c.current)
  const ci = idx >= 0 ? idx : cabinets.length - 1
  const next = cabinets.map((c, i) =>
    i === ci ? { ...c, ketuaUmum: ketum || c.ketuaUmum, wakilKetuaUmum: wakil || c.wakilKetuaUmum } : c
  )
  return { ketum, wakil, cabinets: next }
}

const CACHE_KEY = 'himadistik:content:v1'
const readCache = () => {
  try {
    const obj = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    return obj && typeof obj === 'object' && obj.data ? sanitize(obj.data) : null
  } catch {
    return null
  }
}
const writeCache = (data) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data })) } catch { /* penyimpanan penuh / diblokir */ }
}

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const cached = useMemo(() => readCache(), [])
  const [remote, setRemote] = useState(cached || {})
  // Kunjungan berikutnya tampil instan dari cache; kunjungan pertama menunggu maks. 2,5 dtk
  const [ready, setReady] = useState(!isSupabaseConfigured || cached !== null)
  const remoteRef = useRef(remote)

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined
    let cancelled = false
    const timer = setTimeout(() => !cancelled && setReady(true), 2500)
    ;(async () => {
      try {
        const { data, error } = await supabase.from('site_content').select('key,value')
        if (!cancelled && !error && data) {
          const next = sanitize(Object.fromEntries(data.map((r) => [r.key, r.value])))
          remoteRef.current = next
          setRemote(next)
          writeCache(next)
        }
      } catch { /* offline: pakai cache / data bawaan */ }
      if (!cancelled) setReady(true)
    })()
    return () => { cancelled = true; clearTimeout(timer) }
  }, [])

  // Dipanggil admin setelah menyimpan, supaya halaman publik langsung ikut berubah
  const applyContent = useCallback((key, value) => {
    const next = { ...remoteRef.current }
    if (value == null) delete next[key]
    else next[key] = value
    remoteRef.current = next
    setRemote(next)
    writeCache(next)
  }, [])

  const value = useMemo(() => {
    const programs = normalizePrograms(remote.programs ?? DEFAULTS.programs)
    const faqs = remote.faqs ?? DEFAULTS.faqs
    const struktur = remote.struktur ?? DEFAULTS.struktur
    const { ketum, cabinets } = deriveLeaders(struktur, remote.cabinets ?? DEFAULTS.cabinets)
    const sahitya = {
      ...SAHITYA_RAKSA,
      struktur,
      ketuaUmum: { ...SAHITYA_RAKSA.ketuaUmum, nama: ketum || SAHITYA_RAKSA.ketuaUmum.nama },
    }
    return { programs, faqs, struktur, cabinets, sahitya, applyContent }
  }, [remote, applyContent])

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-10 h-10 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
      </div>
    )
  }
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export const useContent = () => {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent harus dipakai di dalam <ContentProvider>')
  return ctx
}
