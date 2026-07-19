import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * On route change: jump to top, then play a short bounce-in on <main>.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation()
  const prevPath = useRef(pathname)

  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Instantly reset scroll so the new page always starts at the top
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    const main = document.querySelector('main')
    if (!main || prefersReduced) return undefined

    main.classList.remove('page-bounce-in')
    // Force reflow so the animation can restart on every navigation
    void main.offsetWidth
    main.classList.add('page-bounce-in')

    const onEnd = () => main.classList.remove('page-bounce-in')
    main.addEventListener('animationend', onEnd)

    return () => {
      main.removeEventListener('animationend', onEnd)
      main.classList.remove('page-bounce-in')
    }
  }, [pathname])

  return null
}

export default ScrollToTop
