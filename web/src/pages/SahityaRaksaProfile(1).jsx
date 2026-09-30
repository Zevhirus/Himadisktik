import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardBody } from '../components/UI/Card'
import { Badge } from '../components/UI/Badge'
import { useContent, personName, personFoto } from '../lib/content'
import { Users, Layers, Target, Flame, Quote, Crown, ShieldCheck } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
}

const warnaDot = {
  Kuning: 'bg-yellow-400',
  Oranye: 'bg-orange-500',
  Merah: 'bg-red-500',
}

// "PSDM (Pengembangan Sumber Daya Manusia)" -> { singkatan, lengkap }
const parseDept = (nama) => {
  const m = nama.match(/^(.+?)\s*\((.+)\)$/)
  return m ? { singkatan: m[1], lengkap: m[2] } : { singkatan: nama, lengkap: '' }
}

const initials = (nama) =>
  nama
    .replace(/[.,]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="text-primary-500" size={28} />}
        <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
      </div>
      {subtitle && <p className="text-dark-300 mt-2 max-w-3xl">{subtitle}</p>}
    </div>
  )
}

// Kotak foto pengurus: pakai foto kalau ada, kalau tidak tampilkan inisial nama.
// Bentuk potret 2:3 (sama dengan foto aslinya) dengan sudut membulat (bukan persegi) supaya orang di foto tidak terpotong.
function Avatar({ nama, foto, size = 'md', highlight = false }) {
  const sizes = { md: 'w-12 aspect-[2/3] text-sm', lg: 'w-16 aspect-[2/3] text-xl' }
  if (foto) {
    return (
      <div className={`${sizes[size]} rounded-xl overflow-hidden flex-shrink-0 bg-dark-900 ${highlight ? 'ring-2 ring-primary-500' : ''}`}>
        <img src={foto} alt={nama} className="w-full h-full object-cover object-top" loading="lazy" />
      </div>
    )
  }
  return (
    <div
      className={`${sizes[size]} rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
        highlight ? 'bg-primary-500 text-black' : 'bg-primary-500/20 text-primary-400'
      }`}
    >
      {initials(nama)}
    </div>
  )
}

