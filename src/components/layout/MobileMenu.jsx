import { useState } from 'react'
import { Link } from 'react-router-dom'

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-text-light dark:text-text-dark hover:text-primary-light transition-colors"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm shadow-lg py-4">
          <div className="flex flex-col space-y-4 px-4">
            <Link to="/" className="text-text-light dark:text-text-dark hover:text-primary-light transition-colors" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/about" className="text-text-light dark:text-text-dark hover:text-primary-light transition-colors" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link to="/projects" className="text-text-light dark:text-text-dark hover:text-primary-light transition-colors" onClick={() => setIsOpen(false)}>
              Projects
            </Link>
            <Link to="/contact" className="text-text-light dark:text-text-dark hover:text-primary-light transition-colors" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileMenu 