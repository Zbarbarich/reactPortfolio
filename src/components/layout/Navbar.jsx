import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from '../shared/ThemeToggle'
import MobileMenu from './MobileMenu'
import andyHead from '../../assets/andy/andy-head.svg'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
]

const NavLink = ({ to, label, isActive }) => (
  <Link
    to={to}
    className={`relative py-0.5 text-sm transition-colors duration-200 ${
      isActive
        ? 'text-primary-light font-semibold'
        : 'text-text-light/80 dark:text-text-dark/80 hover:text-primary-light dark:hover:text-primary-light'
    }`}
  >
    {label}
    {isActive && (
      <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 gradient-underline rounded-full" />
    )}
  </Link>
)

const Navbar = () => {
  const location = useLocation()

  return (
    <nav className="bg-background-light/70 dark:bg-background-dark/70 backdrop-blur-lg fixed w-full z-40 border-b border-gray-200/20 dark:border-gray-700/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-12">
          <Link
            to="/"
            className="flex items-center gap-2 group min-w-0"
            aria-label="Home — Innovate. Integrate. Inspire."
          >
            <img
              src={andyHead}
              alt=""
              className="andy-nav-head h-7 w-7 object-contain shrink-0
                         transition-transform duration-300 group-hover:scale-110"
              draggable={false}
            />
            <span className="text-sm sm:text-base font-bold text-text-light dark:text-text-dark font-display tracking-tight truncate">
              Innovate. Integrate. Inspire.
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-5">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  label={label}
                  isActive={location.pathname === to}
                />
              ))}
            </div>
            <ThemeToggle />
            <MobileMenu currentPath={location.pathname} />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
