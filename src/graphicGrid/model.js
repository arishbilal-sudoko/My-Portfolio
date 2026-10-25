// Pure maths for the animation (no DOM). ScaleInGrid.jsx draws what this returns.
import { curve } from './curve.js'
import { REF, INTRO_PTS, EXPAND_PTS, SHUFFLE, SHUFFLE_PTS } from './config.js'

const introC = curve(INTRO_PTS), expandC = curve(EXPAND_PTS), shuffleC = curve(SHUFFLE_PTS)
const clamp01 = (v) => Math.min(1, Math.max(0, v))

// Size/placement of the whole lattice at time T. k = stage height / REF.h, vw = stage width.
export function frameState(T, k, vw) {
  const e = expandC(T), s = introC(Math.max(0, T))
  const single = REF.introFrom + (REF.tileSingle - REF.introFrom) * s
  const tw = (single * (1 - e) + REF.tileRest * e) * k
  const th = tw * 0.75
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
