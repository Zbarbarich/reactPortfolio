const Contact = () => {
  return (
    <div className="flex flex-col items-center min-h-[80vh] pt-8 text-center">
      <h1 className="text-5xl font-bold mb-6 relative">
        <div 
          className="absolute bottom-0 left-8 h-[14px] w-[55%] bg-gradient-to-r from-primary-light to-transparent"
        ></div>
        <span className="relative z-[2]">Contact Me</span>
      </h1>
      <div className="max-w-2xl text-center">
        <p className="text-xl text-gray-400 mb-8">
          Let&apos;s connect! Feel free to reach out for collaborations or just a friendly chat.
        </p>
        <div className="space-y-4">
          <a href="mailto:zachery.barbarich@gmail.com" className="block hover:text-primary transition">
            zachery.barbarich@gmail.com
          </a>
          <a href="https://linkedin.com/in/zach-barbarich-193611333" target="_blank" rel="noopener noreferrer" className="block hover:text-primary transition">
            LinkedIn
          </a>
          <a href="https://github.com/Zbarbarich/" target="_blank" rel="noopener noreferrer" className="block hover:text-primary transition">
            GitHub
          </a>
          <a href="https://gitlab.com/zachery.barbarich" target="_blank" rel="noopener noreferrer" className="block hover:text-primary transition">
            GitLab
          </a>
        </div>
      </div>
    </div>
  )
}

export default Contact
