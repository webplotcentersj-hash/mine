import { usePlane } from '@react-three/cannon'
import { useStore } from '../hooks/useStore.js'
import { groundTexture } from '../images/textures.js'
import { useKeyboard } from '../hooks/useKeyboard.js'

export function Ground () {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0]
  }))

  const [addCube, addPlotCenter, buildHouse] = useStore(state => [state.addCube, state.addPlotCenter, state.buildHouse])
  const { createPlotCenter, buildHouse: buildHouseKey } = useKeyboard()

  groundTexture.repeat.set(100, 100)

  const handleClickGround = event => {
    event.stopPropagation()
    const [x, y, z] = Object.values(event.point)
      .map(n => Math.ceil(n))

    if (createPlotCenter) {
      addPlotCenter(x, 0, z)
    } else if (buildHouseKey) {
      buildHouse(x, y, z)
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
