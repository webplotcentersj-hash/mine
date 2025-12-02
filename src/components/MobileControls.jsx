import { useStore } from '../hooks/useStore.js'
import { useMobile } from '../hooks/useMobile.js'
import { useState, useRef } from 'react'

export const MobileControls = () => {
  const { isMobile } = useMobile()
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 })
  const [joystickActive, setJoystickActive] = useState(false)
  const joystickRef = useRef(null)
  const [tool, setTool] = useStore(state => [state.tool, state.setTool])
  const actionsRef = useRef({})

  if (!isMobile) return null

  const handleTouchStart = (e, type) => {
    e.preventDefault()
    if (type === 'joystick') {
      setJoystickActive(true)
      const touch = e.touches[0]
      const rect = joystickRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const updateJoystick = (touch) => {
        const x = touch.clientX - centerX
        const y = touch.clientY - centerY
        const distance = Math.min(50, Math.sqrt(x * x + y * y))
        const angle = Math.atan2(y, x)
        
        setJoystickPos({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance
        })

        // Convertir a movimiento
        const forward = y < -10
        const backward = y > 10
        const left = x < -10
        const right = x > 10

        actionsRef.current = {
          ...actionsRef.current,
          moveForward: forward,
          moveBackward: backward,
          moveLeft: left,
          moveRight: right
        }
        
        // Disparar eventos de teclado simulados
        if (forward && !actionsRef.current._forward) {
          window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }))
          actionsRef.current._forward = true
        } else if (!forward && actionsRef.current._forward) {
          window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyW' }))
          actionsRef.current._forward = false
        }
        
        if (backward && !actionsRef.current._backward) {
          window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyS' }))
          actionsRef.current._backward = true
        } else if (!backward && actionsRef.current._backward) {
          window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyS' }))
          actionsRef.current._backward = false
        }
        
        if (left && !actionsRef.current._left) {
          window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }))
          actionsRef.current._left = true
        } else if (!left && actionsRef.current._left) {
          window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyA' }))
          actionsRef.current._left = false
        }
        
        if (right && !actionsRef.current._right) {
          window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD' }))
          actionsRef.current._right = true
        } else if (!right && actionsRef.current._right) {
          window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyD' }))
          actionsRef.current._right = false
        }
      }

      updateJoystick(touch)
      
      const handleMove = (e) => {
        if (e.touches[0]) updateJoystick(e.touches[0])
      }
      
      const handleEnd = () => {
        setJoystickActive(false)
        setJoystickPos({ x: 0, y: 0 })
        ['KeyW', 'KeyS', 'KeyA', 'KeyD'].forEach(code => {
          window.dispatchEvent(new KeyboardEvent('keyup', { code }))
        })
        actionsRef.current = {}
        document.removeEventListener('touchmove', handleMove)
        document.removeEventListener('touchend', handleEnd)
      }

      document.addEventListener('touchmove', handleMove)
      document.addEventListener('touchend', handleEnd)
    } else if (type === 'jump') {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }))
      setTimeout(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }))
      }, 100)
    } else if (type === 'hammer') {
      setTool(tool === 'hammer' ? 'hand' : 'hammer')
    }
  }

  return (
    <div className='mobile-controls'>
      {/* Joystick izquierdo */}
      <div 
        className='mobile-joystick'
        ref={joystickRef}
        onTouchStart={(e) => handleTouchStart(e, 'joystick')}
      >
        <div 
          className='joystick-knob'
          style={{
            transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
            opacity: joystickActive ? 1 : 0.5
          }}
        />
      </div>

      {/* Botones derechos */}
      <div className='mobile-buttons'>
        <button 
          className='mobile-button jump'
          onTouchStart={(e) => handleTouchStart(e, 'jump')}
        >
          ⬆
        </button>
        <button 
          className='mobile-button hammer'
          onTouchStart={(e) => handleTouchStart(e, 'hammer')}
        >
          {tool === 'hammer' ? '🔨' : '✋'}
        </button>
      </div>
    </div>
  )
}

