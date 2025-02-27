import TechStack from '../components/shared/TechStack'

const About = () => {
  return (
    <div className="flex flex-col xl:flex-row items-start justify-between min-h-[80vh] py-12 px-4 gap-8">
      {/* Content section */}
      <div className="w-full xl:w-1/2 xl:pr-8">
        <h1 className="text-5xl font-bold mb-6 text-center">About Me</h1>
        <div className="text-gray-400">
          <p className="mb-4">
            As a Carnegie Mellon University certified Full Stack Developer with a decade of enterprise IT experience, 
            I bring a unique blend of technical infrastructure knowledge and modern development expertise to the table. 
            My background in network administration and user support has shaped my approach to development, enabling me 
            to create solutions that are not only technically sound but also highly intuitive and user-focused. 
            
            I excel at bridging the gap between complex technical requirements and practical business needs, having 
            spent years translating technical concepts for diverse stakeholders. Now, I&apos;m passionate about leveraging 
            my comprehensive tech background to build scalable, efficient applications that solve real-world challenges. 
            
            I&apos;m particularly drawn to opportunities where I can combine my infrastructure knowledge with modern 
            development practices to create robust, user-centric solutions.
            
            <br></br><br></br>
            
            This site not only serves as a central location for all of my professional information, but also as an 
            example of my dedication to creating functional, enterprise-level front-end interfaces within React. 
            Please take a look at some of my additional projects to see examples of my full-stack development skills!
          </p>
        </div>
      </div>

      {/* Tech stack section */}
      <div className="w-full xl:w-1/2">
        <TechStack />
      </div>
    </div>
  )
}

export default About
