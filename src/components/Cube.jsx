import { useStore } from '../hooks/useStore.js'
import { useBox } from '@react-three/cannon'
import { useState } from 'react'
import * as textures from '../images/textures.js'
import { PointLight } from 'three'

export const Cube = ({ id, position, texture }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [removeCube] = useStore(state => [state.removeCube])

  const [ref] = useBox(() => ({
    type: 'Static',
    position
  }))

  const activeTexture = textures[texture + 'Texture']
  const isSun = texture === 'square'

  return (
    <>
      <mesh
        onPointerMove={(e) => {
          e.stopPropagation()
          setIsHovered(true)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setIsHovered(false)
        }}
        ref={ref}
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
          transparent={!isSun}
          emissive={isSun ? '#FFD700' : '#000000'}
          emissiveIntensity={isSun ? 2 : 0}
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
