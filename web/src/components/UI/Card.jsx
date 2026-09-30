import React from 'react'
import { motion } from 'framer-motion'

export const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4 } : {}}
      transition={{ duration: 0.3 }}
      className={`bg-black rounded-xl border border-dark-800 shadow-soft hover:shadow-soft-lg transition-all duration-300 p-6 ${
        hoverable ? 'cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const CardHeader = ({ title, subtitle, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
    {subtitle && <p className="text-sm text-dark-400 mt-1">{subtitle}</p>}
  </div>
)

export const CardBody = ({ children, className = '' }) => (
  <div className={`${className}`}>{children}</div>
)

export const CardFooter = ({ children, className = '' }) => (
  <div className={`pt-4 border-t border-dark-800 mt-4 ${className}`}>
    {children}
  </div>
)
