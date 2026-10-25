import { useCallback, useEffect, useRef } from 'react'
import { useAnimationFrame } from 'motion/react'
import { REF, START_T, REST_T, HOVER_EASE, HOVER_ROW_RATE, OTHER_ROWS_RATE, HOVER_RELEASE_MS, SHUFFLE, BG, FADE } from './config.js'
import { frameState, shiftTotal, columnRange } from './model.js'

const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const ROWS = [-1, 0, 1]      // the reference shows three rows (top and bottom partly cut off)
const SLOTS = 16             // tile elements per row, re-used as the grid scrolls
const SETTLE_T = SHUFFLE.start + 0.6   // clock time at which the opening scale-in is done and the first shuffle is under way
const MARGIN = 12            // px of background above and below the grid
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const mod = (a, n) => ((a % n) + n) % n

/* Full-width scale-in grid. Timing and easing come from config.js, the maths from model.js;
   this component only draws: one rAF loop (Motion's useAnimationFrame) moves ~30 absolutely-positioned tiles. */
export default function ScaleInGrid({ projects, active, onOpen, onSettled }) {
  const stage = useRef(null)
  const win = useRef(null)
  const tiles = useRef([])
  const T0 = reduce ? REST_T : START_T
  // T = master clock (opening scale-in); TR / rate = one clock + speed per row, so rows can run at different speeds
  const S = useRef({ T: T0, TR: [T0, T0, T0], rate: [1, 1, 1], hoverRow: -1, w: 0, h: 0 })
  const leaveTimer = useRef(0)
  const settledCb = useRef(onSettled); settledCb.current = onSettled
  const activeRef = useRef(active); activeRef.current = active
  const projRef = useRef(projects); projRef.current = projects

  const paint = useCallback(() => {
    const st = S.current
    if (!st.w || !win.current) return
    const T = st.T, k = st.h / REF.h
    const f = frameState(T, k, st.w)
    const scale = f.tw / (REF.tileRest * k)
    const appear = clamp((T - START_T) / 0.5, 0, 1)

    const el = win.current
    el.style.width = f.ww + 'px'
    el.style.borderRadius = f.radius + 'px'
    el.style.opacity = appear
    el.style.transform = `translateX(-50%) scale(${0.97 + 0.03 * appear})`

    const list = projRef.current, N = list.length
    const used = new Uint8Array(ROWS.length * SLOTS)
    ROWS.forEach((r, ri) => {
      const Tr = st.TR[ri]
      const [lo, hi] = columnRange(Tr, f.px, f.ww / 2 + REF.tileRest * k)
      for (let w = lo; w <= hi && w - lo < SLOTS; w++) {
        const x = (w - shiftTotal(w, ri, Tr)) * f.px
        const y = r * f.py
        if (Math.abs(x) - f.tw / 2 >= f.ww / 2 || Math.abs(y) - f.th / 2 >= st.h / 2) continue
        const idx = ri * SLOTS + mod(w, SLOTS)
        const t = tiles.current[idx]
        if (!t) continue
        used[idx] = 1
        t.style.transform = `translate3d(${x.toFixed(3)}px,${y.toFixed(3)}px,0) scale(${scale.toFixed(4)})`
        if (t._vis !== 1) { t.style.visibility = 'visible'; t._vis = 1 }
        const pi = mod(w * 3 + ri * 5, N)                       // which project this world tile shows
        if (t._p !== pi) {
          t._p = pi; t.dataset.p = pi
          const img = t.firstChild.firstChild
          img.src = list[pi].image; img.style.objectPosition = list[pi].position
          t.setAttribute('aria-label', `Open ${list[pi].title}`)
        }
        const on = activeRef.current(list[pi])
        if (t._on !== on) { t._on = on; t.classList.toggle('dim', !on) }
      }
    })
    tiles.current.forEach((t, i) => { if (t && !used[i] && t._vis !== 0) { t.style.visibility = 'hidden'; t._vis = 0 } })
  }, [])

  // the animation clocks: while a tile is hovered its row halts and the other rows crawl; they all ease back afterwards
  useAnimationFrame((_, delta) => {
    if (reduce) return
    const st = S.current
    const dt = Math.min(0.05, delta / 1000)
    st.T += dt
    if (!st.settled && st.T >= SETTLE_T) { st.settled = true; settledCb.current && settledCb.current() }   // grid fully built
    const live = st.T >= SHUFFLE.start - 0.2          // hover only matters once the opening scale-in is done
    const ease = 1 - Math.exp(-dt * HOVER_EASE)       // frame-rate independent smoothing
    for (let i = 0; i < ROWS.length; i++) {
      const target = !live || st.hoverRow < 0 ? 1 : i === st.hoverRow ? HOVER_ROW_RATE : OTHER_ROWS_RATE
      st.rate[i] += (target - st.rate[i]) * ease
      if (Math.abs(target - st.rate[i]) < 0.0005) st.rate[i] = target
      st.TR[i] += dt * st.rate[i]
    }
    paint()
  })

  // measure the stage; size the tiles
  useEffect(() => {
    const el = stage.current
    const apply = () => {
      const st = S.current   // layout size (clientWidth/Height) ignores any CSS scale on a parent, so the grid keeps its design proportions
      st.w = el.clientWidth; st.h = Math.max(1, el.clientHeight - MARGIN * 2)
      const k = st.h / REF.h
      el.style.setProperty('--tw', REF.tileRest * k + 'px')
      el.style.setProperty('--th', REF.tileRest * k * 0.75 + 'px')
      el.style.setProperty('--fade', clamp(st.w * FADE.vw, FADE.min, FADE.max) + 'px')
      paint()
    }
    const ro = new ResizeObserver(apply); ro.observe(el); apply()
    projects.forEach((p) => { new Image().src = p.image })      // warm the cache so tiles never pop in blank
    return () => ro.disconnect()
  }, [paint, projects])

  useEffect(() => { if (reduce) paint() }, [active, paint])
  useEffect(() => () => clearTimeout(leaveTimer.current), [])

  return (
    <div className="gw-stage" ref={stage} style={{ '--gw-bg': BG, '--gw-m': MARGIN + 'px' }}>
      <div className="gw-win" ref={win}>
        <div
          className="gw-world"
          onPointerOver={(e) => {
            if (e.pointerType === 'touch') return
            const tile = e.target.closest('.gw-tile')
            clearTimeout(leaveTimer.current)
            if (tile) S.current.hoverRow = Number(tile.dataset.row)
            else leaveTimer.current = setTimeout(() => { S.current.hoverRow = -1 }, HOVER_RELEASE_MS)
          }}
          onPointerLeave={() => {
            clearTimeout(leaveTimer.current)
            leaveTimer.current = setTimeout(() => { S.current.hoverRow = -1 }, HOVER_RELEASE_MS)
          }}
        >
          {ROWS.map((r, ri) => Array.from({ length: SLOTS }, (_, j) => (
            <button
              key={`${r}-${j}`} type="button" tabIndex={-1} className="gw-tile" data-row={ri}
              ref={(el) => { tiles.current[ri * SLOTS + j] = el }}
              onClick={(e) => onOpen(Number(e.currentTarget.dataset.p))}
            >
              <span className="gw-pop"><img alt="" draggable="false" decoding="async" /></span>
            </button>
          )))}
        </div>
      </div>
      <div className="gw-fade l" aria-hidden="true" />
      <div className="gw-fade r" aria-hidden="true" />
      <button type="button" className="sr-only" onClick={() => onOpen(0)}>Open the gallery</button>
    </div>
  )
}
