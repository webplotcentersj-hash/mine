import { useStore } from '../hooks/useStore.js'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const PlotCenter = ({ id, position }) => {
  const [removePlotCenter] = useStore(state => [state.removePlotCenter])
  const meshRef = useRef()
  const rotationRef = useRef(0)

  useFrame(() => {
    if (meshRef.current) {
      rotationRef.current += 0.01
      meshRef.current.rotation.y = rotationRef.current
    }
  })

  return (
    <group position={position}>
      {/* Base del plot center */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          if (e.altKey) {
            removePlotCenter(id)
          }
        }}
      >
        <cylinderBufferGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Poste central */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderBufferGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
      
      {/* Luz en la parte superior */}
      <pointLight
        position={[0, 1, 0]}
        intensity={1}
        color="#FFD700"
        distance={5}
        decay={2}
      />
      
      {/* Anillo flotante */}
      <mesh position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusBufferGeometry args={[0.2, 0.05, 8, 16]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

export const PlotCenters = () => {
  const [plotCenters] = useStore(state => [state.plotCenters])

  return (
    <>
      {plotCenters.map(({ id, pos }) => (
        <PlotCenter key={id} id={id} position={pos} />
      ))}
    </>
  )
}

