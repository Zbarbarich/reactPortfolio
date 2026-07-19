import { useEffect, useRef } from 'react'
import andySvg from '../../assets/andy/andy-sitting.svg?raw'

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const lerp = (a, b, t) => a + (b - a) * t

/**
 * Inline Andy mascot: teal eyes track the cursor; light body parallax on scroll/pointer.
 */
const AndySitting = () => {
  const hostRef = useRef(null)
  const parallaxRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    const shell = parallaxRef.current
    if (!host || !shell) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const markup = String(andySvg).replace(/<\?xml[\s\S]*?\?>/i, '').trim()
    host.innerHTML = markup

    const root = host.querySelector('svg')
    if (!root) return undefined

    root.removeAttribute('width')
    root.removeAttribute('height')
    root.setAttribute('aria-hidden', 'true')
    root.setAttribute('focusable', 'false')
    root.classList.add('andy-hero-mascot', 'andy-hero-svg')

    const leftEye = root.querySelector('#andy-eye-left')
    const rightEye = root.querySelector('#andy-eye-right')

    const MAX_X = 22
    const MAX_Y = 15
    const look = { x: 0, y: 0, tx: 0, ty: 0 }
    const body = { x: 0, y: 0, lookX: 0, lookY: 0, scrollY: 0 }
    let raf = 0
    let running = true
    let lastScrollY = window.scrollY || 0

    const tick = () => {
      if (!running) return

      look.x = lerp(look.x, look.tx, 0.12)
      look.y = lerp(look.y, look.ty, 0.12)
      body.scrollY = lerp(body.scrollY, 0, 0.05)
      body.x = lerp(body.x, body.lookX, 0.14)
      body.y = lerp(body.y, body.lookY + body.scrollY, 0.14)

      if (leftEye) leftEye.setAttribute('transform', `translate(${look.x}, ${look.y})`)
      if (rightEye) {
        rightEye.setAttribute(
          'transform',
          `translate(${look.x * 0.95}, ${look.y * 0.95})`
        )
      }
      shell.style.transform = `translate3d(${body.x}px, ${body.y}px, 0)`

      raf = requestAnimationFrame(tick)
    }

    const onPointerMove = (e) => {
      const rect = root.getBoundingClientRect()
      if (rect.width < 8 || rect.height < 8) return

      const faceX = rect.left + rect.width * 0.52
      const faceY = rect.top + rect.height * 0.28
      const dx = (e.clientX - faceX) / Math.max(rect.width * 0.45, 1)
      const dy = (e.clientY - faceY) / Math.max(rect.height * 0.38, 1)

      // Soften target acquisition so flicks don't feel snap-to
      const nextX = clamp(dx, -1, 1) * MAX_X
      const nextY = clamp(dy, -1, 1) * MAX_Y
      look.tx = lerp(look.tx, nextX, 0.35)
      look.ty = lerp(look.ty, nextY, 0.35)

      if (!reducedMotion) {
        body.lookX = clamp(dx, -1, 1) * 6
        body.lookY = clamp(dy, -1, 1) * 4
      }
    }

    const onPointerLeave = () => {
      look.tx = 0
      look.ty = 0
      body.lookX = 0
      body.lookY = 0
    }

    const applyScroll = (dy) => {
      if (reducedMotion) return
      body.scrollY = clamp(body.scrollY - dy * 0.05, -20, 20)
    }

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0
      const dy = y - lastScrollY
      lastScrollY = y
      if (Math.abs(dy) > 0.4) applyScroll(dy)
    }

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > 0.4 || Math.abs(e.deltaX) > 0.4) applyScroll(e.deltaY)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onPointerLeave)
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    window.addEventListener('wheel', onWheel, { passive: true, capture: true })
    raf = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('mouseleave', onPointerLeave)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('wheel', onWheel, true)
      host.innerHTML = ''
    }
  }, [])

  return (
    <div ref={parallaxRef} className="andy-hero-parallax relative will-change-transform">
      <div
        ref={hostRef}
        className="andy-hero-host relative flex h-full w-full items-center justify-center
                   [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:max-w-[min(100%,420px)]"
        aria-label="Andy Bot mascot"
        role="img"
      />
    </div>
  )
}

export default AndySitting
