import TechStack from '../components/shared/TechStack'

const About = () => {
  return (
    <div className="flex flex-col xl:flex-row items-start justify-between min-h-[80vh] py-12 px-4 gap-8">
      {/* Content section */}
      <div className="w-full xl:w-1/2 xl:pr-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-6 relative inline-block">
            <div 
              className="absolute bottom-0 left-8 h-[14px] w-[45%] bg-gradient-to-r from-primary-light to-transparent"
            ></div>
            <span className="relative z-[2]">About</span>
          </h1>
        </div>
        <div className="text-gray-400">
          <p className="mb-4">
            As a Full Stack Developer certified by Carnegie Mellon University, 
            I bring a solid decade of experience in IT, including network and 
            system administration, as well as end-user support. My time in IT 
            has given me a unique perspective on development, allowing me to 
            create user-centric, scalable solutions that blend strong technical 
            foundations with practical, real-world application. I&apos;m passionate 
            about leveraging this experience to build efficient, intuitive 
            applications, and I&apos;m excited about the opportunity to apply my 
            skills in development to solve new challenges.  
            
            <br></br><br></br>
            
            This site serves as a hub for my professional journey and a showcase 
            of my full-stack development projects. Here, you can explore my work 
            with front-end interfaces built using React, back-end development 
            with Node.js, and database management with PostgreSQL. I focus on 
            creating seamless, full-stack applications that deliver both 
            functionality and performance.
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
