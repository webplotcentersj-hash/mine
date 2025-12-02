import { useStore } from '../hooks/useStore.js'
import { useEffect, useState } from 'react'
import { useKeyboard } from '../hooks/useKeyboard.js'

export const HUD = () => {
  const [cubes, isDay, timeOfDay, setTimeOfDay, saveWorld, resetWorld, tool, setTool, diamonds, buildHouse] = useStore(state => [
    state.cubes,
    state.isDay,
    state.timeOfDay,
    state.setTimeOfDay,
    state.saveWorld,
    state.resetWorld,
    state.tool,
    state.setTool,
    state.diamonds,
    state.buildHouse
  ])
  const [showInstructions, setShowInstructions] = useState(true)
  const { save, toggleInstructions, toggleHammer, buildHouse: buildHouseKey } = useKeyboard()

  useEffect(() => {
    if (save) {
      saveWorld()
    }
  }, [save, saveWorld])

  useEffect(() => {
    if (toggleInstructions) {
      setShowInstructions(prev => !prev)
    }
  }, [toggleInstructions])

  useEffect(() => {
    if (toggleHammer) {
      setTool(tool === 'hammer' ? 'hand' : 'hammer')
    }
  }, [toggleHammer, tool, setTool])

  useEffect(() => {
    if (buildHouseKey) {
      // Construir casa en la posición del jugador (aproximada)
      buildHouse(0, 0, 0)
      alert('Casa construida! Usa B + Click para construir en otra posición')
    }
  }, [buildHouseKey, buildHouse])

  // Sistema de día/noche automático
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay((timeOfDay + 0.1) % 24)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeOfDay, setTimeOfDay])

  const hour = Math.floor(timeOfDay)
  const minute = Math.floor((timeOfDay % 1) * 60)
  const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

  return (
    <>
      <div className='hud'>
        <div className='hud-stats'>
          <div className='stat'>
            <span className='stat-label'>Bloques:</span>
            <span className='stat-value'>{cubes.length}</span>
          </div>
          <div className='stat'>
            <span className='stat-label'>Hora:</span>
            <span className='stat-value'>{timeString}</span>
          </div>
          <div className='stat'>
            <span className='stat-label'>Día/Noche:</span>
            <span className={`stat-value ${isDay ? 'day' : 'night'}`}>
              {isDay ? '☀️ Día' : '🌙 Noche'}
            </span>
          </div>
          <div className='stat'>
            <span className='stat-label'>💎 Diamantes:</span>
            <span className='stat-value'>{diamonds || 0}</span>
          </div>
          <div className='stat'>
            <span className='stat-label'>Herramienta:</span>
            <span className='stat-value'>{tool === 'hammer' ? '🔨 Martillo' : '✋ Mano'}</span>
          </div>
        </div>
        <div className='hud-actions'>
          <button className='hud-button' onClick={saveWorld} title='Guardar mundo (G)'>
            💾 Guardar
          </button>
          <button className='hud-button reset' onClick={resetWorld} title='Resetear mundo'>
            🔄 Resetear
          </button>
        </div>
      </div>
      {showInstructions && (
        <div className='instructions'>
          <div className='instructions-content'>
            <h3>Controles</h3>
            <ul>
              <li><strong>WASD</strong> - Mover</li>
              <li><strong>Espacio</strong> - Saltar</li>
              <li><strong>Click</strong> - Colocar bloque</li>
              <li><strong>Alt + Click</strong> - Eliminar bloque</li>
              <li><strong>1-7</strong> - Seleccionar textura</li>
              <li><strong>Click</strong> - Colocar bloque</li>
              <li><strong>Alt + Click</strong> - Eliminar bloque</li>
              <li><strong>H</strong> - Cambiar herramienta (Mano/Martillo)</li>
              <li><strong>🔨 Martillo</strong> - Romper bloques (10% chance de diamantes)</li>
              <li><strong>B + Click</strong> - Construir casa</li>
              <li><strong>P + Click</strong> - Crear Plot Center</li>
              <li><strong>G</strong> - Guardar mundo</li>
              <li><strong>ESC</strong> - Mostrar/ocultar instrucciones</li>
            </ul>
            <button onClick={() => setShowInstructions(false)}>Cerrar</button>
          </div>
        </div>
      )}
      <button 
        className='instructions-toggle'
        onClick={() => setShowInstructions(!showInstructions)}
        title='Mostrar/ocultar instrucciones'
      >
        ❓
      </button>
    </>
  )
}

