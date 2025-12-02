import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const BlockBreakEffect = ({ position, onComplete }) => {
  const particlesRef = useRef([])
  const groupRef = useRef()

  useEffect(() => {
    // Crear partículas
    const particles = []
    for (let i = 0; i < 20; i++) {
      particles.push({
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          Math.random() * 0.3 + 0.1,
          (Math.random() - 0.5) * 0.3
        ),
        life: 1.0
      })
    }
    particlesRef.current = particles
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    let allDead = true
    particlesRef.current.forEach((particle, index) => {
      if (particle.life > 0) {
        allDead = false
        particle.position.add(particle.velocity.clone().multiplyScalar(delta * 5))
        particle.velocity.y -= delta * 2 // Gravedad
        particle.life -= delta * 2
      }
    })

    if (allDead && onComplete) {
      onComplete()
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {particlesRef.current.map((particle, index) => (
        <mesh
          key={index}
          position={particle.position}
          visible={particle.life > 0}
        >
          <boxBufferGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial
            color="#888888"
            opacity={particle.life}
            transparent
          />
        </mesh>
      ))}
    </group>
  )
}

