// The Petify app screens in /public/petify (390 x 814)
export const screens = [
 { no: '01', t: 'Splash', f: '01-splash', w: 390, h: 814, why: 'A white paw with a cat peeking out, on deep purple. It says “pets” before a single word is read.' },
 { no: '02', t: 'Login', f: '02-login', w: 390, h: 814, why: 'Email, password and one big Login button at thumb height. “Other methods” is a single tap away.' },
 { no: '03', t: 'Other login methods', f: '03-other-methods', w: 390, h: 814, why: 'Meta, Google and Apple as three equal, full-width buttons, with password as the quiet outline option below.' },
 { no: '04', t: 'Sign up: pet owner', f: '04-signup-owner', w: 390, h: 814, why: 'Four fields and one clear button. Pet owners land here, and care takers can switch roles with one tap.' },
 { no: '05', t: 'Sign up: care taker', f: '05-signup-caretaker', w: 390, h: 814, why: 'The same form with a different subtitle and a swapped switch button, so joining as a care taker feels familiar.' },
 { no: '06', t: 'Profile created', f: '06-created', w: 390, h: 814, why: 'A big check mark and one next step. Nothing else on screen to pull attention away from “Go to home”.' },
 { no: '07', t: 'Home', f: '07-home', w: 390, h: 814, why: 'Search first, then quick services, then a grid of care takers with their experience and rating. The curved edge sets the browse area apart.' },
 { no: '08', t: 'Care taker profile', f: '08-caretaker', w: 390, h: 814, why: 'Builds trust before booking: a verified badge, years of experience, an about section, services and a strip of photo moments. “Book Now” sits right below.' },
 { no: '09', t: 'Choose services', f: '09-services', w: 390, h: 814, why: 'Pick what your pet needs. Selected services get a purple outline, and the floating button says “Add to cart”.' },
 { no: '10', t: 'Services, ready to check out', f: '10-services-cart', w: 390, h: 814, why: 'Once something is added, the same floating button becomes “View Cart”, so the next step is always in the same spot.' },
 { no: '11', t: 'Cart', f: '11-cart', w: 390, h: 814, why: 'Delivery address on top, then each service with its own quantity stepper. Swipe a row to reveal delete. One “Place Order” button.' },
 { no: '12', t: 'Live tracking', f: '12-tracking', w: 390, h: 814, why: 'A live map, the arrival time in a pill, and a bottom sheet with the care taker’s rating, Call and Message. Rating is built right in.' },
 { no: '13', t: 'No internet', f: '13-offline', w: 390, h: 814, why: 'A dog and a cat tangled in a cable turn a dead end into a smile, in the same purple as the rest of the app.' },
]
export const groups = [
 { title: 'Getting in', start: 0, end: 6, blurb: 'Splash, log in, sign up as a pet owner or care taker, and your profile is ready.' },
 { title: 'Finding & booking', start: 6, end: 10, blurb: 'Browse care takers, read a profile, pick services and add them to the cart.' },
 { title: 'Cart & tracking', start: 10, end: 12, blurb: 'Check the order, place it, then follow your care taker to the door.' },
 { title: 'When it goes wrong', start: 12, end: 13, blurb: 'A friendly screen for when the connection drops.' },
]
