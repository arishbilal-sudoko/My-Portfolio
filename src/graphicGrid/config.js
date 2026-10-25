// ─── EVERYTHING THAT DEFINES THE ANIMATION (measured from the reference video) ──────────────
// Sizes are in "reference pixels": the reference window was 668px tall; everything scales with the
// stage height (k = stageHeight / REF.h), so the choreography is identical on any screen.
export const REF = {
  h: 668,            // reference window height
  windowW: 500,      // opening frame width (the single-frame state)
  introFrom: 398,    // tile width at the very start (it scales in to tileSingle)
  tileSingle: 425,   // tile width in the single frame (4:3)
  tileRest: 326,     // tile width in the grid (4:3 → 326 × 244.5)
  gapRest: 47,       // thick black divider between tiles, in the grid
  gapXExtra: 150,    // extra horizontal gap at the start (neighbours sit outside the frame)
  gapYExtra: 320,    // extra vertical gap at the start (rows above/below are hidden)
  radius: 32,        // opening frame corner radius
}

// Time-based curves: [seconds, progress 0→1].
export const INTRO_PTS = [[0, 0], [0.2, 0.59], [0.4, 0.85], [0.6, 0.93], [0.85, 1]]   // frame scales in (398 → 425)
export const EXPAND_PTS = [                                                            // single frame → grid (the "scale-in")
  [0, 0], [1.3, 0], [1.4, 0.03], [1.6, 0.07], [1.8, 0.17], [1.9, 0.4], [2.0, 0.677],
  [2.1, 0.83], [2.2, 0.9], [2.4, 0.98], [2.6, 1],
]

// The shuffle: every row slides one tile to the left. Rows start 0.2s after the row above, and each tile
// starts 0.1s after the tile to its left — that stagger is what makes the black gaps stretch and settle.
export const SHUFFLE = {
  start: 2.6,        // first shuffle begins (top row, left tile)
  period: 2.2,       // seconds between shuffles
  dur: 2.0,          // duration of one tile's slide
  rowDelay: 0.2,
  colDelay: 0.1,
}
// One tile's slide: [fraction of duration, fraction of distance] — eased in and out (zero velocity at both ends), so it glides instead of whipping.
export const SHUFFLE_PTS = [
  [0.0, 0.0], [0.0417, 0.0031], [0.0833, 0.0209], [0.125, 0.0603], [0.1667, 0.1217], [0.2083, 0.2017], [0.25, 0.2949], [0.2917, 0.3951], [0.3333, 0.4964], [0.375, 0.5935], [0.4167, 0.6826], [0.4583, 0.7607], [0.5, 0.8265], [0.5417, 0.8795], [0.5833, 0.9204], [0.625, 0.9504], [0.6667, 0.9711], [0.7083, 0.9846], [0.75, 0.9927], [0.7917, 0.997], [0.8333, 0.999], [0.875, 0.9998], [0.9167, 1.0], [0.9583, 1.0], [1.0, 1.0],
]

// Clock: starts a little before 0 so the opening plays after the page transition has cleared.
export const START_T = -0.7
export const REST_T = 2.55            // reduced motion: hold the grid at rest
export const HOVER_EASE = 5           // how quickly a row speeds up / slows down (higher = snappier)
export const HOVER_ROW_RATE = 0       // speed of the hovered tile's row (0 = halted)
export const OTHER_ROWS_RATE = 0.3    // speed of every other row while a tile is hovered (1 = normal)
export const HOVER_RELEASE_MS = 140   // grace period when the pointer crosses the gap between tiles
export const BG = '#222222'           // page + side-fade colour
export const FADE = { min: 80, vw: 0.15, max: 300 }   // left/right fade width: clamp(min, vw × width, max)
