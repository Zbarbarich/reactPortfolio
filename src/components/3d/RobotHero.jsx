import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DoubleSide } from 'three'

const TEAL = '#4fd1c5'
const INDIGO = '#535bf2'
const BODY = '#1a202c'
const BODY_LIGHT = '#2d3748'
const METAL = '#4a5568'

/**
 * Friendly Twitch-adjacent robot mascot built from primitives.
 * Idle bob + head tracks pointer (pointer is normalized -1..1 from parent).
 */
const RobotHero = ({ pointer = { x: 0, y: 0 } }) => {
  const groupRef = useRef()
  const headRef = useRef()
  const antennaRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.08
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.05
    }
    if (headRef.current) {
      const targetY = pointer.x * 0.35
      const targetX = -pointer.y * 0.2
      headRef.current.rotation.y += (targetY - headRef.current.rotation.y) * 0.08
      headRef.current.rotation.x += (targetX - headRef.current.rotation.x) * 0.08
    }
    if (antennaRef.current) {
      antennaRef.current.rotation.z = Math.sin(t * 3) * 0.15
    }
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(t * 1.1) * 0.12 + 0.15
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = Math.sin(t * 1.1 + Math.PI) * 0.12 + 0.15
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.35, 0]} scale={1.15}>
      {/* Body */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.9, 1.0, 0.65]} />
        <meshStandardMaterial color={BODY} metalness={0.4} roughness={0.35} />
      </mesh>
      {/* Chest panel */}
      <mesh position={[0, 0.25, 0.34]}>
        <boxGeometry args={[0.55, 0.4, 0.04]} />
        <meshStandardMaterial
          color={TEAL}
          emissive={TEAL}
          emissiveIntensity={0.35}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>
      {/* Chest glow ring */}
      <mesh position={[0, 0.25, 0.36]}>
        <ringGeometry args={[0.12, 0.18, 24]} />
        <meshStandardMaterial
          color={INDIGO}
          emissive={INDIGO}
          emissiveIntensity={0.6}
          side={DoubleSide}
        />
      </mesh>

      {/* Head group */}
      <group ref={headRef} position={[0, 0.95, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.85, 0.75, 0.7]} />
          <meshStandardMaterial color={BODY_LIGHT} metalness={0.35} roughness={0.4} />
        </mesh>
        {/* Face plate */}
        <mesh position={[0, 0.02, 0.36]}>
          <boxGeometry args={[0.7, 0.5, 0.05]} />
          <meshStandardMaterial color={BODY} metalness={0.5} roughness={0.25} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.18, 0.08, 0.4]}>
          <boxGeometry args={[0.22, 0.14, 0.04]} />
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={0.9}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0.18, 0.08, 0.4]}>
          <boxGeometry args={[0.22, 0.14, 0.04]} />
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={0.9}
            toneMapped={false}
          />
        </mesh>
        {/* Smile bar */}
        <mesh position={[0, -0.12, 0.4]}>
          <boxGeometry args={[0.28, 0.05, 0.03]} />
          <meshStandardMaterial
            color={INDIGO}
            emissive={INDIGO}
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Ear nubs */}
        <mesh position={[-0.48, 0.05, 0]}>
          <boxGeometry args={[0.12, 0.28, 0.28]} />
          <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0.48, 0.05, 0]}>
          <boxGeometry args={[0.12, 0.28, 0.28]} />
          <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Antenna */}
        <group ref={antennaRef} position={[0, 0.4, 0]}>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
            <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.42, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial
              color={INDIGO}
              emissive={INDIGO}
              emissiveIntensity={0.85}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>

      {/* Neck */}
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.12, 12]} />
        <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Arms */}
      <group ref={leftArmRef} position={[-0.58, 0.35, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.22, 0.7, 0.22]} />
          <meshStandardMaterial color={BODY} metalness={0.4} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial
            color={INDIGO}
            emissive={INDIGO}
            emissiveIntensity={0.25}
          />
        </mesh>
        <mesh position={[0, -0.62, 0]}>
          <boxGeometry args={[0.26, 0.18, 0.26]} />
          <meshStandardMaterial color={TEAL} metalness={0.3} roughness={0.4} />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.58, 0.35, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.22, 0.7, 0.22]} />
          <meshStandardMaterial color={BODY} metalness={0.4} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial
            color={INDIGO}
            emissive={INDIGO}
            emissiveIntensity={0.25}
          />
        </mesh>
        <mesh position={[0, -0.62, 0]}>
          <boxGeometry args={[0.26, 0.18, 0.26]} />
          <meshStandardMaterial color={TEAL} metalness={0.3} roughness={0.4} />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.28, -0.65, 0]} castShadow>
        <boxGeometry args={[0.28, 0.55, 0.35]} />
        <meshStandardMaterial color={BODY} metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0.28, -0.65, 0]} castShadow>
        <boxGeometry args={[0.28, 0.55, 0.35]} />
        <meshStandardMaterial color={BODY} metalness={0.4} roughness={0.35} />
      </mesh>
      {/* Feet */}
      <mesh position={[-0.28, -0.98, 0.08]}>
        <boxGeometry args={[0.32, 0.14, 0.45]} />
        <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0.28, -0.98, 0.08]}>
        <boxGeometry args={[0.32, 0.14, 0.45]} />
        <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.35} />
      </mesh>

      {/* Soft ground glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.08, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial
          color={TEAL}
          emissive={TEAL}
          emissiveIntensity={0.15}
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  )
}

export default RobotHero
