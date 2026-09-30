// Utility Functions

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('id-ID', options)
}

export const formatDateShort = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(date).toLocaleDateString('id-ID', options)
}

export const slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export const getStatusColor = (status) => {
  const statusMap = {
    'Ongoing': 'bg-green-500/20 text-green-400',
    'Completed': 'bg-blue-500/20 text-blue-400',
    'Coming Soon': 'bg-yellow-500/20 text-yellow-400',
    'Cancelled': 'bg-red-500/20 text-red-400',
    'Planning': 'bg-purple-500/20 text-purple-400',
  }
  return statusMap[status] || 'bg-gray-500/20 text-gray-400'
}

export const getStatusBadgeClass = (status) => {
  const classMap = {
    'Ongoing': 'badge-success',
    'Completed': 'badge-info',
    'Coming Soon': 'badge-warning',
    'Cancelled': 'badge-error',
    'Planning': 'badge-primary',
  }
  return classMap[status] || 'badge-default'
}

export const formatPhone = (phone) => {
  // Format Indonesian phone numbers
  if (phone.startsWith('0')) {
    return '+62' + phone.substring(1)
  }
  return phone
}

export const getYearsActive = (startYear) => {
  const currentYear = new Date().getFullYear()
  return currentYear - startYear + 1
}

export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

export const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename || 'download'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

export const generateId = () => {
  return `_${Math.random().toString(36).substr(2, 9)}`
}

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+62|0)[0-9]{9,12}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const debounce = (func, delay = 300) => {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export const throttle = (func, limit = 300) => {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.substr(1, 2), 16)
  const g = parseInt(hexColor.substr(3, 2), 16)
  const b = parseInt(hexColor.substr(5, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#FFFFFF'
}

export const getRandomColor = () => {
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 'bg-teal-500']
  return colors[Math.floor(Math.random() * colors.length)]
}

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const arrayToObject = (array, key = 'id') => {
  return array.reduce((acc, item) => {
    acc[item[key]] = item
    return acc
  }, {})
}

export const objectToArray = (obj) => {
  return Object.keys(obj).map(key => ({
    key,
    ...obj[key],
  }))
}

export const filterBySearch = (items, searchTerm, fields = ['name', 'title', 'description']) => {
  const lowerSearch = searchTerm.toLowerCase()
  return items.filter(item =>
    fields.some(field =>
      item[field]?.toLowerCase().includes(lowerSearch)
    )
  )
}

export const sortBy = (items, key, order = 'asc') => {
  return [...items].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1
    return 0
  })
}

export const groupBy = (items, key) => {
  return items.reduce((acc, item) => {
    const groupKey = item[key]
    if (!acc[groupKey]) {
      acc[groupKey] = []
    }
    acc[groupKey].push(item)
    return acc
  }, {})
}

export const unique = (items, key) => {
  return [...new Map(items.map(item => [item[key], item])).values()]
}

export const paginate = (items, page = 1, pageSize = 10) => {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  return {
    data: items.slice(startIndex, endIndex),
    pagination: {
      page,
      pageSize,
      totalItems: items.length,
      totalPages: Math.ceil(items.length / pageSize),
      hasNextPage: endIndex < items.length,
      hasPrevPage: page > 1,
    },
  }
}

export const merge = (target, source) => {
  const output = { ...target }
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] })
        else
          output[key] = merge(target[key], source[key])
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}

export const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item)
}
