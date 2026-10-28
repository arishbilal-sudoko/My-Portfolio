import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import gsap from 'gsap'
import { Reveal, TLink, useSite } from './site.jsx'
import { Side } from './pages.jsx'
import { screens, groups } from './arishScreens.js'
import GraphicWorks from './GraphicWorks.jsx'
import { screens as pScreens, groups as pGroups } from './petifyScreens.js'

const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const LIVE_URL = '' // TODO: paste the live site link here to show a "Visit live site" button

/* Screenshot with a clip-path reveal + scroll parallax */
const Shot = ({ src, alt, w, h, caption }) => (
  <figure className="shot">
    <div className="rf" style={{ aspectRatio: `${w}/${h}` }}>
      <div className="par"><img src={src} alt={alt} loading="lazy" /></div>
    </div>
    <figcaption><span>Before</span><span>{caption}</span></figcaption>
  </figure>
)

const Row = ({ no, title, label, children }) => (
  <div className="cs-row" data-label={label}>
    <Reveal as="h3" className="cs-h"><small>{no}</small>{title}</Reveal>
    <div className="cs-body">{children}</div>
  </div>
)

const Points = ({ items }) => (
  <ol className="cs-pts">
    {items.map(([t, d], i) => (
      <li className="rise" key={t} style={{ transitionDelay: `${i * 70}ms` }}>
        <i>{String(i + 1).padStart(2, '0')}</i>
        <div><b>{t}</b><span>{d}</span></div>
      </li>
    ))}
  </ol>
)

/* Final-design card: hover (or tap) flips it to show the thinking behind it */
function Flip({ s, i }) {
  const [on, setOn] = useState(false)
  const [visible, setVisible] = useState(reduce)
  const card = useRef(null)

  // React owns the reveal class as well as the flip state, so clicking cannot
  // remove a class previously added by the scroll observer.
  useEffect(() => {
    if (reduce) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect() }
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    io.observe(card.current)
    return () => io.disconnect()
  }, [])

  const toggle = () => setOn((v) => !v)
  return (
    <div
      ref={card}
      className={`flip ${s.cls}${visible ? ' in' : ''}${on ? ' on' : ''}`}
      style={{ aspectRatio: `${s.w}/${s.h}`, flex: `${s.w / s.h} 1 0%`, transitionDelay: `${(i % 2) * 120}ms` }}
      role="button" tabIndex={0} aria-pressed={on}
      aria-label={`${s.t}. Flip to read the design note.`}
      onClick={toggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() } }}
    >
      <div className="flip-in">
        <div className="face front">
          <img src={s.src} alt={s.alt} loading="lazy" />
          <span className="tag">{s.no} · {s.t}</span>
          <span className="hint">Flip ↻</span>
        </div>
        <div className="face back" data-lenis-prevent>
          <small>{s.no} · {s.t}</small>
          <p>{s.why}</p>
          <small className="dn">Design note</small>
        </div>
      </div>
    </div>
  )
}

const palette = [['#e9e7e0', 'Stone'], ['#f7f6f2', 'Paper'], ['#11110f', 'Ink'], ['#b5121b', 'Signal red']]

const finals = [
  { cls: 'b-hero', no: '00', t: 'Hero', src: '/joe/hero.webp', w: 1199, h: 848, alt: 'Hero: Images That Work As Hard as You Do, above three portfolio photographs',
    why: 'Lead with the photos. Three very different shots show Joe’s range before anyone reads a word, and the headline just says it: images that work as hard as you do.' },
  { cls: 'b-port', no: '01', t: 'Portfolio', src: '/joe/portfolio.webp', w: 1219, h: 1839, alt: 'Portfolio section with filter chips and a mixed image grid',
    why: 'Filter chips let people jump straight to the kind of work they came for. Mixing tall and wide frames makes it feel like a contact sheet, not a spreadsheet.' },
  { cls: 'b-about', no: '02', t: 'About', src: '/joe/about.webp', w: 1935, h: 886, alt: 'About section with a large headline and two short paragraphs',
    why: 'A big headline, two short paragraphs, nothing else. Forty years of experience doesn’t need a long speech.' },
  { cls: 'b-serv', no: '03', t: 'Services', src: '/joe/services.webp', w: 1920, h: 1344, alt: 'Services section with four large numbered rows',
    why: 'Four services as big numbered rows you can scan in seconds, each with a single line on why it’s worth hiring.' },
  { cls: 'b-rev', no: '04', t: 'Client reviews', src: '/joe/reviews.webp', w: 1920, h: 857, alt: 'Client reviews as five-star quote cards in a row',
    why: 'Real words from real clients, with the 5.0 rating up top. The cards peek off the edge so people know there’s more to scroll.' },
  { cls: 'b-cta', no: '05', t: 'Contact', src: '/joe/cta.webp', w: 1920, h: 960, alt: 'Dark contact section with a quote request form',
    why: 'The old page had two buttons and a lot of empty space. Now the question comes with a form, so reaching out takes a minute.' },
  { cls: 'b-foot', no: '06', t: 'Footer', src: '/joe/footer.webp', w: 1938, h: 330, alt: 'Footer with links, address, hours and the logo',
    why: 'Everything practical in one glance: links, address, phone and hours. The logo gets the last word.' },
]

