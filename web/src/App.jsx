import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layouts
import MainLayout from './layouts/MainLayout'
import { ContentProvider } from './lib/content'

// Pages - Lazy loaded
const Home = React.lazy(() => import('./pages/Home'))
const HimadistikProfile = React.lazy(() => import('./pages/HimadistikProfile'))
const SahityaRaksaProfile = React.lazy(() => import('./pages/SahityaRaksaProfile'))
const InformasiAbsp = React.lazy(() => import('./pages/InformasiAbsp'))
const ProgramKerja = React.lazy(() => import('./pages/ProgramKerja'))
const KritikSaran = React.lazy(() => import('./pages/KritikSaran'))
const QnA = React.lazy(() => import('./pages/QnA'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

// Admin Pages
const AuthShell = React.lazy(() => import('./pages/admin/AuthShell'))
const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout'))
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'))
const AdminFeedback = React.lazy(() => import('./pages/admin/AdminFeedback'))
const AdminPrograms = React.lazy(() => import('./pages/admin/AdminPrograms'))
const AdminFaqs = React.lazy(() => import('./pages/admin/AdminFaqs'))
const AdminStruktur = React.lazy(() => import('./pages/admin/AdminStruktur'))
const AdminKabinet = React.lazy(() => import('./pages/admin/AdminKabinet'))

// Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="w-12 h-12 bg-primary-500 rounded-full animate-bounce"></div>
      <p className="text-dark-300">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black flex flex-col">
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              style: {
                background: '#10b981',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
              },
            },
          }}
        />

        {/* Routes */}
        <ContentProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Main Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/himadistik" element={<HimadistikProfile />} />
              <Route path="/sahitya-raksa" element={<SahityaRaksaProfile />} />
              <Route path="/informasi" element={<InformasiAbsp />} />
              <Route path="/program-kerja" element={<ProgramKerja />} />
              <Route path="/kritik-saran" element={<KritikSaran />} />
              <Route path="/qna" element={<QnA />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AuthShell />}>
              <Route path="login" element={<AdminLogin />} />
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="kritik-saran" element={<AdminFeedback />} />
                <Route path="program-kerja" element={<AdminPrograms />} />
                <Route path="faq" element={<AdminFaqs />} />
                <Route path="pengurus" element={<AdminStruktur />} />
                <Route path="kabinet" element={<AdminKabinet />} />
              </Route>
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </ContentProvider>
      </div>
    </Router>
  )
}

export default App
