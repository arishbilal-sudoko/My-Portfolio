import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

/* Project detail: click a tile to open. Esc closes, ← → move between projects. */
export default function Lightbox({ projects, index, onClose, onNav }) {
  const p = index === null ? null : projects[index]
  useEffect(() => {
    if (!p) return
    const html = document.documentElement
    html.classList.add('modal-open')
    const key = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
    }
    window.addEventListener('keydown', key)
    return () => { html.classList.remove('modal-open'); window.removeEventListener('keydown', key) }
  }, [p, onClose, onNav])

  return (
    <AnimatePresence>
      {p && (
        <motion.div className="gw-lb" role="dialog" aria-modal="true" aria-label={p.title}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          onClick={onClose} data-lenis-prevent>
          <button className="gw-lb-x" onClick={onClose} aria-label="Close">✕</button>
          <motion.figure key={p.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
            onClick={(e) => e.stopPropagation()}>
            <img src={p.image} alt={p.title} />
            <figcaption>
              <b>{p.title}</b><span>{p.category}</span>
              {p.description && <p>{p.description}</p>}
            </figcaption>
          </motion.figure>
          <button className="gw-lb-n prev" onClick={(e) => { e.stopPropagation(); onNav(-1) }} aria-label="Previous">←</button>
          <button className="gw-lb-n next" onClick={(e) => { e.stopPropagation(); onNav(1) }} aria-label="Next">→</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
