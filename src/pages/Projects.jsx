import { useState } from 'react'
import ProjectCard from '../components/shared/ProjectCard'
import Modal from '../components/shared/Modal'
import Carousel from '../components/shared/Carousel'
import bidspaceGif from '../assets/images/bidspace/BidSpace.gif'
import bidspaceDiagram from '../assets/images/bidspace/BidSpace3.png'
import bidspaceGuiDat from '../assets/images/bidspace/BidSpace1.png'
import bidspaceGuiEd from '../assets/images/bidspace/BidSpace2.png'
import andybotGif from '../assets/images/nineteenthchamber/AndyBot.gif'
import andybotDiagram from '../assets/images/nineteenthchamber/AndyBot-diagram.png'
import andybotSplit from '../assets/images/nineteenthchamber/AndyBot-split.png'
import andybotOrderQuote from '../assets/images/nineteenthchamber/AndyBot-order-quote.png'
import andybotPdf from '../assets/images/nineteenthchamber/AndyBot-pdf.png'
import mvThumbnail from '../assets/images/magnusvisibility/mvthumbnail.png'
import mv1 from '../assets/images/magnusvisibility/mv1.png'
import mv2 from '../assets/images/magnusvisibility/mv2.png'
import mv3 from '../assets/images/magnusvisibility/mv3.png'
import mv4 from '../assets/images/magnusvisibility/mv4.png'
import mv5 from '../assets/images/magnusvisibility/mv5.png'
import portfolioGif from '../assets/images/portfolio/Portfolio.gif'
import portfolioAbout from '../assets/images/portfolio/Portfolio-about.png'
import portfolioMobile1 from '../assets/images/portfolio/Portfolio-mobile-1.png'
import portfolioMobile2 from '../assets/images/portfolio/Portfolio-mobile-2.png'

const featuredProjects = [
  {
    title: 'BidSpace',
    featured: true,
    thumbnail: bidspaceGif,
    shortDescription:
      'Production Python desktop tool that decodes legacy Bidtime .dat binary exports into Excel workbooks — plus an ED Data import fix — so staff can edit line items and import into modern bid platforms.',
    images: [bidspaceGif, bidspaceDiagram, bidspaceGuiDat, bidspaceGuiEd],
    caseStudy: {
      problem:
        'At work we still rely on Bidtime — bid software written nearly 20 years ago — whose proprietary binary .dat exports are impractical to reuse in modern platforms that expect Excel templates. Northeastern ED Data imports also fail when manufacturer names, SKUs, or "As Specified" rows do not match expected formatting.',
      approach:
        'Reverse-engineered Bidtime\'s 2,501-byte record layout in Python (decode_bid_dat.py) to extract and normalize line items with openpyxl — handling A/B options, combo/shipping sublines, and vendor-specific parsing. Built a tkinter desktop app (bidspace_gui.py) with Bidtime Export and ED Data Import Fix tabs, packaged Windows .exe builds via PyInstaller, and added ed_data_fix.py to normalize blocked As Specified rows before ED Data import.',
      result:
        'Deployed as a daily-use production tool: staff convert .dat files to editable Excel workbooks in seconds, run the ED Data normalizer when imports reject rows, and use Bid Dats / Bid XLSX folder workflows on Windows — bridging legacy Bidtime output to modern bid platforms without a full system migration.',
    },
    codeLink: 'https://github.com/Zbarbarich/BidSpace.git',
    tags: [
      { label: 'Production Tool', type: 'status' },
      { label: 'Cross-Platform', type: 'status' },
      { label: 'Automation', type: 'status' },
      { label: 'Python', type: 'tech' },
      { label: 'CLI', type: 'tech' },
      { label: 'Tkinter', type: 'tech' },
      { label: 'PyInstaller', type: 'tech' },
      { label: 'openpyxl', type: 'tech' },
    ],
  },
  {
    title: 'Andy Bot',
    featured: true,
    thumbnail: andybotGif,
    siteUrl: 'https://andy-bot.com/',
    shortDescription:
      'Live ITSM/ERP operator console — customers, tickets, quotes, orders, invoices, purchasing, and PDF generation across Express microservices on PostgreSQL.',
    images: [andybotGif, andybotDiagram, andybotSplit, andybotOrderQuote, andybotPdf],
    caseStudy: {
      problem:
        'Needed a personal ITSM/ERP to manage customers, tickets, orders, quotes, invoices, purchasing, and inventory end-to-end — not a toy demo, but a production-shaped system.',
      approach:
        'Built Andy Bot (A.N.D.Y.) as a React + TypeScript SPA (Vite, Tailwind, Recharts) with protected routes and global search, fronting an API gateway with JWT/bcrypt auth and Express services (auth, customer, ticket, order, invoice, PDF/PDFKit) on a shared PostgreSQL 16 schema with migrations.',
      result:
        'A live operator-facing product on Oracle Cloud (Docker Compose + Caddy HTTPS + GitHub Actions CI/CD) demonstrating full ownership: schema design, gateway routing, quote→order→invoice→PDF flows, and a polished light/dark UI.',
    },
    codeLink: 'https://github.com/Zbarbarich/theNineteenthChamber.git',
    tags: [
      { label: 'Live', type: 'status' },
      { label: 'Microservices', type: 'status' },
      { label: 'Full Stack', type: 'status' },
      { label: 'TypeScript', type: 'tech' },
      { label: 'React', type: 'tech' },
      { label: 'Vite', type: 'tech' },
      { label: 'TailwindCSS', type: 'tech' },
      { label: 'Node.js', type: 'tech' },
      { label: 'Express', type: 'tech' },
      { label: 'PostgreSQL', type: 'tech' },
      { label: 'JWT', type: 'tech' },
      { label: 'Docker', type: 'tech' },
      { label: 'Caddy', type: 'tech' },
      { label: 'Oracle Cloud', type: 'tech' },
    ],
  },
]

