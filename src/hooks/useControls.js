import { useState, useEffect, useRef } from 'react'
import { useMobile } from './useMobile.js'

// Sistema unificado de controles para móvil y desktop
export const useControls = () => {
  const { isMobile } = useMobile()
  const [movement, setMovement] = useState({ forward: 0, right: 0 })
  const [jump, setJump] = useState(false)
  const joystickRef = useRef({ active: false, startPos: null, currentPos: null })

  // Controles de teclado (desktop)
  useEffect(() => {
    if (isMobile) return

    const keys = { w: false, s: false, a: false, d: false, space: false }

    const handleKeyDown = (e) => {
      const code = e.code
      if (code === 'KeyW') keys.w = true
      if (code === 'KeyS') keys.s = true
      if (code === 'KeyA') keys.a = true
      if (code === 'KeyD') keys.d = true
      if (code === 'Space') {
        e.preventDefault()
        keys.space = true
        setJump(true)
      }
      updateMovement()
    }

    const handleKeyUp = (e) => {
      const code = e.code
      if (code === 'KeyW') keys.w = false
      if (code === 'KeyS') keys.s = false
      if (code === 'KeyA') keys.a = false
      if (code === 'KeyD') keys.d = false
      if (code === 'Space') {
        keys.space = false
        setJump(false)
      }
      updateMovement()
    }

    const updateMovement = () => {
      const forward = (keys.w ? 1 : 0) - (keys.s ? 1 : 0)
      const right = (keys.d ? 1 : 0) - (keys.a ? 1 : 0)
      setMovement({ forward, right })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isMobile])

  // Controles táctiles (móvil)
  const joystickElementRef = useRef(null)
  
  const handleJoystickStart = (e) => {
    if (!isMobile) return
    e.preventDefault()
    const touch = e.touches[0]
    if (!joystickElementRef.current) return
    
    const rect = joystickElementRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    joystickRef.current = {
      active: true,
      startPos: { x: centerX, y: centerY },
      currentPos: { x: touch.clientX, y: touch.clientY }
    }
    updateJoystickMovement()
  }

  const handleJoystickMove = (e) => {
    if (!isMobile || !joystickRef.current.active) return
    e.preventDefault()
    if (e.touches[0]) {
      joystickRef.current.currentPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      }
      updateJoystickMovement()
    }
  }

  const handleJoystickEnd = (e) => {
    if (!isMobile) return
    e.preventDefault()
    joystickRef.current = { active: false, startPos: null, currentPos: null }
    setMovement({ forward: 0, right: 0 })
  }

  const updateJoystickMovement = () => {
    if (!joystickRef.current.active || !joystickRef.current.startPos) return
    
    const start = joystickRef.current.startPos
    const current = joystickRef.current.currentPos || start
    
    const dx = current.x - start.x
    const dy = current.y - start.y
    const maxDistance = 50
    
    const distance = Math.min(maxDistance, Math.sqrt(dx * dx + dy * dy))
    const angle = Math.atan2(dy, dx)
    
    // Normalizar a -1 a 1
    const forward = -Math.sin(angle) * (distance / maxDistance)
    const right = Math.cos(angle) * (distance / maxDistance)
    
    setMovement({ forward, right })
  }

  return {
    movement,
    jump,
    setJump,
    joystickHandlers: {
      onTouchStart: handleJoystickStart,
      onTouchMove: handleJoystickMove,
      onTouchEnd: handleJoystickEnd,
      ref: joystickElementRef
    },
    joystickPos: joystickRef.current.currentPos && joystickRef.current.startPos
      ? {
          x: Math.max(-50, Math.min(50, joystickRef.current.currentPos.x - joystickRef.current.startPos.x)),
          y: Math.max(-50, Math.min(50, joystickRef.current.currentPos.y - joystickRef.current.startPos.y))
        }
      : { x: 0, y: 0 },
    joystickActive: joystickRef.current.active
  }
}

