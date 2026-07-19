import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
]

const MobileMenu = ({ currentPath }) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [currentPath])

  useEffect(() => {
    if (!isOpen) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="relative z-[60] text-text-light dark:text-text-dark hover:text-primary-light transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed top-12 left-0 right-0 z-[60] md:hidden
                       bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md
                       shadow-lg py-3 border-b border-gray-200/20 dark:border-gray-700/30"
          >
            <div className="flex flex-col space-y-2.5 px-4">
              {navLinks.map(({ to, label }) => {
                const isActive = currentPath === to
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative w-fit py-0.5 text-sm transition-colors ${
                      isActive
                        ? 'text-primary-light font-semibold'
                        : 'text-text-light dark:text-text-dark hover:text-primary-light'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                    {isActive && (
                      <span
                        className="absolute -bottom-0.5 left-0 right-0 h-0.5 gradient-underline rounded-full"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MobileMenu
