import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { Ground } from './components/Ground.jsx'
import { FPV as Fpv } from './components/FPV.jsx'
import { Player } from './components/Player.jsx'
import { Cubes } from './components/Cubes.jsx'
import { TextureSelector } from './components/TextureSelect.jsx'
import { Inventory } from './components/Inventory.jsx'
import { HUD } from './components/HUD.jsx'
import { Hands } from './components/Hands.jsx'
import { PlotCenters } from './components/PlotCenter.jsx'
import { useStore } from './hooks/useStore.js'
import { useEffect } from 'react'

function App () {
  const [isDay, timeOfDay, loadInventory] = useStore(state => [
    state.isDay,
    state.timeOfDay,
    state.loadInventory
  ])

  useEffect(() => {
    loadInventory()
  }, [loadInventory])

  // Calcular posición del sol basado en la hora
  const sunAngle = (timeOfDay / 24) * Math.PI * 2 - Math.PI / 2
  const sunX = Math.cos(sunAngle) * 100
  const sunY = Math.sin(sunAngle) * 100
  const sunZ = 20

  // Intensidad de luz basada en la hora del día
  const ambientIntensity = isDay ? 0.8 : 0.2

  return (
    <>
      <Canvas>
        <Sky sunPosition={[sunX, sunY, sunZ]} />
        <ambientLight intensity={ambientIntensity} />
        <directionalLight
          position={[sunX, sunY, sunZ]}
          intensity={isDay ? 1 : 0.3}
          castShadow
        />
        <Fpv />

        <Physics>
          <Cubes />
          <Player />
          <Ground />
          <PlotCenters />
        </Physics>
        <Hands />
      </Canvas>
      <div className='pointer'>+</div>
      <TextureSelector />
      <Inventory />
      <HUD />
    </>
  )
}

export default App
