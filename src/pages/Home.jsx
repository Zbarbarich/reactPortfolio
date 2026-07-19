import { Link } from 'react-router-dom'
import AndySitting from '../components/shared/AndySitting'

const Home = () => {
  return (
    <div className="relative min-h-[85vh] overflow-hidden px-4">
      <div className="relative z-10 mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center min-h-[85vh] py-10">
        <div className="text-center lg:text-left order-2 lg:order-1">
          <div className="animate-fade-in-up">
            <p className="text-sm sm:text-base uppercase tracking-[0.2em] text-primary-light mb-4 font-medium">
              Full Stack Developer
            </p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 font-display">
              Hi, I&apos;m{' '}
              <span className="gradient-text">Zach</span>.
            </h1>
          </div>

          <p
            className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-in-up leading-relaxed"
            style={{ animationDelay: '0.15s' }}
          >
            CMU-certified developer with a decade of IT experience — building full-stack
            applications that bridge real-world operations with modern software.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <Link to="/projects" className="btn-glow text-center">
              View Projects
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full border border-primary-light/50 text-primary-light
                         hover:bg-primary-light/10 transition-all duration-300 font-medium text-center"
            >
              Get in Touch
            </Link>
            <a
              href="/ZachBarbarichResume2026.pdf"
              download="ZachBarbarichResume2026.pdf"
              className="px-6 py-3 rounded-full border border-secondary/40 text-secondary
                         hover:bg-secondary/10 transition-all duration-300 font-medium text-center"
            >
              Download Resume
            </a>
          </div>
          <p
            className="mt-6 text-sm text-gray-400 dark:text-gray-500 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            Open to all development opportunities.
          </p>
        </div>

        <div
          id="andy-corner-anchor"
          className="order-1 lg:order-2 relative flex items-center justify-center
                     h-[300px] sm:h-[420px] lg:h-[520px] animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <AndySitting />
        </div>
      </div>
    </div>
  )
}

export default Home
