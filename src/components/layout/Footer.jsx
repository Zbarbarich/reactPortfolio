const Footer = () => {
  return (
    <footer className="border-t border-gray-200/20 dark:border-gray-700/30 bg-white/5 py-3 sm:py-3.5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3">
          <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
            © {new Date().getFullYear()} Zach Barbarich. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-xs sm:text-sm">
            <a
              href="https://github.com/Zbarbarich/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary-light transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://gitlab.com/zachery.barbarich"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary-light transition-colors"
            >
              GitLab
            </a>
            <a
              href="https://linkedin.com/in/zach-barbarich-193611333"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary-light transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:zachery.barbarich@gmail.com"
              className="text-gray-400 hover:text-primary-light transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
