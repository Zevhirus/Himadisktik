import React, { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

/** Penampil foto layar penuh. Tutup: klik latar / tombol X / Esc. Navigasi: tombol atau panah kiri-kanan. */
function Lightbox({ photos, index, onClose, onIndex, title }) {
  const total = photos.length
  const go = (d) => onIndex((index + d + total) % total)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && total > 1) go(-1)
      else if (e.key === 'ArrowRight' && total > 1) go(1)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  })

  const photo = photos[index]
  if (!photo) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Foto dokumentasi'}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        aria-label="Tutup"
        onClick={onClose}
        className="absolute top-4 right-4 w-11 h-11 rounded-full bg-dark-800 hover:bg-dark-700 text-white flex items-center justify-center"
      >
        <X size={22} />
      </button>
      {total > 1 && (
        <>
          <button
            aria-label="Foto sebelumnya"
            onClick={(e) => { e.stopPropagation(); go(-1) }}
            className="absolute left-3 md:left-6 w-11 h-11 rounded-full bg-dark-800 hover:bg-dark-700 text-white flex items-center justify-center"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            aria-label="Foto berikutnya"
            onClick={(e) => { e.stopPropagation(); go(1) }}
            className="absolute right-3 md:right-6 w-11 h-11 rounded-full bg-dark-800 hover:bg-dark-700 text-white flex items-center justify-center"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
      <figure className="max-w-5xl max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.url}
          alt={photo.caption || title || 'Foto dokumentasi'}
          className="max-h-[80vh] max-w-full object-contain rounded-lg"
        />
        <figcaption className="mt-3 text-center text-sm text-dark-200">
          {photo.caption && <span className="block text-white font-medium">{photo.caption}</span>}
          {title && <span className="text-dark-400">{title}</span>}
          {total > 1 && <span className="text-dark-400"> · {index + 1}/{total}</span>}
        </figcaption>
      </figure>
    </div>
  )
}

export default Lightbox