function PersonCard({ nama, jabatan, foto, highlight = false, delay = 0 }) {
  return (
    <motion.div {...fadeUp} transition={{ duration: 0.6, delay }} className="h-full">
      <Card
        className={`h-full ${highlight ? 'border-primary-500/60' : ''}`}
        hoverable
      >
        <div className="flex items-center gap-4">
          <Avatar nama={nama} foto={foto} size={highlight ? 'lg' : 'md'} highlight={highlight} />
          <div>
            <p className={`font-bold text-white ${highlight ? 'text-lg' : ''}`}>{nama}</p>
            <p className="text-sm text-primary-500 font-semibold">{jabatan}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

function SahityaRaksaProfile() {
  const { sahitya: SAHITYA_RAKSA } = useContent()
  const { struktur } = SAHITYA_RAKSA
  const pembina = struktur.pimpinan.filter((p) => p.jabatan === 'Pembina')
  const ketum = struktur.pimpinan.find((p) => p.jabatan === 'Ketua Umum')
  const inti = struktur.pimpinan.filter((p) => p.jabatan !== 'Pembina' && p.jabatan !== 'Ketua Umum')

  const totalStaff = struktur.departemen.reduce(
    (sum, d) => sum + d.bidang.reduce((s, b) => s + b.staff.length, 0),
    0
  )
  const totalBidang = struktur.departemen.reduce((sum, d) => sum + d.bidang.length, 0)
  const totalPengurus = (struktur.pimpinan.length - pembina.length) + struktur.departemen.length + totalStaff

  const stats = [
    { label: 'Pengurus', value: totalPengurus, icon: Users },
    { label: 'Departemen', value: struktur.departemen.length, icon: Layers },
    { label: 'Bidang', value: totalBidang, icon: Target },
    { label: 'Pembina', value: pembina.length, icon: ShieldCheck },
  ]

  return (
    <div className="pb-12">
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 md:px-8 overflow-hidden bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/images/sahitya-raksa.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
        <div className="relative max-w-7xl mx-auto flex items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <Badge variant="primary" size="lg">Periode {SAHITYA_RAKSA.year}</Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mt-5 mb-4">
              {SAHITYA_RAKSA.name}
            </h1>
            <p className="text-xl md:text-2xl text-dark-200 max-w-2xl italic">
              {SAHITYA_RAKSA.motto}
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              {[
                ['#filosofi', 'Filosofi'],
                ['#visi-misi', 'Visi & Misi'],
                ['#struktur', 'Struktur Organisasi'],
                ['#departemen', 'Departemen'],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="px-4 py-2 rounded-full border border-dark-700 text-dark-200 hover:text-primary-500 hover:border-primary-500 text-sm font-medium transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            src={SAHITYA_RAKSA.logo.image}
            alt="Logo Kabinet Sahitya Raksa"
            className="hidden md:block w-56 lg:w-80 h-auto object-contain flex-shrink-0 drop-shadow-[0_0_40px_rgba(249,115,22,0.35)]"
          />
        </div>
      </section>

      <div className="px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-24 pt-8">
          {/* Statistik */}
          <motion.div {...fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <Card key={label} className="text-center">
                <Icon className="text-primary-500 mx-auto mb-2" size={24} />
                <p className="text-4xl font-bold text-white">{value}</p>
                <p className="text-sm text-dark-300 mt-1">{label}</p>
              </Card>
            ))}
          </motion.div>

          {/* Filosofi Nama & Logo */}
          <section id="filosofi" className="scroll-mt-28">
            <SectionTitle icon={Flame} title="Filosofi" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div {...fadeUp}>
                <Card className="h-full">
                  <CardBody>
                    <h3 className="text-xl font-bold text-white mb-3">Makna Nama</h3>
                    <p className="text-dark-200 leading-relaxed">{SAHITYA_RAKSA.filosofiNama}</p>
                  </CardBody>
                </Card>
              </motion.div>
              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
                <Card className="h-full">
                  <CardBody>
                    <img
                      src={SAHITYA_RAKSA.logo.image}
                      alt="Logo Kabinet Sahitya Raksa"
                      className="h-40 w-auto mx-auto mb-6 object-contain"
                    />
                    <h3 className="text-xl font-bold text-white mb-3">Makna Logo</h3>
                    <div className="space-y-3 mb-5">
                      {SAHITYA_RAKSA.logo.filosofiBentuk.map((para, i) => (
                        <p key={i} className="text-dark-200 leading-relaxed">{para}</p>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {SAHITYA_RAKSA.logo.maknawarna.map((w) => (
                        <div key={w.warna} className="flex items-start gap-3">
                          <span
                            className={`mt-1.5 w-4 h-4 rounded-full flex-shrink-0 ${
                              warnaDot[w.warna] || 'bg-primary-500'
                            }`}
                          />
                          <p className="text-dark-200">
                            <span className="font-semibold text-white">{w.warna}</span> · {w.makna}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Visi & Misi */}
          <section id="visi-misi" className="scroll-mt-28">
            <SectionTitle icon={Target} title="Visi & Misi" />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <motion.div {...fadeUp} className="lg:col-span-2">
                <Card className="h-full border-primary-500/40">
                  <CardBody>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-3">Visi</h3>
                    <p className="text-lg text-white leading-relaxed">{SAHITYA_RAKSA.visi}</p>
                  </CardBody>
                </Card>
              </motion.div>
              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="lg:col-span-3">
                <Card className="h-full">
                  <CardBody>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-4">Misi</h3>
                    <ol className="space-y-4">
                      {SAHITYA_RAKSA.misi.map((m, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 font-bold flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </span>
                          <p className="text-dark-200 leading-relaxed">{m}</p>
                        </li>
                      ))}
                    </ol>
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Pesan Ketua Umum */}
          <motion.section {...fadeUp}>
            <Card className="border-primary-500/30">
              <CardBody className="flex flex-col md:flex-row gap-6 items-start">
                <Quote className="text-primary-500 flex-shrink-0" size={40} />
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-primary-500 mb-4">
                    Pesan dari Ketua Umum HIMADISTIK {SAHITYA_RAKSA.year}
                  </p>
                  <div className="space-y-4">
                    {SAHITYA_RAKSA.ketuaUmum.pesan.map((para, i) => (
                      <p
                        key={i}
                        className={`leading-relaxed ${
                          i === SAHITYA_RAKSA.ketuaUmum.pesan.length - 1
                            ? 'text-xl md:text-2xl text-white font-semibold italic'
                            : 'text-lg text-dark-200'
                        }`}
                      >
                        {para}
                      </p>
                    ))}
                    <p className="text-lg text-primary-500 font-bold italic">
                      {SAHITYA_RAKSA.ketuaUmum.penutup}
                    </p>
                  </div>
                  <p className="mt-6 font-bold text-white">{SAHITYA_RAKSA.ketuaUmum.nama}</p>
                  <p className="text-sm text-primary-500">{SAHITYA_RAKSA.ketuaUmum.jabatan} HIMADISTIK</p>
                </div>
              </CardBody>
            </Card>
          </motion.section>

          {/* Struktur Organisasi */}
          <section id="struktur" className="scroll-mt-28">
            <SectionTitle
              icon={Crown}
              title="Struktur Organisasi"
              subtitle="Susunan pembina dan pengurus inti Kabinet Sahitya Raksa periode 2026."
            />

            <h3 className="text-sm font-bold uppercase tracking-widest text-dark-400 mb-3">Pembina</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {pembina.map((p, i) => (
                <PersonCard key={p.nama} nama={p.nama} jabatan={p.jabatan} foto={p.foto} delay={i * 0.05} />
              ))}
            </div>

            <h3 className="text-sm font-bold uppercase tracking-widest text-dark-400 mb-3">Pengurus Inti</h3>
            <div className="max-w-xl mx-auto mb-4">
              <PersonCard nama={ketum.nama} jabatan={ketum.jabatan} foto={ketum.foto} highlight />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {inti.map((p, i) => (
                <PersonCard key={p.nama} nama={p.nama} jabatan={p.jabatan} foto={p.foto} delay={i * 0.08} />
              ))}
            </div>
          </section>

          {/* Departemen */}
          <section id="departemen" className="scroll-mt-28">
            <SectionTitle
              icon={Layers}
              title="Departemen"
              subtitle="Empat departemen dengan masing-masing dua bidang kerja, beserta penjelasan peran dan anggotanya."
            />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {struktur.departemen.map((dept, di) => {
                const { singkatan, lengkap } = parseDept(dept.nama)
                const jumlah = 1 + dept.bidang.reduce((s, b) => s + b.staff.length, 0)
                return (
                  <motion.div key={dept.nama} {...fadeUp} transition={{ duration: 0.6, delay: di * 0.08 }}>
                    <Card className="h-full">
                      <CardBody>
                        <div className="flex items-start justify-between gap-3 mb-5">
                          <div>
                            <span className="text-3xl font-bold text-primary-500">{singkatan}</span>
                            <p className="text-dark-300 text-sm mt-1">Departemen {lengkap}</p>
                          </div>
                          <Badge variant="accent" size="sm">{jumlah} orang</Badge>
                        </div>

                        <p className="text-dark-200 leading-relaxed mb-5">{dept.deskripsi}</p>

                        <div className="flex items-center gap-4 p-4 rounded-lg border border-primary-500/40 bg-primary-500/10 mb-5">
                          <Avatar nama={personName(dept.kepalaDepartemen)} foto={personFoto(dept.kepalaDepartemen)} highlight />
                          <div>
                            <p className="font-bold text-white">{personName(dept.kepalaDepartemen)}</p>
                            <p className="text-sm text-primary-500 font-semibold">Kepala Departemen</p>
                          </div>
                        </div>

                        <div className="space-y-5">
                          {dept.bidang.map((b) => (
                            <div key={b.nama}>
                              <p className="text-sm font-semibold text-dark-100 mb-1">
                                {b.nama}
                                <span className="text-dark-400 font-normal"> · {b.staff.length} staff</span>
                              </p>
                              <p className="text-sm text-dark-400 leading-relaxed mb-3 pb-3 border-b border-dark-800">
                                {b.deskripsi}
                              </p>
                              <ul className="space-y-2">
                                {b.staff.map((orang) => (
                                  <li
                                    key={personName(orang)}
                                    className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-primary-500/10 transition-colors"
                                  >
                                    <Avatar nama={personName(orang)} foto={personFoto(orang)} />
                                    <span className="text-dark-200">{personName(orang)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default SahityaRaksaProfile
