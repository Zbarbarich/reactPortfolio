import { Suspense, useEffect, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Float, Environment } from '@react-three/drei'
import RobotHero from './RobotHero'
import SceneFallback from './SceneFallback'

const SceneContents = ({ pointer }) => (
  <>
    <ambientLight intensity={0.45} />
    <directionalLight
      position={[4, 6, 3]}
      intensity={1.2}
      castShadow
      shadow-mapSize={[1024, 1024]}
    />
    <pointLight position={[-3, 2, 2]} intensity={0.6} color="#535bf2" />
    <pointLight position={[3, 1, 3]} intensity={0.5} color="#4fd1c5" />
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
      <RobotHero pointer={pointer} />
    </Float>
    <ContactShadows
      position={[0, -1.15, 0]}
      opacity={0.45}
      scale={8}
      blur={2.5}
      far={4}
    />
    <Environment preset="city" />
  </>
)

const HeroScene = () => {
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const onPointerMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    setPointer({ x, y })
  }, [])

  if (reducedMotion) {
    return <SceneFallback />
  }

  return (
    <div
      className="w-full h-full min-h-[320px] sm:min-h-[420px]"
      onPointerMove={onPointerMove}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.4, 4.2], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        frameloop={visible ? 'always' : 'never'}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContents pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default HeroScene