/* Shared by every case study: the full-screen intro + scroll reveals / parallax */
function useCaseFx() {
  const { setReady } = useSite()
  const root = useRef(null)
  const cover = useRef(null)
  const ov = useRef(null)

  /* Opening: the mockup fills the screen, then recedes into place and the title pops up */
  useLayoutEffect(() => {
    const html = document.documentElement
    const wasReady = html.classList.contains('ready')
    setReady(true)
    const ctx = gsap.context(() => {
      if (reduce) { gsap.set(ov.current, { display: 'none' }); return }
      html.classList.add('intro-lock')
      const vw = window.innerWidth, vh = window.innerHeight
      const W = Math.max(vw, (vh * 16) / 9), H = (W * 9) / 16
      const fit = () => cover.current.getBoundingClientRect()
      gsap.set(cover.current, { opacity: 0 })
      gsap.set(ov.current, { display: 'block', width: W, height: H, x: (vw - W) / 2, y: (vh - H) / 2, scale: 1, transformOrigin: '0 0', borderRadius: 0 })
      gsap.set('.cs-ov img', { scale: 1.14 })
      gsap.set('.fx', { opacity: 0, y: 24 })
      const tl = gsap.timeline({ delay: wasReady ? 0.8 : 0.2, onComplete: () => html.classList.remove('intro-lock') })
      tl.to('.cs-ov img', { scale: 1, duration: 1.6, ease: 'power3.out' }, 0)
        .to(ov.current, {
          x: () => fit().left, y: () => fit().top,
          scale: () => fit().width / W,
          borderRadius: () => 10 / (fit().width / W),
          duration: 1.3, ease: 'power4.inOut',
        }, 1.2)
        .add(() => { gsap.set(cover.current, { opacity: 1 }); gsap.set(ov.current, { display: 'none' }) }, 2.5)
        .from('.cs-title .nl > i', { yPercent: 115, duration: 1, ease: 'power4.out', stagger: 0.1 }, 2.0)
        .to('.fx', { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, 2.4)
      const img = ov.current.querySelector('img')
      if (!img.complete) { // wait for the picture so the intro never starts on a blank screen
        tl.pause()
        const go = () => tl.play()
        img.addEventListener('load', go, { once: true })
        img.addEventListener('error', go, { once: true })
      }
    }, root)
    return () => { ctx.revert(); html.classList.remove('intro-lock') }
  }, [setReady])

  /* Scroll reveals + gentle parallax on screenshots */
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    root.current.querySelectorAll('.rf, .rise').forEach((el) => io.observe(el))
    const pars = [...root.current.querySelectorAll('.par')]
    let raf = 0
    const upd = () => {
      raf = 0
      const vh = window.innerHeight
      for (const el of pars) {
        const r = el.parentElement.getBoundingClientRect()
        if (r.bottom < 0 || r.top > vh) continue
        const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh))
        el.style.transform = `translate3d(0, ${(-p * r.height * 0.07).toFixed(1)}px, 0)`
      }
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(upd) }
    window.addEventListener('scroll', on, { passive: true })
    upd()
    return () => { io.disconnect(); window.removeEventListener('scroll', on); cancelAnimationFrame(raf) }
  }, [])

  return { root, cover, ov }
}

