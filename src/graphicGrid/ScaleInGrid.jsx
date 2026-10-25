import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useAnimationFrame } from 'motion/react'
import { REF, START_T, CAT_START_T, REST_T, HOVER_EASE, HOVER_ROW_RATE, OTHER_ROWS_RATE, HOVER_RELEASE_MS, SHUFFLE, BG, FADE, MARGIN, layoutFor } from './config.js'
import { scene, ROWS, SLOTS } from './model.js'
import { draw } from './draw.js'

const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const SETTLE_T = SHUFFLE.start + 0.6   // clock time at which the opening scale-in is done and the first shuffle is under way
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

/* Full-width scale-in grid. Timing and easing come from config.js, the maths from model.js, the drawing from draw.js;
   this component owns the clocks and the DOM. One instance = one grid: switching category mounts a new one.
   aspect = tile width / height (default 4:3). mix = the scattered "All" order. quick = replay only the scale-in. */
export default function ScaleInGrid({ projects, aspect, mix = true, quick = false, onOpen, onSettled }) {
  const stage = useRef(null)
  const win = useRef(null)
  const tiles = useRef([])
  const L = useMemo(() => layoutFor(aspect), [aspect])
  const T0 = reduce ? REST_T : quick ? CAT_START_T : START_T
  // T = master clock (opening scale-in); TR / rate = one clock + speed per row, so rows can run at different speeds
  const S = useRef({ T: T0, TR: [T0, T0, T0], rate: [1, 1, 1], hoverRow: -1, w: 0, h: 0, H: 0 })
  const leaveTimer = useRef(0)
  const settledCb = useRef(onSettled); settledCb.current = onSettled
  const projRef = useRef(projects); projRef.current = projects

  const paint = useCallback(() => {
    const st = S.current
    if (!st.w || !win.current) return
    const list = projRef.current
    const sc = scene(st, L, list.length, mix, { from: T0, dur: quick ? 0.35 : 0.5 })
    draw(sc, win.current, tiles.current, list)
  }, [L, mix, quick, T0])

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
      st.w = el.clientWidth; st.H = el.clientHeight; st.h = Math.max(1, st.H - MARGIN * 2)
      const k = st.h / REF.h
      el.style.setProperty('--tw', L.rest * k + 'px')
      el.style.setProperty('--th', (L.rest / L.aspect) * k + 'px')
      el.style.setProperty('--fade', clamp(st.w * FADE.vw, FADE.min, FADE.max) + 'px')
      paint()
    }
    const ro = new ResizeObserver(apply); ro.observe(el); apply()
    projects.forEach((p) => { new Image().src = p.image })      // warm the cache so tiles never pop in blank
    return () => ro.disconnect()
  }, [paint, projects, L])

  useEffect(() => { if (reduce) paint() }, [paint])
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
