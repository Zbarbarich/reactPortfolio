import { useState } from 'react'
import PropTypes from 'prop-types'

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = (e) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prev = (e) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  if (!images?.length) return null

  const currentSrc = images[currentIndex]

  return (
    <div className="group/carousel relative">
      <div
        className="relative aspect-video overflow-hidden rounded-xl bg-gray-100/80 dark:bg-gray-800/80
                   flex items-center justify-center
                   shadow-[inset_0_1px_8px_rgba(0,0,0,0.12)]
                   ring-1 ring-gray-200/40 dark:ring-gray-700/50"
      >
        {/* Zoomed + blurred fill behind letterboxed / pillarboxed slides */}
        <img
          src={currentSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover scale-125 blur-2xl opacity-70
                     dark:opacity-60 pointer-events-none select-none"
          draggable={false}
        />
        <a
          href={currentSrc}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="relative z-[1] max-h-full max-w-full flex items-center justify-center
                     cursor-zoom-in focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-primary-light/50 rounded-sm"
          aria-label={`Open slide ${currentIndex + 1} full size in a new tab`}
          title="Open full size"
        >
          <img
            src={currentSrc}
            alt={`Slide ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain"
          />
        </a>
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-[2]
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
            className="absolute right-2 top-1/2 -translate-y-1/2 z-[2]
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