function JoeRobbins() {
  const { root, cover, ov } = useCaseFx()

  return (
    <div ref={root}>
      <Side />
      <div className="cs-ov" ref={ov} aria-hidden="true"><img src="/joe/mockup.webp" alt="" /></div>

      <section className="cs-hero" data-label="Intro">
        <div className="wrap">
          <h1 className="cs-title" aria-label="Joe Robbins Photography">
            <span className="nl" aria-hidden="true"><i>Joe Robbins</i></span>
            <span className="nl serif" aria-hidden="true"><i>Photography</i></span>
          </h1>
          <p className="cs-sub fx">Website redesign · case study</p>
          <div className="cover-frame" ref={cover}>
            <img src="/joe/mockup.webp" width="1920" height="1080" alt="The redesigned Joe Robbins Photography website on a laptop" />
          </div>
          <p className="lead cs-intro fx">Joe’s photography is brilliant. His old website wasn’t doing it justice, so I redesigned it, and built it, in a day.</p>
          <dl className="cs-meta fx">
            <div><dt>Client</dt><dd>Joe Robbins Photography</dd></div>
            <div><dt>My role</dt><dd>Designer &amp; front-end developer</dd></div>
            <div><dt>Timeline</dt><dd>1 day · 2026</dd></div>
            <div><dt>Tools</dt><dd>Figma, Adobe Photoshop, HTML/CSS/JS (with some AI assistance)</dd></div>
          </dl>
          {LIVE_URL && <a className="btn fx" href={LIVE_URL} target="_blank" rel="noopener noreferrer">Visit live site ↗</a>}
        </div>
      </section>

      <section className="cs">
        <div className="wrap">
          <Row no="01" title="Overview" label="Overview">
            <p>Joe Robbins is a commercial photographer in Houston, Texas, working with businesses since 1984. His work covers executive headshots, industrial and construction documentation, product photography and architecture.</p>
            <p>My brief to myself: make the site feel as sharp as the photographs on it, and ship it in a day.</p>
          </Row>

          <Row no="02" title="The old site" label="Before">
            <Shot caption="Old hero" src="/joe/before-hero.webp" w={1897} h={956} alt="The old hero: a wrapped navigation bar above a single factory photograph" />
            <div className="cs-pair">
              <Shot caption="Old contact section" src="/joe/before-cta.webp" w={1895} h={957} alt="The old contact section with a serif headline and two buttons" />
              <Shot caption="Old footer" src="/joe/before-footer.webp" w={1896} h={956} alt="The old footer with default bulleted blue links" />
            </div>
          </Row>

          <Row no="03" title="What was off" label="Problems">
            <p>A few things jumped out the moment I opened it.</p>
            <Points items={[
              ['A header that hogged the screen', 'The nav wrapped onto two rows, hid content behind three dropdowns and pushed Joe’s photos down the page.'],
              ['A phone number that couldn’t fit', '“Call: 832-242-5050” broke across two lines, in the one spot it needs to be effortless.'],
              ['One photo, no range', 'The hero was a single factory shot. Nothing hinted at the headshots, products or interiors.'],
              ['A contact section with no way to ask', 'Two buttons and a lot of empty space. No form, no quick route to a quote.'],
              ['A footer that looked unfinished', 'Plain headings over default blue bulleted links. No address, no hours.'],
              ['Fonts that didn’t agree', 'A serif headline against a sans-serif menu, with no clear hierarchy.'],
            ]} />
          </Row>

          <Row no="04" title="What I fixed" label="Goals">
            <p>Each problem became a goal, and each goal got solved.</p>
            <Points items={[
              ['Let the photos lead', 'A bold headline and a strip of three very different shots, right at the top.'],
              ['A header that gets out of the way', 'Four links and the phone number on one tidy line. No dropdowns.'],
              ['Make reaching Joe effortless', 'The number is always in view, and a quote form closes out the page.'],
              ['One voice for the whole site', 'One tight sans-serif, warm neutrals and a single red from Joe’s logo.'],
              ['A footer that earns its place', 'Links, address, phone and hours, with the logo signing off.'],
            ]} />
          </Row>

          <Row no="05" title="Site structure" label="Structure">
            <ol className="cs-steps">
              <li><b>Hero</b><span>A bold headline over a strip of three signature images.</span></li>
              <li><b>01 · Portfolio</b><span>A filterable image grid: Corporate, Industrial, Architectural, Product, Commercial.</span></li>
              <li><b>02 · About</b><span>Who Joe is and how he works, in two short paragraphs.</span></li>
              <li><b>03 · Services</b><span>Four services as large, numbered rows.</span></li>
              <li><b>04 · Client reviews</b><span>A horizontal row of five-star reviews, each with the client’s role.</span></li>
              <li><b>Contact</b><span>A “Start your project” quote form next to a direct phone link.</span></li>
            </ol>
          </Row>

          <Row no="06" title="Look &amp; feel" label="Design system">
            <p>Warm neutrals, near-black type with tight tracking, and one red lifted straight from Joe’s logo. Quiet on purpose, so the photographs do the shouting. One geometric sans-serif handles every word.</p>
            <div className="cs-sw">
              {palette.map(([hex, name]) => (
                <div key={hex}><span style={{ background: hex }} /><b>{name}</b><small>{hex}</small></div>
              ))}
            </div>
          </Row>
        </div>
      </section>

      <section className="cs-final" data-label="Final design">
        <div className="wrap">
          <Reveal as="h3" className="cs-h"><small>07</small>The final design</Reveal>
          <p className="cs-note">Hover over a screen (or tap it) to flip it and see why I designed it that way.</p>
          <div className="bento">
            {[[0, 1], [2, 3], [4, 5], [6]].map((row) => (
              <div className="b-row" key={row.join('-')}>
                {row.map((i) => <Flip key={finals[i].no} s={finals[i]} i={i} />)}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cs">
        <div className="wrap">
          <Row no="08" title="Outcome" label="Outcome">
            <p>Joe now has a site that looks like his work: clean, confident and quick to scan. Going from first frame to finished code in a day meant tight decisions and no room for filler.</p>
            <div className="cs-stats">
              <div className="rise"><b>1 day</b><span>From first frame to finished code</span></div>
              <div className="rise" style={{ transitionDelay: '80ms' }}><b>5 → 4</b><span>Navigation links, and no more dropdowns</span></div>
              <div className="rise" style={{ transitionDelay: '160ms' }}><b>0 → 1</b><span>Quote form to start a project</span></div>
            </div>
          </Row>
          <Row no="09" title="Takeaways" label="Takeaways">
            <p>Constraints are a gift. With one day on the clock, every element had to earn its place, and the site is calmer because of it.</p>
            <p>AI sped up the typing, but it didn’t make the design calls. Those came from looking hard at Joe’s photos and asking what they needed around them.</p>
          </Row>
        </div>
      </section>

      <section className="cs-end">
        <div className="wrap">
          <TLink to="/#works" className="btn">← Back to works</TLink>
        </div>
      </section>
    </div>
  )
}

const palA = [['#181a1b', 'Charcoal'], ['#3e4041', 'Slate'], ['#d0ff63', 'Lime'], ['#d4b9ef', 'Lavender'], ['#e56e4a', 'Coral'], ['#5d6bd8', 'Periwinkle']]
const flow = ['Welcome', 'Login / Sign up', 'Name', 'Gender', 'Age', 'Weight', 'Height', 'Fitness level', 'Main goal', 'Profile created', 'Home']
const road = [
  ['done', 'Flows & wireframes', 'The first user flow, mapped screen by screen.'],
  ['done', 'UI design', 'Onboarding, home and profile, all in the final look.'],
  ['now', 'Building it in Java', 'Turning the screens into a real Android app, one screen at a time.'],
  ['next', 'Design the rest', 'The Workout, Analytics and Community tabs still need their screens.'],
]
const stLabel = { done: 'Done', now: 'In progress', next: 'Up next' }

function ArishFitness() {
  const { root, cover, ov } = useCaseFx()
  const finals = screens.map((s) => ({ cls: '', no: s.no, t: s.t, src: `/arish-fitness/ui/${s.f}.webp`, w: s.w, h: s.h, alt: `${s.t} screen`, why: s.why }))
  return (
    <div ref={root}>
      <Side />
      <div className="cs-ov" ref={ov} aria-hidden="true"><img src="/arish-fitness/mockup.webp" alt="" /></div>

      <section className="cs-hero" data-label="Intro">
        <div className="wrap">
          <h1 className="cs-title" style={{ fontSize: 'clamp(40px,9.5vw,170px)' }} aria-label="Arish Fitness">
            <span className="nl" aria-hidden="true"><i>Arish</i></span>
            <span className="nl serif" aria-hidden="true"><i>Fitness</i></span>
          </h1>
          <p className="cs-sub fx">Android app · UI/UX design<span className="cs-live"><i />In progress</span></p>
          <div className="cover-frame" ref={cover}>
            <img src="/arish-fitness/mockup.webp" width="1254" height="705" alt="The Arish Fitness dashboard on a smartwatch, showing steps, calories, heart rate and distance" />
          </div>
          <p className="lead cs-intro fx">A fitness app that gets to know you before it asks you to work out. I’ve designed the screens, and now I’m building it for Android in Java.</p>
          <dl className="cs-meta fx">
            <div><dt>Type</dt><dd>Personal project</dd></div>
            <div><dt>My role</dt><dd>UI/UX designer &amp; Android developer</dd></div>
            <div><dt>Status</dt><dd>Work in progress</dd></div>
            <div><dt>Tools</dt><dd>Figma, Java, Android Studio</dd></div>
          </dl>
        </div>
      </section>

      <section className="cs">
        <div className="wrap">
          <Row no="01" title="Overview" label="Overview">
            <p>Arish Fitness is an Android app for people who want to get fit without wading through settings. You sign in, answer a few quick questions, and land on a home screen that shows how today is going.</p>
            <p>It’s still a work in progress. The first flow is designed, and I’m now building it in Java with Android Studio.</p>
          </Row>

          <Row no="02" title="What I wanted" label="Goals">
            <Points items={[
              ['Setup that feels like a chat', 'One question per screen, big controls, and a Skip button on every step.'],
              ['Easy to get in', 'Social sign-in for speed, or just an email and password.'],
              ['Thumb-friendly everything', 'Main buttons sit at the bottom, right where your thumb already is.'],
              ['A home screen with one job', 'Answer “how am I doing today?” with steps, calories and minutes at a glance.'],
              ['A profile you can change', 'Every answer from setup lives in one list you can edit later.'],
            ]} />
          </Row>

          <Row no="03" title="The flow" label="Flow">
            <p>From opening the app to landing on the home screen, in eleven steps.</p>
            <ol className="flow">
              {flow.map((f, i) => <li className="rise" key={f} style={{ transitionDelay: `${i * 50}ms` }}><span>{f}</span></li>)}
            </ol>
          </Row>
        </div>
      </section>

      <section className="cs-shots" data-label="Wireframes">
        <div className="wrap">
          <Reveal as="h3" className="cs-h"><small>04</small>Wireframes</Reveal>
          <p className="cs-note">The structure under every screen: layout, hierarchy and the main action, with colour and styling stripped away.</p>
          {groups.map((g) => (
            <div className="grp" key={g.title}>
              <div className="grp-h"><b>{g.title}</b><span>{g.blurb}</span></div>
              <div className="wgrid">
                {screens.slice(g.start, g.end).map((s, i) => (
                  <figure className="wire rise" key={s.no} style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
                    <img src={`/arish-fitness/wire/${s.f}.svg`} alt={`Wireframe: ${s.t}`} width={s.w} height={s.h} loading="lazy" />
                    <figcaption><span>{s.no}</span><span>{s.t}</span></figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cs">
        <div className="wrap">
          <Row no="05" title="Look &amp; feel" label="Design system">
            <p>A dark charcoal canvas, one loud lime for everything you can tap, and soft lavender, coral and blue to colour-code the home screen. One bold, rounded sans-serif (Poppins) does all the talking.</p>
            <div className="cs-sw">
              {palA.map(([hex, name]) => (
                <div key={hex}><span style={{ background: hex }} /><b>{name}</b><small>{hex}</small></div>
              ))}
            </div>
            <p>Big pill buttons, rounded cards and oversized pickers keep everything easy to hit with a thumb.</p>
          </Row>
        </div>
      </section>

      <section className="cs-final" data-label="Screens">
        <div className="wrap">
          <Reveal as="h3" className="cs-h"><small>06</small>The screens</Reveal>
          <p className="cs-note">Hover over a screen (or tap it) to flip it and read the thinking behind it.</p>
          {groups.map((g) => (
            <div className="grp" key={g.title}>
              <div className="grp-h"><b>{g.title}</b></div>
              <div className="fgrid">
                {finals.slice(g.start, g.end).map((f, i) => <Flip key={f.no} s={f} i={i} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cs">
        <div className="wrap">
          <Row no="07" title="Where it’s at" label="Status">
            <p>This one’s still cooking. The design for the first flow is done, and I’m building it as a Java app for Android.</p>
            <ol className="cs-road">
              {road.map(([st, t, d], i) => (
                <li className="rise" key={t} style={{ transitionDelay: `${i * 70}ms` }}>
                  <span className={`st ${st}`}>{stLabel[st]}</span>
                  <div><b>{t}</b><span>{d}</span></div>
                </li>
              ))}
            </ol>
          </Row>
        </div>
      </section>

      <section className="cs-end">
        <div className="wrap">
          <TLink to="/#works" className="btn">← Back to works</TLink>
        </div>
      </section>
    </div>
  )
}

const palP = [['#5c0396', 'Royal purple'], ['#6c0cc0', 'Violet'], ['#a371c4', 'Orchid'], ['#eee3fb', 'Lilac'], ['#f2ecf5', 'Lavender'], ['#3d3840', 'Charcoal']]
const flowP = ['Splash', 'Login / Sign up', 'Profile created', 'Home', 'Care taker profile', 'Services', 'Cart', 'Live tracking']
const statsP = [['13', 'Screens designed'], ['4', 'Ways to log in: Meta, Google, Apple or password'], ['2', 'Roles: pet owner and care taker']]

/* Wireframe gallery, grouped (used by the app case studies) */
function WireSection({ folder, list, grps, no, note }) {
  return (
    <section className="cs-shots" data-label="Wireframes">
      <div className="wrap">
        <Reveal as="h3" className="cs-h"><small>{no}</small>Wireframes</Reveal>
        <p className="cs-note">{note}</p>
        {grps.map((g) => (
          <div className="grp" key={g.title}>
            <div className="grp-h"><b>{g.title}</b><span>{g.blurb}</span></div>
            <div className="wgrid">
              {list.slice(g.start, g.end).map((s, i) => (
                <figure className="wire rise" key={s.no} style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
                  <img src={`/${folder}/wire/${s.f}.svg`} alt={`Wireframe: ${s.t}`} width={s.w} height={s.h} loading="lazy" />
                  <figcaption><span>{s.no}</span><span>{s.t}</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* Final screens as flip cards (front = the design, back = the thinking) */
function ScreenSection({ folder, list, grps, no }) {
  const finals = list.map((s) => ({ cls: '', no: s.no, t: s.t, src: `/${folder}/ui/${s.f}.webp`, w: s.w, h: s.h, alt: `${s.t} screen`, why: s.why }))
  return (
    <section className="cs-final" data-label="Screens">
      <div className="wrap">
        <Reveal as="h3" className="cs-h"><small>{no}</small>The screens</Reveal>
        <p className="cs-note">Hover over a screen (or tap it) to flip it and read the thinking behind it.</p>
        {grps.map((g) => (
          <div className="grp" key={g.title}>
            <div className="grp-h"><b>{g.title}</b></div>
            <div className="fgrid">
              {finals.slice(g.start, g.end).map((f, i) => <Flip key={f.no} s={f} i={i} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* Tap-through prototype built from the final screens. Hotspots are [x, y, w, h, goes to screen #, label] in the screens' 390x814 space. A target of -1 means "back to where you were" (used by the no-internet screen). */
const OFF = 12
const NAV_HOME = [24, 752, 48, 56, 6, 'Home']
const NAV_STATUS = [219, 752, 50, 56, 11, 'Status']
const HOT = {
  0: [[0, 0, 390, 814, 1, 'Open the app']],
  1: [[24, 48, 44, 44, 0, 'Back'], [24, 607, 342, 50, 6, 'Login'], [24, 693, 342, 50, 2, 'Other methods'], [252, 765, 56, 24, 3, 'Sign up']],
  2: [[24, 48, 44, 44, 1, 'Back'], [24, 207, 342, 61, 6, 'Continue with Meta'], [24, 288, 342, 61, 6, 'Continue with Google'], [24, 369, 342, 61, 6, 'Continue with Apple'], [24, 693, 342, 50, 1, 'Continue with Password'], [252, 765, 56, 24, 3, 'Sign up']],
  3: [[24, 48, 44, 44, 1, 'Back'], [24, 611, 342, 50, 5, 'Create account'], [24, 697, 342, 47, 4, 'Register as Care Taker'], [262, 765, 44, 24, 1, 'Log in']],
  4: [[24, 48, 44, 44, 1, 'Back'], [24, 611, 342, 50, 5, 'Create account'], [24, 697, 342, 47, 3, 'Register as Pet Owner'], [262, 765, 44, 24, 1, 'Log in']],
  5: [[324, 29, 44, 44, 6, 'Close'], [24, 681, 342, 50, 6, 'Go to home']],
  6: [[17, 275, 175, 140, 7, 'Care taker 1'], [200, 275, 175, 140, 7, 'Care taker 2'], [17, 445, 175, 140, 7, 'Care taker 3'], [200, 445, 175, 140, 7, 'Care taker 4'], [17, 598, 175, 140, 7, 'Care taker 5'], [200, 598, 175, 140, 7, 'Care taker 6'], NAV_STATUS, [324, 752, 50, 56, 7, 'Profile']],
  7: [[151, 704, 88, 26, 8, 'Book Now'], NAV_HOME, NAV_STATUS],
  8: [[16, 22, 36, 36, 7, 'Back'], [260, 671, 112, 38, 9, 'Add to cart'], NAV_HOME],
  9: [[16, 22, 36, 36, 7, 'Back'], [262, 675, 103, 36, 10, 'View Cart'], NAV_HOME],
  10: [[20, 20, 34, 34, 9, 'Back'], [250, 675, 118, 40, 11, 'Place Order']],
  11: [[14, 14, 40, 40, 6, 'Back to Home']],
  12: [[0, 0, 390, 814, -1, 'Back to where you were']],
}

function ProtoPhone() {
  const [cur, setCur] = useState(0)
  const [prev, setPrev] = useState(null)
  const [show, setShow] = useState(false)
  const [back, setBack] = useState(0)
  useEffect(() => { pScreens.forEach((s) => { new Image().src = `/petify/ui/${s.f}.webp` }) }, [])
  const src = (i) => `/petify/ui/${pScreens[i].f}.webp`
  const go = (i) => { if (i === cur) return; if (i === OFF) setBack(cur); setPrev(cur); setCur(i); setTimeout(() => setPrev(null), 420) }
  return (
    <div className="proto">
      <div className={'phone' + (show ? ' show-hot' : '')}>
        {prev !== null && <img key={'p' + prev} src={src(prev)} alt="" />}
        <img key={'c' + cur} className="cur" src={src(cur)} alt={`${pScreens[cur].t} screen`} />
        {HOT[cur].map(([x, y, w, h, to, label]) => (
          <button key={label + x + y} className="hot" aria-label={label} onClick={() => go(to < 0 ? back : to)}
            style={{ left: `${(x / 390) * 100}%`, top: `${(y / 814) * 100}%`, width: `${(w / 390) * 100}%`, height: `${(h / 814) * 100}%` }} />
        ))}
      </div>
      <div className="proto-side">
        <small>Screen {cur + 1} of {pScreens.length} · {pScreens[cur].t}</small>
        <p>Tap around, it works like the real thing. Try signing up, logging in, picking a care taker, adding a walk to the cart and placing the order. Or switch off the internet and see what happens.</p>
        <div className="proto-btns">
          <button className="pbtn" onClick={() => setShow((v) => !v)}>{show ? 'Hide' : 'Show'} tap areas</button>
          <button className="pbtn" onClick={() => go(0)}>Restart</button>
          {cur !== OFF && <button className="pbtn" onClick={() => go(OFF)}>Go offline</button>}
        </div>
      </div>
    </div>
  )
}

function Petify() {
  const { root, cover, ov } = useCaseFx()
  return (
    <div ref={root}>
      <Side />
      <div className="cs-ov" ref={ov} aria-hidden="true"><img src="/petify/mockup.webp" alt="" /></div>

      <section className="cs-hero" data-label="Intro">
        <div className="wrap">
          <h1 className="cs-title" style={{ fontSize: 'clamp(40px,9.5vw,170px)' }} aria-label="Petify">
            <span className="nl" aria-hidden="true"><i>Petify</i></span>
            <span className="nl serif" aria-hidden="true"><i>Pet care</i></span>
          </h1>
          <p className="cs-sub fx">Pet care app · UI/UX case study</p>
          <div className="cover-frame" ref={cover}>
            <img src="/petify/mockup.webp" width="1600" height="900" alt="A man holding up a phone showing the Petify splash screen" />
          </div>
          <p className="lead cs-intro fx">Pets can’t book their own walks, so Petify makes it easy for their people. Find a trusted care taker, book what your pet needs, and watch them arrive, all in one bold purple app.</p>
          <dl className="cs-meta fx">
            <div><dt>Type</dt><dd>Concept project</dd></div>
            <div><dt>My role</dt><dd>UI/UX designer</dd></div>
            <div><dt>Platform</dt><dd>Mobile app</dd></div>
            <div><dt>Tools</dt><dd>Figma</dd></div>
          </dl>
        </div>
      </section>

      <section className="cs">
        <div className="wrap">
          <Row no="01" title="Overview" label="Overview">
            <p>Petify is a mobile app that brings pet care to your door. Pet owners can browse care takers, read their profiles, book walks, baths, vet visits or home visits, and follow their care taker live on a map. Care takers get their own sign-up and a profile to show off their experience.</p>
            <p>I designed the first full flow, from the splash screen to live tracking, in a deep purple look with soft lilac panels and paw prints everywhere they fit.</p>
          </Row>

          <Row no="02" title="What I wanted" label="Goals">
            <Points items={[
              ['Find a care taker fast', 'Search, quick service shortcuts and a grid of care takers with their experience and rating, all on the first screen.'],
              ['Trust before you book', 'A verified badge, years of experience, an about section, services and real photo moments on every profile.'],
              ['Booking that feels like shopping', 'Pick services, add them to the cart, change the quantity and see the price before you place the order.'],
              ['Know where they are', 'A live map, an arrival time, Call and Message buttons, and a simple way to rate your care taker.'],
              ['Two sides, one app', 'Pet owners and care takers sign up from the same form and can switch roles with one tap.'],
            ]} />
          </Row>

          <Row no="03" title="The flow" label="Flow">
            <p>From opening the app to your care taker arriving. If the connection drops along the way, a friendly no-internet screen catches you.</p>
            <ol className="flow">
              {flowP.map((f, i) => <li className="rise" key={f} style={{ transitionDelay: `${i * 50}ms` }}><span>{f}</span></li>)}
            </ol>
          </Row>
        </div>
      </section>

      <WireSection folder="petify" list={pScreens} grps={pGroups} no="04" note="The structure under every screen: layout, hierarchy and the main action, with colour and styling stripped away." />

      <section className="cs">
        <div className="wrap">
          <Row no="05" title="The brand" label="Brand">
            <p>A white paw with a black cat peeking out from the pad, on deep purple. Playful, but simple enough to work as a tiny app icon.</p>
            <div className="logo-card rise" style={{ background: '#5b0093' }}><img src="/petify/logo.webp" width="704" height="372" style={{ width: 'min(100%,352px)' }} alt="Petify logo" loading="lazy" /></div>
          </Row>

          <Row no="06" title="Look &amp; feel" label="Design system">
            <p>One strong royal purple does most of the work, with lilac and lavender washes behind it so the screens stay light and friendly. White cards, rounded corners and soft paw-print shapes keep it playful. Poppins leads the browsing and ordering screens, and Inter keeps the forms clean.</p>
            <div className="cs-sw">
              {palP.map(([hex, name]) => (
                <div key={hex}><span style={{ background: hex }} /><b>{name}</b><small>{hex}</small></div>
              ))}
            </div>
            <p>Big pill-shaped buttons, a floating action button and a simple four-tab bottom bar keep everything easy to reach with a thumb.</p>
          </Row>
        </div>
      </section>

      <ScreenSection folder="petify" list={pScreens} grps={pGroups} no="07" />

      <section className="cs">
        <div className="wrap">
          <Row no="08" title="Prototype" label="Prototype">
            <p>I mapped how every screen links to the next, so the whole flow can be tapped through: logging in or signing up as either role, finding a care taker, booking, checking out and tracking the arrival.</p>
            <figure className="wire rise">
              <a href="/petify/user-flow.svg" target="_blank" rel="noopener noreferrer" aria-label="Open the user flow chart full size in a new tab">
                <img src="/petify/user-flow.svg" width="1392" height="1092" alt="The Petify user flow chart: splash leads to login, other login methods and the two sign-up screens, which lead to profile created and Home. Home leads to the care taker profile, services, cart and live tracking. A no-internet screen can appear from any screen." loading="lazy" />
              </a>
              <figcaption><span>Flow</span><span>The user flow (tap to open full size)</span></figcaption>
            </figure>
            <p>Now try it yourself.</p>
            <ProtoPhone />
          </Row>
        </div>
      </section>

      <section className="cs">
        <div className="wrap">
          <Row no="09" title="Where it ended up" label="Outcome">
            <p>A complete first flow, from the splash screen to live tracking, in one consistent purple style.</p>
            <div className="cs-stats">
              {statsP.map(([n, l], i) => (
                <div className="rise" key={l} style={{ transitionDelay: `${i * 80}ms` }}><b>{n}</b><span>{l}</span></div>
              ))}
            </div>
            <p>Still to do: the Search tab sits in the bottom bar but isn’t designed yet, and the “More” services shortcut still needs its own screen. They’re next on my list.</p>
          </Row>
        </div>
      </section>

      <section className="cs-end">
        <div className="wrap">
          <TLink to="/#works" className="btn">← Back to works</TLink>
        </div>
      </section>
    </div>
  )
}

const studies = { 'joe-robbins-photography': JoeRobbins, 'arish-fitness': ArishFitness, 'petify': Petify, 'graphic-works': GraphicWorks }
const titles = { 'joe-robbins-photography': 'Joe Robbins Photography', 'arish-fitness': 'Arish Fitness', 'petify': 'Petify', 'graphic-works': 'Graphic Works' }

export default function CaseStudy() {
  const { slug } = useParams()
  const Study = studies[slug]
  useEffect(() => {
    document.title = Study ? `${titles[slug]} — Case study · Arish Bilal Ahmed` : 'Arish Bilal Ahmed'
    return () => { document.title = 'Arish Bilal Ahmed — UI/UX Designer & Front-End Developer' }
  }, [Study])
  return Study ? <Study /> : (
    <section className="cs-hero"><div className="wrap">
      <p className="lead">That case study doesn’t exist yet.</p>
      <TLink to="/#works" className="btn">← Back to works</TLink>
    </div></section>
  )
}
