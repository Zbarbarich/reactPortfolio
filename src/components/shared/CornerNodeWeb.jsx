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
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

/** Deterministic PRNG (mulberry32) from a string seed. */
const hashString = (str) => {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const mulberry32 = (seed) => {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const CORNER_RAYS = [
  { x: 0, y: -1, weight: 1.2 },
  { x: -0.92, y: 0.55, weight: 1.15 },
  { x: 0.92, y: 0.55, weight: 1.15 },
]

/**
 * Site-wide teal node web. Corner lines only on Home (fixed behind Andy).
 * Free nodes react to hover / click / scroll. Corner nodes stay locked.
 * Mobile: one predetermined tall field per route; height-only resize never reseeds.
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
    let worldH = 0
    let scrollOffsetY = 0
    let dpr = 1
    let raf = 0
    let nodes = []
    let running = true
    let looping = false
    let visible = document.visibilityState !== 'hidden'
    let seedKey = ''
    let lastSeedWidth = 0
    let lastScrollY = window.scrollY || 0
    let last = performance.now()
    let activityUntil = 0
    let rng = Math.random

    // Phone / small viewport — avoid bare (pointer: coarse); hybrid desktops match it
    const isMobile =
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(hover: none) and (pointer: coarse)').matches

    const drift = { x: 0, y: 0, tx: 0, ty: 0 }
    const origin = { x: 0.5, y: 0.52 }
    const pointer = { x: -9999, y: -9999, active: false }

    const scrollGain = isMobile ? 0.32 : 0.48
    const scrollClamp = 180
    const mobileDyCap = 48
    const driftClampX = 42
    const driftClampY = 52
    const instantNudge = isMobile ? 0 : 0.1
    const wakeHoldScroll = isMobile ? 2000 : 1400
    const maxDpr = isMobile ? 1 : 2
    const nodeBudgetDivisor = isMobile ? 18000 : 12000
    const nodeCap = isMobile ? 70 : 120
    const nodeFloor = isMobile ? 48 : 60
    const worldScrollGain = 0.55

    // Mobile: coalesce scroll into one applyScrollDelta per frame
    let pendingScrollDy = 0
    let scrollFlushRaf = 0

    // Touch: defer push until we know it was a tap, not a scroll drag
    let touchTap = null

    const rand = (min, max) => min + rng() * (max - min)

    const wake = (holdMs = 900) => {
      activityUntil = Math.max(activityUntil, performance.now() + holdMs)
      if (!running || !visible || looping) return
      looping = true
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }

    const isBusy = () => {
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

    const computeWorldH = () => {
      const docH = Math.max(
        document.documentElement.scrollHeight || 0,
        document.body?.scrollHeight || 0,
        h
      )
      return Math.max(h * 3, docH + h)
    }

    const syncScrollOffset = () => {
      if (!isMobile) {
        scrollOffsetY = 0
        return
      }
      const y = window.scrollY || document.documentElement.scrollTop || 0
      const maxScroll = Math.max(0, worldH - h)
      scrollOffsetY = clamp(y * worldScrollGain, 0, maxScroll)
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
        depth: anchored ? 0 : rand(0.75, 1.25),
        size: anchored ? rand(1.6, 2.6) : rand(1.4, 2.4),
        scale: 1,
        phase: rand(0, Math.PI * 2),
        pulse: 0,
      }
    }

    const seedNodes = (force = false) => {
      const ox = origin.x * w
      const oy = origin.y * h
      // Mobile: seed key ignores height so URL-bar resize never reshuffles
      const key = isMobile
        ? `${pathname}:${showCorner ? 'c' : 'f'}:${w}:m`
        : `${showCorner ? 'c' : 'f'}:${Math.round(ox)}:${Math.round(oy)}:${w}x${h}:d`
      if (!force && key === seedKey && nodes.length) return
      seedKey = key
      lastSeedWidth = w

      if (isMobile) {
        rng = mulberry32(hashString(`${pathname}:m`))
        worldH = computeWorldH()
      } else {
        rng = Math.random
        worldH = h
      }

      const area = isMobile ? w * worldH : w * h
      const freeTarget = Math.round(
        Math.min(nodeCap, Math.max(nodeFloor, area / nodeBudgetDivisor))
      )
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

      const fieldH = isMobile ? worldH : h
      let free = 0
      let guard = 0
      while (free < freeTarget && guard < freeTarget * 24) {
        guard += 1
        const x = rand(0, w)
        const y = rand(0, fieldH)
        if (showCorner) {
          const dHub = Math.hypot(x - ox, y - oy)
          if (dHub < 36 && rng() < 0.75) continue
        }
        nodes.push(makeNode(x, y, rand(0.05, 0.95), false))
        free += 1
      }

      syncScrollOffset()
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
      const nextW = Math.max(1, window.innerWidth)
      const nextH = Math.max(1, window.innerHeight)
      const widthChanged = Math.abs(nextW - lastSeedWidth) >= 1 || lastSeedWidth === 0

      w = nextW
      h = nextH
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      updateOrigin()

      if (isMobile) {
        // Height-only (URL bar): keep the same predetermined field
        if (widthChanged || !nodes.length) {
          seedNodes(true)
        } else {
          worldH = Math.max(worldH, computeWorldH())
          syncScrollOffset()
        }
      } else {
        seedKey = ''
        seedNodes(true)
      }

      lastScrollY = window.scrollY || document.documentElement.scrollTop || 0
      wake(1200)
    }

    const applyScrollDelta = (dx, dy) => {
      let adx = dx
      let ady = dy
      if (isMobile) {
        ady = clamp(ady, -mobileDyCap, mobileDyCap)
        adx = 0 // never let horizontal input affect the background
      }
      const nx = clamp(adx, -scrollClamp, scrollClamp) * scrollGain
      const ny = clamp(ady, -scrollClamp, scrollClamp) * scrollGain
      drift.tx = clamp(drift.tx + nx * 0.9, -driftClampX, driftClampX)
      drift.ty = clamp(drift.ty + ny * 0.9, -driftClampY, driftClampY)
      drift.x = lerp(drift.x, drift.tx, 0.5)
      drift.y = lerp(drift.y, drift.ty, 0.5)

      if (instantNudge > 0) {
        nodes.forEach((n) => {
          if (n.anchored) return
          n.x += nx * instantNudge * n.depth
          n.y += ny * instantNudge * n.depth
        })
      }
      wake(wakeHoldScroll)
    }

    const flushMobileScroll = () => {
      scrollFlushRaf = 0
      const dy = pendingScrollDy
      pendingScrollDy = 0
      syncScrollOffset()
      if (Math.abs(dy) <= 0.5) {
        wake(wakeHoldScroll)
        return
      }
      applyScrollDelta(0, dy)
      if (showCorner) updateOrigin()
    }

    /** Screen-space Y for drawing / hit tests (mobile scrolls the tall field). */
    const screenY = (worldY) => (isMobile ? worldY - scrollOffsetY : worldY)

    /** World-space Y from a screen / client Y. */
    const worldFromScreenY = (clientY) => (isMobile ? clientY + scrollOffsetY : clientY)

    const applyBounceAt = (clientX, clientY, allowPush) => {
      const wx = clientX
      const wy = worldFromScreenY(clientY)
      nodes.forEach((n) => {
        const d = Math.hypot(n.x - wx, n.y - wy)
        if (d >= 200) return
        const strength = 1 - d / 200
        n.pulse = Math.max(n.pulse, strength)

        if (allowPush && !n.anchored && d > 0.5) {
          const push = strength * 22
          const ox = ((n.x - wx) / d) * push
          const oy = ((n.y - wy) / d) * push
          n.x += ox
          n.y += oy
          n.baseX += ox * 0.35
          n.baseY += oy * 0.35
          n.vx += ((n.x - wx) / d) * strength * 6
          n.vy += ((n.y - wy) / d) * strength * 6
        }
      })
      wake(1400)
    }

    const onPointerMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = true
      if (touchTap && e.pointerId === touchTap.pointerId) {
        const moved = Math.hypot(e.clientX - touchTap.x, e.clientY - touchTap.y)
        if (moved > 10) touchTap.moved = true
      }
      wake(400)
    }

    const onPointerLeave = () => {
      pointer.active = false
    }

    const onPointerDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return

      if (e.pointerType === 'touch') {
        touchTap = {
          pointerId: e.pointerId,
          x: e.clientX,
          y: e.clientY,
          moved: false,
        }
        return
      }

      applyBounceAt(e.clientX, e.clientY, true)
    }

    const onPointerUp = (e) => {
      if (!touchTap || e.pointerId !== touchTap.pointerId) return
      const tap = touchTap
      touchTap = null
      if (tap.moved) return
      applyBounceAt(tap.x, tap.y, true)
    }

    const onPointerCancel = (e) => {
      if (touchTap && e.pointerId === touchTap.pointerId) touchTap = null
    }

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0
      const dy = y - lastScrollY
      lastScrollY = y
      if (Math.abs(dy) <= 0.5) return

      if (isMobile) {
        pendingScrollDy += dy
        if (!scrollFlushRaf) {
          scrollFlushRaf = requestAnimationFrame(flushMobileScroll)
        }
        return
      }

      applyScrollDelta(0, dy)
      if (showCorner) updateOrigin()
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
        if (scrollFlushRaf) {
          cancelAnimationFrame(scrollFlushRaf)
          scrollFlushRaf = 0
        }
        looping = false
        return
      }
      wake(800)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointercancel', onPointerCancel, { passive: true })
    document.documentElement.addEventListener('mouseleave', onPointerLeave)
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
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

      if (!isBusy()) {
        looping = false
        return
      }

      try {
        const dt = Math.min(32, now - last) / 16.67
        last = now

        drift.x = lerp(drift.x, drift.tx, 0.1)
        drift.y = lerp(drift.y, drift.ty, 0.1)
        drift.tx = lerp(drift.tx, 0, 0.02)
        drift.ty = lerp(drift.ty, 0, 0.02)
        if (showCorner) updateOrigin()
        if (isMobile) syncScrollOffset()

        const ox = origin.x * w
        const oy = origin.y * h

        if (w < 1 || h < 1) {
          raf = requestAnimationFrame(tick)
          return
        }

        if (showCorner) {
          let ai = 0
          CORNER_RAYS.forEach((ray) => {
            for (let i = 1; i <= 7; i += 1) {
              const n = nodes[ai]
              ai += 1
              if (!n?.anchored) continue
              const p = cornerPoint(ray, i / 7.2, ox, oy)
              // Anchored corner stays in viewport; store in world coords
              n.baseX = n.x = p.x
              n.baseY = n.y = isMobile ? p.y + scrollOffsetY : p.y
              n.vx = 0
              n.vy = 0
            }
          })
          const vertex = nodes[ai]
          if (vertex?.anchored) {
            vertex.baseX = vertex.x = ox
            vertex.baseY = vertex.y = isMobile ? oy + scrollOffsetY : oy
            vertex.vx = 0
            vertex.vy = 0
          }
        }

        nodes.forEach((n) => {
          if (n.anchored) {
            const sx = n.x
            const sy = screenY(n.y)
            let targetScale = 1
            if (pointer.active) {
              const dScreen = Math.hypot(sx - pointer.x, sy - pointer.y)
              if (dScreen < 40) targetScale = 1.2
              else if (dScreen < 64) targetScale = 1.08
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
            const sx = n.x
            const sy = screenY(n.y)
            const dScreen = Math.hypot(sx - pointer.x, sy - pointer.y)
            if (dScreen < 42) targetScale = 1.28
            else if (dScreen < 70) targetScale = 1.12
          }
          targetScale = Math.max(targetScale, 1 + n.pulse * 0.9)
          n.scale = lerp(n.scale, targetScale, targetScale > n.scale ? 0.22 : 0.07)
          n.pulse = Math.max(0, n.pulse - 0.04 * dt)
          n.phase += 0.015 * dt
        })

        ctx.clearRect(0, 0, w, h)

        // Hub glow stays viewport-relative on home
        const glowCy = showCorner ? oy : h * 0.5
        const g = ctx.createRadialGradient(ox, glowCy, 10, ox, glowCy, Math.min(w, h) * 0.85)
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
        const pad = linkDist + 40

        for (let i = 0; i < nodes.length; i += 1) {
          const a = nodes[i]
          const ax = a.x
          const ay = screenY(a.y)

          // Cull far off-screen nodes on mobile tall field
          if (isMobile && (ay < -pad || ay > h + pad)) continue

          if (!a.anchored && showCorner) {
            const dCorner = Math.hypot(ax - ox, ay - oy)
            if (dCorner < linkDist * 2.2) {
              const alpha = (1 - dCorner / (linkDist * 2.2)) * 0.45
              ctx.beginPath()
              ctx.moveTo(ax, ay)
              ctx.lineTo(ox, oy)
              ctx.strokeStyle = rgba(TEAL, alpha)
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }

          for (let j = i + 1; j < nodes.length; j += 1) {
            const b = nodes[j]
            const bx = b.x
            const by = screenY(b.y)
            if (isMobile && (by < -pad || by > h + pad)) continue
            const d = Math.hypot(ax - bx, ay - by)
            if (d > linkDist) continue
            const alpha = (1 - d / linkDist) * 0.65 + Math.max(a.pulse, b.pulse) * 0.25
            ctx.beginPath()
            ctx.moveTo(ax, ay)
            ctx.lineTo(bx, by)
            ctx.strokeStyle = rgba(TEAL, alpha)
            ctx.lineWidth = 1.15
            ctx.stroke()
          }
        }

        nodes.forEach((n) => {
          const sx = n.x
          const sy = screenY(n.y)
          if (isMobile && (sy < -pad || sy > h + pad)) return

          const c = mixColor(n.tint)
          const breathe = 1 + Math.sin(n.phase) * 0.1
          const r = n.size * breathe * n.scale

          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 5)
          glow.addColorStop(0, rgba(c, 0.72 + (n.scale - 1) * 0.4))
          glow.addColorStop(1, rgba(c, 0))
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(sx, sy, r * 5, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.arc(sx, sy, r, 0, Math.PI * 2)
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
      if (scrollFlushRaf) cancelAnimationFrame(scrollFlushRaf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerCancel)
      document.documentElement.removeEventListener('mouseleave', onPointerLeave)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('wheel', onWheel, true)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [showCorner, pathname])

  return (
    <div className="corner-node-web" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}

export default CornerNodeWeb
