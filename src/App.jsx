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
import { Enemies } from './components/Enemy.jsx'
import { Story } from './components/Story.jsx'
import { useStore } from './hooks/useStore.js'
import { useEffect } from 'react'

function App () {
  const [isDay, timeOfDay, loadInventory, spawnEnemy, enemies] = useStore(state => [
    state.isDay,
    state.timeOfDay,
    state.loadInventory,
    state.spawnEnemy,
    state.enemies
  ])

  useEffect(() => {
    loadInventory()
  }, [loadInventory])

  // Spawnear enemigos periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      if (enemies.length < 5) {
        const angle = Math.random() * Math.PI * 2
        const distance = 10 + Math.random() * 10
        const x = Math.cos(angle) * distance
        const z = Math.sin(angle) * distance
        spawnEnemy(x, 1, z)
      }
    }, 15000) // Cada 15 segundos

    return () => clearInterval(interval)
  }, [enemies.length, spawnEnemy])

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
          <Enemies />
        </Physics>
        <Hands />
      </Canvas>
      <div className='pointer'>+</div>
      <TextureSelector />
      <Inventory />
      <HUD />
      <Story />
    </>
  )
}

export default App
