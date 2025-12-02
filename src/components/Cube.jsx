import { useStore } from '../hooks/useStore.js'
import { useBox } from '@react-three/cannon'
import { useState, useRef, useEffect } from 'react'
import * as textures from '../images/textures.js'
import { PointLight } from 'three'
import { useFrame } from '@react-three/fiber'

export const Cube = ({ id, position, texture }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [removeCube] = useStore(state => [state.removeCube])
  const meshRef = useRef()
  const scaleRef = useRef(1)

  const [ref] = useBox(() => ({
    type: 'Static',
    position
  }))

  const activeTexture = textures[texture + 'Texture']
  const isSun = texture === 'square'
  const isAnimated = texture === 'design'

  // Animación al aparecer
  useEffect(() => {
    scaleRef.current = 0
  }, [])

  useFrame(() => {
    if (meshRef.current && scaleRef.current < 1) {
      scaleRef.current = Math.min(1, scaleRef.current + 0.1)
      meshRef.current.scale.setScalar(scaleRef.current)
    }
    
    // Actualizar textura animada
    if (isAnimated && activeTexture && activeTexture.update) {
      activeTexture.update()
    }
  })

  return (
    <>
      <mesh
        ref={(node) => {
          meshRef.current = node
          if (ref) {
            if (typeof ref === 'function') {
              ref(node)
            } else {
              ref.current = node
            }
          }
        }}
        onPointerMove={(e) => {
          e.stopPropagation()
          setIsHovered(true)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setIsHovered(false)
        }}
        onClick={(e) => {
          e.stopPropagation()

          if (e.altKey) {
            removeCube(id)
          }
        }}
      >
        <boxBufferGeometry attach='geometry' />
        <meshStandardMaterial
          color={isHovered ? 'grey' : isSun ? '#FFD700' : 'white'}
          transparent={!isSun && !isAnimated}
          emissive={isSun ? '#FFD700' : isAnimated ? '#FFFFFF' : '#000000'}
          emissiveIntensity={isSun ? 2 : isAnimated ? 0.5 : 0}
          map={activeTexture}
          attach='material'
        />
      </mesh>
      {isSun && (
        <pointLight
          position={position}
          intensity={2}
          color="#FFD700"
          distance={10}
          decay={2}
        />
      )}
    </>
  )
}
