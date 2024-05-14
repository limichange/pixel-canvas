'use client'

/* eslint-disable @next/next/no-img-element */
import { FC, ReactNode, use, useCallback, useEffect, useState } from 'react'
import { Application, Assets, Container, Graphics, Sprite } from 'pixi.js'
import { getImageData } from '../utils/getImageData'

export interface PixiApplicationProps {
  children?: ReactNode
}

const random = (min: number, max: number) => Math.random() * (max - min) + min

export const PixiApplication: FC<PixiApplicationProps> = (props) => {
  const { children } = props
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const init = useCallback(async () => {
    // Create a new application
    const app = new Application()

    app.init({
      antialias: true,
      resizeTo: window,
    })

    // Initialize the application
    await app.init({ background: '#111111', resizeTo: window })

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas)

    // Create and add a container to the stage
    const container = new Container()

    // Load the bunny texture
    // const texture = await Assets.load('https://pixijs.com/assets/bunny.png')

    const bunnies: Graphics[] = []

    const stageWidth = window.innerWidth
    const stageHeight = window.innerHeight

    console.log(stageWidth, stageHeight)
    // Create a 5x5 grid of bunnies in the container
    for (let i = 0; i < 50000; i++) {
      const bunny = new Graphics()
      bunny.circle(0, 0, 2)
      bunny.fill(0xde3249, 1)

      bunny.x = Math.random() * stageWidth
      bunny.y = Math.random() * stageHeight
      bunnies.push(bunny)
      container.addChild(bunny)
    }

    // Move the container to the center
    container.x = 0
    container.y = 0

    app.stage.addChild(container)

    // Center the bunny sprites in local container coordinates
    // container.pivot.x = container.width / 2
    // container.pivot.y = container.height / 2

    // Listen for animate update
    app.ticker.add((time) => {
      // Continuously rotate the container!
      // * use delta to create frame-independent transform *
      // container.rotation -= 0.01 * time.deltaTime
      bunnies.forEach((bunny) => {
        // bunny.rotation += Math.random() * 0.01 * time.deltaTime
        // random move
        // bunny.x += random(-1, 1) * time.deltaTime
        // bunny.y += random(-1, 1) * time.deltaTime
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

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 200,
          background: 'gray',
        }}>
        <img
          style={{
            display: 'block',
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
    </div>
  )
}
