import { createContext, useContext, useEffect, useRef } from 'react'

export const SiteCtx = createContext({ go: () => {}, ready: false })
export const useSite = () => useContext(SiteCtx)

// Link that runs the brush-stroke transition, then jumps to a section (to = "#works")
export function TLink({ to, children, ...rest }) {
  const { go } = useSite()
  return (
    <a href={to} onClick={(e) => { e.preventDefault(); go(to) }} {...rest}>
      {children}
    </a>
  )
}

// Masked slide-up reveal, fires when scrolled into view (after the loader / page wipe)
export function Reveal({ as: T = 'div', className = '', children }) {
  const ref = useRef(null)
  const { ready } = useSite()
  useEffect(() => {
    if (!ready) return
    let io
    const t = setTimeout(() => {
      io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.disconnect() }
      }, { threshold: 0.25 })
      io.observe(ref.current)
    }, 500)
    return () => { clearTimeout(t); io && io.disconnect() }
  }, [ready])
  return (
    <T ref={ref} className={`rv ${className}`}>
      <span>{children}</span>
    </T>
  )
}
