import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { useKeyboard } from '../hooks/useKeyboard.js'
import * as THREE from 'three'

export const Hands = () => {
  const { camera } = useThree()
  const leftHandRef = useRef()
  const rightHandRef = useRef()
  const groupRef = useRef()
  const { moveForward, moveBackward, moveLeft, moveRight, jump } = useKeyboard()
  
  const isMoving = moveForward || moveBackward || moveLeft || moveRight

  useFrame((state) => {
    if (!groupRef.current || !leftHandRef.current || !rightHandRef.current) return

    const time = state.clock.elapsedTime
    
    // Actualizar posición del grupo para seguir la cámara
    groupRef.current.position.copy(camera.position)
    groupRef.current.rotation.copy(camera.rotation)

    // Posición base de las manos (delante de la cámara)
    const handDistance = 0.4
    const handHeight = -0.3
    const handWidth = 0.2

    // Posicionar manos relativas al grupo
    leftHandRef.current.position.set(-handWidth, handHeight, -handDistance)
    rightHandRef.current.position.set(handWidth, handHeight, -handDistance)

    // Animación de caminar
    let swingOffset = 0
    if (isMoving) {
      swingOffset = Math.sin(time * 8) * 0.1
    }

    // Animación de salto
    let jumpOffset = 0
    if (jump) {
      jumpOffset = Math.sin(time * 20) * 0.05
    }

    // Aplicar animaciones
    leftHandRef.current.position.y += swingOffset + jumpOffset
    leftHandRef.current.rotation.x = swingOffset * 2

    rightHandRef.current.position.y -= swingOffset + jumpOffset
    rightHandRef.current.rotation.x = -swingOffset * 2
  })

  return (
    <group ref={groupRef}>
      {/* Mano izquierda */}
      <mesh ref={leftHandRef}>
        <boxBufferGeometry args={[0.15, 0.25, 0.1]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      
      {/* Mano derecha */}
      <mesh ref={rightHandRef}>
        <boxBufferGeometry args={[0.15, 0.25, 0.1]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
    </group>
  )
}

