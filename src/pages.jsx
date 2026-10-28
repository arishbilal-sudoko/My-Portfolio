import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { TLink, Reveal, useSite } from './site.jsx'
import { ME, socials, projects, skills, testimonials, clients } from './data.js'

/* Works list: siblings dim; a preview eases after the cursor. Projects with a `logo` show it AS the cursor. */
function WorksList() {
  const box = useRef(null)
  const { go } = useSite()
  const [active, setActive] = useState(null)
  const last = useRef(projects[0])
  if (active) last.current = active
  const shown = last.current

  useEffect(() => { projects.forEach((p) => { if (p.img) new Image().src = p.img }) }, []) // warm the cache for the case-study intro

  useEffect(() => {
    gsap.set(box.current, { xPercent: -50, yPercent: -50, scale: 0.8, opacity: 0 })
    const qx = gsap.quickTo(box.current, 'x', { duration: 0.5, ease: 'power3' })
    const qy = gsap.quickTo(box.current, 'y', { duration: 0.5, ease: 'power3' })
    const move = (e) => { qx(e.clientX); qy(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  useEffect(() => {
    gsap.to(box.current, { scale: active ? 1 : 0.8, opacity: active ? 1 : 0, duration: 0.35, ease: 'power3.out' })
  }, [active])

  return (
    <>
      <ul className="works-list">
        {projects.map((p) => {
          const link = p.slug
            ? { href: `/work/${p.slug}`, onClick: (e) => { e.preventDefault(); go(`/work/${p.slug}`) } }
            : { href: p.url, target: '_blank', rel: 'noopener noreferrer' }
          return (
            <li key={p.title}>
              <a {...link} className={p.logo ? 'has-logo' : ''}
                 onMouseEnter={() => setActive(p)} onMouseLeave={() => setActive(null)}
                 onFocus={() => setActive(p)} onBlur={() => setActive(null)}>
                <span className="t">{p.title}</span>
                <span className="k">{p.type}</span>
                <span className="y">{p.year}</span>
              </a>
            </li>
          )
        })}
      </ul>
      <div className={'preview' + (shown.logo ? ' is-logo' : '')} ref={box} aria-hidden="true">
        {!shown.logo && <div className="pm"><span>{shown.year}</span><span>Preview</span></div>}
        <div className="pi" style={{ background: shown.color }}>
          {shown.logo ? <img src={shown.logo} alt="" /> : shown.img ? <img src={shown.img} alt="" /> : shown.title}
        </div>
      </div>
    </>
  )
}

/* Fixed side details: scroll counter (left), section name + progress line (right) */
export function Side() {
  const [label, setLabel] = useState('')
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setLabel(e.target.dataset.label)),
      { rootMargin: '-45% 0px -45% 0px' }
    )
    document.querySelectorAll('[data-label]').forEach((s) => io.observe(s))
    const on = () => setPct(Math.round((scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)) * 100))
    on()
    addEventListener('scroll', on, { passive: true })
    return () => { io.disconnect(); removeEventListener('scroll', on) }
  }, [])
  return (
    <>
      <span className="side-l">({String(pct).padStart(2, '0')})</span>
      <span className="side-r">{label}</span>
      <span className="bar"><i style={{ height: pct + '%' }} /></span>
    </>
  )
}

const Socials = () => (
  <div className="socials">
    {socials.map((s) => <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>)}
  </div>
)


const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
let introPlayed = false // the red intro only plays on the first visit, not when returning from a case study

