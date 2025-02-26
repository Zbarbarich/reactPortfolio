import TechStack from '../components/shared/TechStack'

const About = () => {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between min-h-[80vh] py-12 px-4">
      {/* Left side content */}
      <div className="md:w-1/2 md:pr-8">
        <h1 className="text-5xl font-bold mb-6 text-center">About Me</h1>
        <div className="text-gray-400">
          <p className="mb-4">
            I am a full stack developer with a focus on building scalable and efficient web applications.  <br></br><br></br>
            This site not only serves as a central location for all of my professional information, but also as an example of my dedication to creating functional,
            enterprise-level front-end interfaces within React. Please take a look at some of my additional projects to see examples of my full-stack development skills!
          </p>
        </div>
      </div>

      {/* Right side tech stack */}
      <div className="md:w-1/2 mt-8 md:mt-0">
        <TechStack />
      </div>
    </div>
  )
}

export default About
