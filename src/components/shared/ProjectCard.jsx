import { useRef, useState } from 'react'
import PropTypes from 'prop-types'

const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)
  const isFeatured = project.featured

  const handleMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    setTilt({
      x: (py - 0.5) * -10,
      y: (px - 0.5) * 12,
    })
  }

  const resetTilt = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <div className="perspective-card h-fit w-full">
      <div
        ref={cardRef}
        className={`group relative cursor-pointer transition-shadow duration-300 h-fit w-full
          hover:shadow-xl hover:shadow-primary-light/15
          ${isFeatured ? 'glow-border' : ''}`}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? 'scale(1.02)' : 'scale(1)'}`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
          ...(isFeatured
            ? {}
            : {
                border: 'double 4px transparent',
                borderRadius: '8px',
                backgroundImage:
                  'linear-gradient(var(--background-color), var(--background-color)), linear-gradient(to right, #4fd1c5, #535bf2)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMove}
        onMouseLeave={resetTilt}
        onClick={project.onOpen}
      >
        <div
          className={`relative overflow-hidden rounded-[4px] ${
            isFeatured ? 'aspect-[16/10]' : 'aspect-video'
          }`}
        >
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-0 right-0 p-4 bg-background-dark/50 backdrop-blur-md">
            <h3 className="text-xl font-extrabold tracking-wide text-text-dark relative font-display">
              <div
                className="absolute bottom-1 -right-2 h-[9px] w-[85%] gradient-underline -z-10"
                style={{ transform: 'translateX(10%)' }}
              />
              <span className="relative z-10">{project.title}</span>
            </h3>
          </div>
          {isHovered && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-white text-lg font-semibold px-4 py-2 rounded-full border border-white/30">
                Learn More
              </span>
            </div>
          )}
        </div>
        {isFeatured && project.shortDescription && (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed px-1">
            {project.shortDescription}
          </p>
        )}
      </div>
    </div>
  )
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    shortDescription: PropTypes.string,
    featured: PropTypes.bool,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['status', 'tech']).isRequired,
      })
    ).isRequired,
    onOpen: PropTypes.func.isRequired,
  }).isRequired,
}

export default ProjectCard
