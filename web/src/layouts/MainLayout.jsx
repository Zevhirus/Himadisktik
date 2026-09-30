import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'
import { useScrollPosition } from '../hooks/useCustomHooks'

function MainLayout() {
  const scrollPosition = useScrollPosition()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial page load
    setIsLoading(false)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Back to Top Button */}
      <BackToTop />

      {/* Scroll Indicator */}
      {scrollPosition > 100 && (
        <div className="fixed bottom-20 right-8 md:bottom-24 md:right-12 z-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="text-xs text-dark-400 pointer-events-none"
          >
            {`${Math.round((scrollPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 100)}%`}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default MainLayout
