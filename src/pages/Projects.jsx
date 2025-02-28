import { useState } from 'react'
import ProjectCard from '../components/shared/ProjectCard'
import Modal from '../components/shared/Modal'
import Carousel from '../components/shared/Carousel'
import mvThumbnail from '../assets/images/magnusvisibility/mvthumbnail.png'
import mv1 from '../assets/images/magnusvisibility/mv1.png'
import mv2 from '../assets/images/magnusvisibility/mv2.png'
import mv3 from '../assets/images/magnusvisibility/mv3.png'
import mv4 from '../assets/images/magnusvisibility/mv4.png'
import mv5 from '../assets/images/magnusvisibility/mv5.png'
import portfolioThumbnail from '../assets/images/portfolio/portfolioThumbnail.png'
import portfolioDesktop from '../assets/images/portfolio/portfolioDesktop.png'
import portfolioTablet from '../assets/images/portfolio/portfolioTablet.png'
import portfolioMobile from '../assets/images/portfolio/portfolioMobile.png'


const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [showVideo, setShowVideo] = useState(false)

  const projects = [
    {
      title: "Magnus Visibility",
      thumbnail: mvThumbnail,
      siteUrl: "https://magnusvisibility.com/",
      shortDescription: "A comprehensive ERP system focused on production availability tracking, featuring both admin and regular user functionality.",
      images: [
        mv1,
        mv2,
        mv3,
        mv4,
        mv5

      ],
      fullDescription: "Magnus Visibility is an ERP system designed to track and manage \
production availability, developed as my final capstone for CMU certification. On this project I had a heavy hand in \
both front-end design and backend architecture, while my teammates took charge of the database setup and initial EC2 \
implementation via AWS. During this process we all made sure to be involved in each other's implementations\n\n\
The project showcases my ability to work effectively in a team setting, implementing \
CI/CD pipelines using Docker within Docker containers, and integrating multiple stack \
components. Completed within a two-week sprint, the project continues to evolve with \
planned updates.",
      demoLink: "https://youtu.be/1X7a-nmDDSQ",
      codeLink: "https://gitlab.com/wattrs7/magnuserpdowndetail.git",
      tags: [
        // Status Tags
        { label: 'Live', type: 'status' },
        { label: 'SSL Secure', type: 'status' },
        { label: 'CI/CD', type: 'status' },
        { label: 'Containerized', type: 'status' },
        { label: 'DinD', type: 'status' },
        { label: 'Scalable', type: 'status' },
        { label: 'Modular', type: 'status' },
        
        { label: 'JavaScript', type: 'tech' },
        { label: 'React', type: 'tech' },
        { label: 'Vite', type: 'tech' },
        { label: 'HTML', type: 'tech' },
        { label: 'TailwindCSS', type: 'tech' },
        { label: 'React Router', type: 'tech' },
        
        // Backend Tech
        { label: 'Node.js', type: 'tech' },
        { label: 'Express', type: 'tech' },
        { label: 'Microservices', type: 'tech' },
        { label: 'JWT', type: 'tech' },
        { label: 'CORS', type: 'tech' },
        { label: 'dotenv', type: 'tech' },
        
        // Database & Infrastructure
        { label: 'PostgreSQL', type: 'tech' },
        { label: 'AWS', type: 'tech' },
        { label: 'EC2', type: 'tech' },
        { label: 'Docker', type: 'tech' },
        { label: 'Nginx', type: 'tech' },
        
        // Development Tools,
        { label: 'Jest', type: 'tech' }
      ]
    },
    {
      title: "Portfolio Site",
      thumbnail: portfolioThumbnail,
      siteUrl: "https://zach-barbarich.net/",
      shortDescription: "A modern, responsive portfolio website showcasing my projects and skills.",
      images: [
        portfolioDesktop,
        portfolioTablet,
        portfolioMobile
      ],
      fullDescription: "This portfolio site demonstrates modern React development practices, \
featuring responsive design, dark mode support, and containerized deployment using Docker \
and AWS (ECR/ECS). The project utilizes GitHub Actions for CI/CD, contrasting with my \
capstone's GitLab workflow.\n\n\
Try viewing this site on different devices or resizing your browser window - the screenshots \
above show how the layout adapts to desktop, tablet, and mobile screen sizes!",
      codeLink: "https://github.com/Zbarbarich/reactPortfolio.git",
      tags: [
        { label: 'Live', type: 'status' },
        { label: 'SSL Secure', type: 'status' },
        { label: 'CI/CD', type: 'status' },
        { label: 'Containerized', type: 'status' },
        { label: 'React', type: 'tech' },
        { label: 'Vite', type: 'tech' },
        { label: 'JavaScript', type: 'tech' },
        { label: 'HTML', type: 'tech' },
        { label: 'TailwindCSS', type: 'tech' },
        { label: 'Docker', type: 'tech' },
        { label: 'AWS', type: 'tech' },
        { label: 'GitHub Actions', type: 'tech' },
        { label: 'Nginx', type: 'tech' }
      ]
    }
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
          <div className="space-y-4 sm:space-y-6 w-full">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-primary-light text-2xl sm:text-3xl font-bold z-20"
            >
              ×
            </button>
            <div className="max-w-2xl mx-auto">
              <Carousel images={selectedProject.images} />
            </div>
            <div className="max-w-[95%] sm:max-w-[85%] mx-auto space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-bold">{selectedProject.title}</h2>
                {selectedProject.siteUrl && (
                  <a 
                    href={selectedProject.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-secondary transition text-sm whitespace-nowrap"
                  >
                    Visit Site →
                  </a>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {selectedProject.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      tag.type === 'status' 
                        ? 'bg-teal-200 text-teal-900' 
                        : 'bg-sky-200 text-sky-900'
                    }`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
              <p className="text-gray-400 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                {selectedProject.fullDescription}
              </p>
              <div className="flex space-x-4 pt-2">
                {selectedProject.demoLink && (
                  <button 
                    onClick={handleDemoClick}
                    className="text-primary hover:text-secondary transition text-sm"
                  >
                    Watch Demo →
                  </button>
                )}
                <a 
                  href={selectedProject.codeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-secondary transition text-sm"
                >
                  View Code →
                </a>
              </div>
            </div>
          </div>
        ) : (
          selectedProject?.demoLink && (
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
                src={`https://www.youtube.com/embed/${selectedProject.demoLink.split('/').pop()}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )
        )}
      </Modal>
    </div>
  )
}

export default Projects
