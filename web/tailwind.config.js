/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - Black & Orange
        primary: {
          DEFAULT: '#f97316', // supaya `bg-primary`, `text-primary`, `border-primary` (tanpa angka) bisa dipakai
          50: '#fef5f0',
          100: '#fde6db',
          200: '#fad4b9',
          300: '#f7b88d',
          400: '#f39250',
          500: '#f97316', // Main Orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a360e',
          900: '#7c2d0f',
        },
        accent: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#000000', // Pure Black
        },
        // Dark palette (dipakai di globals.css: text-dark-900, bg-dark-100, dll)
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#000000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // 'display' dipakai di globals.css untuk h1-h6 (font-display)
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in',
        slideUp: 'slideUp 0.5s ease-out',
        float: 'float 6s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(249, 115, 22, 0.5)',
        'glow-lg': '0 0 40px rgba(249, 115, 22, 0.6)',
        // 'soft' & 'soft-lg' dipakai di globals.css (.card, .btn-primary, dll)
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -5px rgba(0, 0, 0, 0.1), 0 20px 30px -5px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1f2937 0%, #000000 100%)',
        'gradient-mix': 'linear-gradient(135deg, #f97316 0%, #1f2937 100%)',
      },
    },
  },
  plugins: [],
}
