// Pure maths for the animation (no DOM). ScaleInGrid.jsx draws what this returns.
import { curve } from './curve.js'
import { REF, INTRO_PTS, EXPAND_PTS, SHUFFLE, SHUFFLE_PTS, MARGIN, layoutFor } from './config.js'

const introC = curve(INTRO_PTS), expandC = curve(EXPAND_PTS), shuffleC = curve(SHUFFLE_PTS)
const clamp01 = (v) => Math.min(1, Math.max(0, v))

// Size/placement of the whole lattice at time T. k = stage height / REF.h, vw = stage width, L = tile layout (see layoutFor).
export function frameState(T, k, vw, L = layoutFor()) {
  const e = expandC(T), s = introC(Math.max(0, T))
  const single = L.intro + (L.single - L.intro) * s
  const tw = (single * (1 - e) + L.rest * e) * k
  const th = tw / L.aspect
  const gx = (REF.gapRest + REF.gapXExtra * (1 - e)) * k
  const gy = (REF.gapRest + REF.gapYExtra * (1 - e)) * k
  return { e, tw, th, px: tw + gx, py: th + gy, ww: REF.windowW * k * (1 - e) + vw * e, radius: REF.radius * k * (1 - e) }
}

// How many tile-widths world column w (in row `row`, 0 = top) has slid to the left by time T.
export function shiftTotal(w, row, T) {
  const kmax = Math.floor((T - SHUFFLE.start) / SHUFFLE.period)
  if (kmax < 0) return 0
  const first = Math.max(0, kmax - 3)
  let total = first
  for (let k = first; k <= kmax; k++) {
    const col = w - k                                            // screen column before this shuffle
    const start = SHUFFLE.start + SHUFFLE.period * k + SHUFFLE.rowDelay * row + SHUFFLE.colDelay * Math.max(0, col + 1)
    total += shuffleC(clamp01((T - start) / SHUFFLE.dur))
  }
  return total
}

// Which world columns could be on screen at time T (the component draws these; the rest are hidden).
export function columnRange(T, px, half) {
  const cols = Math.ceil(half / px) + 1
  const kmax = Math.max(0, Math.floor((T - SHUFFLE.start) / SHUFFLE.period))
  return [kmax - cols - 1, kmax + cols + 2]
}

// ─── THE SCENE: where every tile and the window are at time T (no DOM, so it can be tested) ───
export const ROWS = [-1, 0, 1]      // the reference shows three rows (top and bottom partly cut off)
export const SLOTS = 20             // tile elements per row, re-used as the grid scrolls
const mod = (a, n) => ((a % n) + n) % n

// Which project a world tile shows. "mix" (the All grid) keeps the reference's scattered order; a single-category grid
// walks through its works in order, offsetting each row so the same piece never sits directly above or below itself.
export function tileProject(w, ri, N, mix) {
  if (mix) return mod(w * 3 + ri * 5, N)
  return mod(w + ri * Math.max(1, Math.floor(N / 3)), N)
}

// st = { TR: [clock per row], T: master clock, w: stage width, h: stage height minus the opening margin, H: stage height }
// ap = { from, dur } fade-in of the whole grid.
export function scene(st, L, N, mix, ap) {
  const T = st.T, k = st.h / REF.h
  const f = frameState(T, k, st.w, L)
  const scale = f.tw / (L.rest * k)
  const appear = Math.min(1, Math.max(0, (T - ap.from) / ap.dur))
  const win = { width: f.ww, radius: f.radius, opacity: appear, scale: 0.97 + 0.03 * appear, inset: MARGIN * (1 - f.e) }
  const tiles = []
  ROWS.forEach((r, ri) => {
    const Tr = st.TR[ri]
    const [lo, hi] = columnRange(Tr, f.px, f.ww / 2 + L.rest * k)
    for (let w = lo; w <= hi && w - lo < SLOTS; w++) {
      const x = (w - shiftTotal(w, ri, Tr)) * f.px
      const y = r * f.py
      if (Math.abs(x) - f.tw / 2 >= f.ww / 2 || Math.abs(y) - f.th / 2 >= st.H / 2) continue
      tiles.push({ slot: ri * SLOTS + mod(w, SLOTS), x, y, scale, pi: tileProject(w, ri, N, mix) })
    }
  })
  return { win, tiles, f }
}
