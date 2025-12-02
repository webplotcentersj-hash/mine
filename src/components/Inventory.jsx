import { useStore } from '../hooks/useStore.js'
import * as images from '../images/images.js'

export const Inventory = () => {
  const [inventory, texture, setTexture] = useStore(state => [
    state.inventory,
    state.texture,
    state.setTexture
  ])

  const textureNames = ['dirt', 'grass', 'glass', 'wood', 'log', 'square', 'design']
  const textureLabels = {
    dirt: 'Tierra',
    grass: 'Pasto',
    glass: 'Vidrio',
    wood: 'Madera',
    log: 'Tronco',
    square: 'Sol',
    design: 'Diseño Animado'
  }

  return (
    <div className='inventory'>
      <div className='inventory-title'>Inventario</div>
      <div className='inventory-items'>
        {textureNames.map((textureName, index) => {
          const count = inventory[textureName] || 0
          const imgKey = textureName + 'Img'
          const img = images[imgKey]
          
          return (
            <div
              key={textureName}
              className={`inventory-item ${texture === textureName ? 'selected' : ''} ${count === 0 ? 'empty' : ''}`}
              onClick={() => setTexture(textureName)}
              title={`${textureLabels[textureName]} (${count})`}
            >
              <img src={img} alt={textureName} />
              <div className='inventory-count'>{count}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

