// ─── YOUR GRAPHIC WORKS ────────────────────────────────────────────────────────────────────
// The grid builds itself from this list. To use your own work:
//   1. Save an image in /public/images/portfolio/ (WebP or JPG, under ~250 KB). Save each piece at its REAL proportions:
//      posters & social posts 1200x1500, thumbnails 1280x720, blog graphics 1200x630, standees tall and narrow (see `aspects` below).
//   2. Change `image` (and `title`, `category`, `description`) on one of the entries below.
//   3. `position` is the focal point when the image is cropped: '50% 50%' = centre, '50% 20%' = favour the top.
// Add or remove entries freely. The animated grid reuses tile elements and cycles through
// all works in the selected category; images repeat automatically to fill the rows.
// Keep `id`s unique and unchanged once set. Categories are picked up automatically for the filters.
export const projects = [
  { id: 'work-01', title: 'Poster design', category: 'Posters', image: '/images/portfolio/01-posters.webp', description: 'A poster built around one clear idea.', position: '50% 50%' },
  { id: 'work-02', title: 'Thumbnail design', category: 'Thumbnails', image: '/images/portfolio/02-thumbnails.webp', description: 'A thumbnail made to stand out in a crowded feed.', position: '50% 50%' },
  { id: 'work-03', title: 'Poster design', category: 'Posters', image: '/images/portfolio/03-posters.webp', description: 'A poster built around one clear idea.', position: '50% 50%' },
  {"id": "work-04", "title": "Product lessons — SynthWeb", "category": "Social", "image": "/images/portfolio/social/product-lessons.webp", "description": "Social graphic sharing lessons from building and launching multiple products.", "position": "50% 50%"},
  { id: 'work-05', title: 'Brand identity', category: 'Branding', image: '/images/portfolio/05-branding.webp', description: 'A brand identity piece, with logo, colour and type working together.', position: '50% 50%' },
  { id: 'work-06', title: 'Standee design', category: 'Standees', image: '/images/portfolio/06-standees.webp', description: 'A standee made for print and real-world spaces.', position: '50% 50%' },
  { id: 'work-07', title: 'Poster design', category: 'Posters', image: '/images/portfolio/07-posters.webp', description: 'A poster built around one clear idea.', position: '50% 50%' },
  { id: 'work-08', title: 'Thumbnail design', category: 'Thumbnails', image: '/images/portfolio/08-thumbnails.webp', description: 'A thumbnail made to stand out in a crowded feed.', position: '50% 50%' },
  { id: 'work-09', title: 'Standee design', category: 'Standees', image: '/images/portfolio/09-standees.webp', description: 'A standee made for print and real-world spaces.', position: '50% 50%' },
  {"id": "work-10", "title": "Design communication — SynthWeb", "category": "Social", "image": "/images/portfolio/social/design-communication.webp", "description": "Social graphic on the communication behind product and design decisions.", "position": "50% 50%"},
  { id: 'work-11', title: 'Blog graphic', category: 'Blogs', image: '/images/portfolio/11-blogs.webp', description: 'A blog graphic that sets the tone before the first line.', position: '50% 50%' },
  { id: 'work-12', title: 'Brand identity', category: 'Branding', image: '/images/portfolio/12-branding.webp', description: 'A brand identity piece, with logo, colour and type working together.', position: '50% 50%' },
  { id: 'work-13', title: 'Thumbnail design', category: 'Thumbnails', image: '/images/portfolio/13-thumbnails.webp', description: 'A thumbnail made to stand out in a crowded feed.', position: '50% 50%' },
  { id: 'work-14', title: 'Poster design', category: 'Posters', image: '/images/portfolio/14-posters.webp', description: 'A poster built around one clear idea.', position: '50% 50%' },
  {"id": "work-15", "title": "Production performance — SynthWeb", "category": "Social", "image": "/images/portfolio/social/production-performance.webp", "description": "Social graphic sharing performance lessons from production.", "position": "50% 50%"},
  { id: 'work-16', title: 'Blog graphic', category: 'Blogs', image: '/images/portfolio/16-blogs.webp', description: 'A blog graphic that sets the tone before the first line.', position: '50% 50%' },
  {"id": "work-17", "title": "Skills-based hiring — Cairn", "category": "Social", "image": "/images/portfolio/social/skills-based-hiring.webp", "description": "A visual comparison of hiring practices, from credentials to demonstrated skills.", "position": "50% 50%"},
  {"id": "work-18", "title": "Sattriya — Assam’s dance form", "category": "Social", "image": "/images/portfolio/social/sattriya-dance.webp", "description": "A cultural social graphic celebrating Sattriya, a dance form from Assam.", "position": "50% 50%"},
  {"id": "work-19", "title": "Design interfaces people can use", "category": "Social", "image": "/images/portfolio/social/intuitive-ui.webp", "description": "A social graphic about making interfaces intuitive and easy to use.", "position": "50% 50%"},
]

// ─── TILE SHAPE PER CATEGORY ───────────────────────────────────────────────────────────────
// The "All" grid is the symmetric 4:3 wall. Choosing a category rebuilds the grid with ONLY that category, and its tiles take
// the shape below (width / height), so each piece is shown uncropped. Change a number to change that grid's shape.
// A category that isn't listed here falls back to 4:3.
export const aspects = {
  Posters: 1200 / 1500,       // 4:5
  Social: 1200 / 1500,        // 4:5  (LinkedIn, Instagram, event posts)
  Standees: 85 / 200,         // tall and narrow: a 85 x 200 cm roll-up standee. Change to your real size.
  Thumbnails: 1280 / 720,     // 16:9
  Blogs: 1200 / 630,          // 1.91:1
  Branding: 4 / 3,
}

export const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))]