/* Hero: red intro wipe, then a soft red glow that drifts toward the cursor (and tints the last name) */
function Hero() {
  const root = useRef(null)
  const cv = useRef(null)
  const mint = useRef(null)
  const { setReady } = useSite()

  // Opening animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduce || introPlayed) {
        gsap.set('.intro-panel', { display: 'none' })
        gsap.set(['.hg-mint', cv.current], { opacity: 1 })
        setReady(true)
        return
      }
      gsap.timeline()
        .from('.nl > i', { yPercent: 115, duration: 1, ease: 'power4.out', stagger: 0.1 }, 0.2)
        .to('.intro-panel', { yPercent: -100, duration: 1.1, ease: 'power4.inOut' }, 1.5)
        .add(() => setReady(true), 1.9)
        .to('.hg-mint', { opacity: 1, duration: 1.2, ease: 'power2.inOut' }, 1.9)
        .to(cv.current, { opacity: 1, duration: 1.8, ease: 'power2.out' }, 2.0)
        .from('.hero-tag', { opacity: 0, y: 10, duration: 0.9, ease: 'power2.out' }, 2.4)
        .from('.rule', { scaleX: 0, duration: 1.1, ease: 'power3.inOut' }, 2.4)
        .from('.hero-bar > :not(.rule)', { opacity: 0, y: 12, duration: 0.7, stagger: 0.1, ease: 'power2.out' }, 2.9)
        .set('.intro-panel', { display: 'none' })
        .add(() => { introPlayed = true })
    }, root)
    return () => ctx.revert()
  }, [setReady])

  // Cursor-reactive glow (canvas, drawn at half resolution)
  useEffect(() => {
    const c = cv.current
    const g = c.getContext('2d')
    const S = 0.5
    let w = 1, h = 1, raf, visible = true
    const m = { x: 0.6, y: 0.3, tx: 0.6, ty: 0.3, hover: 0, th: 0, mx: 70, tmx: 70 }
    // c = rgb, a = strength, bx/by = resting spot, rx/ry = size, k = cursor parallax, lag = easing
    const blobs = [
      { c: '225,6,0', a: 0.95, bx: 0.62, by: 0.16, rx: 0.3, ry: 0.62, k: 0.12, lag: 0.035, ph: 0 },
      { c: '255,59,29', a: 0.7, bx: 0.56, by: -0.02, rx: 0.2, ry: 0.38, k: 0.18, lag: 0.05, ph: 2 },
      { c: '120,0,16', a: 0.9, bx: 0.2, by: 0.18, rx: 0.24, ry: 0.55, k: 0.08, lag: 0.025, ph: 4 },
      { c: '70,16,90', a: 0.6, bx: 0.99, by: 0.34, rx: 0.13, ry: 0.4, k: 0.05, lag: 0.03, ph: 1 },
      { c: '255,70,40', a: 0.8, bx: 0.5, by: 0.4, rx: 0.17, ry: 0.34, cursor: true, lag: 0.07, ph: 0 },
    ].map((b) => ({ ...b, x: b.bx, y: b.by }))

    const resize = () => {
      const r = c.parentElement.getBoundingClientRect()
      w = c.width = Math.max(2, Math.ceil(r.width * S))
      h = c.height = Math.max(2, Math.ceil(r.height * S))
    }
    const move = (e) => {
      const r = c.getBoundingClientRect()
      m.tx = (e.clientX - r.left) / r.width
      m.ty = (e.clientY - r.top) / r.height
      m.th = m.ty > -0.1 && m.ty < 1.1 ? 1 : 0
      const mr = mint.current.getBoundingClientRect()
      m.tmx = Math.min(100, Math.max(0, ((e.clientX - mr.left) / mr.width) * 100))
    }
    const leave = () => { m.th = 0 }

    const draw = (t) => {
      raf = requestAnimationFrame(draw)
      if (!visible) return
      m.x += (m.tx - m.x) * 0.08; m.y += (m.ty - m.y) * 0.08
      m.hover += (m.th - m.hover) * 0.06; m.mx += (m.tmx - m.mx) * 0.07
      mint.current.style.setProperty('--mx', m.mx.toFixed(1) + '%')
      g.globalCompositeOperation = 'source-over'
      g.fillStyle = '#0a0a0a'
      g.fillRect(0, 0, w, h)
      g.globalCompositeOperation = 'lighter'
      for (const b of blobs) {
        const tx = b.cursor ? m.x : b.bx + (m.x - 0.5) * b.k + Math.sin(t / 4000 + b.ph) * 0.04
        const ty = b.cursor ? m.y : b.by + (m.y - 0.5) * b.k * 0.6 + Math.cos(t / 5200 + b.ph) * 0.03
        b.x += (tx - b.x) * b.lag; b.y += (ty - b.y) * b.lag
        const al = b.cursor ? b.a * m.hover : b.a
        if (al < 0.01) continue
        const r = b.rx * w
        g.save()
        g.translate(b.x * w, b.y * h)
        g.scale(1, (b.ry * h) / r)
        const gr = g.createRadialGradient(0, 0, 0, 0, 0, r)
        gr.addColorStop(0, `rgba(${b.c},${al})`)
        gr.addColorStop(0.5, `rgba(${b.c},${al * 0.42})`)
        gr.addColorStop(1, `rgba(${b.c},0)`)
        g.fillStyle = gr
        g.fillRect(-r, -r, r * 2, r * 2)
        g.restore()
      }
    }

    resize()
    const ro = new ResizeObserver(resize); ro.observe(c.parentElement)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(root.current)
    if (reduce) { draw(0); cancelAnimationFrame(raf) } else {
      window.addEventListener('pointermove', move)
      root.current.addEventListener('pointerleave', leave)
      raf = requestAnimationFrame(draw)
    }
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      window.removeEventListener('pointermove', move)
      root.current && root.current.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <section className="hero" id="top" data-label="Intro" ref={root}>
      <div className="intro-panel" aria-hidden="true" />
      <div className="hero-bg" aria-hidden="true"><canvas ref={cv} /></div>
      <p className="hero-tag">Chai, code &amp; clean design.</p>
      <h1 className="name" aria-label={ME.name}>
        <span className="nl" aria-hidden="true"><i>Arish Bilal</i></span>
        <span className="nl serif" aria-hidden="true"><i>Ahmed.<b className="hg-mint" ref={mint}>Ahmed.</b></i></span>
      </h1>
      <div className="hero-bar">
        <span className="rule" />
        <img className="mark" src="/logo.png" alt="ABA" />
        <Socials />
      </div>
    </section>
  )
}

