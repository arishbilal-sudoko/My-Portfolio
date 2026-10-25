// The red "snake" used in page transitions. It's drawn on a canvas (not by animating an SVG stroke), which keeps
// it smooth: the path is sampled by arc length, so it moves at an even speed, and its body tapers towards the tail.
const SEGS = [
  [[-0.12, -0.10], [0.12, 1.27], [0.46, -0.37], [0.62, 0.43]],
  [[0.62, 0.43], [0.78, 1.23], [0.90, 0.87], [1.12, 1.17]],
]
const STEPS = 320
const bez = (p, t) => {
  const u = 1 - t
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t]
  return [0, 1].map((a) => k[0] * p[0][a] + k[1] * p[1][a] + k[2] * p[2][a] + k[3] * p[3][a])
}

export function createSnake(canvas) {
  const ctx = canvas.getContext('2d')
  let pts = [], cum = [0], total = 1, W = 1, H = 1, R = 40

  const prepare = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    W = window.innerWidth; H = window.innerHeight
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    R = Math.max(26, Math.min(52, Math.max(W, H) * 0.03))
    pts = []
    SEGS.forEach((s, si) => {
      for (let i = si ? 1 : 0; i <= STEPS; i++) { const [x, y] = bez(s, i / STEPS); pts.push([x * W, y * H]) }
    })
    cum = [0]
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
    total = cum[cum.length - 1]
  }
  const find = (d) => {
    let lo = 0, hi = cum.length - 1
    while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < d) lo = m + 1; else hi = m }
    return lo
  }
  // tail / head are 0..1 positions along the path
  const draw = (tail, head) => {
    ctx.clearRect(0, 0, W, H)
    if (head <= tail) return
    const t0 = tail * total, t1 = head * total, span = Math.max(1, t1 - t0)
    ctx.fillStyle = '#e10600'
    ctx.beginPath()
    for (let i = find(t0); i <= find(t1); i++) {
      const u = (cum[i] - t0) / span // 0 at the tail, 1 at the head
      const r = R * (0.16 + 0.84 * Math.pow(Math.min(1, u * 1.7), 0.75))
      ctx.moveTo(pts[i][0] + r, pts[i][1])
      ctx.arc(pts[i][0], pts[i][1], r, 0, Math.PI * 2)
    }
    ctx.fill()
  }
  const clear = () => ctx.clearRect(0, 0, W, H)
  return { prepare, draw, clear }
}
