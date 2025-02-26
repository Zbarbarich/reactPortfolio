import { useEffect, useRef } from 'react'

const WaveAnimation = () => {
  const boatRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const boat = boatRef.current
    const container = containerRef.current
    let position = 0

    const getWaveY = (x) => {
      const animationProgress = (Date.now() % 15000) / 15000
      const waveOffset = -animationProgress * 480
      
      // Normalize x position to the wave cycle (480px) and adjust for screen width
      const normalizedX = ((x - waveOffset) % 480 + 480) % 480
      
      // Get container width ratio for wave amplitude adjustment
      const containerWidth = container?.offsetWidth || 1920
      const widthRatio = containerWidth / 1920
      
      // Bezier curve control points from SVG path
      // M0,120 C160,180 320,60 480,120
      const t = normalizedX / 480
      const t1 = (1 - t) * (1 - t) * (1 - t)
      const t2 = 3 * t * (1 - t) * (1 - t)
      const t3 = 3 * t * t * (1 - t)
      const t4 = t * t * t
      
      // Scale wave height based on container width
      const y = ((120 * t1) + (180 * t2) + (60 * t3) + (120 * t4)) * widthRatio
      return y - 120 * widthRatio
    }

    const animate = () => {
      if (!container || !boat) return

      const containerWidth = container.offsetWidth
      const cycleTime = 15000
      const progress = (Date.now() % (cycleTime * 2)) / cycleTime
      
      const normalizedProgress = progress <= 1 
        ? progress 
        : 2 - progress
      
      position = normalizedProgress * (containerWidth - 64)
      const goingRight = progress <= 1
      
      // Calculate points with direction-aware offsets
      const offset = goingRight ? 2 : -2
      const prevX = position - offset
      const nextX = position + offset
      
      const currentWaveY = getWaveY(position)
      const prevWaveY = getWaveY(prevX)
      const nextWaveY = getWaveY(nextX)
      
      // Direction-aware angle calculation
      const angle = goingRight 
        ? Math.atan2(nextWaveY - prevWaveY, 4) * (180 / Math.PI)
        : Math.atan2(prevWaveY - nextWaveY, 4) * (180 / Math.PI)
      
      const scale = container.offsetHeight / 240
      const baseOffset = container.offsetHeight - 143
      const waveScale = 0.85
      const adjustedY = baseOffset + (currentWaveY * scale * waveScale)

      boat.style.transform = `translateX(${position}px) translateY(${adjustedY}px) rotate(${angle}deg)`
      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-48 overflow-hidden">
      {/* Waves First */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400vw] h-32">
        <svg 
          className="absolute w-full h-full animate-wave"
          viewBox="0 0 7680 240"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,105
              C160,165 320,45 480,105
              C640,165 800,45 960,105
              C1120,165 1280,45 1440,105
              C1600,165 1760,45 1920,105
              C2080,165 2240,45 2400,105
              C2560,165 2720,45 2880,105
              C3040,165 3200,45 3360,105
              C3520,165 3680,45 3840,105
              C4000,165 4160,45 4320,105
              C4480,165 4640,45 4800,105
              C4960,165 5120,45 5280,105
              C5440,165 5600,45 5760,105
              C5920,165 6080,45 6240,105
              C6400,165 6560,45 6720,105
              C6880,165 7040,45 7200,105
              C7360,165 7520,45 7680,105"
            className="stroke-primary-light/30 fill-none"
            strokeWidth="8"
          />
        </svg>
        
        <svg 
          className="absolute w-full h-full animate-wave"
          viewBox="0 0 7680 240"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,120
              C160,180 320,60 480,120
              C640,180 800,60 960,120
              C1120,180 1280,60 1440,120
              C1600,180 1760,60 1920,120
              C2080,180 2240,60 2400,120
              C2560,180 2720,60 2880,120
              C3040,180 3200,60 3360,120
              C3520,180 3680,60 3840,120
              C4000,180 4160,60 4320,120
              C4480,180 4640,60 4800,120
              C4960,180 5120,60 5280,120
              C5440,180 5600,60 5760,120
              C5920,180 6080,60 6240,120
              C6400,180 6560,60 6720,120
              C6880,180 7040,60 7200,120
              C7360,180 7520,60 7680,120"
            className="stroke-primary-light/40 fill-none"
            strokeWidth="12"
          />
        </svg>
      </div>

      {/* Boat Last */}
      <div 
        ref={boatRef} 
        className="absolute left-0 top-0 w-24 h-24 z-[999]"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-primary-light stroke-2">
          {/* Hull - pointed front */}
          <path d="M15,70 Q35,80 50,80 Q65,80 80,70 L85,60 L75,45 Q50,40 25,45 L15,70" />
          
          {/* Bow Spirit (front pointed part) */}
          <path d="M85,60 L95,55" strokeWidth="1.5" />
          
          {/* Main Mast */}
          <line x1="50" y1="45" x2="50" y2="15" strokeWidth="2.5" />
          
          {/* Cross Beam */}
          <line x1="35" y1="30" x2="65" y2="30" strokeWidth="2" />
          
          {/* Main Sail */}
          <path d="M50,15 Q65,20 65,45" />
          <path d="M50,30 Q60,32 62,45" />
          
          {/* Back Sail */}
          <path d="M50,20 Q35,25 35,45" />
          <path d="M50,30 Q40,32 38,45" />
          
          {/* Flag */}
          <path d="M50,15 L60,17 L50,19" fill="currentColor" />
          
          {/* Ship Details */}
          <path d="M30,60 L70,60" strokeWidth="1" />
          <path d="M35,65 L65,65" strokeWidth="1" />
          <path d="M25,50 L35,55" strokeWidth="1" />
          <path d="M75,50 L65,55" strokeWidth="1" />
          
          {/* Portholes */}
          <circle cx="35" cy="55" r="2" />
          <circle cx="50" cy="55" r="2" />
          <circle cx="65" cy="55" r="2" />
        </svg>
      </div>
    </div>
  )
}

export default WaveAnimation