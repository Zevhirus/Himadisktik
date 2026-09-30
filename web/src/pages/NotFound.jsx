import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <motion.h1
          className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          404
        </motion.h1>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Halaman Tidak Ditemukan
        </h2>

        <p className="text-lg text-dark-300 mb-8">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. Silakan kembali ke halaman utama.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold flex items-center gap-2 justify-center hover:shadow-soft-lg transition-all"
            >
              <Home size={20} /> Kembali ke Beranda
            </motion.button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold flex items-center gap-2 justify-center hover:bg-primary-500/10 transition-all"
          >
            <ArrowLeft size={20} /> Kembali
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound
