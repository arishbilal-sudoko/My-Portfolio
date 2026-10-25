// ─── TILE GEOMETRY ─────────────────────────────────────────────────────────────────────────
// A unit grid: 12 columns × 8 rows (the expanded frame is 3:2, so units are square).
// Every tile is  [slot, column, row, width, height]  in grid units.
//   • slot = which project the tile shows (slot n → projects[n] in portfolioData.js).
//   • The same slot in two neighbouring states is the SAME tile, so it slides/resizes between them.
//   • A slot that is only in the new state scales in; one that is only in the old state scales out.
// Each state fills the frame completely; the black dividers come from the gap between tiles.
export const STATES = [
  // 0 · single frame: one 4:3 artwork
  { name: 'single', frame: 'single', cols: 1, rows: 1, tiles: [[0, 0, 0, 1, 1]] },

  // 1 · first expansion: big 4:3 tile + vertical divider column + two horizontal bars
  { name: 'expand', frame: 'full', cols: 12, rows: 8, tiles: [
    [0, 0, 0, 8, 6], [1, 8, 0, 4, 2], [2, 8, 2, 4, 4], [3, 0, 6, 5, 2], [4, 5, 6, 7, 2],
  ] },

  // 2 · multi-tile: three 4:3 tiles on top, a tall sliver, one wide, a thin bar along the bottom
  { name: 'multi', frame: 'full', cols: 12, rows: 8, tiles: [
    [1, 0, 0, 4, 3], [0, 4, 0, 4, 3], [2, 8, 0, 4, 3], [5, 0, 3, 2, 5], [6, 2, 3, 6, 4], [7, 8, 3, 4, 4], [3, 2, 7, 10, 1],
  ] },

  // 3 · shuffle: tall column on the left, bars and blocks stacked on the right
  { name: 'shuffle-1', frame: 'full', cols: 12, rows: 8, tiles: [
    [8, 0, 0, 3, 8], [6, 3, 0, 6, 4], [2, 9, 0, 3, 5], [1, 3, 4, 3, 4], [9, 6, 4, 3, 2], [10, 9, 5, 3, 1], [5, 6, 6, 6, 2],
  ] },

  // 4 · shuffle: wide bar across the top, vertical divider in the middle
  { name: 'shuffle-2', frame: 'full', cols: 12, rows: 8, tiles: [
    [0, 0, 0, 6, 2], [11, 6, 0, 6, 4], [12, 0, 2, 4, 3], [3, 4, 2, 2, 6], [7, 0, 5, 4, 3], [9, 6, 4, 3, 4], [13, 9, 4, 3, 4],
  ] },

  // 5 · final resting arrangement
  { name: 'final', frame: 'full', cols: 12, rows: 8, tiles: [
    [0, 0, 0, 6, 5], [14, 6, 0, 3, 3], [2, 9, 0, 3, 5], [15, 6, 3, 3, 2], [12, 0, 5, 3, 3], [5, 3, 5, 5, 3], [13, 8, 5, 4, 3],
  ] },
]

// On tall (portrait) screens the same choreography runs on a 8 × 12 grid: columns and rows swap.
export const transpose = (s) =>
  s.frame === 'single'
    ? s
    : { ...s, cols: s.rows, rows: s.cols, tiles: s.tiles.map(([id, c, r, w, h]) => [id, r, c, h, w]) }
