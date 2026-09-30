import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, CardBody } from '../components/UI/Card'
import { Badge, StatusBadge } from '../components/UI/Badge'
import { ABSP_INFO } from '../data/mockData'
import { useContent } from '../lib/content'
import { GraduationCap, MapPin, ArrowRight, Award, Layers } from 'lucide-react'

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
  viewport: { once: true },
})

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${ABSP_INFO.kampus} ${ABSP_INFO.alamat}`
)}`

function InformasiAbsp() {
  const { programs: PROGRAMS } = useContent()
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
            <Badge variant="primary" size="lg" className="mb-5">
              <GraduationCap size={18} className="mr-2" /> {ABSP_INFO.kampus}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Program Studi ABSP</h1>
            <p className="text-xl md:text-2xl text-primary-500 font-semibold mb-6 max-w-3xl">
              {ABSP_INFO.nama}
            </p>
            <p className="text-lg text-dark-200 leading-relaxed max-w-4xl">{ABSP_INFO.deskripsi}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Pola Pembelajaran */}
          <motion.div {...reveal()}>
            <div className="flex items-center gap-3 mb-6">
              <Layers className="text-primary-500" size={28} />
              <h2 className="text-3xl font-bold text-white">Pola Pembelajaran</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardBody>
                  <p className="text-sm font-bold uppercase tracking-widest text-dark-400 mb-3">
                    Teori & praktik dalam
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ABSP_INFO.bidangKajian.map((b) => (
                      <Badge key={b} variant="primary" size="lg">{b}</Badge>
                    ))}
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <p className="text-sm font-bold uppercase tracking-widest text-dark-400 mb-3">
                    Diperkuat melalui
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ABSP_INFO.metodePembelajaran.map((m) => (
                      <Badge key={m} variant="accent" size="lg">{m}</Badge>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </motion.div>

          {/* Kompetensi */}
          <motion.div {...reveal()}>
            <div className="flex items-center gap-3 mb-2">
              <Award className="text-primary-500" size={28} />
              <h2 className="text-3xl font-bold text-white">Kompetensi yang Dikembangkan</h2>
            </div>
            <p className="text-dark-300 mb-6">
              Selain kompetensi akademik, mahasiswa juga dibekali kemampuan berikut.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ABSP_INFO.kompetensi.map((k, idx) => (
                <motion.div key={k} {...reveal(idx * 0.05)}>
                  <Card hoverable className="h-full">
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 rounded-full bg-primary-500/20 text-primary-400 font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <p className="font-semibold text-white">{k}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Alamat Kampus */}
          <motion.div {...reveal()}>
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="text-primary-500" size={28} />
              <h2 className="text-3xl font-bold text-white">Alamat Kampus</h2>
            </div>
            <Card className="border-primary-500/30">
              <CardBody className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <p className="text-xl font-bold text-white">{ABSP_INFO.kampus}</p>
                  <p className="text-dark-200 mt-1">{ABSP_INFO.alamat}</p>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors flex-shrink-0"
                >
                  <MapPin size={18} /> Buka di Google Maps
                </a>
              </CardBody>
            </Card>
          </motion.div>

          {/* Program Kerja HIMADISTIK */}
          <motion.div {...reveal()}>
            <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
              <h2 className="text-3xl font-bold text-white">Program Kerja HIMADISTIK</h2>
              <Link
                to="/program-kerja"
                className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 font-semibold"
              >
                Lihat selengkapnya <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROGRAMS.map((p, idx) => (
                <motion.div key={p.id} {...reveal(idx * 0.05)}>
                  <Card className="h-full">
                    <CardBody>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-lg font-bold text-white">{p.name}</h3>
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="text-dark-300 text-sm leading-relaxed line-clamp-4">{p.deskripsi}</p>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default InformasiAbsp
