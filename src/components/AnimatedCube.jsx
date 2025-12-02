import { useStore } from '../hooks/useStore.js'
import { useBox } from '@react-three/cannon'
import { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as textures from '../images/textures.js'
import { VideoTexture } from 'three'
import designImg from '../images/design.gif'

export const AnimatedCube = ({ id, position, texture }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [removeCube] = useStore(state => [state.removeCube])
  const meshRef = useRef()
  const scaleRef = useRef(1)
  const videoRef = useRef(null)
  const textureRef = useRef(null)

  const [ref] = useBox(() => ({
    type: 'Static',
    position
  }))

  useEffect(() => {
    // Crear video para textura animada
    const video = document.createElement('video')
    video.src = designImg
    video.loop = true
    video.muted = true
    video.autoplay = true
    video.play().catch(() => {
      // Si falla el autoplay, intentar de nuevo
      setTimeout(() => video.play(), 100)
    })
    videoRef.current = video
    
    const videoTexture = new VideoTexture(video)
    videoTexture.magFilter = textures.designTexture.magFilter
    textureRef.current = videoTexture

    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current = null
      }
      if (textureRef.current) {
        textureRef.current.dispose()
      }
    }
  }, [])

  useEffect(() => {
    scaleRef.current = 0
  }, [])

  useFrame(() => {
    if (meshRef.current && scaleRef.current < 1) {
      scaleRef.current = Math.min(1, scaleRef.current + 0.1)
      meshRef.current.scale.setScalar(scaleRef.current)
    }
    
    // Actualizar textura de video
    if (textureRef.current && textureRef.current.update) {
      textureRef.current.update()
    }
  })

  const activeTexture = textureRef.current || textures.designTexture

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
          color={isHovered ? 'grey' : 'white'}
          emissive="#FFFFFF"
          emissiveIntensity={0.3}
          map={activeTexture}
          attach='material'
        />
      </mesh>
      <pointLight
        position={position}
        intensity={0.5}
        color="#FFFFFF"
        distance={5}
        decay={2}
      />
    </>
  )
}

