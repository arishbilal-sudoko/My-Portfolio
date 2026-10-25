import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import Lenis from 'lenis'
import { SiteCtx } from './site.jsx'
import Page from './pages.jsx'
import CaseStudy from './CaseStudy.jsx'
import { createSnake } from './snake.js'
import FooterHands from './FooterHands.jsx'

const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const SNAKE_LEN = 0.5 // how much of the path the snake's body covers

export default function App() {
  const nav = useNavigate()
  const loc = useLocation()
  const [ready, setReady] = useState(false)
  const canvas = useRef(null)
  const snake = useRef(null)
  const main = useRef(null)
  const lenis = useRef(null)
  const busy = useRef(false)
  const pending = useRef('')

  useEffect(() => { document.documentElement.classList.toggle('ready', ready) }, [ready])
  useEffect(() => { snake.current = createSnake(canvas.current) }, [])

  // Smooth scroll (Lenis) driven by GSAP's ticker
  useEffect(() => {
    if (reduce) return
    const l = new Lenis({ lerp: 0.09 })
    lenis.current = l
    const tick = (t) => l.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); l.destroy(); lenis.current = null }
  }, [])

  const scrollTo = (target) => {
    const el = typeof target === 'string' ? document.querySelector(target) : null
    if (lenis.current) { lenis.current.resize(); lenis.current.scrollTo(el || 0, { immediate: true }) }
    else if (el) el.scrollIntoView()
    else window.scrollTo(0, 0)
  }

  // After a route change: jump to the requested section, or to the top
  useLayoutEffect(() => {
    scrollTo(pending.current || null)
    pending.current = ''
  }, [loc.pathname])

  // to = "#works" (section on this page), "/work/slug" (another page) or "/#works" (section on home)
  const go = useCallback((to) => {
    if (busy.current) return
    const [p, h] = to.split('#')
    const target = p || '/'
    const hash = h ? '#' + h : ''
    const same = target === loc.pathname
    if (same && !hash) return
    const swap = () => {
      if (same) scrollTo(hash)
      else { pending.current = hash; nav(target) }
    }
    if (reduce) { swap(); return }
    busy.current = true
    // One continuous pass: the snake slithers across while the page fades out, swaps, and fades back in
    const o = { p: 0 }
    const tl = gsap.timeline({ onComplete: () => { busy.current = false } })
    tl.add(() => { canvas.current.style.display = 'block'; snake.current.prepare() })
      .to(o, {
        p: 1 + SNAKE_LEN, duration: 1.8, ease: 'power1.inOut',
        onUpdate: () => snake.current.draw(Math.max(0, o.p - SNAKE_LEN), Math.min(1, o.p)),
      }, 0)
      .to(main.current, { opacity: 0, duration: 0.4, ease: 'power2.in' }, 0.35)
      .add(swap, 0.85)
      .to(main.current, { opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.9)
      .add(() => { snake.current.clear(); canvas.current.style.display = 'none' })
      .set(main.current, { clearProps: 'opacity' })
  }, [loc.pathname, nav])

  return (
    <SiteCtx.Provider value={{ go, ready, setReady }}>
      <canvas className="stroke" ref={canvas} aria-hidden="true" />

      <main ref={main}>
        <Routes>
          <Route path="/" element={<Page />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="*" element={<Page />} />
        </Routes>
      </main>

      <footer>
        <FooterHands />
        <div className="f-name" aria-hidden="true">Arish Bilal Ahmed<span>.</span></div>
      </footer>
    </SiteCtx.Provider>
  )
}
