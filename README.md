# Portfolio (React + Vite) — single page
npm install
npm run dev      # local dev
npm run build    # production build in /dist

Edit lists (projects, skills, quotes, clients) in src/data.js and page text in src/pages.jsx.

## Graphic Works page (full-width scale-in grid)
Route: `/work/graphic-works`. The animation was measured from the reference video; which file controls what:

| What | File |
|---|---|
| Timeline and measurements: opening scale-in, expansion curve, shuffle period / delays / easing, tile + gap sizes, fade width | `src/graphicGrid/config.js` |
| The maths (where every tile is at time T) | `src/graphicGrid/model.js` + `curve.js` |
| Drawing + clock (one rAF loop, tile pool, hover-to-pause) | `src/graphicGrid/ScaleInGrid.jsx` |
| Your artwork (titles, categories, images, focal points) | `src/portfolioData.js` + `/public/images/portfolio/` |
| Lightbox | `src/graphicGrid/Lightbox.jsx` |
| Page around the grid (filters, About, back link) | `src/GraphicWorks.jsx` |

To use your own work: drop images in `/public/images/portfolio/`, then edit the matching entries in `src/portfolioData.js`
(`image`, `title`, `category`, `description`, `position`). New categories appear in the filters automatically.
The grid cycles through every project in the list, so add as many as you like.
