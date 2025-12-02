import { usePlane } from '@react-three/cannon'
import { useStore } from '../hooks/useStore.js'
import { groundTexture } from '../images/textures.js'
import { useKeyboard } from '../hooks/useKeyboard.js'
import { useEffect } from 'react'

export function Ground () {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0]
  }))

  const [addCube, addPlotCenter] = useStore(state => [state.addCube, state.addPlotCenter])
  const { createPlotCenter } = useKeyboard()

  groundTexture.repeat.set(100, 100)

  const handleClickGround = event => {
    event.stopPropagation()
    const [x, y, z] = Object.values(event.point)
      .map(n => Math.ceil(n))

    if (createPlotCenter) {
      addPlotCenter(x, 0, z)
    } else {
      addCube(x, y, z)
    }
  }

  return (
    <mesh
      onClick={handleClickGround}
      ref={ref}
    >
      <planeBufferGeometry attach='geometry' args={[100, 100]} />
      <meshStandardMaterial attach='material' map={groundTexture} />
    </mesh>
  )
}
