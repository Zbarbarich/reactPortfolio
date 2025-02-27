import PropTypes from 'prop-types'
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

const TechIcon = ({ tech }) => (
  <div
    className="flex flex-col items-center justify-center p-4 rounded-lg w-[75px] h-[75px] sm:w-[130px] sm:h-[130px]"
    style={{
      border: 'double 4px transparent',
      borderRadius: '8px',
      backgroundImage: 'linear-gradient(var(--background-color), var(--background-color)), linear-gradient(to right, #4fd1c5, #7dd3fc)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box'
    }}
  >
    <img
      src={tech.icon}
      alt={`${tech.name} icon`}
      className="w-[32px] h-[32px] sm:w-[55px] sm:h-[55px] object-contain"
    />
    <span className="text-[9px] sm:text-sm font-bold text-text-light dark:text-white mt-2 text-center">{tech.name}</span>
  </div>
)

TechIcon.propTypes = {
  tech: PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  }).isRequired
}

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
      { name: 'AWS Cloud', icon: awsIcon },
    ],
    right: [
      { name: 'MongoDB', icon: mongodbIcon },
      { name: 'PostgreSQL', icon: postgresqlIcon },
    ],
  }

  return (
    <div className="grid grid-cols-4 gap-8 relative">
      {/* Top Git Icon */}
      <div className="col-span-4 flex justify-center">
        {technologies.top.map(tech => (
          <TechIcon key={tech.name} tech={tech} />
        ))}
      </div>

      {/* Left Side */}
      <div className="flex flex-col justify-center gap-8">
        {technologies.left.map(tech => (
          <TechIcon key={tech.name} tech={tech} />
        ))}
      </div>

      {/* Center 4x2 Grid */}
      <div className="col-span-2 grid grid-cols-2 gap-8">
        {technologies.center.map(tech => (
          <TechIcon key={tech.name} tech={tech} />
        ))}
      </div>

      {/* Right Side */}
      <div className="flex flex-col justify-center gap-8">
        {technologies.right.map(tech => (
          <TechIcon key={tech.name} tech={tech} />
        ))}
      </div>
    </div>
  )
}

export default TechStack