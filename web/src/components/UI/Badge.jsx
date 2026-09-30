import React from 'react'
import { motion } from 'framer-motion'

export const Badge = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary-500/20 text-primary-300',
    accent: 'bg-dark-800 text-dark-200',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
    gray: 'bg-dark-800 text-dark-100',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs font-medium',
    md: 'px-3 py-1.5 text-sm font-medium',
    lg: 'px-4 py-2 text-base font-semibold',
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center rounded-full font-medium transition-all duration-300 ${
        variants[variant]
      } ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.span>
  )
}

export const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    'Ongoing': { variant: 'success', label: 'Sedang Berlangsung' },
    'Coming Soon': { variant: 'warning', label: 'Coming Soon' },
    'Completed': { variant: 'info', label: 'Selesai' },
    'Cancelled': { variant: 'danger', label: 'Dibatalkan' },
    'Planning': { variant: 'primary', label: 'Perencanaan' },
  }

  const config = statusConfig[status] || statusConfig['Planning']

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
