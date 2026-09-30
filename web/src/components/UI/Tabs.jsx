import React, { useState } from 'react'
import { motion } from 'framer-motion'

export const Tabs = ({ defaultValue, children, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)

  const childrenArray = React.Children.toArray(children)
  const triggerChild = childrenArray.find(child => child.type === TabsList)
  const contentChildren = childrenArray.filter(child => child.type === TabsContent)

  return (
    <div className={className}>
      {triggerChild && React.cloneElement(triggerChild, { activeTab, setActiveTab })}
      {contentChildren.map(child =>
        React.cloneElement(child, { key: child.props.value, isActive: activeTab === child.props.value })
      )}
    </div>
  )
}

export const TabsList = ({ children, activeTab, setActiveTab, className = '' }) => {
  return (
    <div className={`flex gap-2 border-b border-dark-700 overflow-x-auto pb-4 md:pb-0 md:border-b-2 ${className}`}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { activeTab, setActiveTab }) : child
      )}
    </div>
  )
}

export const TabsTrigger = ({ value, children, activeTab, setActiveTab }) => {
  const isActive = activeTab === value

  return (
    <motion.button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 md:px-6 md:py-3 font-semibold text-sm md:text-base whitespace-nowrap transition-colors duration-300 relative ${
        isActive
          ? 'text-primary-600'
          : 'text-dark-300 hover:text-white'
      }`}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t-full"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  )
}

export const TabsContent = ({ value, isActive, children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className={`${isActive ? 'block' : 'hidden'} ${className}`}
    >
      {children}
    </motion.div>
  )
}
