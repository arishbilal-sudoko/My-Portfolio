import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Reveal, TLink, useSite } from './site.jsx'
import { Side } from './pages.jsx'
import ScaleInGrid from './graphicGrid/ScaleInGrid.jsx'
import Lightbox from './graphicGrid/Lightbox.jsx'
import { projects, categories } from './portfolioData.js'

const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const RADIUS = 10   // matches .cover-frame

/* Case study: "Graphic Works". Same opening as the other projects: the live grid fills the screen and plays its
   scale-in; once the whole grid is built it recedes into the cover frame and the title pops up above it. */
export default function GraphicWorks() {
  const { setReady } = useSite()
  const root = useRef(null)
  const cover = useRef(null)
  const ov = useRef(null)
  const tl = useRef(null)
  const started = useRef(false)
  const size = useRef({ W: 1600, H: 900 })

  const [cat, setCat] = useState('All')
  const [open, setOpen] = useState(null)
  const [replay, setReplay] = useState(0)
  const active = (p) => cat === 'All' || p.category === cat
  const nav = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + projects.length) % projects.length)), [])

  const play = useCallback(() => {
    if (started.current || !tl.current) return
    started.current = true
    tl.current.play()
  }, [])

  useLayoutEffect(() => {
    const html = document.documentElement
    const wasReady = html.classList.contains('ready')
    setReady(true)
    const vw = window.innerWidth, vh = window.innerHeight
    const W = Math.max(vw, (vh * 16) / 9), H = (W * 9) / 16          // 16:9 "design size", covers the screen
    size.current = { W, H }
    const fit = () => cover.current.clientWidth / W                  // scale that fits the grid into the cover frame
    let fallback = 0, ro

    const ctx = gsap.context(() => {
      gsap.set(ov.current, { width: W, height: H, transformOrigin: '0 0' })
      if (reduce) {
        gsap.set(ov.current, { x: 0, y: 0, scale: fit(), borderRadius: RADIUS / fit() })
        return
      }
      html.classList.add('intro-lock')
      const cr = cover.current.getBoundingClientRect()
      gsap.set(ov.current, { x: (vw - W) / 2 - cr.left, y: (vh - H) / 2 - (cr.top + window.scrollY), scale: 1, borderRadius: 0, pointerEvents: 'none' })
      gsap.set('.fx', { opacity: 0, y: 24 })
      tl.current = gsap.timeline({
        paused: true, delay: wasReady ? 0.2 : 0,
        onComplete: () => { html.classList.remove('intro-lock'); gsap.set(ov.current, { zIndex: 1, pointerEvents: 'auto' }) },
      })
      tl.current
        .to(ov.current, { x: 0, y: 0, scale: () => fit(), borderRadius: () => RADIUS / fit(), duration: 1.3, ease: 'power4.inOut' }, 0)
        .from('.cs-title .nl > i', { yPercent: 115, duration: 1, ease: 'power4.out', stagger: 0.1 }, 0.55)
        .to('.fx', { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, 0.95)
      fallback = window.setTimeout(play, 7000)                        // safety net: never leave the page covered
    }, root)

    // keep the grid fitted to its frame when the window changes size
    ro = new ResizeObserver(() => {
      if (!started.current && !reduce) return
      if (tl.current && tl.current.isActive()) return
      const s = fit(); gsap.set(ov.current, { scale: s, borderRadius: RADIUS / s, x: 0, y: 0 })
    })
    ro.observe(cover.current)

    return () => { clearTimeout(fallback); ro.disconnect(); ctx.revert(); html.classList.remove('intro-lock') }
  }, [setReady, play])

  return (
    <div ref={root}>
      <Side />

      <section className="cs-hero" data-label="Intro">
        <div className="wrap">
          <h1 className="cs-title" aria-label="Graphic Works">
            <span className="nl" aria-hidden="true"><i>Graphic</i></span>
            <span className="nl serif" aria-hidden="true"><i>Works</i></span>
          </h1>
          <p className="cs-sub fx">Posters, thumbnails, social, branding &amp; more · selected work</p>

          <div className="cover-frame gw-cover" ref={cover}>
            <div className="gw-ov" ref={ov}>
              <ScaleInGrid key={replay} projects={projects} active={active} onOpen={setOpen} onSettled={play} />
            </div>
          </div>

          <div className="gw-filters fx" role="group" aria-label="Filter by category">
            {categories.map((c) => (
              <button key={c} className={'gw-pill' + (cat === c ? ' on' : '')} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
            ))}
            <button className="gw-pill gw-replay" onClick={() => setReplay((n) => n + 1)}>Replay ↻</button>
          </div>

          <p className="lead cs-intro fx">Everything I design away from screens and code, in one moving wall. Hover a tile to hold its row still, tap it to see it bigger.</p>
          <dl className="cs-meta fx">
            <div><dt>Type</dt><dd>Solo, client &amp; freelance work</dd></div>
            <div><dt>My role</dt><dd>Graphic designer</dd></div>
            <div><dt>Formats</dt><dd>Posters, thumbnails, social, branding, standees &amp; blogs</dd></div>
          </dl>
        </div>
      </section>

      <section className="cs">
        <div className="wrap">
          <div className="cs-row" data-label="About">
            <Reveal as="h3" className="cs-h"><small>01</small>About this work</Reveal>
            <div className="cs-body">
              <p>Everything I design away from screens and code: posters, YouTube thumbnails, social creatives, branding, standees and blog graphics.</p>
              <p>Some are solo experiments, some were for clients, some for the firms I’ve worked with, and some are freelance jobs. Tap any tile to see it bigger.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cs-end">
        <div className="wrap"><TLink to="/#works" className="btn">← Back to works</TLink></div>
      </section>

      <Lightbox projects={projects} index={open} onClose={() => setOpen(null)} onNav={nav} />
    </div>
  )
}
