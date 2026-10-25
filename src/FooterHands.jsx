import { useEffect, useRef } from 'react'
import { GRID } from './footerHandsData.js'

/* Two reaching hands drawn as a field of text characters.

   Look
   - Every cell of the hands holds one character picked from a "density ramp": dots and commas on the faint
     edges, then - ~ ^ : ;  then = + < > ? !  and brackets / slashes / chevrons ( ) [ ] { } / \ | « » in the dense core.
   - The cells sit on a 10.5 x 10.75 px grid (at a 1918px screen) in a dim red.

   Motion
   - Reveal: as the footer scrolls in, characters appear from the bottom of the hands upward, with a little randomness.
   - Parallax: the two hands drift apart / together and up / down with the pointer, eased with a ~0.16s lag.
   - Hover: moving the pointer paints a ragged brush stroke of solid red cells with dark glyphs (math symbols mixed in).
     Each cell snaps on, holds for a split second, then fades out, so fast strokes leave a short-lived trail.
     Nothing lights up while the pointer is still. */

const DESIGN_W = 1918, DESIGN_H = 956      // the screen the hands were traced from
const CELL_W = 10.5, CELL_H = 10.75        // character cell at that size
const OX = -3, OY = 147.25                 // where the grid starts in that design (x, y)
const SPLIT = 91                           // columns [0, SPLIT) belong to the left hand, the rest to the right
const ROWS = GRID.length, COLS = GRID[0].length

// density ramp, faint → dense
const RAMP = [
  '',
  `.,'\``,
  '-~^:;',
  '=+<>?!;',
  '()[]{}<>=!?/\\|»',
  '[]{}()/\\|«»!',
]
const MATH = '∑≠≤≥√∫∏±÷×≈∞'               // extra symbols that flicker inside lit cells

// brush + timing, measured from the reference
const BRUSH = 3.0                          // brush radius, in cells
const HOLD = [0.03, 0.30]                  // how long a lit cell stays solid (s)
const FADE = 0.1                           // fade-out time (s)
const PAR_X = 17.5, PAR_Y = 11             // max parallax at the screen edge (px, at design size)
const ALPHA = [0.5, 0.95]                    // per-character brightness range of the resting glyphs
const PAR_TAU = 0.16                       // parallax easing time constant (s)

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const mulberry = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }

