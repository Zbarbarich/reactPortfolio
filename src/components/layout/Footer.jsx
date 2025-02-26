const Footer = () => {
  return (
    <footer className="bg-white/5 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-400">© {new Date().getFullYear()} Zach Barbarich. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
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
