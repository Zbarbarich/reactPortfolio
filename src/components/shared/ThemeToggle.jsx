import { useState, useEffect } from 'react'

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    if (darkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={darkMode}
      className="theme-toggle group relative inline-flex h-6 w-11 items-center rounded-full
                 overflow-hidden shadow-inner transition-shadow duration-500
                 hover:shadow-[0_0_12px_rgba(79,209,197,0.35)]
                 dark:hover:shadow-[0_0_12px_rgba(83,91,242,0.4)]
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light/60
                 dark:focus-visible:ring-secondary/60"
    >
      {/* Gradient track — teal-heavy in light, purple-heavy in dark */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity duration-500 ease-out ${
          darkMode ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background:
            'linear-gradient(105deg, #4fd1c5 0%, #38b2ac 42%, #7c8cf8 78%, #535bf2 100%)',
        }}
      />
      <span
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity duration-500 ease-out ${
          darkMode ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'linear-gradient(105deg, #4fd1c5 0%, #6b7aef 35%, #535bf2 68%, #3d45c8 100%)',
        }}
      />

      {/* Soft shimmer on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100
                   transition-opacity duration-500
                   bg-gradient-to-r from-white/25 via-transparent to-white/10"
      />

      <span
        className={`relative z-[1] inline-flex h-4 w-4 items-center justify-center
                    rounded-full bg-white shadow-md
                    transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`}
      >
        {darkMode ? (
          <svg
            viewBox="0 0 24 24"
            className="h-2.5 w-2.5 text-secondary"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-2.5 w-2.5 text-primary-light"
            fill="currentColor"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </button>
  )
}

export default ThemeToggle
