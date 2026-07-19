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
const wrap = (v, span) => ((v % span) + span) % span

const CORNER_RAYS = [
  { x: 0, y: -1, weight: 1.2 },
  { x: -0.92, y: 0.55, weight: 1.15 },
  { x: 0.92, y: 0.55, weight: 1.15 },
]

/**
 * Site-wide teal node web. Corner lines only on Home (fixed behind Andy).
 * Free nodes react to hover / click / scroll. Corner nodes stay locked.
 * Mobile: camera pans a tall wrapped field so scroll reveals new nodes
 * smoothly (scroll up returns earlier nodes).
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
    let fieldH = 1
    let raf = 0
    let nodes = []
    let running = true
    let looping = false
    let visible = document.visibilityState !== 'hidden'
    let seedKey = ''
    let lastScrollY = window.scrollY || 0
    let last = performance.now()
    let activityUntil = 0

    // Phone / small viewport — avoid bare (pointer: coarse); hybrid desktops match it
    const isMobile =
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(hover: none) and (pointer: coarse)').matches

    const drift = { x: 0, y: 0, tx: 0, ty: 0 }
    // Mobile vertical camera through the free-node field (world units ≈ px)
    const camera = { y: 0, ty: 0 }
    const origin = { x: 0.5, y: 0.52 }
    const pointer = { x: -9999, y: -9999, active: false }

    const scrollGain = 0.48
    const scrollClamp = 180
    const driftClampX = 42
    const driftClampY = 52
    const instantNudge = isMobile ? 0 : 0.1
    const wakeHoldScroll = isMobile ? 2000 : 1400
    const maxDpr = isMobile ? 1 : 2
    // Keep field motion clearly slower than the finger (long pages used to feel whipped)
    const mobileCamFactor = 0.07
    const mobileCamEase = 0.08
    const nodeBudgetDivisor = isMobile ? 14000 : 12000
    const nodeCap = isMobile ? 64 : 120
    const nodeFloor = isMobile ? 48 : 60
    let mobileLinkDist = 120

    const wake = (holdMs = 900) => {
      activityUntil = Math.max(activityUntil, performance.now() + holdMs)
      if (!running || !visible || looping) return
      looping = true
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }

    const isBusy = () => {
      if (performance.now() < activityUntil) return true
      if (isMobile) {
        if (Math.abs(camera.y - camera.ty) > 0.35) return true
      } else {
        if (Math.abs(drift.x) > 0.12 || Math.abs(drift.y) > 0.12) return true
        if (Math.abs(drift.tx) > 0.12 || Math.abs(drift.ty) > 0.12) return true
      }
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
        depth: anchored ? 0 : rand(0.75, 1.25),
        size: anchored ? rand(1.6, 2.6) : rand(1.4, 2.4),
        scale: 1,
        phase: rand(0, Math.PI * 2),
        pulse: 0,
      }
    }

    const seedNodes = () => {
      const ox = origin.x * w
      const oy = origin.y * h
      fieldH = Math.max(h * 2.5, h + 1)
      const key = `${showCorner ? 'c' : 'f'}:${Math.round(ox)}:${Math.round(oy)}:${w}x${h}:${isMobile ? 'm' : 'd'}`
      if (key === seedKey && nodes.length) return
      seedKey = key

      const freeTarget = Math.round(
        Math.min(nodeCap, Math.max(nodeFloor, (w * h) / nodeBudgetDivisor))
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

      if (isMobile) {
        // Even grid + jitter; link distance is derived from cell size so neighbors always connect
        const cols = 5
        const rows = Math.max(8, Math.ceil(freeTarget / cols))
        const cellW = w / cols
        const cellH = fieldH / rows
        mobileLinkDist = Math.hypot(cellW, cellH) * 1.2
        let placed = 0
        for (let row = 0; row < rows && placed < freeTarget; row += 1) {
          for (let col = 0; col < cols && placed < freeTarget; col += 1) {
            const x = clamp((col + 0.5) * cellW + rand(-cellW * 0.28, cellW * 0.28), 4, w - 4)
            const y = wrap((row + 0.5) * cellH + rand(-cellH * 0.28, cellH * 0.28), fieldH)
            nodes.push(makeNode(x, y, rand(0.05, 0.95), false))
            placed += 1
          }
        }
      } else {
        let free = 0
        let guard = 0
        while (free < freeTarget && guard < freeTarget * 24) {
          guard += 1
          const x = rand(0, w)
          const y = rand(0, h)
          if (showCorner) {
            const dHub = Math.hypot(x - ox, y - oy)
            if (dHub < 36 && Math.random() < 0.75) continue
          }
          nodes.push(makeNode(x, y, rand(0.05, 0.95), false))
          free += 1
        }
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
      if (isMobile) {
        const y = window.scrollY || document.documentElement.scrollTop || 0
        camera.ty = y * mobileCamFactor
        camera.y = camera.ty
      }
      wake(1200)
    }

    const applyScrollDelta = (dx, dy) => {
      const nx = clamp(dx, -scrollClamp, scrollClamp) * scrollGain
      const ny = clamp(dy, -scrollClamp, scrollClamp) * scrollGain
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

    /** Mobile: scroll position → camera through the field (down = new, up = earlier). */
    const syncMobileCamera = () => {
      const y = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0)
      camera.ty = y * mobileCamFactor
      wake(wakeHoldScroll)
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
      if (e.pointerType === 'mouse' && e.button !== 0) return
      const x = e.clientX
      const y = e.clientY
      // On touch, only pulse — push fights with page scroll / long-press drag
      const allowPush = e.pointerType !== 'touch'

      nodes.forEach((n) => {
        const d = Math.hypot(n.x - x, n.y - y)
        if (d >= 200) return
        const strength = 1 - d / 200
        n.pulse = Math.max(n.pulse, strength)

        if (allowPush && !n.anchored && d > 0.5) {
          const push = strength * 22
          const ox = ((n.x - x) / d) * push
          const oy = ((n.y - y) / d) * push
          n.x += ox
          n.y += oy
          n.baseX += ox * 0.35
          n.baseY += oy * 0.35
          n.vx += ((n.x - x) / d) * strength * 6
          n.vy += ((n.y - y) / d) * strength * 6
        }
      })
      wake(1400)
    }

    const onScroll = () => {
      if (isMobile) {
        syncMobileCamera()
        return
      }
      const y = window.scrollY || document.documentElement.scrollTop || 0
      const dy = y - lastScrollY
      lastScrollY = y
      if (Math.abs(dy) <= 0.5) return
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

        if (isMobile) {
          camera.y = lerp(camera.y, camera.ty, mobileCamEase)
          if (showCorner) updateOrigin()
        } else {
          drift.x = lerp(drift.x, drift.tx, 0.1)
          drift.y = lerp(drift.y, drift.ty, 0.1)
          drift.tx = lerp(drift.tx, 0, 0.02)
          drift.ty = lerp(drift.ty, 0, 0.02)
        }

        const px = pointer.x
        const py = pointer.y
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

        nodes.forEach((n) => {
          if (n.anchored) {
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

          if (isMobile) {
            // Pan the whole field together (no depth stretch) so spacing stays even
            n.x = n.baseX + n.vx
            n.y = wrap(n.baseY - camera.y, fieldH)
            n.vx *= 0.84
            n.vy *= 0.84
            n.pulse = Math.max(0, n.pulse - 0.04 * dt)
            n.phase += 0.012 * dt
            n.scale = lerp(n.scale, 1 + n.pulse * 0.9, 0.18)
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

        const linkDist = isMobile
          ? mobileLinkDist
          : Math.min(w, h) * 0.155
        const inBand = (n) => n.y > -60 && n.y < h + 60

        for (let i = 0; i < nodes.length; i += 1) {
          const a = nodes[i]
          if (isMobile && !a.anchored && !inBand(a)) continue

          if (!a.anchored && showCorner && (!isMobile || inBand(a))) {
            const dCorner = Math.hypot(a.x - ox, a.y - oy)
            if (dCorner < linkDist * 2.2) {
              const alpha = (1 - dCorner / (linkDist * 2.2)) * 0.45
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
            if (isMobile && !b.anchored && !inBand(b)) continue
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
          if (isMobile && !n.anchored && !inBand(n)) return
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
    }
  }, [showCorner])

  return (
    <div className="corner-node-web" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}

export default CornerNodeWeb