const moreProjects = [
  {
    title: 'React Portfolio',
    featured: false,
    thumbnail: portfolioGif,
    siteUrl: 'https://zachbarbarich.net/',
    shortDescription:
      'This site — a React + Vite + Tailwind SPA that showcases production tools and full-stack systems, and doubles as a UX showcase: interactive background, interactive hero, and motion-led UI.',
    images: [portfolioGif, portfolioAbout, portfolioMobile1, portfolioMobile2],
    caseStudy: {
      problem:
        'Needed a living personal site that stays fast and cheap to host, feels distinctive (not a template), and can present production tools and full-stack systems while also proving UX and interaction design skill.',
      approach:
        'Designed and built a React 19 + Vite + Tailwind SPA around recent UI trends — glassmorphism, gradient accents, and branded Andy Bot motion. Standout UX: an interactive canvas node-web background that reacts to hover, click, and scroll; an interactive hero whose eyes track the cursor with light body parallax; 3D-tilt project cards; a glass tech-stack carousel with blurred neighbors; and project modals with GIF-first carousels that use a zoomed blur fill when media does not cover the frame. Hosted on Netlify with continuous deploys from GitHub; Netlify Forms handles inbound contact messages.',
      result:
        'Live at zachbarbarich.net with SSL, continuous deploys from GitHub, a working contact form, and a portfolio that demonstrates modern interaction design alongside the engineering work it features.',
    },
    codeLink: 'https://github.com/Zbarbarich/reactPortfolio.git',
    tags: [
      { label: 'Live', type: 'status' },
      { label: 'SSL Secure', type: 'status' },
      { label: 'CI/CD', type: 'status' },
      { label: 'React', type: 'tech' },
      { label: 'Vite', type: 'tech' },
      { label: 'JavaScript', type: 'tech' },
      { label: 'TailwindCSS', type: 'tech' },
      { label: 'Netlify', type: 'tech' },
      { label: 'Netlify Forms', type: 'tech' },
    ],
  },
  {
    title: 'Magnus Visibility',
    featured: false,
    thumbnail: mvThumbnail,
    siteUrl: 'https://magnusvisibility.com/',
    shortDescription:
      'A comprehensive ERP system focused on production availability tracking, featuring both admin and regular user functionality.',
    images: [mv1, mv2, mv3, mv4, mv5],
    caseStudy: {
      problem:
        'Production teams needed a clear way to track and manage availability across admin and regular-user workflows.',
      approach:
        'CMU capstone ERP built in a two-week sprint. I led front-end design and backend architecture while teammates owned database setup and initial AWS EC2 — with shared ownership across CI/CD (Docker-in-Docker) and stack integration.',
      result:
        'A live, containerized ERP (Magnus Visibility) that demonstrates team delivery under deadline and continues to evolve with planned updates.',
    },
    demoLink: 'https://youtu.be/1X7a-nmDDSQ',
    codeLink: 'https://gitlab.com/wattrs7/magnuserpdowndetail.git',
    tags: [
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
      { label: 'Node.js', type: 'tech' },
      { label: 'Express', type: 'tech' },
      { label: 'Microservices', type: 'tech' },
      { label: 'JWT', type: 'tech' },
      { label: 'CORS', type: 'tech' },
      { label: 'dotenv', type: 'tech' },
      { label: 'PostgreSQL', type: 'tech' },
      { label: 'AWS', type: 'tech' },
      { label: 'EC2', type: 'tech' },
      { label: 'Docker', type: 'tech' },
      { label: 'Nginx', type: 'tech' },
      { label: 'Jest', type: 'tech' },
    ],
  },
]

