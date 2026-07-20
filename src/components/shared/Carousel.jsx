import { useRef, useState } from 'react'
import PropTypes from 'prop-types'

const SWIPE_THRESHOLD = 40

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)
  const swiped = useRef(false)

  const next = (e) => {
    e?.stopPropagation?.()
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prev = (e) => {
    e?.stopPropagation?.()
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    swiped.current = false
  }

  const onTouchMove = (e) => {
    if (touchStartX.current == null) return
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current
    // Clearly horizontal — mark as swipe so the zoom link does not fire
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) {
      swiped.current = true
    }
  }

  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - (touchStartY.current ?? 0)
    touchStartX.current = null
    touchStartY.current = null

    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      swiped.current = true
      if (dx < 0) next()
      else prev()
    }
  }

  const onZoomClick = (e) => {
    e.stopPropagation()
    if (swiped.current) {
      e.preventDefault()
      swiped.current = false
    }
  }

  if (!images?.length) return null

  const currentSrc = images[currentIndex]

  return (
    <div className="group/carousel relative">
      <div
        className="relative aspect-video overflow-hidden rounded-xl bg-gray-100/80 dark:bg-gray-800/80
                   shadow-[inset_0_1px_8px_rgba(0,0,0,0.12)]
                   ring-1 ring-gray-200/40 dark:ring-gray-700/50 touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Blurred fill — covers letterbox/pillarbox gaps only */}
        <img
          src={currentSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover scale-110 blur-xl opacity-60
                     dark:opacity-50 pointer-events-none select-none"
          draggable={false}
        />

        {/* Full image always visible inside the frame (never cropped) */}
        <img
          src={currentSrc}
          alt={`Slide ${currentIndex + 1}`}
          className="absolute inset-0 z-[1] h-full w-full object-contain pointer-events-none"
          draggable={false}
        />

        <a
          href={currentSrc}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onZoomClick}
          className="absolute inset-0 z-[2] cursor-zoom-in
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-inset focus-visible:ring-primary-light/50"
          aria-label={`Open slide ${currentIndex + 1} full size in a new tab`}
          title="Open full size"
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-[3]
                       w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full
                       bg-background-dark/40 backdrop-blur-sm text-white text-sm
                       opacity-0 group-hover/carousel:opacity-100 focus:opacity-100
                       hover:bg-background-dark/70 transition-opacity"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-[3]
                       w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full
                       bg-background-dark/40 backdrop-blur-sm text-white text-sm
                       opacity-0 group-hover/carousel:opacity-100 focus:opacity-100
                       hover:bg-background-dark/70 transition-opacity"
          >
            ›
          </button>

          <div className="flex justify-center gap-1.5 mt-3">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(index)
                }}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-6 gradient-underline'
                    : 'w-1.5 bg-gray-400/50 hover:bg-gray-400/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

Carousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default Carousel
