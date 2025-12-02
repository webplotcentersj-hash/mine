import { useStore } from '../hooks/useStore.js'
import { useState, useEffect } from 'react'

const STORY_TEXT = {
  0: {
    title: 'Bienvenido al Mundo',
    text: 'Eres un constructor que ha llegado a un nuevo mundo. Tu misión es construir, explorar y sobrevivir. Usa las teclas 1-7 para seleccionar materiales y construye tu primera casa con B + Click.'
  },
  1: {
    title: 'Primera Construcción',
    text: '¡Excelente! Has construido tu primera casa. Ahora necesitas recursos valiosos. Usa el martillo (H) para romper bloques y encontrar diamantes. Recolecta 10 diamantes para completar tu misión.'
  },
  2: {
    title: 'Amenazas Oscuras',
    text: 'Los enemigos han aparecido en el mundo. Usa tu martillo (H) para defenderte. Cada enemigo derrotado te dará diamantes. Derrota 5 enemigos para proteger tu territorio.'
  },
  3: {
    title: 'Maestro Constructor',
    text: '¡Felicidades! Has completado todas las misiones. Eres ahora un maestro constructor. Continúa construyendo y explorando este mundo infinito.'
  }
}

export const Story = () => {
  const [storyProgress, quests, diamonds, enemies] = useStore(state => [
    state.storyProgress,
    state.quests,
    state.diamonds,
    state.enemies
  ])
  const [showStory, setShowStory] = useState(true)
  const [currentStory, setCurrentStory] = useState(0)

  useEffect(() => {
    // Actualizar historia basada en progreso
    if (quests[0]?.completed && currentStory < 1) {
      setCurrentStory(1)
      setShowStory(true)
    }
    if (diamonds >= 10 && currentStory < 2) {
      setCurrentStory(2)
      setShowStory(true)
    }
    if (enemies.length === 0 && storyProgress >= 5 && currentStory < 3) {
      setCurrentStory(3)
      setShowStory(true)
    }
  }, [quests, diamonds, enemies, storyProgress, currentStory])

  const story = STORY_TEXT[currentStory] || STORY_TEXT[0]
  const activeQuest = quests.find(q => !q.completed)

  if (!showStory && !activeQuest) return null

  return (
    <>
      {showStory && (
        <div className='story-modal'>
          <div className='story-content'>
            <h2>{story.title}</h2>
            <p>{story.text}</p>
            <button onClick={() => setShowStory(false)}>Continuar</button>
          </div>
        </div>
      )}
      {activeQuest && (
        <div className='quest-tracker'>
          <div className='quest-title'>📜 Misión: {activeQuest.title}</div>
          <div className='quest-description'>{activeQuest.description}</div>
          {activeQuest.id === 2 && (
            <div className='quest-progress'>Diamantes: {diamonds}/10</div>
          )}
          {activeQuest.id === 3 && (
            <div className='quest-progress'>Enemigos derrotados: {storyProgress}/5</div>
          )}
        </div>
      )}
    </>
  )
}

