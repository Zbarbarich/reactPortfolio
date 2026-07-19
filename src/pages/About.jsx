import TechStack from '../components/shared/TechStack'

const highlights = ['10 yrs IT', 'CMU Full Stack', 'Open to roles']

const About = () => {
  return (
    <div className="relative min-h-[80vh] py-12 px-4 overflow-hidden">
      <div className="noise-overlay absolute inset-0 -z-10 dark:opacity-25 opacity-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-6xl flex flex-col xl:flex-row items-center justify-center gap-10 xl:gap-14 xl:min-h-[70vh]">
        <div className="w-full max-w-xl xl:max-w-none xl:w-[42%] animate-fade-in-up">
          <div className="mb-6 text-center">
            <h1 className="text-5xl font-bold relative inline-block font-display">
              <div className="absolute bottom-0 left-8 h-[14px] w-[45%] gradient-underline" />
              <span className="relative z-[2]">About</span>
            </h1>
          </div>

          <div className="glass-panel p-6 sm:p-8 space-y-5">
            <div className="text-gray-500 dark:text-gray-400 space-y-4 leading-relaxed text-center xl:text-left">
              <p>
                IT professional turned full-stack developer with 10 years of hands-on experience
                in network administration, systems support, and enterprise end-user operations.
                I completed Carnegie Mellon University&apos;s Talentsprint full-stack certification
                and bring a problem-solver&apos;s mindset from IT into every application I build.
              </p>
              <p>
                My background means I design software with real users and real infrastructure in
                mind — not just clean code, but tools that hold up in production. From legacy
                data conversion utilities to microservice ERP systems like Andy Bot, I focus on
                practical solutions that streamline how teams actually work.
              </p>
              <p>
                The technologies I work with rotate beside this page and are always evolving as
                I learn. I&apos;m eager to collaborate, contribute, and grow with a team building
                software that matters.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2 border-t border-white/10 dark:border-white/10 justify-center">
              {highlights.map((label) => (
                <span
                  key={label}
                  className="relative text-sm font-semibold tracking-wide text-text-light dark:text-text-dark pb-1"
                >
                  {label}
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] gradient-underline rounded-full opacity-80" />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className="w-full max-w-xl xl:max-w-none xl:w-[52%] animate-fade-in-up flex flex-col items-center justify-center"
          style={{ animationDelay: '0.15s' }}
        >
          <h2 className="text-center text-3xl sm:text-4xl font-bold font-display mb-8 relative inline-block">
            <span className="relative z-[2]">Tech Stack</span>
            <span
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[5px] w-[72%]
                         gradient-underline rounded-full"
              aria-hidden="true"
            />
          </h2>
          <TechStack />
        </div>
      </div>
    </div>
  )
}

export default About