/* Testimonials: two full-bleed marquee rows moving in opposite directions (CSS animation).
   Each row holds 4 identical copies and slides exactly one copy's width, so the loop never shows a gap or a jump.
   Hovering a card eases that row to a full stop and slows the other row; leaving eases both back to full speed. */
const COPIES = 4
const initials = (n) => n.replace(/[^A-Za-z\s]/g, '').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '·'

function Marquee({ items, reverse, seconds }) {
  return (
    <div className="t-row">
      <ul className={'t-track' + (reverse ? ' rev' : '')} style={{ '--dur': `${seconds}s` }}>
        {Array.from({ length: COPIES }, (_, c) => items.map((t, i) => (
          <li className="t-item" key={`${c}-${i}`} aria-hidden={c > 0 ? 'true' : undefined}>
            <div className="t-card">
              <div className="t-who">
                {t.photo
                  ? <img className={'t-avatar' + (t.logo ? ' t-avatar-logo' : '')} src={t.photo} alt="" width="44" height="44" decoding="async" />
                  : <span className="t-avatar" aria-hidden="true">{initials(t.name)}</span>}
                <div><strong>{t.name}</strong><span>{t.role}</span></div>
              </div>
              <p>“{t.text}”</p>
            </div>
          </li>
        )))}
      </ul>
    </div>
  )
}

