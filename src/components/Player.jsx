import { useSphere } from '@react-three/cannon'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { useControls } from '../hooks/useControls.js'
import { useStore } from '../hooks/useStore.js'

const CHARACTER_SPEED = 4
const CHARACTER_JUMP_FORCE = 4

export const Player = () => {
  const { movement, jump } = useControls()

  const { camera } = useThree()
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 0.5, 0]
  }))

  const setPlayerPosition = useStore(state => state.setPlayerPosition)
  const pos = useRef([0, 0, 0])
  useEffect(() => {
    api.position.subscribe(p => {
      pos.current = p
      setPlayerPosition(p)
    })
  }, [api.position, setPlayerPosition])

  const vel = useRef([0, 0, 0])
  useEffect(() => {
    api.velocity.subscribe(p => {
      vel.current = p
    })
  }, [api.velocity])

  useFrame(() => {
    camera.position.copy(
      new Vector3(
        pos.current[0], // x
        pos.current[1], // y
        pos.current[2] // z
      )
    )

    const direction = new Vector3(
      movement.right,
      0,
      movement.forward
    )
      .normalize()
      .multiplyScalar(CHARACTER_SPEED)
      .applyEuler(camera.rotation)

    api.velocity.set(
      direction.x,
      vel.current[1], // ???? saltar.
      direction.z
    )

    if (jump && Math.abs(vel.current[1]) < 0.05) {
      api.velocity.set(
        vel.current[0],
        CHARACTER_JUMP_FORCE,
        vel.current[2]
      )
    }
  })

  return (
    <mesh ref={ref} />
  )
}
