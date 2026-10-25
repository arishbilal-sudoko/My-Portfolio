// Applies a scene (from model.js) to the DOM. Used by ScaleInGrid.jsx and by the test harness.
export function draw(sc, win, tiles, list) {
  win.style.width = sc.win.width + 'px'
  win.style.borderRadius = sc.win.radius + 'px'
  win.style.opacity = sc.win.opacity
  win.style.top = win.style.bottom = sc.win.inset + 'px'
  win.style.transform = `translateX(-50%) scale(${sc.win.scale})`
  const used = new Uint8Array(tiles.length)
  for (const p of sc.tiles) {
    const t = tiles[p.slot]
    if (!t) continue
    used[p.slot] = 1
    t.style.transform = `translate3d(${p.x.toFixed(3)}px,${p.y.toFixed(3)}px,0) scale(${p.scale.toFixed(4)})`
    if (t._vis !== 1) { t.style.visibility = 'visible'; t._vis = 1 }
    if (t._p !== p.pi) {
      t._p = p.pi; t.dataset.p = p.pi
      const img = t.firstChild.firstChild
      img.src = list[p.pi].image; img.style.objectPosition = list[p.pi].position
      t.setAttribute('aria-label', `Open ${list[p.pi].title}`)
    }
  }
  tiles.forEach((t, i) => { if (t && !used[i] && t._vis !== 0) { t.style.visibility = 'hidden'; t._vis = 0 } })
}
