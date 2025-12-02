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
import { MobileControls } from './components/MobileControls.jsx'
import { useStore } from './hooks/useStore.js'
import { useEffect, useState } from 'react'

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

  // Detectar móvil y optimizar
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Spawnear enemigos periódicamente (menos en móvil)
  useEffect(() => {
    const maxEnemies = isMobile ? 2 : 5
    const spawnInterval = isMobile ? 30000 : 15000
    
    const interval = setInterval(() => {
      if (enemies.length < maxEnemies) {
        const angle = Math.random() * Math.PI * 2
        const distance = 10 + Math.random() * 10
        const x = Math.cos(angle) * distance
        const z = Math.sin(angle) * distance
        spawnEnemy(x, 1, z)
      }
    }, spawnInterval)

    return () => clearInterval(interval)
  }, [enemies.length, spawnEnemy, isMobile])

  // Calcular posición del sol basado en la hora
  const sunAngle = (timeOfDay / 24) * Math.PI * 2 - Math.PI / 2
  const sunX = Math.cos(sunAngle) * 100
  const sunY = Math.sin(sunAngle) * 100
  const sunZ = 20

  // Intensidad de luz basada en la hora del día
  const ambientIntensity = isDay ? 0.8 : 0.2

  return (
    <>
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
        performance={{ min: 0.5 }}
      >
        <Sky sunPosition={[sunX, sunY, sunZ]} />
        <ambientLight intensity={ambientIntensity} />
        <directionalLight
          position={[sunX, sunY, sunZ]}
          intensity={isDay ? 1 : 0.3}
          castShadow={!isMobile}
        />
        <Fpv />

        <Physics>
          <Cubes />
          <Player />
          <Ground />
          <PlotCenters />
          <Enemies />
        </Physics>
        {!isMobile && <Hands />}
      </Canvas>
      <div className='pointer'>+</div>
      <TextureSelector />
      <Inventory />
      <HUD />
      <Story />
      <MobileControls />
    </>
  )
}

export default App