function Testimonials() {
  if (!testimonials.length) return null
  const wall = useRef(null)
  const k = Math.floor(testimonials.length / 2)
  const second = [...testimonials.slice(k), ...testimonials.slice(0, k)] // different order so the rows never line up

  useEffect(() => {
    if (reduce) return
    const el = wall.current
    const tracks = [...el.querySelectorAll('.t-track')]
    const rate = tracks.map(() => 1)
    let target = tracks.map(() => 1)
    let raf = 0
    const step = () => {
      raf = 0
      let moving = false
      tracks.forEach((t, i) => {
        rate[i] += (target[i] - rate[i]) * 0.1
        if (Math.abs(target[i] - rate[i]) < 0.004) rate[i] = target[i]
        else moving = true
        const a = t.getAnimations()[0]
        if (a) a.playbackRate = rate[i]
      })
      if (moving) raf = requestAnimationFrame(step)
    }
    const aim = (t) => { target = t; if (!raf) raf = requestAnimationFrame(step) }
    const over = (e) => {
      const item = e.target.closest('.t-item')
      if (!item) return aim(tracks.map(() => 1))
      const row = tracks.indexOf(item.closest('.t-track'))
      aim(tracks.map((_, i) => (i === row ? 0 : 0.25))) // hovered row stops, the other crawls
    }
    const leave = () => aim(tracks.map(() => 1))
    el.addEventListener('pointerover', over)
    el.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerover', over)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <section className="testimonials" data-label="Testimonials" aria-label="Testimonials">
      <div className="t-head"><Reveal as="h2">Testimonials</Reveal></div>
      <div className="t-wall" ref={wall}>
        <Marquee items={testimonials} seconds={34} />
        <Marquee items={second} reverse seconds={40} />
      </div>
    </section>
  )
}

function Skills() {
  const [open, setOpen] = useState(Object.keys(skills)[0])
  return (
    <div className="acc">
      {Object.entries(skills).map(([g, items]) => (
        <div key={g} className={`acc-item${open === g ? ' open' : ''}`}>
          <button onClick={() => setOpen(open === g ? null : g)} aria-expanded={open === g}>
            <span>{g}</span><b>{open === g ? '−' : '+'}</b>
          </button>
          <div className="acc-body"><ul>{items.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
        </div>
      ))}
    </div>
  )
}

export default function Page() {
  return (
    <>
      <Side />

      <Hero />

      {/* INFO — about */}
      <section className="about" id="info" data-label="About">
        <div className="wrap two">
          <div>
            <Reveal as="p" className="lead">I design interfaces, build products, and turn ideas into things people can actually use. Somewhere between pixels and code, that’s where I do my best work.</Reveal>
            <p className="sub">I come from Assam, where there’s no shortage of tea, ideas, or reasons to take things a little slower. Somewhere along the way, I found myself designing interfaces, writing code, and turning “what if?” into things people can actually use.</p>
            <div className="btns">
              <TLink to="#contact" className="btn">Get in touch</TLink>
              <a className="btn" href="/Arish_Ahmed_CV.pdf" download>Download CV</a>
            </div>
          </div>
          <div className="photo blob"><img src="/me.jpg" alt={ME.name} onError={(e) => { e.currentTarget.style.display = 'none' }} /></div>
        </div>
      </section>

      {/* WORKS */}
      <section id="works" data-label="Projects">
        <div className="wrap">
          <Reveal as="h2">Selected works</Reveal>
          <WorksList />
        </div>
      </section>

      {/* SKILLS */}
      <section data-label="Skills">
        <div className="wrap two">
          <div>
            <Reveal as="h2">Skills</Reveal>
            <p className="statement">I’m a BCA student learning to design and build for the web and mobile. I care about clean layouts, clear flows and interfaces that feel good to use.</p>
            <TLink to="#contact" className="btn">Contact me +</TLink>
          </div>
          <Skills />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* CLIENTS & PARTNERS (hidden until data.js has real entries) */}
      {clients.length > 0 && <section data-label="Clients">
        <div className="wrap">
          <Reveal as="h2">Clients &amp; partners</Reveal>
          <ul className="table">
            {clients.map((c, i) => (
              <li key={i}><span>{c.name}</span><span>{c.type}</span><span>{c.year}</span></li>
            ))}
          </ul>
        </div>
      </section>}

      {/* CONTACT */}
      <section className="contact" id="contact" data-label="Contact">
        <div className="wrap">
          <Reveal as="h1" className="title">Contact</Reveal>
          <a className="big" href={`mailto:${ME.email}`}>{ME.email}</a>
          <div className="cols">
            <p className="serif-p">Open to internships and entry-level roles in UI/UX design and front-end development.</p>
            <p className="serif-p">Also happy to take on freelance design and front-end projects.</p>
          </div>
          <a className="btn dl" href="/Arish_Ahmed_CV.pdf" download>Download CV</a>
          <Socials />
        </div>
      </section>
    </>
  )
}
