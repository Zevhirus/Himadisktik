import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/UI/Tabs'
import { Card, CardBody } from '../components/UI/Card'
import { Badge } from '../components/UI/Badge'
import { HIMADISTIK_PROFILE } from '../data/mockData'
import { useContent } from '../lib/content'
import {
  Calendar,
  MapPin,
  Mail,
  Instagram,
  Video,
  Palette,
  Sparkles,
  Crown,
  ArrowRight,
} from 'lucide-react'

const fade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const swatch = {
  orange: { label: 'Oranye', className: 'bg-primary-500' },
  black: { label: 'Hitam', className: 'bg-black border border-dark-500' },
}

function HimadistikProfile() {
  const { cabinets: CABINETS } = useContent()
  const P = HIMADISTIK_PROFILE
  const pendiri = [
    { nama: P.founders[0], peran: 'Ketua Umum pertama' },
    { nama: P.founders[1], peran: 'Wakil Ketua Umum pertama' },
  ]
  const kabinetSaatIni = CABINETS.find((c) => c.current) || CABINETS[CABINETS.length - 1]

  return (
    <div className="pt-20 pb-12">
      {/* Hero */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          <motion.div {...fade} className="flex-1">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{P.name}</h1>
            <p className="text-xl text-dark-300 mb-6 max-w-2xl">{P.fullName}</p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary" size="lg">Berdiri {P.foundedDate}</Badge>
              <Badge variant="accent" size="lg">{CABINETS.length} Kabinet</Badge>
              <Badge variant="accent" size="lg">{P.campus}</Badge>
            </div>
          </motion.div>
          <motion.img
            {...fade}
            src={P.logo.image}
            alt="Logo HIMADISTIK"
            className="hidden md:block w-40 lg:w-52 h-auto object-contain flex-shrink-0 drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]"
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="tentang" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="tentang">Tentang</TabsTrigger>
              <TabsTrigger value="logo-maskot">Logo & Maskot</TabsTrigger>
              <TabsTrigger value="visi-misi">Visi & Misi</TabsTrigger>
              <TabsTrigger value="kabinet">Perjalanan Kabinet</TabsTrigger>
            </TabsList>

            {/* Tentang */}
            <TabsContent value="tentang">
              <motion.div {...fade} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardBody>
                      <h2 className="text-3xl font-bold mb-4 text-white">Latar Belakang</h2>
                      <p className="text-dark-200 leading-relaxed">{P.latarBelakang}</p>
                    </CardBody>
                  </Card>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-dark-400 mb-3">
                      Pendiri
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {pendiri.map((p) => (
                        <Card key={p.nama}>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary-500/20 text-primary-400 font-bold flex items-center justify-center flex-shrink-0">
                              {p.nama.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-white">{p.nama}</p>
                              <p className="text-sm text-primary-500 font-semibold">{p.peran}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: Calendar, label: 'Dibentuk', value: P.foundedDate },
                    { icon: MapPin, label: 'Kampus', value: P.campus },
                  ].map(({ icon: Icon, label, value }) => (
                    <Card key={label}>
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-500 flex-shrink-0">
                          <Icon size={22} />
                        </div>
                        <div>
                          <p className="text-dark-400 text-sm">{label}</p>
                          <p className="font-bold text-white">{value}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Card className="border-primary-500/40">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-500 flex-shrink-0">
                        <Crown size={22} />
                      </div>
                      <div>
                        <p className="text-dark-400 text-sm">Kabinet saat ini</p>
                        <p className="font-bold text-white">{kabinetSaatIni.name}</p>
                        <Link
                          to="/sahitya-raksa"
                          className="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-400 font-semibold mt-1"
                        >
                          Lihat struktur <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            {/* Logo & Maskot */}
            <TabsContent value="logo-maskot">
              <motion.div {...fade} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="h-full">
                  <CardBody>
                    <img
                      src={P.logo.image}
                      alt="Logo HIMADISTIK"
                      className="h-52 w-auto mx-auto mb-6 object-contain"
                    />
                    <div className="flex items-center gap-3 mb-4">
                      <Palette className="text-primary-500" size={26} />
                      <h2 className="text-2xl font-bold text-white">Makna Logo</h2>
                    </div>
                    <p className="text-dark-200 leading-relaxed mb-6">{P.logo.description}</p>
                    <div className="space-y-3">
                      {Object.entries(P.logo.colors).map(([key, makna]) => (
                        <div key={key} className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex-shrink-0 ${swatch[key]?.className}`} />
                          <p className="text-dark-200">
                            <span className="font-semibold text-white">{swatch[key]?.label || key}</span> · {makna}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                <Card className="h-full">
                  <CardBody>
                    <img
                      src={P.mascot.image}
                      alt={`Maskot ${P.mascot.name}`}
                      className="h-52 w-auto mx-auto mb-6 object-contain"
                    />
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="text-primary-500" size={26} />
                      <h2 className="text-2xl font-bold text-white">Maskot: {P.mascot.name}</h2>
                    </div>
                    <p className="text-dark-200 leading-relaxed">{P.mascot.description}</p>
                  </CardBody>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Visi & Misi */}
            <TabsContent value="visi-misi">
              <motion.div {...fade} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2 border-primary-500/40">
                  <CardBody>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-3">Visi</h3>
                    <p className="text-lg text-white leading-relaxed italic">“{P.visi}”</p>
                  </CardBody>
                </Card>
                <Card className="lg:col-span-3">
                  <CardBody>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-4">Misi</h3>
                    <ol className="space-y-4">
                      {P.misi.map((item, idx) => (
                        <li key={idx} className="flex gap-4">
                          <span className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 font-bold flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-dark-200 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ol>
                  </CardBody>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Perjalanan Kabinet */}
            <TabsContent value="kabinet">
              <motion.div {...fade}>
                <ol className="relative border-l-2 border-dark-800 ml-3 md:ml-4 space-y-8">
                  {CABINETS.map((c) => (
                    <li key={c.id} className="pl-6 md:pl-8 relative">
                      <span
                        className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full border-2 ${
                          c.current ? 'bg-primary-500 border-primary-500' : 'bg-black border-primary-500/60'
                        }`}
                      />
                      <p className="text-primary-500 font-semibold text-sm mb-2">{c.year}</p>
                      <Card className={c.current ? 'border-primary-500/60' : ''}>
                        <CardBody>
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-white">{c.name}</h3>
                            {c.current && <Badge variant="primary" size="sm">Kabinet saat ini</Badge>}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <p className="text-dark-400">
                              Ketua Umum
                              <span className="block text-white font-semibold text-base">{c.ketuaUmum}</span>
                            </p>
                            <p className="text-dark-400">
                              Wakil Ketua Umum
                              <span className="block text-white font-semibold text-base">{c.wakilKetuaUmum}</span>
                            </p>
                          </div>
                        </CardBody>
                      </Card>
                    </li>
                  ))}
                </ol>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Kontak */}
      <section className="px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-white mb-2">Hubungi & Ikuti HIMADISTIK</h2>
              <p className="text-dark-300 mb-6 flex items-start gap-2">
                <MapPin size={18} className="text-primary-500 mt-0.5 flex-shrink-0" />
                Sekretariat: {P.address}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${P.email}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-dark-700 text-white hover:border-primary-500 hover:text-primary-500 transition-colors font-semibold"
                >
                  <Mail size={18} /> {P.email}
                </a>
                <a
                  href={P.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-dark-700 text-white hover:border-primary-500 hover:text-primary-500 transition-colors font-semibold"
                >
                  <Instagram size={18} /> {P.instagramHandle}
                </a>
                <a
                  href={P.videoProfil}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
                >
                  <Video size={18} /> Video Profil
                </a>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default HimadistikProfile
