import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useScrollPosition } from '../hooks/useCustomHooks'

function BackToTop() {
  const scrollPosition = useScrollPosition()
  const isVisible = scrollPosition > 300

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-40 p-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to top"
        >
          <ArrowUp
            size={20}
            className="group-hover:translate-y-0.5 transition-transform duration-300"
          />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default BackToTop
