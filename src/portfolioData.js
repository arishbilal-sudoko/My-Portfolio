// ─── YOUR GRAPHIC WORKS ────────────────────────────────────────────────────────────────────
// The grid builds itself from this list. To use your own work:
//   1. Save an image in /public/images/portfolio/ (WebP or JPG, under ~250 KB). Save each piece at its REAL proportions:
//      posters & social posts 1200x1500, thumbnails 1080x1080, blog graphics 1200x675, standees tall and narrow (see `aspects` below).
//   2. Change `image` (and `title`, `category`, `description`) on one of the entries below.
//   3. `position` is the focal point when the image is cropped: '50% 50%' = centre, '50% 20%' = favour the top.
// Add or remove entries freely. The animated grid reuses tile elements and cycles through
// all works in the selected category; images repeat automatically to fill the rows.
// Keep `id`s unique and unchanged once set. Categories are picked up automatically for the filters.
export const projects = [
  { id: 'work-01', title: 'Poster design', category: 'Posters', image: '/images/portfolio/01-posters.webp', description: 'A poster built around one clear idea.', position: '50% 50%' },
  {"id": "work-02", "title": "CSS for Creatives", "category": "Thumbnails", "image": "/images/portfolio/thumbnails/css-for-creatives.webp", "description": "CSS for Creatives — GrowthCraft course graphic.", "position": "50% 50%"},
  { id: 'work-03', title: 'Poster design', category: 'Posters', image: '/images/portfolio/03-posters.webp', description: 'A poster built around one clear idea.', position: '50% 50%' },
  {"id": "work-04", "title": "Product lessons — SynthWeb", "category": "Social", "image": "/images/portfolio/social/product-lessons.webp", "description": "Social graphic sharing lessons from building and launching multiple products.", "position": "50% 50%"},
  {"id": "work-05", "title": "SynthWeb Studio — brand identity", "category": "Branding", "image": "/images/portfolio/branding/synthweb-studio.webp", "description": "SynthWeb Studio — brand identity.", "position": "50% 50%"},
  {"id": "work-06", "title": "Amuthi — product standee", "category": "Standees", "image": "/images/portfolio/standees/amuthi.webp", "description": "Amuthi — product standee.", "position": "50% 50%"},
  { id: 'work-07', title: 'Poster design', category: 'Posters', image: '/images/portfolio/07-posters.webp', description: 'A poster built around one clear idea.', position: '50% 50%' },
  {"id": "work-08", "title": "FlutterVerse: Advanced Flutter", "category": "Thumbnails", "image": "/images/portfolio/thumbnails/flutterverse.webp", "description": "FlutterVerse: Advanced Flutter — GrowthCraft course graphic.", "position": "50% 50%"},
  {"id": "work-09", "title": "SYNC 26 — event standee", "category": "Standees", "image": "/images/portfolio/standees/sync-26.webp", "description": "SYNC 26 — event standee.", "position": "50% 50%"},
  {"id": "work-10", "title": "Design communication — SynthWeb", "category": "Social", "image": "/images/portfolio/social/design-communication.webp", "description": "Social graphic on the communication behind product and design decisions.", "position": "50% 50%"},
  {"id": "work-11", "title": "Freelancer vs offshore engineering — 12-month costs", "category": "Blogs", "image": "/images/portfolio/blogs/freelancer-vs-offshore.webp", "description": "Freelancer vs offshore engineering — 12-month costs.", "position": "50% 50%"},
  {"id": "work-12", "title": "Swagata Borah Productions — logo", "category": "Branding", "image": "/images/portfolio/branding/swagata-borah-productions.webp", "description": "Swagata Borah Productions — logo.", "position": "50% 50%"},
  {"id": "work-13", "title": "iOS Insights: Advanced Swift", "category": "Thumbnails", "image": "/images/portfolio/thumbnails/ios-insights.webp", "description": "iOS Insights: Advanced Swift — GrowthCraft course graphic.", "position": "50% 50%"},
  { id: 'work-14', title: 'Poster design', category: 'Posters', image: '/images/portfolio/14-posters.webp', description: 'A poster built around one clear idea.', position: '50% 50%' },
  {"id": "work-15", "title": "Production performance — SynthWeb", "category": "Social", "image": "/images/portfolio/social/production-performance.webp", "description": "Social graphic sharing performance lessons from production.", "position": "50% 50%"},
  {"id": "work-16", "title": "Why we chose a modular monolith for Amuthi", "category": "Blogs", "image": "/images/portfolio/blogs/amuthi-modular-monolith.webp", "description": "Why we chose a modular monolith for Amuthi.", "position": "50% 50%"},
  {"id": "work-17", "title": "Skills-based hiring — Cairn", "category": "Social", "image": "/images/portfolio/social/skills-based-hiring.webp", "description": "A visual comparison of hiring practices, from credentials to demonstrated skills.", "position": "50% 50%"},
  {"id": "work-18", "title": "Sattriya — Assam’s dance form", "category": "Social", "image": "/images/portfolio/social/sattriya-dance.webp", "description": "A cultural social graphic celebrating Sattriya, a dance form from Assam.", "position": "50% 50%"},
  {"id": "work-19", "title": "Design interfaces people can use", "category": "Social", "image": "/images/portfolio/social/intuitive-ui.webp", "description": "A social graphic about making interfaces intuitive and easy to use.", "position": "50% 50%"},
  {"id": "thumbnail-nextjs-ninja", "title": "Next.js Ninja: Advanced Patterns", "category": "Thumbnails", "image": "/images/portfolio/thumbnails/nextjs-ninja.webp", "description": "Next.js Ninja: Advanced Patterns — GrowthCraft course graphic.", "position": "50% 50%"},
  {"id": "thumbnail-powerup-bi", "title": "PowerUp BI: Microsoft Power BI", "category": "Thumbnails", "image": "/images/portfolio/thumbnails/powerup-bi.webp", "description": "PowerUp BI: Microsoft Power BI — GrowthCraft course graphic.", "position": "50% 50%"},
  {"id": "thumbnail-react-ready", "title": "React Ready: Build with Components", "category": "Thumbnails", "image": "/images/portfolio/thumbnails/react-ready.webp", "description": "React Ready: Build with Components — GrowthCraft course graphic.", "position": "50% 50%"},
  {"id": "thumbnail-resumeready", "title": "ResumeReady: Job Search Foundations", "category": "Thumbnails", "image": "/images/portfolio/thumbnails/resumeready.webp", "description": "ResumeReady: Job Search Foundations — GrowthCraft course graphic.", "position": "50% 50%"},
  {"id": "thumbnail-shopify-sprint", "title": "Shopify Sprint: Launch a Store", "category": "Thumbnails", "image": "/images/portfolio/thumbnails/shopify-sprint.webp", "description": "Shopify Sprint: Launch a Store — GrowthCraft course graphic.", "position": "50% 50%"},
  {"id": "thumbnail-vue-vibes", "title": "Vue Vibes: Vue 3 Essentials", "category": "Thumbnails", "image": "/images/portfolio/thumbnails/vue-vibes.webp", "description": "Vue Vibes: Vue 3 Essentials — GrowthCraft course graphic.", "position": "50% 50%"},
  {"id": "branding-computer-clinic", "title": "Computer Clinic — logo", "category": "Branding", "image": "/images/portfolio/branding/computer-clinic.webp", "description": "Computer Clinic — logo.", "position": "50% 50%"},
  {"id": "branding-legacy-of-chikankari", "title": "Legacy of Chikankari — logo", "category": "Branding", "image": "/images/portfolio/branding/legacy-of-chikankari.webp", "description": "Legacy of Chikankari — logo.", "position": "50% 50%"},
  {"id": "blog-amuthi-audience", "title": "Amuthi — who is it for?", "category": "Blogs", "image": "/images/portfolio/blogs/amuthi-who-is-it-for.webp", "description": "Amuthi — who is it for?.", "position": "50% 50%"},
  {"id": "blog-guwahati-world", "title": "Guwahati to the world — SynthWeb", "category": "Blogs", "image": "/images/portfolio/blogs/guwahati-to-the-world.webp", "description": "Guwahati to the world — SynthWeb.", "position": "50% 50%"},
  {"id": "blog-certificates-hiring", "title": "Course certificates vs what hiring managers screen for — GrowthCraft", "category": "Blogs", "image": "/images/portfolio/blogs/certificates-vs-hiring.webp", "description": "Course certificates vs what hiring managers screen for — GrowthCraft.", "position": "50% 50%"},
]

// ─── TILE SHAPE PER CATEGORY ───────────────────────────────────────────────────────────────
// The "All" grid is the symmetric 4:3 wall. Choosing a category rebuilds the grid with ONLY that category, and its tiles take
// the shape below (width / height), so each piece is shown uncropped. Change a number to change that grid's shape.
// A category that isn't listed here falls back to 4:3.
export const aspects = {
  Posters: 1200 / 1500,       // 4:5
  Social: 1200 / 1500,        // 4:5  (LinkedIn, Instagram, event posts)
  Standees: 1023 / 2047,      // supplied standee artwork proportions
  Thumbnails: 1080 / 1080,    // 1:1 — square 1080 × 1080 artwork
  Blogs: 1200 / 675,          // 16:9 — 1200 × 675 hero artwork
  Branding: 1,               // square logo artwork
}

export const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))]
