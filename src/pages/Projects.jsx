import { useState } from 'react'
import ProjectCard from '../components/shared/ProjectCard'
import Modal from '../components/shared/Modal'
import Carousel from '../components/shared/Carousel'
import mvThumbnail from '../assets/images/magnusvisibility/mvthumbnail.png'
import mv1 from '../assets/images/magnusvisibility/mv1.png'
import mv2 from '../assets/images/magnusvisibility/mv2.png'
import mv3 from '../assets/images/magnusvisibility/mv3.png'
import mv4 from '../assets/images/magnusvisibility/mv4.png'

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [showVideo, setShowVideo] = useState(false)

  const projects = [
    {
      title: "Magnus Visibility",
      thumbnail: mvThumbnail,
      shortDescription: "A comprehensive ERP system focused on production availability tracking, featuring both admin and regular user functionality.",
      images: [
        mv1,
        mv2,
        mv3,
        mv4
      ],
      fullDescription: "Magnus Visibility is an enterprise-level ERP system designed to track and manage production availability. It features comprehensive admin controls and user-friendly interfaces for regular users, enabling efficient monitoring of production metrics and downtime analysis.",
      demoLink: "https://youtu.be/1X7a-nmDDSQ",
      codeLink: "https://gitlab.com/wattrs7/magnuserpdowndetail.git"
    }
    // Add more projects here
  ]

  const handleProjectClick = (project) => {
    setSelectedProject(project)
    setShowVideo(false)
  }

  const handleDemoClick = () => {
    setShowVideo(true)
  }

  return (
    <div className="flex flex-col items-center min-h-[80vh] pt-8">
      <h1 className="text-5xl font-bold mb-6 relative">
        <div 
          className="absolute bottom-0 left-8 h-[14px] w-[55%] bg-gradient-to-r from-primary-light to-transparent"
        ></div>
        <span className="relative z-[2]">Projects</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            project={{
              ...project,
              onOpen: () => handleProjectClick(project),
              onDemoClick: handleDemoClick
            }}
          />
        ))}
      </div>

      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      >
        {selectedProject && !showVideo ? (
          <div className="space-y-4">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-primary-light"
            >
              ×
            </button>
            <Carousel images={selectedProject.images} />
            <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
            <p className="text-gray-400">{selectedProject.fullDescription}</p>
            <div className="flex space-x-4">
              <button 
                onClick={handleDemoClick}
                className="text-primary hover:text-secondary transition"
              >
                Watch Demo
              </button>
              <a 
                href={selectedProject.codeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition"
              >
                View Code
              </a>
            </div>
          </div>
        ) : (
          <div className="aspect-video">
            <button 
              onClick={() => setShowVideo(false)}
              className="absolute top-2 left-2 text-white bg-black/50 px-3 py-1 rounded-full hover:bg-black/70"
            >
              Back
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedProject?.demoLink.split('/').pop()}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Projects
