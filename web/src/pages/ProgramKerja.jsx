import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardBody } from '../components/UI/Card'
import { Badge, StatusBadge } from '../components/UI/Badge'
import { useContent } from '../lib/content'
import Lightbox from '../components/UI/Lightbox'
import { Filter, Search } from 'lucide-react'

function ProgramKerja() {
  const { programs: PROGRAMS } = useContent()
  const [lightbox, setLightbox] = useState(null) // { photos, index, title }
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const statusLabel = {
    All: 'Semua',
    Ongoing: 'Sedang Berlangsung',
    Completed: 'Selesai',
    'Coming Soon': 'Coming Soon',
  }
  const uniqueStatuses = ['All', ...new Set(PROGRAMS.map(p => p.status))]

  const filteredPrograms = useMemo(() => {
    const q = search.trim().toLowerCase()
    return PROGRAMS.filter(program => {
      const matchStatus = filter === 'All' || program.status === filter
      const matchSearch =
        program.name.toLowerCase().includes(q) ||
        program.deskripsi.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [PROGRAMS, filter, search])

  return (
    <div className="pt-20 pb-12">
      {/* Hero */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Program Kerja HIMADISTIK
            </h1>
            <p className="text-xl text-dark-300">
              Berbagai program yang dijalankan HIMADISTIK untuk mempererat kebersamaan, menumbuhkan kepedulian, dan mengembangkan mahasiswa Administrasi Bisnis Sektor Publik
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 space-y-6"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
              <input
                type="text"
                placeholder="Cari program kerja..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Filter size={20} className="text-dark-300 self-center" />
              {uniqueStatuses.map(status => (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    filter === status
                      ? 'bg-primary-600 text-white shadow-soft'
                      : 'bg-dark-800 text-dark-200 hover:bg-dark-700'
                  }`}
                >
                  {statusLabel[status] || status}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Programs Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          >
            {filteredPrograms.map((program, idx) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <Card hoverable className="h-full">
                  <CardBody>
                    <div className="mb-4 flex justify-between items-start gap-4">
                      <h3 className="text-xl font-bold text-white">{program.name}</h3>
                      <StatusBadge status={program.status} />
                    </div>
                    <p className="text-dark-200 leading-relaxed">{program.deskripsi}</p>

                    {program.photos.length > 0 && (
                      <div className="mt-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-dark-400 mb-2">
                          Dokumentasi · {program.photos.length} foto
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {program.photos.slice(0, 3).map((ph, i) => (
                            <button
                              key={ph.url}
                              type="button"
                              onClick={() => setLightbox({ photos: program.photos, index: i, title: program.name })}
                              className="relative aspect-video rounded-lg overflow-hidden border border-dark-800 hover:border-primary-500 transition-colors"
                              aria-label={`Buka foto ${i + 1} ${program.name}`}
                            >
                              <img
                                src={ph.url}
                                alt={ph.caption || `Dokumentasi ${program.name}`}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                              {i === 2 && program.photos.length > 3 && (
                                <span className="absolute inset-0 bg-black/70 flex items-center justify-center text-white font-bold">
                                  +{program.photos.length - 3}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredPrograms.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-dark-300 text-lg">Tidak ada program yang cocok dengan pencarianmu</p>
            </motion.div>
          )}
        </div>
      </section>

      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          index={lightbox.index}
          title={lightbox.title}
          onIndex={(i) => setLightbox((l) => ({ ...l, index: i }))}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  )
}

export default ProgramKerja
