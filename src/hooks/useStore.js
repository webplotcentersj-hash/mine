import { nanoid } from 'nanoid'
import create from 'zustand'

const STORAGE_KEY = 'minecraft-world'
const PLOT_CENTERS_KEY = 'minecraft-plot-centers'

const loadWorld = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const loadPlotCenters = () => {
  try {
    const saved = localStorage.getItem(PLOT_CENTERS_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export const useStore = create(set => ({
  texture: 'dirt',
  cubes: loadWorld(),
  plotCenters: loadPlotCenters(),
  isDay: true,
  timeOfDay: 0, // 0-24 horas
  inventory: {
    dirt: 999,
    grass: 999,
    glass: 999,
    wood: 999,
    log: 999,
    square: 10,
    design: 50
  },
  addCube: (x, y, z) => {
    set(state => {
      const texture = state.texture
      const currentCount = state.inventory[texture] || 0
      
      if (currentCount <= 0 && texture !== 'square') {
        return state // No hay bloques disponibles
      }

      const newCubes = [...state.cubes, {
        id: nanoid(),
        texture: texture,
        pos: [x, y, z]
      }]

      const newInventory = {
        ...state.inventory,
        [texture]: texture === 'square' ? (state.inventory[texture] || 0) : Math.max(0, currentCount - 1)
      }

      // Guardar automáticamente
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCubes))
      localStorage.setItem('minecraft-inventory', JSON.stringify(newInventory))

      return {
        cubes: newCubes,
        inventory: newInventory
      }
    })
  },
  removeCube: (id) => {
    set(state => {
      const cube = state.cubes.find(c => c.id === id)
      const newCubes = state.cubes.filter(c => c.id !== id)
      
      if (cube) {
        const newInventory = {
          ...state.inventory,
          [cube.texture]: (state.inventory[cube.texture] || 0) + 1
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCubes))
        localStorage.setItem('minecraft-inventory', JSON.stringify(newInventory))
        
        return {
          cubes: newCubes,
          inventory: newInventory
        }
      }
      
      return { cubes: newCubes }
    })
  },
  setTexture: (texture) => {
    set(() => ({ texture }))
  },
  toggleDayNight: () => {
    set(state => ({ isDay: !state.isDay }))
  },
  setTimeOfDay: (time) => {
    set(() => ({ timeOfDay: time, isDay: time >= 6 && time < 18 }))
  },
  saveWorld: () => {
    const state = useStore.getState()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cubes))
    localStorage.setItem('minecraft-inventory', JSON.stringify(state.inventory))
    alert('Mundo guardado!')
  },
  resetWorld: () => {
    if (confirm('¿Estás seguro de que quieres resetear el mundo? Se perderán todos los bloques.')) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem('minecraft-inventory')
      set({
        cubes: [],
        inventory: {
          dirt: 999,
          grass: 999,
          glass: 999,
          wood: 999,
          log: 999,
          square: 10,
          design: 50
        }
      })
    }
  },
  loadInventory: () => {
    try {
      const saved = localStorage.getItem('minecraft-inventory')
      if (saved) {
        set({ inventory: JSON.parse(saved) })
      }
    } catch {}
  },
  addPlotCenter: (x, y, z) => {
    set(state => {
      const newPlotCenters = [...state.plotCenters, {
        id: nanoid(),
        pos: [x, y, z]
      }]
      localStorage.setItem(PLOT_CENTERS_KEY, JSON.stringify(newPlotCenters))
      return { plotCenters: newPlotCenters }
    })
  },
  removePlotCenter: (id) => {
    set(state => {
      const newPlotCenters = state.plotCenters.filter(pc => pc.id !== id)
      localStorage.setItem(PLOT_CENTERS_KEY, JSON.stringify(newPlotCenters))
      return { plotCenters: newPlotCenters }
    })
  }
}))
