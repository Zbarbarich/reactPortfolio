import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const TEAL = { r: 79, g: 209, b: 197 }
const PURPLE = { r: 83, g: 91, b: 242 }

const lerp = (a, b, t) => a + (b - a) * t
const mixColor = (t) => ({
  r: Math.round(lerp(TEAL.r, PURPLE.r, t)),
  g: Math.round(lerp(TEAL.g, PURPLE.g, t)),
  b: Math.round(lerp(TEAL.b, PURPLE.b, t)),
})
const rgba = (c, a) => `rgba(${c.r},${c.g},${c.b},${a})`
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const rand = (min, max) => min + Math.random() * (max - min)
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

const CORNER_RAYS = [
  { x: 0, y: -1, weight: 1.2 },
  { x: -0.92, y: 0.55, weight: 1.15 },
  { x: 0.92, y: 0.55, weight: 1.15 },
]

/**
 * Site-wide teal node web. Corner lines only on Home (fixed behind Andy).
 * Free nodes react to hover / click / scroll. Corner nodes stay locked.
 * Pauses when the tab is hidden; sleeps when motion has settled.
 */
const CornerNodeWeb = () => {
  const canvasRef = useRef(null)
  const { pathname } = useLocation()
  const showCorner = pathname === '/'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')

    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let nodes = []
    let running = true
    let looping = false
    let visible = document.visibilityState !== 'hidden'
    let seedKey = ''
    let lastScrollY = window.scrollY || 0
    let last = performance.now()
    let activityUntil = 0
    let scrollRaf = 0
    let pendingScrollDy = 0

    // Touch / narrow screens: fewer nodes, softer parallax, no double scroll+touch
    const isMobile =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 768px)').matches

    const drift = { x: 0, y: 0, tx: 0, ty: 0 }
    const origin = { x: 0.5, y: 0.52 }
    const pointer = { x: -9999, y: -9999, active: false }

    const scrollGain = isMobile ? 0.22 : 0.48
    const scrollClamp = isMobile ? 90 : 180
    const driftClampX = isMobile ? 22 : 42
    const driftClampY = isMobile ? 28 : 52
    const instantNudge = isMobile ? 0 : 0.1
    const wakeHoldScroll = isMobile ? 900 : 1400
    const maxDpr = isMobile ? 1.25 : 2
    const nodeBudgetDivisor = isMobile ? 22000 : 12000
    const nodeCap = isMobile ? 56 : 120
    const nodeFloor = isMobile ? 28 : 60

    const wake = (holdMs = 900) => {
      activityUntil = Math.max(activityUntil, performance.now() + holdMs)
      if (!running || !visible || looping) return
      looping = true
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }

    const isBusy = () => {
      // Recent input keeps the loop hot; pointer.active alone does not
      // (a still cursor over the page should be allowed to sleep).
      if (performance.now() < activityUntil) return true
      if (Math.abs(drift.x) > 0.12 || Math.abs(drift.y) > 0.12) return true
      if (Math.abs(drift.tx) > 0.12 || Math.abs(drift.ty) > 0.12) return true
      for (let i = 0; i < nodes.length; i += 1) {
        const n = nodes[i]
        if (n.pulse > 0.008) return true
        if (Math.abs(n.vx) > 0.04 || Math.abs(n.vy) > 0.04) return true
        if (Math.abs(n.scale - 1) > 0.008) return true
      }
      return false
    }

    const updateOrigin = () => {
      if (showCorner) {
        const el = document.getElementById('andy-corner-anchor')
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.width >= 8 && rect.height >= 8) {
            origin.x = (rect.left + rect.width * 0.5) / w
            origin.y = (rect.top + rect.height * 0.7) / h
            return
          }
        }
        origin.x = 0.72
        origin.y = 0.62
        return
      }
      origin.x = 0.5
      origin.y = 0.5
    }

    const rayEnd = (ox, oy, ray) => {
      const maxReach = Math.hypot(w, h) * ray.weight
      let tHit = maxReach
      const eps = 1e-6
      if (Math.abs(ray.x) > eps) {
        const tx = ray.x > 0 ? (w - ox) / ray.x : (0 - ox) / ray.x
        if (tx > 0) tHit = Math.min(tHit, tx)
      }
      if (Math.abs(ray.y) > eps) {
        const ty = ray.y > 0 ? (h - oy) / ray.y : (0 - oy) / ray.y
        if (ty > 0) tHit = Math.min(tHit, ty)
      }
      return { x: ox + ray.x * tHit, y: oy + ray.y * tHit }
    }

    const cornerPoint = (ray, t, ox, oy) => {
      const end = rayEnd(ox, oy, ray)
      return {
        x: ox + (end.x - ox) * t,
        y: oy + (end.y - oy) * t,
      }
    }

    function makeNode(x, y, tint, anchored) {
      return {
        x,
        y,
        baseX: x,
        baseY: y,
        vx: 0,
        vy: 0,
        tint,
        anchored,
        depth: anchored ? 0 : rand(0.7, 1.35),
        size: anchored ? rand(1.6, 2.6) : rand(1.4, 2.4),
        scale: 1,
        phase: rand(0, Math.PI * 2),
        pulse: 0,
      }
    }

    const seedNodes = () => {
      const ox = origin.x * w
      const oy = origin.y * h
      const key = `${showCorner ? 'c' : 'f'}:${Math.round(ox)}:${Math.round(oy)}:${w}x${h}`
      if (key === seedKey && nodes.length) return
      seedKey = key

      const count = Math.round(Math.min(nodeCap, Math.max(nodeFloor, (w * h) / nodeBudgetDivisor)))
      nodes = []

      if (showCorner) {
        CORNER_RAYS.forEach((ray) => {
          for (let i = 1; i <= 7; i += 1) {
            const p = cornerPoint(ray, i / 7.2, ox, oy)
            nodes.push(makeNode(p.x, p.y, 0.08 + (i / 7) * 0.75, true))
          }
        })
        nodes.push(makeNode(ox, oy, 0.35, true))
      }

      let guard = 0
      while (nodes.length < count && guard < count * 10) {
        guard += 1
        const x = rand(0, w)
        const y = rand(0, h)
        const d = Math.hypot(x - ox, y - oy) / Math.hypot(w, h)
        if (Math.random() > 0.4 + (1 - d) * 0.5) continue
        nodes.push(makeNode(x, y, rand(0.05, 0.95), false))
      }
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
      w = Math.max(1, window.innerWidth)
      h = Math.max(1, window.innerHeight)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      updateOrigin()
      seedKey = ''
      seedNodes()
      wake(1200)
    }

    const applyScrollDelta = (dx, dy) => {
      const nx = clamp(dx, -scrollClamp, scrollClamp) * scrollGain
      const ny = clamp(dy, -scrollClamp, scrollClamp) * scrollGain
      drift.tx = clamp(drift.tx + nx * 0.9, -driftClampX, driftClampX)
      drift.ty = clamp(drift.ty + ny * 0.9, -driftClampY, driftClampY)
      // Desktop: snappier follow. Mobile: let the rAF tick lerp for butter smoother motion.
      if (!isMobile) {
        drift.x = lerp(drift.x, drift.tx, 0.5)
        drift.y = lerp(drift.y, drift.ty, 0.5)
      }

      if (instantNudge > 0) {
        nodes.forEach((n) => {
          if (n.anchored) return
          n.x += nx * instantNudge * n.depth
          n.y += ny * instantNudge * n.depth
        })
      }
      wake(wakeHoldScroll)
    }

    const flushPendingScroll = () => {
      scrollRaf = 0
      if (Math.abs(pendingScrollDy) < 0.2) {
        pendingScrollDy = 0
        return
      }
      const dy = pendingScrollDy
      pendingScrollDy = 0
      applyScrollDelta(0, dy)
      if (showCorner) updateOrigin()
    }

    const queueScrollDy = (dy) => {
      pendingScrollDy += dy
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(flushPendingScroll)
    }

    const onPointerMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = true
      wake(400)
    }

    const onPointerLeave = () => {
      pointer.active = false
    }

    const onPointerDown = (e) => {
      if (e.button !== 0) return
      const x = e.clientX
      const y = e.clientY

      nodes.forEach((n) => {
        const d = Math.hypot(n.x - x, n.y - y)
        if (d >= 200) return
        const strength = 1 - d / 200
        n.pulse = Math.max(n.pulse, strength)

        // Only free nodes leave their seat — corner nodes stay put
        if (!n.anchored && d > 0.5) {
          const push = strength * 22
          n.x += ((n.x - x) / d) * push
          n.y += ((n.y - y) / d) * push
          n.vx += ((n.x - x) / d) * strength * 6
          n.vy += ((n.y - y) / d) * strength * 6
        }
      })
      wake(1400)
    }

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0
      const dy = y - lastScrollY
      lastScrollY = y
      if (Math.abs(dy) <= 0.5) return
      // Coalesce scroll deltas to one apply per animation frame (critical on iOS)
      if (isMobile) queueScrollDy(dy)
      else {
        applyScrollDelta(0, dy)
        if (showCorner) updateOrigin()
      }
    }

    const onWheel = (e) => {
      if (isMobile) return
      applyScrollDelta(e.deltaX, e.deltaY)
      if (showCorner) updateOrigin()
    }

    const onVisibility = () => {
      visible = document.visibilityState !== 'hidden'
      if (!visible) {
        cancelAnimationFrame(raf)
        looping = false
        return
      }
      wake(800)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.documentElement.addEventListener('mouseleave', onPointerLeave)
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    // Wheel only on desktop — touch+scroll double-firing made mobile choppy
    if (!isMobile) {
      window.addEventListener('wheel', onWheel, { passive: true, capture: true })
    }
    document.addEventListener('visibilitychange', onVisibility)

    requestAnimationFrame(() => resize())

    const tick = (now) => {
      if (!running || !visible) {
        looping = false
        return
      }

      // Skip work entirely when settled — last frame stays on the canvas
      if (!isBusy()) {
        looping = false
        return
      }

      try {
        const dt = Math.min(32, now - last) / 16.67
        last = now

        drift.x = lerp(drift.x, drift.tx, isMobile ? 0.14 : 0.1)
        drift.y = lerp(drift.y, drift.ty, isMobile ? 0.14 : 0.1)
        drift.tx = lerp(drift.tx, 0, isMobile ? 0.035 : 0.02)
        drift.ty = lerp(drift.ty, 0, isMobile ? 0.035 : 0.02)

        const px = pointer.x
        const py = pointer.y
        const ox = origin.x * w
        const oy = origin.y * h

        if (w < 1 || h < 1) {
          raf = requestAnimationFrame(tick)
          return
        }

        // Lock corner-anchored nodes exactly to the fixed corner structure
        if (showCorner) {
          let ai = 0
          CORNER_RAYS.forEach((ray) => {
            for (let i = 1; i <= 7; i += 1) {
              const n = nodes[ai]
              ai += 1
              if (!n?.anchored) continue
              const p = cornerPoint(ray, i / 7.2, ox, oy)
              n.baseX = n.x = p.x
              n.baseY = n.y = p.y
              n.vx = 0
              n.vy = 0
            }
          })
          const vertex = nodes[ai]
          if (vertex?.anchored) {
            vertex.baseX = vertex.x = ox
            vertex.baseY = vertex.y = oy
            vertex.vx = 0
            vertex.vy = 0
          }
        }

        // Free nodes: spring toward base + scroll drift
        nodes.forEach((n) => {
          if (n.anchored) {
            // Still allow hover/click grow on corner nodes
            let targetScale = 1
            if (pointer.active) {
              const d = Math.hypot(n.x - px, n.y - py)
              if (d < 40) targetScale = 1.2
              else if (d < 64) targetScale = 1.08
            }
            targetScale = Math.max(targetScale, 1 + n.pulse * 0.7)
            n.scale = lerp(n.scale, targetScale, targetScale > n.scale ? 0.2 : 0.08)
            n.pulse = Math.max(0, n.pulse - 0.045 * dt)
            n.phase += 0.012 * dt
            return
          }

          const homeX = n.baseX + drift.x * n.depth
          const homeY = n.baseY + drift.y * n.depth
          n.vx += (homeX - n.x) * 0.045
          n.vy += (homeY - n.y) * 0.045
          n.vx *= 0.88
          n.vy *= 0.88
          n.x += n.vx * dt
          n.y += n.vy * dt

          let targetScale = 1
          if (pointer.active) {
            const d = Math.hypot(n.x - px, n.y - py)
            if (d < 42) targetScale = 1.28
            else if (d < 70) targetScale = 1.12
          }
          targetScale = Math.max(targetScale, 1 + n.pulse * 0.9)
          n.scale = lerp(n.scale, targetScale, targetScale > n.scale ? 0.22 : 0.07)
          n.pulse = Math.max(0, n.pulse - 0.04 * dt)
          n.phase += 0.015 * dt
        })

        ctx.clearRect(0, 0, w, h)

        const g = ctx.createRadialGradient(ox, oy, 10, ox, oy, Math.min(w, h) * 0.85)
        g.addColorStop(0, showCorner ? 'rgba(79,209,197,0.22)' : 'rgba(79,209,197,0.14)')
        g.addColorStop(0.4, 'rgba(79,209,197,0.08)')
        g.addColorStop(0.75, 'rgba(83,91,242,0.04)')
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)

        if (showCorner) {
          CORNER_RAYS.forEach((ray) => {
            const end = rayEnd(ox, oy, ray)
            ctx.beginPath()
            ctx.moveTo(ox, oy)
            ctx.lineTo(end.x, end.y)
            ctx.strokeStyle = 'rgba(79,209,197,0.28)'
            ctx.lineWidth = 8
            ctx.lineCap = 'round'
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(ox, oy)
            ctx.lineTo(end.x, end.y)
            ctx.strokeStyle = 'rgba(79,209,197,0.95)'
            ctx.lineWidth = 2.8
            ctx.lineCap = 'round'
            ctx.stroke()
          })

          ctx.beginPath()
          ctx.arc(ox, oy, 4, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(79,209,197,1)'
          ctx.fill()
        }

        const linkDist = Math.min(w, h) * 0.155

        for (let i = 0; i < nodes.length; i += 1) {
          const a = nodes[i]
          if (!a.anchored && showCorner) {
            const dCorner = Math.hypot(a.x - ox, a.y - oy)
            if (dCorner < linkDist * 2.4) {
              const alpha = (1 - dCorner / (linkDist * 2.4)) * 0.45
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(ox, oy)
              ctx.strokeStyle = rgba(TEAL, alpha)
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }

          for (let j = i + 1; j < nodes.length; j += 1) {
            const b = nodes[j]
            const d = dist(a, b)
            if (d > linkDist) continue
            const alpha = (1 - d / linkDist) * 0.65 + Math.max(a.pulse, b.pulse) * 0.25
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = rgba(TEAL, alpha)
            ctx.lineWidth = 1.15
            ctx.stroke()
          }
        }

        nodes.forEach((n) => {
          const c = mixColor(n.tint)
          const breathe = 1 + Math.sin(n.phase) * 0.1
          const r = n.size * breathe * n.scale

          const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5)
          glow.addColorStop(0, rgba(c, 0.72 + (n.scale - 1) * 0.4))
          glow.addColorStop(1, rgba(c, 0))
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(n.x, n.y, r * 5, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
          ctx.fillStyle = rgba(c, 1)
          ctx.fill()
        })
      } catch (err) {
        console.error('CornerNodeWeb frame error:', err)
      }

      if (isBusy()) {
        raf = requestAnimationFrame(tick)
      } else {
        looping = false
      }
    }

    wake(1200)

    return () => {
      running = false
      looping = false
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      document.documentElement.removeEventListener('mouseleave', onPointerLeave)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('wheel', onWheel, true)
      document.removeEventListener('visibilitychange', onVisibility)
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
    }
  }, [showCorner])

  return (
    <div className="corner-node-web" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}

export default CornerNodeWeb
