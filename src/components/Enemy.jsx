import { useBox } from '@react-three/cannon'
import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../hooks/useStore.js'
import { Vector3 } from 'three'

export const Enemy = ({ id, position }) => {
  const [health, setHealth] = useState(3)
  const [isDead, setIsDead] = useState(false)
  const [removeEnemy] = useStore(state => [state.removeEnemy])
  const playerPos = useStore(state => state.playerPosition)
  const meshRef = useRef()
  const hitCooldown = useRef(0)

  const [ref, api] = useBox(() => ({
    mass: 1,
    type: 'Dynamic',
    position,
    args: [0.5, 1, 0.5]
  }))

  const lastUpdate = useRef(0)
  useFrame((state, delta) => {
    if (isDead || !meshRef.current) return

    // Throttle updates para mejor rendimiento
    lastUpdate.current += delta
    if (lastUpdate.current < 0.1) return // Actualizar cada 100ms
    lastUpdate.current = 0

    hitCooldown.current = Math.max(0, hitCooldown.current - delta)

    // Movimiento hacia el jugador
    if (playerPos && Array.isArray(playerPos) && playerPos.length === 3) {
      const direction = new Vector3()
        .subVectors(new Vector3(...playerPos), new Vector3(...position))
        .normalize()
        .multiplyScalar(2)

      api.velocity.set(direction.x, 0, direction.z)
    }

    // Animación de flotación (menos frecuente)
    const time = state.clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.3
      meshRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.1
    }
  })

  const handleHit = () => {
    if (hitCooldown.current > 0) return
    
    hitCooldown.current = 0.5
    setHealth(prev => {
      const newHealth = prev - 1
      if (newHealth <= 0) {
        setIsDead(true)
        setTimeout(() => removeEnemy(id), 500)
        // Dropear diamantes
        const diamonds = Math.floor(Math.random() * 3) + 1
        useStore.getState().addDiamonds(diamonds)
      }
      return newHealth
    })
  }


  if (isDead) return null

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation()
        const tool = useStore.getState().tool
        if (tool === 'hammer') {
          handleHit()
        }
      }}
    >
      <boxBufferGeometry args={[0.5, 1, 0.5]} />
      <meshStandardMaterial 
        color={health === 3 ? '#8B0000' : health === 2 ? '#FF4500' : '#FF0000'}
        emissive={health === 1 ? '#FF0000' : '#000000'}
        emissiveIntensity={health === 1 ? 0.5 : 0}
      />
      {/* Ojos */}
      <mesh position={[0.15, 0.2, 0.26]}>
        <boxBufferGeometry args={[0.1, 0.1, 0.05]} />
        <meshStandardMaterial color="#FFFF00" />
      </mesh>
      <mesh position={[-0.15, 0.2, 0.26]}>
        <boxBufferGeometry args={[0.1, 0.1, 0.05]} />
        <meshStandardMaterial color="#FFFF00" />
      </mesh>
    </mesh>
  )
}

export const Enemies = () => {
  const [enemies] = useStore(state => [state.enemies])

  return (
    <>
      {enemies.map(({ id, pos }) => (
        <Enemy key={id} id={id} position={pos} />
      ))}
    </>
  )
}

