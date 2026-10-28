// The SpendSmart screens, in /public/spendsmart/ui (captured from the working app at phone width)
export const screens = [
  { no: '01', t: 'Sign in', f: '01-signin', w: 430, h: 932,
    why: 'Sign In and Register are one tap apart. The demo login (admin / 1234) sits right under the button, so anyone can look around without making an account first.' },
  { no: '02', t: 'Register', f: '02-register', w: 430, h: 932,
    why: 'Mistakes get a plain-English message in a red strip above the form: a username that’s taken, a password that’s too short, or two passwords that don’t match.' },
  { no: '03', t: 'Dashboard', f: '03-dashboard', w: 430, h: 1301,
    why: 'Three cards answer the three questions that matter: what came in, what I allowed myself to spend, and what’s left. Below them, a ring and a few plain numbers show how the month is going.' },
  { no: '04', t: 'Over budget', f: '04-overbudget', w: 430, h: 1404,
    why: 'Cross the limit and the app stops being polite. Remaining turns red, a warning strip says by how much, the ring goes red (it goes amber at 80% as an early warning) and a pop-up appears the moment you cross it.' },
  { no: '05', t: 'Expenses', f: '05-expenses', w: 430, h: 1458,
    why: 'Four fields and one button. Each category gets its own emoji and colour so the list is easy to scan, dates can’t be in the future, and the bin icon always asks “are you sure?” before deleting.' },
  { no: '06', t: 'Summary', f: '06-summary', w: 430, h: 1255,
    why: 'Step back through earlier months with the arrows. Income, spending, savings and budget sit in four colour-coded cards, with a progress bar and spending ranked by category underneath.' },
  { no: '07', t: 'Salary', f: '07-salary', w: 430, h: 985,
    why: 'Money in lives on its own tab, so it’s easy to put it next to money out. Net savings turns green when you’re ahead and red when you’re behind.' },
  { no: '08', t: 'Money tips', f: '08-tips', w: 430, h: 932,
    why: 'A small bulb in the corner opens ten bite-sized money tips, one at a time. They move on by themselves (you can switch that off), so help is there when you want it and out of the way when you don’t.' },
]
export const groups = [
  { title: 'Getting in', start: 0, end: 2, blurb: 'Sign in, or create an account.' },
  { title: 'Dashboard', start: 2, end: 4, blurb: 'Where you land, and what it looks like when you overspend.' },
  { title: 'Tracking', start: 4, end: 7, blurb: 'Log what you spend and earn, and look back at past months.' },
  { title: 'Little helpers', start: 7, end: 8, blurb: 'Advice when you want it.' },
]
