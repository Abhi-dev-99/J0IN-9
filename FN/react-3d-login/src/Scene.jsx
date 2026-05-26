import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function FloatingShape({ position, color, size, speed, geometry }) {
  const meshRef = useRef()
  
  const initialY = position[1]
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * speed) * 0.3
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 * speed
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      {geometry === 'sphere' && <sphereGeometry args={[size, 32, 32]} />}
      {geometry === 'box' && <boxGeometry args={[size, size, size]} />}
      {geometry === 'torus' && <torusGeometry args={[size, size * 0.3, 16, 32]} />}
      <meshStandardMaterial 
        color={color} 
        roughness={0.3}
        metalness={0.7}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

function FloatingParticles() {
  const particlesRef = useRef()
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(300 * 3)
    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={300}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#5c6bc0"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export default function Scene() {
  return (
    <>
      {/* Dark bluish background */}
      <color attach="background" args={['#050a1f']} />
      <fog attach="fog" args={['#050a1f', 8, 25]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} color="#3949ab" />
      <pointLight position={[5, 5, 5]} intensity={1} color="#5c6bc0" />
      <pointLight position={[-5, -5, 3]} intensity={0.5} color="#1a237e" />
      <directionalLight position={[0, 5, 0]} intensity={0.5} color="#7986cb" />
      
      {/* Floating 3D shapes */}
      <FloatingShape 
        position={[-3, 1, -2]} 
        color="#3949ab" 
        size={1.2} 
        speed={0.5}
        geometry="sphere"
      />
      <FloatingShape 
        position={[3.5, -0.5, -3]} 
        color="#5c6bc0" 
        size={0.9} 
        speed={0.7}
        geometry="box"
      />
      <FloatingShape 
        position={[0, 2.5, -4]} 
        color="#283593" 
        size={0.7} 
        speed={0.4}
        geometry="torus"
      />
      <FloatingShape 
        position={[-2.5, -2, -1]} 
        color="#1a237e" 
        size={0.8} 
        speed={0.6}
        geometry="sphere"
      />
      <FloatingShape 
        position={[2, 1.5, -2.5]} 
        color="#3f51b5" 
        size={0.6} 
        speed={0.8}
        geometry="box"
      />
      
      {/* Particle field */}
      <FloatingParticles />
    </>
  )
}
