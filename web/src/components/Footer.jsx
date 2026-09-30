import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Instagram, Video, MapPin } from 'lucide-react'
import { APP_CONFIG } from '../config/app.config'

function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { label: 'HIMADISTIK', href: '/himadistik' },
    { label: 'Sahitya Raksa', href: '/sahitya-raksa' },
    { label: 'Program Kerja', href: '/program-kerja' },
    { label: 'Informasi', href: '/informasi' },
    { label: 'QnA', href: '/qna' },
    { label: 'Kritik & Saran', href: '/kritik-saran' },
  ]

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: APP_CONFIG.social.instagram },
    { icon: Video, label: 'Video Profil', href: APP_CONFIG.social.videoProfil },
    { icon: Mail, label: 'Email', href: `mailto:${APP_CONFIG.contact.email}` },
  ]

  return (
    <footer className="bg-black border-t border-dark-800 text-white pt-16 md:pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/images/logo-himadistik.png"
                  alt="Logo HIMADISTIK"
                  className="w-12 h-12 object-contain"
                />
                <h3 className="text-lg font-bold">{APP_CONFIG.appName}</h3>
              </div>
              <p className="text-dark-300 text-sm leading-relaxed">
                {APP_CONFIG.description}
              </p>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4">Menu</h4>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-dark-300 hover:text-primary-400 transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4">Kontak</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                  <a
                    href={`mailto:${APP_CONFIG.contact.email}`}
                    className="text-dark-300 hover:text-primary-400 transition-colors"
                  >
                    {APP_CONFIG.contact.email}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Instagram size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                  <a
                    href={APP_CONFIG.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-300 hover:text-primary-400 transition-colors"
                  >
                    {APP_CONFIG.social.instagramHandle}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                  <span className="text-dark-300">{APP_CONFIG.contact.address}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Social Media */}
          <div className="col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4">Ikuti Kami</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-dark-900 flex items-center justify-center text-dark-300 hover:text-primary-400 hover:bg-dark-800 transition-all duration-300"
                    title={social.label}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-800 my-8"></div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-dark-400"
        >
          <p>© {currentYear} {APP_CONFIG.appName}. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
