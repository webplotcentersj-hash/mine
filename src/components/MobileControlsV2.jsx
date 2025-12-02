import { useStore } from '../hooks/useStore.js'
import { useMobile } from '../hooks/useMobile.js'
import { useControls } from '../hooks/useControls.js'
import { useState } from 'react'

export const MobileControlsV2 = () => {
  const { isMobile } = useMobile()
  const { joystickHandlers, joystickPos, joystickActive, setJump } = useControls()
  const [tool, setTool, buildMode, setBuildMode] = useStore(state => [
    state.tool, 
    state.setTool,
    state.buildMode,
    state.setBuildMode
  ])
  const [showTextureMenu, setShowTextureMenu] = useState(false)
  const [showBuildMenu, setShowBuildMenu] = useState(false)

  if (!isMobile) return null

  const handleJump = () => {
    setJump(true)
    setTimeout(() => setJump(false), 100)
  }

  const handleToolToggle = () => {
    setTool(tool === 'hammer' ? 'hand' : 'hammer')
  }

  return (
    <>
      {/* Joystick de movimiento */}
      <div 
        className='mobile-joystick-v2'
        ref={joystickHandlers.ref}
        onTouchStart={joystickHandlers.onTouchStart}
        onTouchMove={joystickHandlers.onTouchMove}
        onTouchEnd={joystickHandlers.onTouchEnd}
      >
        <div className='joystick-base' />
        <div 
          className='joystick-knob-v2'
          style={{
            transform: `translate(${Math.max(-50, Math.min(50, joystickPos.x))}px, ${Math.max(-50, Math.min(50, joystickPos.y))}px)`,
            opacity: joystickActive ? 1 : 0.3
          }}
        />
      </div>

      {/* Botones de acción */}
      <div className='mobile-actions-v2'>
        <button 
          className='mobile-action-btn jump-btn'
          onTouchStart={(e) => { e.preventDefault(); handleJump() }}
          onTouchEnd={(e) => e.preventDefault()}
        >
          ⬆
        </button>
        <button 
          className='mobile-action-btn tool-btn'
          onTouchStart={(e) => { e.preventDefault(); handleToolToggle() }}
        >
          {tool === 'hammer' ? '🔨' : '✋'}
        </button>
        <button 
          className='mobile-action-btn build-btn'
          onTouchStart={(e) => { e.preventDefault(); setShowBuildMenu(!showBuildMenu) }}
        >
          🏗️
        </button>
        <button 
          className='mobile-action-btn texture-btn'
          onTouchStart={(e) => { e.preventDefault(); setShowTextureMenu(!showTextureMenu) }}
        >
          📦
        </button>
      </div>

      {/* Menú de modo de construcción */}
      {showBuildMenu && (
        <div className='mobile-build-menu'>
          <button
            className={`mobile-build-option ${buildMode === 'cube' ? 'active' : ''}`}
            onTouchStart={(e) => {
              e.preventDefault()
              setBuildMode('cube')
              setShowBuildMenu(false)
            }}
          >
            🧱 Cubo
          </button>
          <button
            className={`mobile-build-option ${buildMode === 'house' ? 'active' : ''}`}
            onTouchStart={(e) => {
              e.preventDefault()
              setBuildMode('house')
              setShowBuildMenu(false)
            }}
          >
            🏠 Casa
          </button>
          <button
            className={`mobile-build-option ${buildMode === 'plot' ? 'active' : ''}`}
            onTouchStart={(e) => {
              e.preventDefault()
              setBuildMode('plot')
              setShowBuildMenu(false)
            }}
          >
            📍 Plot
          </button>
          <button 
            className='mobile-close-btn'
            onTouchStart={(e) => { e.preventDefault(); setShowBuildMenu(false) }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Menú de texturas móvil */}
      {showTextureMenu && (
        <div className='mobile-texture-menu'>
          <div className='mobile-texture-grid'>
            {['dirt', 'grass', 'glass', 'wood', 'log', 'square', 'design'].map((texture, idx) => (
              <button
                key={texture}
                className='mobile-texture-btn'
                onTouchStart={(e) => {
                  e.preventDefault()
                  useStore.getState().setTexture(texture)
                  setShowTextureMenu(false)
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <button 
            className='mobile-close-btn'
            onTouchStart={(e) => { e.preventDefault(); setShowTextureMenu(false) }}
          >
            ✕
          </button>
        </div>
      )}
    </>
  )
}

