import WaveAnimation from '../components/shared/WaveAnimation'

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center relative">
      <h1 className="text-5xl font-bold mb-6">
        Hi, I&apos;m <span className="text-primary-light">Zach</span>.
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl">
        I am a passionate full-stack developer.
      </p>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen">
        <WaveAnimation />
      </div>
    </div>
  )
}

export default Home
