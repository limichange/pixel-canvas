/* eslint-disable @next/next/no-img-element */
import { FC, ReactNode, use, useCallback, useEffect, useState } from 'react'
import { Application, Assets, Container, Sprite } from 'pixi.js'
import { getImageData } from '../utils/getImageData'

export interface PixiApplicationProps {
  children?: ReactNode
}

export const PixiApplication: FC<PixiApplicationProps> = (props) => {
  const { children } = props
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const init = useCallback(async () => {
    console.log('init')

    // Create a new application
    const app = new Application()

    // Initialize the application
    await app.init({ background: '#1099bb', resizeTo: window })

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas)

    // Create and add a container to the stage
    const container = new Container()

    app.stage.addChild(container)

    // Load the bunny texture
    const texture = await Assets.load('https://pixijs.com/assets/bunny.png')

    const bunnies: Sprite[] = []
    // Create a 5x5 grid of bunnies in the container
    for (let i = 0; i < 10000; i++) {
      const bunny = new Sprite(texture)

      bunny.x = (i % 50) * 40
      bunny.y = Math.floor(i / 50) * 40
      bunnies.push(bunny)
      container.addChild(bunny)
    }

    // Move the container to the center
    container.x = app.screen.width / 10
    container.y = app.screen.height / 10

    // Center the bunny sprites in local container coordinates
    container.pivot.x = container.width / 2
    container.pivot.y = container.height / 2

    // Listen for animate update
    app.ticker.add((time) => {
      // Continuously rotate the container!
      // * use delta to create frame-independent transform *
      // container.rotation -= 0.01 * time.deltaTime
      bunnies.forEach((bunny) => {
        bunny.rotation += 0.01 * time.deltaTime

        // random move
        bunny.x += Math.random() * 2 - 1
        bunny.y += Math.random() * 2 - 1
      })
    })
  }, [])

  useEffect(() => {
    if (!isMounted) return

    init()
  }, [init, isMounted])

  return (
    <div>
      {children}
      <img
        style={{
          width: '400px',
        }}
        src='/image.jpg'
        alt='image'
        id='img'
      />

      <button
        onClick={() => {
          const result = getImageData()

          console.log(result)
        }}>
        click
      </button>
    </div>
  )
}
