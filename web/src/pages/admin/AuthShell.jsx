import React from 'react'
import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../../lib/auth'

// Kode login hanya dimuat saat membuka /admin — pengunjung biasa tidak pernah menjalankannya
export default function AuthShell() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
