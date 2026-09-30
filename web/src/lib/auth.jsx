import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'

/**
 * Login admin lewat Supabase Auth (email + password).
 * Akun login SAJA tidak cukup: emailnya juga harus ada di tabel `admins`
 * (dicek oleh fungsi SQL is_admin(), dan juga oleh setiap aturan keamanan database).
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [adminState, setAdminState] = useState('unknown') // unknown | yes | no
  const [loading, setLoading] = useState(isSupabaseConfigured)

  const checkAdmin = useCallback(async (sess) => {
    if (!sess) { setAdminState('no'); return }
    setAdminState('unknown')
    try {
      const { data, error } = await supabase.rpc('is_admin')
      setAdminState(!error && data === true ? 'yes' : 'no')
    } catch {
      setAdminState('no')
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined
    let active = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session)
      await checkAdmin(data.session)
      if (active) setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess)
      // jangan memanggil Supabase langsung di dalam callback ini (bisa deadlock)
      setTimeout(() => checkAdmin(sess), 0)
    })
    return () => { active = false; sub.subscription.unsubscribe() }
  }, [checkAdmin])

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) throw error
    return data
  }, [])
  const signOut = useCallback(() => supabase.auth.signOut(), [])

  const value = useMemo(
    () => ({
      configured: isSupabaseConfigured,
      session,
      user: session?.user || null,
      adminState,
      isAdmin: adminState === 'yes',
      loading,
      signIn,
      signOut,
    }),
    [session, adminState, loading, signIn, signOut]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  return ctx
}
