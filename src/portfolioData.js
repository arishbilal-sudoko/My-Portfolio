// ─── YOUR GRAPHIC WORKS ────────────────────────────────────────────────────────────────────
// The grid builds itself from this list. To use your own work:
//   1. Save an image in /public/images/portfolio/ (JPG or WebP, about 1400px on the long edge, under ~250 KB).
//   2. Change `image` (and `title`, `category`, `description`) on one of the entries below.
//   3. `position` is the focal point when the image is cropped: '50% 50%' = centre, '50% 20%' = favour the top.
// Add or remove entries freely — the first 16 fill the 16 tiles used across the animation, and any extra
// ones appear in the lightbox. Fewer than 16? The grid simply repeats from the start.
// Keep `id`s unique and unchanged once set. Categories are picked up automatically for the filters.
export const projects = [
  { id: 'work-01', title: 'Poster design', category: 'Posters', image: '/images/portfolio/01-posters.webp', description: 'A poster built around one clear idea.', position: '50% 50%' },
  { id: 'work-02', title: 'Thumbnail design', category: 'Thumbnails', image: '/images/portfolio/02-thumbnails.webp', description: 'A thumbnail made to stand out in a crowded feed.', position: '50% 50%' },
  { id: 'work-03', title: 'Poster design', category: 'Posters', image: '/images/portfolio/03-posters.webp', description: 'A poster built around one clear idea.', position: '50% 50%' },
  { id: 'work-04', title: 'Social media post', category: 'Social', image: '/images/portfolio/04-social.webp', description: 'A social post designed to stop the scroll.', position: '50% 50%' },
  { id: 'work-05', title: 'Brand identity', category: 'Branding', image: '/images/portfolio/05-branding.webp', description: 'A brand identity piece, with logo, colour and type working together.', position: '50% 50%' },
  { id: 'work-06', title: 'Standee design', category: 'Standees', image: '/images/portfolio/06-standees.webp', description: 'A standee made for print and real-world spaces.', position: '50% 50%' },
  { id: 'work-07', title: 'Poster design', category: 'Posters', image: '/images/portfolio/07-posters.webp', description: 'A poster built around one clear idea.', position: '50% 50%' },
  { id: 'work-08', title: 'Thumbnail design', category: 'Thumbnails', image: '/images/portfolio/08-thumbnails.webp', description: 'A thumbnail made to stand out in a crowded feed.', position: '50% 50%' },
  { id: 'work-09', title: 'Standee design', category: 'Standees', image: '/images/portfolio/09-standees.webp', description: 'A standee made for print and real-world spaces.', position: '50% 50%' },
  { id: 'work-10', title: 'Social media post', category: 'Social', image: '/images/portfolio/10-social.webp', description: 'A social post designed to stop the scroll.', position: '50% 50%' },
  { id: 'work-11', title: 'Blog graphic', category: 'Blogs', image: '/images/portfolio/11-blogs.webp', description: 'A blog graphic that sets the tone before the first line.', position: '50% 50%' },
  { id: 'work-12', title: 'Brand identity', category: 'Branding', image: '/images/portfolio/12-branding.webp', description: 'A brand identity piece, with logo, colour and type working together.', position: '50% 50%' },
  { id: 'work-13', title: 'Thumbnail design', category: 'Thumbnails', image: '/images/portfolio/13-thumbnails.webp', description: 'A thumbnail made to stand out in a crowded feed.', position: '50% 50%' },
  { id: 'work-14', title: 'Poster design', category: 'Posters', image: '/images/portfolio/14-posters.webp', description: 'A poster built around one clear idea.', position: '50% 50%' },
  { id: 'work-15', title: 'Social media post', category: 'Social', image: '/images/portfolio/15-social.webp', description: 'A social post designed to stop the scroll.', position: '50% 50%' },
  { id: 'work-16', title: 'Blog graphic', category: 'Blogs', image: '/images/portfolio/16-blogs.webp', description: 'A blog graphic that sets the tone before the first line.', position: '50% 50%' },
]

export const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))]
