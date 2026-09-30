// Application Configuration untuk HIMADISTIK
export const APP_CONFIG = {
  appName: 'HIMADISTIK',
  appFullName: 'Himpunan Mahasiswa Administrasi Bisnis Sektor Publik',
  tagline: 'Bersama, Berkarya, Bertumbuh',
  description: 'Wadah kolaborasi, aspirasi, dan pengembangan mahasiswa Program Studi Administrasi Bisnis Sektor Publik Politeknik STIA LAN Makassar',
  
  // Branding - WARNA HITAM & ORANYE
  colors: {
    primary: '#f97316', // Orange-500 (Oranye HIMADISTIK)
    accent: '#1f2937', // Dark-800 (Hitam)
    dark: '#000000',
    light: '#f9fafb',
  },

  // Contact Information
  contact: {
    email: 'himadistikmks@gmail.com',
    address: 'Jl. Andi Pangerang Pettarani No. 61, Makassar 90222, Sulawesi Selatan',
    campus: 'Politeknik STIA LAN Makassar',
  },

  // Social Media
  social: {
    instagram: 'https://www.instagram.com/himadistik.polteklanmks',
    instagramHandle: '@himadistik.polteklanmks',
    videoProfil: 'https://drive.google.com/drive/folders/1WV_oagb3eOi2Wgjj_zq_s9eTjM2NU4dy?usp=sharing',
    email: 'himadistikmks@gmail.com',
  },

  // Navigation
  nav: [
    { label: 'Beranda', path: '/' },
    { label: 'HIMADISTIK', path: '/himadistik' },
    { label: 'Sahitya Raksa', path: '/sahitya-raksa' },
    { label: 'Informasi', path: '/informasi' },
    { label: 'Program Kerja', path: '/program-kerja' },
    { label: 'Kritik & Saran', path: '/kritik-saran' },
    { label: 'QnA', path: '/qna' },
  ],

  // Admin
  admin: {
    loginPath: '/admin/login',
    dashboardPath: '/admin/dashboard',
  },
}

// Feature Flags
export const FEATURES = {
  darkMode: false,
  adminDashboard: true,
  searchFunction: true,
  filterByStatus: true,
  galleryLightbox: true,
  backToTop: true,
  newsletter: true,
}

// Animation Config
export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
  },
  delay: {
    staggerChildren: 0.1,
  },
}
