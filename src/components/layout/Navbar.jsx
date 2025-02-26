import { Link } from 'react-router-dom'
import ThemeToggle from '../shared/ThemeToggle'
import MobileMenu from './MobileMenu'

const Navbar = () => {
  return (
    <nav className="bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md fixed w-full z-10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-text-light dark:text-text-dark hover:text-primary-light transition-colors">
            Innovate. Integrate. Inspire.
          </Link>
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-text-light/80 dark:text-text-dark/80 hover:text-primary-light dark:hover:text-primary-light transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-text-light/80 dark:text-text-dark/80 hover:text-primary-light dark:hover:text-primary-light transition-colors">
                About
              </Link>
              <Link to="/projects" className="text-text-light/80 dark:text-text-dark/80 hover:text-primary-light dark:hover:text-primary-light transition-colors">
                Projects
              </Link>
              <Link to="/contact" className="text-text-light/80 dark:text-text-dark/80 hover:text-primary-light dark:hover:text-primary-light transition-colors">
                Contact
              </Link>
            </div>
            <ThemeToggle />
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
