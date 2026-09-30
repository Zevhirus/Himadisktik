import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogIn } from 'lucide-react'
import { APP_CONFIG } from '../config/app.config'
import { useScrollPosition } from '../hooks/useCustomHooks'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollPosition = useScrollPosition()
  const location = useLocation()

  useEffect(() => {
    setIsScrolled(scrollPosition > 50)
  }, [scrollPosition])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const isActive = (path) => {
    return location.pathname === path
  }

  const navItems = APP_CONFIG.nav

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black shadow-soft-lg backdrop-blur-md'
          : 'bg-black/50 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.img
              src="/images/logo-himadistik.png"
              alt="Logo HIMADISTIK"
              className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full group-hover:shadow-glow transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-white text-sm md:text-base">HIMADISTIK</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 group ${
                  isActive(item.path)
                    ? 'text-primary-600'
                    : 'text-dark-200 hover:text-primary-600'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-1 left-3 right-3 h-0.5 bg-primary-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button & Admin Link */}
          <div className="flex items-center gap-2 md:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-semibold text-sm hover:shadow-soft-lg transition-all duration-300"
            >
              Jelajahi HIMADISTIK
            </motion.button>

            <motion.a
              href="/admin/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 p-2 text-dark-200 hover:text-primary-600 transition-colors"
              title="Admin Login"
            >
              <LogIn size={20} />
            </motion.a>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="lg:hidden p-2 text-dark-200 hover:text-primary-600"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-dark-800 bg-black/95 backdrop-blur-md"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`block px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-primary-500/20 text-primary-600'
                      : 'text-dark-200 hover:bg-dark-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-dark-800 mt-2">
                <button className="w-full px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-semibold text-sm hover:shadow-soft-lg transition-all duration-300">
                  Jelajahi HIMADISTIK
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
