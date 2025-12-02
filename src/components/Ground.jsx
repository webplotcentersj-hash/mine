import { usePlane } from '@react-three/cannon'
import { useStore } from '../hooks/useStore.js'
import { groundTexture } from '../images/textures.js'
import { useKeyboard } from '../hooks/useKeyboard.js'
import { useMobile } from '../hooks/useMobile.js'
import { useRef } from 'react'

export function Ground () {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0]
  }))

  const [addCube, addPlotCenter, buildHouse, buildMode] = useStore(state => [
    state.addCube, 
    state.addPlotCenter, 
    state.buildHouse,
    state.buildMode
  ])
  const { createPlotCenter, buildHouse: buildHouseKey } = useKeyboard()
  const { isMobile } = useMobile()
  const lastClickTime = useRef(0)

  groundTexture.repeat.set(100, 100)

  const handleClickGround = event => {
    event.stopPropagation()
    
    // Prevenir clicks muy rápidos en móvil
    const now = Date.now()
    if (isMobile && now - lastClickTime.current < 200) return
    lastClickTime.current = now

    const [x, y, z] = Object.values(event.point)
      .map(n => Math.ceil(n))

    // Priorizar buildMode sobre teclas
    if (buildMode === 'plot') {
      addPlotCenter(x, 0, z)
    } else if (buildMode === 'house') {
      buildHouse(x, y, z)
    } else if (createPlotCenter) {
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
