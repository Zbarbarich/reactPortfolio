import { useState } from 'react'
import PropTypes from 'prop-types'

const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
      style={{
        border: 'double 4px transparent',
        borderRadius: '8px',
        backgroundImage: 'linear-gradient(var(--background-color), var(--background-color)), linear-gradient(to right, #4fd1c5, #535bf2)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={project.onOpen}
    >
      <div className="relative aspect-video rounded-[4px] overflow-hidden">
        <img 
          src={project.thumbnail} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute bottom-0 right-0 p-4 bg-background-dark/40 backdrop-blur-md"
        >
          <h3 className="text-xl font-extrabold tracking-wide text-text-dark relative">
            <div 
              className="absolute bottom-1 -right-2 h-[9px] w-[85%] bg-gradient-to-r from-primary-light to-transparent -z-10"
              style={{ transform: 'translateX(10%)' }}
            ></div>
            <span className="relative z-10">{project.title}</span>
          </h3>
        </div>
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">Learn More</span>
          </div>
        )}
      </div>
    </div>
  )
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    onOpen: PropTypes.func.isRequired,
  }).isRequired,
}

export default ProjectCard 