import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardBody } from '../components/UI/Card'
import { useContent } from '../lib/content'
import { ChevronDown, HelpCircle } from 'lucide-react'

function QnA() {
  const { faqs: FAQS } = useContent()
  const [openId, setOpenId] = useState(null)

  return (
    <div className="pt-20 pb-12">
      {/* Hero */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <HelpCircle className="w-16 h-16 mx-auto mb-4 text-primary-600" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Pertanyaan yang Sering Diajukan
            </h1>
            <p className="text-xl text-dark-300 max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan umum tentang HIMADISTIK
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {FAQS.map((faq, idx) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
              >
                <Card
                  className="cursor-pointer hover:border-primary-500/50"
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                >
                  <CardBody>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white flex-1">
                        {faq.pertanyaan}
                      </h3>
                      <motion.div
                        animate={{ rotate: openId === faq.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="text-primary-600" size={24} />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {openId === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-dark-800"
                        >
                          <p className="text-dark-200 leading-relaxed">
                            {faq.jawaban}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-dark-300 mb-4">Belum menemukan jawaban?</p>
            <Link
              to="/kritik-saran"
              className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 !text-white rounded-lg font-semibold hover:shadow-soft-lg transition-all"
            >
              Ajukan Pertanyaan
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default QnA
