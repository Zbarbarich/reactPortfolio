const Projects = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-5xl font-bold mb-6">My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        {/* Magnus Visibility Project */}
        <div className="bg-white/5 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Magnus Visibility</h3>
          <p className="text-gray-400 mb-4">
            A comprehensive ERP system focused on production availability tracking, featuring both admin and regular user functionality.
          </p>
          <div className="flex space-x-4">
            <a 
              href="https://youtu.be/1X7a-nmDDSQ" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:text-secondary transition"
            >
              Demo
            </a>
            <a 
              href="https://gitlab.com/wattrs7/magnuserpdowndetail.git"
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:text-secondary transition"
            >
              Code
            </a>
          </div>
        </div>

        {/* Add more project cards as needed */}
      </div>
    </div>
  )
}

export default Projects