const SectionHeading = ({ children }) => (
  <h2 className="text-3xl sm:text-4xl font-bold mb-8 relative font-display">
    <div className="absolute bottom-0 left-4 h-[12px] w-[45%] gradient-underline" />
    <span className="relative z-[2]">{children}</span>
  </h2>
)

const TECH_TAG_LIMIT = 8

const ProjectModalBody = ({ project, onDemoClick }) => {
  const statusTags = project.tags.filter((t) => t.type === 'status')
  const techTags = project.tags.filter((t) => t.type === 'tech')
  const visibleTech = techTags.slice(0, TECH_TAG_LIMIT)
  const hiddenTechCount = techTags.length - visibleTech.length

  return (
    <div className="space-y-5 sm:space-y-6 w-full">
      <Carousel images={project.images} />

      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold font-display pr-2">{project.title}</h2>
          {project.siteUrl && (
            <a
              href={project.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm px-3 py-1.5 rounded-full
                         border border-primary-light/40 text-primary-light
                         hover:bg-primary-light/10 transition-colors whitespace-nowrap"
            >
              Visit Site →
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {statusTags.map((tag) => (
            <span
              key={`s-${tag.label}`}
              className="text-[11px] px-2 py-0.5 rounded-full bg-teal-200/90 text-teal-900 dark:bg-teal-900/50 dark:text-teal-200"
            >
              {tag.label}
            </span>
          ))}
          {visibleTech.map((tag) => (
            <span
              key={`t-${tag.label}`}
              className="text-[11px] px-2 py-0.5 rounded-full bg-sky-200/80 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200"
            >
              {tag.label}
            </span>
          ))}
          {hiddenTechCount > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400 border border-gray-300/40 dark:border-gray-600/40">
              +{hiddenTechCount} more
            </span>
          )}
        </div>

        {project.caseStudy ? (
          <div className="space-y-3 text-gray-500 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
            {[
              { label: 'Problem', text: project.caseStudy.problem },
              { label: 'Approach', text: project.caseStudy.approach },
              { label: 'Result', text: project.caseStudy.result },
            ].map(({ label, text }) => (
              <div key={label} className="case-block">
                <h3 className="text-primary-light font-semibold text-xs uppercase tracking-wider mb-1">
                  {label}
                </h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
            {project.fullDescription}
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-1 border-t border-gray-200/20 dark:border-gray-700/30">
          {project.demoLink && (
            <button
              type="button"
              onClick={onDemoClick}
              className="text-sm font-medium text-primary hover:text-secondary transition pt-3"
            >
              Watch Demo →
            </button>
          )}
          {project.codeLink && (
            <a
              href={project.codeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:text-secondary transition pt-3"
            >
              View Code →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [showVideo, setShowVideo] = useState(false)

  const handleProjectClick = (project) => {
    setSelectedProject(project)
    setShowVideo(false)
  }

  const handleDemoClick = () => {
    setShowVideo(true)
  }

  const renderProjectCard = (project) => (
    <ProjectCard
      key={project.title}
      project={{
        ...project,
        onOpen: () => handleProjectClick(project),
        onDemoClick: handleDemoClick,
      }}
    />
  )

  return (
    <div className="relative flex flex-col items-center min-h-[80vh] pt-8 px-4">
      <h1 className="text-5xl font-bold mb-12 relative font-display">
        <div className="absolute bottom-0 left-8 h-[14px] w-[55%] gradient-underline" />
        <span className="relative z-[2]">Projects</span>
      </h1>

      <section className="w-full max-w-6xl mb-16">
        <SectionHeading>Featured</SectionHeading>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredProjects.map(renderProjectCard)}
        </div>
      </section>

      <section className="w-full max-w-6xl">
        <SectionHeading>More Projects</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moreProjects.map(renderProjectCard)}
        </div>
      </section>

      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)}>
        {selectedProject && !showVideo ? (
          <ProjectModalBody
            project={selectedProject}
            onDemoClick={handleDemoClick}
          />
        ) : (
          selectedProject?.demoLink && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setShowVideo(false)}
                className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full
                           border border-primary-light/40 text-primary-light
                           hover:bg-primary-light/10 transition-colors"
              >
                ← Back
              </button>
              <div className="aspect-video rounded-xl overflow-hidden ring-1 ring-gray-200/40 dark:ring-gray-700/50">
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
            </div>
          )
        )}
      </Modal>
    </div>
  )
}

export default Projects
