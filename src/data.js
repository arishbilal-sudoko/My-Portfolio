export const ME = { name: 'Arish Bilal Ahmed', email: 'arishbilalghy@gmail.com' }

export const socials = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/arish-ahmed-861b442a8/' },
  { label: 'GitHub', url: 'https://github.com/arishbilal-sudoko/' },
  { label: 'Instagram', url: 'https://www.instagram.com/armed.03/' },
]

// TODO: replace with your real projects. `color` shows until you add an `img`.
export const projects = [
  // Internal project: `slug` opens /work/<slug> (case study); `logo` replaces the cursor on hover.
  { slug: 'joe-robbins-photography', title: 'Joe Robbins Photography', type: 'Website redesign', year: '2026', color: '#8a0f1a', logo: '/joe-robbins-logo.png', img: '/joe/mockup.webp' }, // TODO: set the real year
  { slug: 'arish-fitness', title: 'Arish Fitness', type: 'Android app · In progress', year: '2026', color: '#1d2a0e', img: '/arish-fitness/mockup.webp' }, // TODO: confirm the year
  { slug: 'petify', title: 'Petify', type: 'Pet care app · UI/UX case study', year: '2026', color: '#5b0093', img: '/petify/mockup.webp' },
  { title: 'Project Five', type: 'Experiment', year: '2024', url: '#', color: '#1d3a5c', img: '' },
  { slug: 'graphic-works', title: 'Graphic Works', type: 'Posters, thumbnails & more', year: '2026', color: '#2a1f1f', img: '/images/portfolio/01-posters.webp' }, // TODO: confirm the year
]

export const skills = {
  Frontend: ['HTML', 'CSS', 'JavaScript', 'React', 'GSAP animations'],
  Design: ['UI/UX design', 'Figma', 'Adobe Photoshop', 'Posters, thumbnails & branding'],
  Mobile: ['Java', 'Android Studio'],
  'Tools & workflow': ['Git', 'GitHub'],
}

// Testimonials and clients stay hidden on the site until you add real entries here.
// Testimonial: { photo: '/people/jane.jpg' (square, 160×160, or '' for initials), name: 'Full Name', role: 'Role · Company', text: 'What they said.' }
export const testimonials = []

// Client / partner: { name: 'Name', type: 'What you did for them', year: '2026' }
export const clients = []
