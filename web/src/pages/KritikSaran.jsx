import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardBody } from '../components/UI/Card'
import { useForm } from '../hooks/useCustomHooks'
import toast from 'react-hot-toast'
import { MessageSquare, CheckCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured, humanError } from '../lib/supabase'

const COOLDOWN_MS = 30000
const LAST_KEY = 'himadistik:feedback:last'

function KritikSaran() {
  const [submitted, setSubmitted] = useState(false)

  const { values, handleChange, handleBlur, handleSubmit, resetForm, isSubmitting } = useForm(
    {
      name: '',
      email: '',
      category: 'Saran',
      message: '',
      anonymous: false,
      website: '', // kolom jebakan untuk bot (disembunyikan dari manusia)
    },
    async (values) => {
      const done = () => {
        setSubmitted(true)
        resetForm()
        setTimeout(() => setSubmitted(false), 6000)
      }

      // Bot mengisi kolom tersembunyi → pura-pura berhasil, tidak disimpan
      if (values.website) return done()

      const message = values.message.trim()
      if (message.length < 5) return toast.error('Pesan terlalu pendek (minimal 5 karakter).')
      if (message.length > 2000) return toast.error('Pesan terlalu panjang (maksimal 2000 karakter).')
      if (!isSupabaseConfigured) return toast.error('Pengiriman belum aktif. Silakan hubungi kami lewat email atau Instagram.')

      let last = 0
      try { last = Number(localStorage.getItem(LAST_KEY) || 0) } catch { /* diblokir */ }
      if (Date.now() - last < COOLDOWN_MS) return toast.error('Tunggu sebentar sebelum mengirim lagi.')

      try {
        // Mode anonim: nama & kontak TIDAK dikirim sama sekali
        const { error } = await supabase.from('feedback').insert({
          category: values.category,
          name: values.anonymous ? null : values.name.trim() || null,
          contact: values.anonymous ? null : values.email.trim() || null,
          message,
          anonymous: values.anonymous,
        })
        if (error) throw error
        try { localStorage.setItem(LAST_KEY, String(Date.now())) } catch { /* diblokir */ }
        toast.success('Terima kasih! Masukan Anda telah diterima.')
        done()
      } catch (e) {
        console.error('Gagal mengirim masukan:', e)
        toast.error(`Gagal mengirim. ${humanError(e)}`)
      }
    }
  )

  return (
    <div className="pt-20 pb-12">
      {/* Hero */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-primary-600" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Suara Kamu, Perubahan Kita
            </h1>
            <p className="text-xl text-dark-300 max-w-2xl mx-auto">
              Kami menghargai setiap masukan Anda untuk terus berkembang dan memberikan yang terbaik
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-6 bg-green-500/10 border border-green-500/30 rounded-lg flex gap-4 items-start"
              >
                <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-green-900 mb-1">Terima Kasih!</h3>
                  <p className="text-green-400">Masukan Anda telah diterima dan akan kami pertimbangkan.</p>
                </div>
              </motion.div>
            )}

            <Card>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-dark-200 mb-2">
                      Nama {values.anonymous && '(Opsional)'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Nama Anda"
                      disabled={values.anonymous}
                      className={`w-full px-4 py-2 rounded-lg border border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        values.anonymous ? 'bg-dark-800' : ''
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-dark-200 mb-2">
                      Email/NIM {values.anonymous && '(Opsional)'}
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="email@contoh.com atau NIM"
                      disabled={values.anonymous}
                      className={`w-full px-4 py-2 rounded-lg border border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        values.anonymous ? 'bg-dark-800' : ''
                      }`}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-dark-200 mb-2">
                      Kategori
                    </label>
                    <select
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Kritik">Kritik</option>
                      <option value="Saran">Saran</option>
                      <option value="Aspirasi">Aspirasi</option>
                      <option value="Pertanyaan">Pertanyaan</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-dark-200 mb-2">
                      Pesan
                    </label>
                    <textarea
                      name="message"
                      value={values.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Tulis pesan Anda di sini..."
                      rows="6"
                      required
                      minLength={5}
                      maxLength={2000}
                      className="w-full px-4 py-2 rounded-lg border border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>

                  {/* Kolom jebakan bot: manusia tidak melihatnya */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>
                      Website
                      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={handleChange} />
                    </label>
                  </div>

                  {/* Anonymous */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="anonymous"
                      checked={values.anonymous}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-dark-600"
                    />
                    <span className="text-dark-200">
                      Kirim secara anonim
                      <span className="block text-xs text-dark-400">Nama dan kontak tidak akan dikirim sama sekali.</span>
                    </span>
                  </label>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:shadow-soft-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Masukan'}
                  </motion.button>
                </form>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default KritikSaran
