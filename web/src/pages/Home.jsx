import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HIMADISTIK_PROFILE } from '../data/mockData';
import { useContent } from '../lib/content';

const Home = () => {
  const { cabinets: CABINETS, programs: PROGRAMS, sahitya: SAHITYA_RAKSA } = useContent();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-black via-accent-950 to-black overflow-hidden pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute w-96 h-96 bg-gradient-primary rounded-full opacity-20 blur-3xl"
            animate={{
              x: mousePosition.x - 192,
              y: mousePosition.y - 192,
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 100 }}
          />
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full opacity-10 blur-3xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-4 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.img
            variants={itemVariants}
            src="/images/logo-himadistik.png"
            alt="Logo HIMADISTIK"
            className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 object-contain drop-shadow-[0_0_30px_rgba(249,115,22,0.35)]"
          />

          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-block"
          >
            <div className="px-6 py-2 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
              <p className="text-primary font-semibold text-sm">HIMADISTIK 2026</p>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            {HIMADISTIK_PROFILE.name}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-4"
          >
            {HIMADISTIK_PROFILE.fullName}
          </motion.p>

          {/* Tagline with Gradient */}
          <motion.p
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-8"
          >
            {HIMADISTIK_PROFILE.tagline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex gap-4 justify-center mb-12 flex-wrap"
          >
            <Link
              to="/himadistik"
              className="px-8 py-4 bg-primary hover:bg-orange-600 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              Kenal HIMADISTIK <ArrowRight size={20} />
            </Link>
            <Link
              to="/program-kerja"
              className="px-8 py-4 bg-accent-800 hover:bg-black text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border border-primary/30"
            >
              Lihat Program Kerja
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center"
          >
            <ChevronDown size={32} className="text-primary animate-bounce" />
          </motion.div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, margin: '-100px' }}
          >
            {[
              { label: 'Tahun Berdiri', value: HIMADISTIK_PROFILE.foundedYear },
              { label: 'Kabinet', value: CABINETS.length },
              { label: 'Program Kerja', value: PROGRAMS.length },
              { label: 'Departemen', value: 4 },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent-800/10 border border-primary/20 hover:border-primary/40 transition-all duration-300 text-center"
              >
                <h3 className="text-primary text-4xl font-bold mb-2">{stat.value}</h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-accent-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl font-bold text-white mb-6">
                Tentang <span className="text-primary">HIMADISTIK</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                {HIMADISTIK_PROFILE.description}
              </p>
              <Link
                to="/himadistik"
                className="inline-flex items-center gap-2 text-primary hover:text-orange-400 font-semibold transition-colors"
              >
                Pelajari lebih lanjut <ArrowRight size={20} />
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="space-y-6"
            >
              <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                <h3 className="text-2xl font-bold text-white mb-3">Visi</h3>
                <p className="text-gray-300">{HIMADISTIK_PROFILE.visi}</p>
              </div>
              <div className="p-6 rounded-xl bg-accent-800/20 border border-primary/20">
                <h3 className="text-lg font-bold text-white mb-2">Misi Kami</h3>
                <ul className="space-y-2">
                  {HIMADISTIK_PROFILE.misi.slice(0, 2).map((misi, idx) => (
                    <li key={idx} className="text-gray-400 flex gap-3">
                      <span className="text-primary">✓</span> {misi}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Current Cabinet - Sahitya Raksa */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <img
                src="/images/logo-sahitya-raksa.png"
                alt="Logo Kabinet Sahitya Raksa"
                className="h-24 md:h-32 w-auto mx-auto mb-6 object-contain"
              />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                <span className="text-primary">Kabinet Sahitya Raksa</span>
                <br /> Periode 2026
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Membangun solidaritas, menjaga kolaborasi, dan menjadi ruang aspirasi bagi seluruh warga ABSP
              </p>
            </motion.div>

            {/* Current Cabinet Info */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <div className="p-8 rounded-xl bg-gradient-to-br from-primary/10 to-accent-800/10 border border-primary/30 text-center">
                <p className="text-gray-400 mb-2">Ketua Umum</p>
                <h3 className="text-2xl font-bold text-white">{SAHITYA_RAKSA.ketuaUmum.nama}</h3>
              </div>
              <div className="p-8 rounded-xl bg-gradient-to-br from-primary/10 to-accent-800/10 border border-primary/30 text-center">
                <p className="text-gray-400 mb-2">Wakil Ketua Umum</p>
                <h3 className="text-2xl font-bold text-white">{(CABINETS.find((c) => c.current) || CABINETS[CABINETS.length - 1]).wakilKetuaUmum}</h3>
              </div>
              <div className="p-8 rounded-xl bg-gradient-to-br from-primary/10 to-accent-800/10 border border-primary/30 text-center">
                <p className="text-gray-400 mb-2">Tahun</p>
                <h3 className="text-2xl font-bold text-primary">{SAHITYA_RAKSA.year}</h3>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <Link
                to="/sahitya-raksa"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-orange-600 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Lihat Struktur Lengkap <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="py-20 px-4 bg-accent-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-white text-center mb-12"
            >
              Program Kerja <span className="text-primary">Unggulan</span>
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
              variants={containerVariants}
            >
              {PROGRAMS.slice(0, 3).map((program) => (
                <motion.div
                  key={program.id}
                  variants={itemVariants}
                  className="group p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent-800/10 border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-white flex-1">{program.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      program.status === 'Ongoing' ? 'bg-green-500/20 text-green-400' :
                      program.status === 'Coming Soon' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {program.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{program.deskripsi}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <Link
                to="/program-kerja"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-orange-600 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Lihat Semua Program <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Journey Cabinet */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-white text-center mb-12"
            >
              Perjalanan <span className="text-primary">Kabinet</span>
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {CABINETS.slice(-3).map((cabinet) => (
                <motion.div
                  key={cabinet.id}
                  variants={itemVariants}
                  className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent-800/10 border border-primary/20 hover:border-primary/50 transition-all duration-300"
                >
                  <p className="text-primary text-sm font-semibold mb-2">{cabinet.year}</p>
                  <h3 className="text-2xl font-bold text-white mb-3">{cabinet.name}</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-400">Ketua: <span className="text-white">{cabinet.ketuaUmum}</span></p>
                    <p className="text-gray-400">Wakil: <span className="text-white">{cabinet.wakilKetuaUmum}</span></p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-orange-600">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Bergabunglah dengan HIMADISTIK
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-white/90 mb-8"
          >
            Jadilah bagian dari keluarga besar HIMADISTIK dan wujudkan potensimu bersama kami
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link
              to="/himadistik"
              className="px-8 py-4 bg-black hover:bg-accent-950 text-primary rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Pelajari Lebih Lanjut
            </Link>
            <a
              href="https://www.instagram.com/himadistik.polteklanmks"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all duration-300 border border-white"
            >
              Ikuti Instagram Kami
            </a>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
