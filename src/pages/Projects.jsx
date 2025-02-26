const Projects = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-5xl font-bold mb-6">My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        {/* Project Card 1 */}
        <div className="bg-white/5 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Project Name</h3>
          <p className="text-gray-400 mb-4">
            Placeholder for project description.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-primary hover:text-secondary transition">Demo</a>
            <a href="#" className="text-primary hover:text-secondary transition">Code</a>
          </div>
        </div>

        {/* Add more project cards as needed */}
      </div>
    </div>
  )
}

export default Projects
