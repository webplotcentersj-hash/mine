import { useStore } from '../hooks/useStore.js'
import * as images from '../images/images.js'
import { useKeyboard } from '../hooks/useKeyboard.js'
import { useEffect, useState } from 'react'

export const TextureSelector = () => {
  const [visible, setVisible] = useState(true)
  const [texture, setTexture] = useStore(state => [state.texture, state.setTexture])

  const {
    dirt,
    grass,
    glass,
    wood,
    log,
    square,
    design
  } = useKeyboard()

  useEffect(() => {
    const visibilityTimeout = setTimeout(() => {
      setVisible(false)
    }, 1000)

    setVisible(true)

    return () => {
      clearTimeout(visibilityTimeout)
    }
  }, [texture])

  useEffect(() => {
    const options = {
      dirt,
      grass,
      glass,
      wood,
      log,
      square,
      design
    }

    const selectedTexture = Object
      .entries(options)
      .find(([texture, isEnabled]) => isEnabled)

    if (selectedTexture) {
      const [textureName] = selectedTexture
      setTexture(textureName)
    }
  }, [dirt, grass, glass, wood, log, square, design, setTexture])

  return (
    <div className='texture-selector'>
      {
        Object
          .entries(images)
          .map(([imgKey, img]) => {
            const textureName = imgKey.replace('Img', '')
            return (
              <img
                className={texture === textureName ? 'selected' : ''}
                key={imgKey}
                src={img}
                alt={imgKey}
                onClick={() => setTexture(textureName)}
                style={{ cursor: 'pointer' }}
              />
            )
          })
      }
    </div>
  )
}
