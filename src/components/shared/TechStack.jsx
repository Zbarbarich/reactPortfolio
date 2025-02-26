import reactIcon from '../../assets/icons/react.png'
import nodeIcon from '../../assets/icons/node.png'
import pythonIcon from '../../assets/icons/python.png'
import javascriptIcon from '../../assets/icons/javascript.png'
import expressIcon from '../../assets/icons/express.png'
import tailwindIcon from '../../assets/icons/tailwind.png'
import mongodbIcon from '../../assets/icons/mongodb.png'
import postgresqlIcon from '../../assets/icons/postgresql.png'
import dockerIcon from '../../assets/icons/docker.png'
import gitIcon from '../../assets/icons/git.png'
import awsIcon from '../../assets/icons/aws.png'
import htmlIcon from '../../assets/icons/html.png'
import cssIcon from '../../assets/icons/css.png'

const TechStack = () => {
  const technologies = {
    top: [{ name: 'Git', icon: gitIcon }],
    left: [
      { name: 'Python', icon: pythonIcon },
      { name: 'JavaScript', icon: javascriptIcon },
    ],
    center: [
      { name: 'Express', icon: expressIcon },
      { name: 'Node.js', icon: nodeIcon },
      { name: 'HTML', icon: htmlIcon },
      { name: 'CSS', icon: cssIcon },
      { name: 'React', icon: reactIcon },
      { name: 'Tailwind CSS', icon: tailwindIcon },
      { name: 'Docker', icon: dockerIcon },
      { name: 'AWS Cloud Hosting', icon: awsIcon },
    ],
    right: [
      { name: 'MongoDB', icon: mongodbIcon },
      { name: 'PostgreSQL', icon: postgresqlIcon },
    ],
  }

  const TechIcon = ({ tech }) => (
    <div
      key={tech.name}
      className="flex flex-col items-center justify-center p-4 rounded-lg border-4 border-primary-light w-[130px] h-[130px]"
    >
      <img
        src={tech.icon}
        alt={`${tech.name} icon`}
        className="w-[55px] h-[55px] object-contain"
      />
      <span className="text-sm font-bold text-text-light dark:text-white mt-2 text-center">{tech.name}</span>
    </div>
  )

  return (
    <div className="w-full">
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-col items-center gap-8">
        {/* Top Git Icon */}
        <div className="flex justify-center">
          {technologies.top.map(tech => <TechIcon key={tech.name} tech={tech} />)}
        </div>

        <div className="flex gap-6 items-center justify-center">
          {/* Left Column */}
          <div className="flex flex-col gap-6 justify-center">
            {technologies.left.map(tech => <TechIcon key={tech.name} tech={tech} />)}
          </div>

          {/* Center Grid - Now in 2 columns */}
          <div className="grid grid-cols-2 gap-6">
            {technologies.center.map(tech => <TechIcon key={tech.name} tech={tech} />)}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 justify-center">
            {technologies.right.map(tech => <TechIcon key={tech.name} tech={tech} />)}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden grid grid-cols-3 gap-4">
        {[...technologies.top, ...technologies.left, ...technologies.center, ...technologies.right]
          .map(tech => <TechIcon key={tech.name} tech={tech} />)}
      </div>
    </div>
  )
}

export default TechStack