export default function FooterHands() {
  const left = useRef(null), right = useRef(null)

  useEffect(() => {
    const cvs = [left.current, right.current]
    const ctxs = cvs.map((c) => c.getContext('2d'))
    const host = cvs[0].parentElement
    let W = 1, H = 1, dpr = 1, k = 1, cw = 10, ch = 10, top = 0
    let n = 0, cell = [], sprites = null, glyphIdx = {}, chars = ''
    const org = [0, 0]                                     // left edge of each canvas, in footer px
    const off = [{ x: 0, y: 0 }, { x: 0, y: 0 }]           // current parallax offsets (smoothed)
    const tgt = [{ x: 0, y: 0 }, { x: 0, y: 0 }]
    let raf = 0, visible = true, last = 0, lastRp = -1
    const dirty = [true, true]
    const ptr = { x: 0, y: 0, px: 0, py: 0, in: false, moved: false, nx: 0, ny: 0 }

    const build = () => {
      W = Math.max(1, host.clientWidth); H = Math.max(1, host.clientHeight)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      k = Math.max(W / DESIGN_W, 0.62)                      // never let the characters get unreadably small
      cw = CELL_W * k; ch = CELL_H * k
      const layerW = COLS * cw
      const ox = layerW <= W + 1 ? OX * k : (W - layerW) / 2   // narrow screens: centre the hands
      // the hands' lower edge sits right on top of the name, as in the reference
      const name = host.querySelector('.f-name')
      top = name ? name.offsetTop + 5 * k - ROWS * CELL_H * k : H - (DESIGN_H - OY) * k
      org[0] = ox; org[1] = ox + SPLIT * cw
      const widths = [SPLIT * cw, (COLS - SPLIT) * cw]
      const heightPx = ROWS * ch
      cvs.forEach((c, i) => {
        c.width = Math.ceil(widths[i] * dpr); c.height = Math.ceil(heightPx * dpr)
        c.style.width = widths[i] + 'px'; c.style.height = heightPx + 'px'
        c.style.left = org[i] + 'px'; c.style.top = top + 'px'
      })

      // character sprites (normal + dark-on-red), drawn once
      const sw = Math.max(1, Math.round(cw * dpr)), sh = Math.max(1, Math.round(ch * dpr))
      chars = [...new Set((RAMP.join('') + MATH).split(''))].join('')
      glyphIdx = {}; [...chars].forEach((g, i) => { glyphIdx[g] = i })
      const mk = (color) => [...chars].map((g) => {
        const s = document.createElement('canvas'); s.width = sw; s.height = sh
        const x = s.getContext('2d'); x.fillStyle = color; x.textAlign = 'center'; x.textBaseline = 'middle'
        x.font = `400 ${Math.round(sh * 0.8)}px ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace`
        x.fillText(g, sw / 2, sh / 2 + sh * 0.05)
        return s
      })
      sprites = { n: mk('#e0301f'), d: mk('#1c0503') }
      sprites.w = sw / dpr; sprites.h = sh / dpr

      // one record per cell that holds a character
      cell = []
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cls = GRID[r].charCodeAt(c) - 48
          if (!cls) continue
          const rnd = mulberry(r * 1009 + c * 7919 + 13)
          const set = RAMP[cls]
          cell.push({
            r, c, cls, h: c < SPLIT ? 0 : 1,
            g: glyphIdx[set[Math.floor(rnd() * set.length)]],
            a: ALPHA[0] + rnd() * (ALPHA[1] - ALPHA[0]),                         // each character has its own brightness
            o: 0.7 * (1 - r / (ROWS - 1)) + 0.3 * rnd(),    // reveal order: bottom first, with some scatter
            L: 0, lg: 0,                                    // time left lit, lit-state glyph
          })
        }
      }
      n = cell.length
      dirty[0] = dirty[1] = true; lastRp = -1
    }

    const draw = (h, rp) => {
      const ctx = ctxs[h]; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cvs[h].width / dpr, cvs[h].height / dpr)
      const c0 = h ? SPLIT : 0, sw = sprites.w, sh = sprites.h
      for (let i = 0; i < n; i++) {
        const t = cell[i]; if (t.h !== h) continue
        let a = clamp((rp * 1.25 - t.o) / 0.2, 0, 1)         // reveal
        if (t.r > ROWS - 4) a *= (ROWS - t.r) / 4              // soft bottom edge, in case no name covers it
        if (a <= 0) continue
        const x = Math.round((t.c - c0) * cw * dpr) / dpr, y = Math.round(t.r * ch * dpr) / dpr
        ctx.globalAlpha = a * t.a
        ctx.drawImage(sprites.n[t.g], x, y, sw, sh)
        if (t.L > 0) {                                         // lit: solid red cell, dark glyph
          const la = clamp(t.L / FADE, 0, 1) * a
          ctx.globalAlpha = la
          ctx.fillStyle = '#4a0b06'; ctx.fillRect(x, y, sw, sh)
          ctx.fillStyle = '#a81f13'; ctx.fillRect(x + 1, y + 1, sw - 2, sh - 2)
          ctx.globalAlpha = la * 0.92
          ctx.drawImage(sprites.d[t.lg], x, y, sw, sh)
        }
      }
      ctx.globalAlpha = 1
    }

    // paint a stroke from (x0,y0) to (x1,y1), footer-local px
    const stamp = (x0, y0, x1, y1) => {
      const R = BRUSH * cw, dx = x1 - x0, dy = y1 - y0, len2 = dx * dx + dy * dy
      for (let i = 0; i < n; i++) {
        const t = cell[i]
        const cx = org[t.h] + off[t.h].x + (t.c - (t.h ? SPLIT : 0) + 0.5) * cw
        const cy = top + off[t.h].y + (t.r + 0.5) * ch
        const u = len2 ? clamp(((cx - x0) * dx + (cy - y0) * dy) / len2, 0, 1) : 0
        const d = Math.hypot(cx - (x0 + dx * u), cy - (y0 + dy * u)) / R
        if (d >= 1) continue
        if (Math.random() > Math.pow(1 - d * d, 0.5) * 0.98) continue      // ragged, noisy edge
        const life = FADE + HOLD[0] + Math.pow(Math.random(), 1.5) * (HOLD[1] - HOLD[0])
        if (t.L <= 0) t.lg = glyphIdx[(RAMP[Math.max(2, t.cls)] + MATH)[Math.floor(Math.random() * (RAMP[Math.max(2, t.cls)].length + MATH.length))]]
        if (life > t.L) t.L = life
        dirty[t.h] = true
      }
    }

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      if (!visible) { last = now; return }
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now
      const rect = host.getBoundingClientRect()
      const rp = reduce ? 1 : clamp((window.innerHeight - rect.top) / (rect.height * 0.7), 0, 1)

      if (!reduce) {
        // parallax: hands drift apart / together with the pointer's x, and both follow its y
        const s = W / DESIGN_W
        tgt[0].x = -ptr.nx * PAR_X * s; tgt[1].x = ptr.nx * PAR_X * s
        tgt[0].y = tgt[1].y = -ptr.ny * PAR_Y * s
        const e = 1 - Math.exp(-dt / PAR_TAU)
        for (let h = 0; h < 2; h++) {
          const o = off[h]
          o.x += (tgt[h].x - o.x) * e; o.y += (tgt[h].y - o.y) * e
          if (Math.abs(tgt[h].x - o.x) < 0.01) o.x = tgt[h].x
          if (Math.abs(tgt[h].y - o.y) < 0.01) o.y = tgt[h].y
          cvs[h].style.transform = `translate3d(${o.x.toFixed(2)}px,${o.y.toFixed(2)}px,0)`
        }
        // hover: brush from the previous pointer position to the current one (only while it moves)
        if (ptr.in && ptr.moved) {
          stamp(ptr.px, ptr.py, ptr.x, ptr.y)
          ptr.px = ptr.x; ptr.py = ptr.y; ptr.moved = false
        }
        // lit cells: count down, flicker the glyph a little while solid
        for (let i = 0; i < n; i++) {
          const t = cell[i]; if (t.L <= 0) continue
          t.L -= dt; dirty[t.h] = true
          if (t.L > FADE && Math.random() < 0.07) t.lg = glyphIdx[MATH[Math.floor(Math.random() * MATH.length)]] ?? t.lg
          if (t.L <= 0) t.L = 0
        }
      }

      if (rp !== lastRp) { dirty[0] = dirty[1] = true; lastRp = rp }
      for (let h = 0; h < 2; h++) if (dirty[h]) { draw(h, rp); dirty[h] = false }
    }

    const move = (e) => {
      if (e.pointerType === 'touch') return
      ptr.nx = clamp((e.clientX / window.innerWidth - 0.5) * 2, -1, 1)
      ptr.ny = clamp((e.clientY / window.innerHeight - 0.5) * 2, -1, 1)
      const r = host.getBoundingClientRect()
      ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top
      const inside = ptr.x >= 0 && ptr.y >= 0 && ptr.x <= r.width && ptr.y <= r.height
      if (inside && !ptr.in) { ptr.px = ptr.x; ptr.py = ptr.y }
      ptr.in = inside; ptr.moved = inside
    }

    build()
    const ro = new ResizeObserver(build); ro.observe(host)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; dirty[0] = dirty[1] = true }); io.observe(host)
    if (!reduce) window.addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      window.removeEventListener('pointermove', move)
    }
  }, [])

  return (
    <>
      <canvas className="f-hand" ref={left} aria-hidden="true" />
      <canvas className="f-hand" ref={right} aria-hidden="true" />
    </>
  )
}
