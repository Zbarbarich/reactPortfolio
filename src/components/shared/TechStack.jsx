import { useCallback, useEffect, useRef, useState } from 'react'
import reactIcon from '../../assets/icons/react.png'
import nodeIcon from '../../assets/icons/node.png'
import pythonIcon from '../../assets/icons/python.png'
import javascriptIcon from '../../assets/icons/javascript.png'
import typescriptIcon from '../../assets/icons/typescript.svg'
import expressIcon from '../../assets/icons/express.png'
import tailwindIcon from '../../assets/icons/tailwind.png'
import mongodbIcon from '../../assets/icons/mongodb.png'
import postgresqlIcon from '../../assets/icons/postgresql.png'
import dockerIcon from '../../assets/icons/docker.png'
import gitIcon from '../../assets/icons/git.png'
import awsIcon from '../../assets/icons/aws.png'
import oracleIcon from '../../assets/icons/oracle.svg'
import htmlIcon from '../../assets/icons/html.png'
import cssIcon from '../../assets/icons/css.png'

const technologies = [
  { name: 'Git', icon: gitIcon },
  { name: 'Python', icon: pythonIcon },
  { name: 'JavaScript', icon: javascriptIcon },
  { name: 'TypeScript', icon: typescriptIcon },
  { name: 'Express', icon: expressIcon },
  { name: 'Node.js', icon: nodeIcon },
  { name: 'HTML', icon: htmlIcon },
  { name: 'CSS', icon: cssIcon },
  { name: 'React', icon: reactIcon },
  { name: 'Tailwind CSS', icon: tailwindIcon },
  { name: 'Docker', icon: dockerIcon },
  { name: 'AWS Cloud', icon: awsIcon },
  { name: 'Oracle', icon: oracleIcon },
  { name: 'MongoDB', icon: mongodbIcon },
  { name: 'PostgreSQL', icon: postgresqlIcon },
]

const AUTO_MS = 3200
const SLIDE_MS = 600
const SLOT = 100 / 3 // each slide is 1/3 of the viewport

// Clones at both ends for seamless looping: [last, ...all, first]
const trackItems = [
  technologies[technologies.length - 1],
  ...technologies,
  technologies[0],
]

const wrap = (i, len) => ((i % len) + len) % len

const TechStack = () => {
  const len = technologies.length
  // trackPos indexes into trackItems; start at 1 (= first real item, centered)
  const [trackPos, setTrackPos] = useState(1)
  const [animate, setAnimate] = useState(true)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const locked = useRef(false)
  const touchStartX = useRef(null)

  const active = wrap(trackPos - 1, len)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const goNext = useCallback(() => {
    if (locked.current) return
    locked.current = true
    if (reducedMotion) {
      setAnimate(false)
      setTrackPos((p) => {
        const next = p + 1
        return next === len + 1 ? 1 : next
      })
      locked.current = false
      return
    }
    setAnimate(true)
    setTrackPos((p) => p + 1)
    window.setTimeout(() => {
      locked.current = false
    }, SLIDE_MS + 80)
  }, [reducedMotion, len])

  const goPrev = useCallback(() => {
    if (locked.current) return
    locked.current = true
    if (reducedMotion) {
      setAnimate(false)
      setTrackPos((p) => {
        const next = p - 1
        return next === 0 ? len : next
      })
      locked.current = false
      return
    }
    setAnimate(true)
    setTrackPos((p) => p - 1)
    window.setTimeout(() => {
      locked.current = false
    }, SLIDE_MS + 80)
  }, [reducedMotion, len])

  const onTransitionEnd = (e) => {
    if (e.target !== e.currentTarget) return
    if (e.propertyName !== 'transform') return

    if (trackPos === 0) {
      setAnimate(false)
      setTrackPos(len)
    } else if (trackPos === len + 1) {
      setAnimate(false)
      setTrackPos(1)
    }
    locked.current = false
  }

  // Re-enable animation after an instant clone jump
  useEffect(() => {
    if (animate) return undefined
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimate(true))
    })
    return () => cancelAnimationFrame(id)
  }, [animate, trackPos])

  useEffect(() => {
    if (paused || reducedMotion) return undefined
    const id = window.setInterval(goNext, AUTO_MS)
    return () => window.clearInterval(id)
  }, [paused, reducedMotion, goNext])

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    setPaused(true)
  }

  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) > 40) {
      if (dx < 0) goNext()
      else goPrev()
    }
    window.setTimeout(() => setPaused(false), 400)
  }

  const jumpTo = (i) => {
    if (locked.current || i === active) return
    locked.current = true
    if (reducedMotion) {
      setAnimate(false)
      setTrackPos(i + 1)
      locked.current = false
      return
    }
    setAnimate(true)
    setTrackPos(i + 1)
  }

  // Center the item at trackPos: shift so that slot is in the middle third
  const translateX = `calc(-${trackPos} * ${SLOT}% + ${SLOT}%)`

  return (
    <div
      className="w-full max-w-xl mx-auto select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Technology stack"
    >
      <div className="tech-carousel-viewport">
        <div
          className={`tech-carousel-track${animate && !reducedMotion ? ' is-animated' : ''}`}
          style={{
            transform: `translate3d(${translateX}, 0, 0)`,
            transitionDuration: reducedMotion || !animate ? '0ms' : `${SLIDE_MS}ms`,
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {trackItems.map((tech, i) => {
            const distance = i - trackPos
            const role =
              distance === 0 ? 'active' : distance === -1 ? 'prev' : distance === 1 ? 'next' : 'far'
            const clickable = role === 'prev' || role === 'next'
            const Tag = clickable ? 'button' : 'div'

            return (
              <Tag
                key={`${tech.name}-${i}`}
                type={clickable ? 'button' : undefined}
                className={`tech-carousel-slide is-${role}`}
                aria-label={
                  clickable
                    ? role === 'prev'
                      ? `Previous: ${tech.name}`
                      : `Next: ${tech.name}`
                    : undefined
                }
                onClick={clickable ? (role === 'prev' ? goPrev : goNext) : undefined}
              >
                <img
                  src={tech.icon}
                  alt={role === 'active' ? tech.name : ''}
                  className={`tech-carousel-logo${role === 'active' && !reducedMotion ? ' is-bobbing' : ''}`}
                  draggable={false}
                />
              </Tag>
            )
          })}
        </div>
      </div>

      <p
        className="font-display font-semibold text-center text-base sm:text-lg
                   text-text-light/90 dark:text-text-dark/90 mt-4 mb-5 min-h-[1.5rem]"
        aria-live="polite"
      >
        {technologies[active].name}
      </p>

      <div className="flex justify-center gap-2 flex-wrap px-4">
        {technologies.map((tech, i) => (
          <button
            key={tech.name}
            type="button"
            aria-label={`Show ${tech.name}`}
            aria-current={i === active ? 'true' : undefined}
            onClick={() => jumpTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active
                ? 'w-5 gradient-underline'
                : 'w-1.5 bg-gray-400/35 hover:bg-gray-400/65'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default TechStack
