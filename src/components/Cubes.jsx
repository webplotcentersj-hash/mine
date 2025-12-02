import { useStore } from '../hooks/useStore'
import { Cube } from './Cube.jsx'
import { AnimatedCube } from './AnimatedCube.jsx'

export const Cubes = () => {
  const [cubes] = useStore(state => [state.cubes])

  return cubes.map(({ id, pos, texture }) => {
    if (texture === 'design') {
      return (
        <AnimatedCube
          key={id}
          id={id}
          position={pos}
          texture={texture}
        />
      )
    }
    return (
      <Cube
        key={id}
        id={id}
        position={pos}
        texture={texture}
      />
    )
  })
}
