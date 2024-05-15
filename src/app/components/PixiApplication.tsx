'use client'

/* eslint-disable @next/next/no-img-element */
import { FC, ReactNode, use, useCallback, useEffect, useState } from 'react'
import {
  Application,
  Assets,
  Container,
  Graphics,
  Point,
  Sprite,
} from 'pixi.js'
import { getImageData } from '../utils/getImageData'
import { Vector } from 'p5'
import { Pixel } from './Pixel'

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

    // Initialize the application
    await app.init({
      background: '#111111',
      resizeTo: window,
      antialias: true,
    })

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
    const { pixels } = getImageData()

    console.log(pixels)

    const newPixels: Pixel[] = []

    // random remove items
    for (let i = 0; i < pixels.length; i += 1) {
      if (Math.random() > 0.5) {
        newPixels.push(new Pixel(pixels[i].x, pixels[i].y, pixels[i].lum))
      }
    }

    for (let i = 0; i < newPixels.length; i += 1) {
      const pixel = newPixels[i]
      const bunny = new Graphics()
      bunny.rect(0, 0, 3, 3)
      bunny.x = random(0, stageWidth)
      bunny.y = random(0, stageHeight)
      bunny.fill({
        color: 0xde3249,
        // alpha: 1 - lum / 255,
      })

      bunnies.push(bunny)
      app.stage.addChild(bunny)
    }

    // Move the container to the center
    container.x = 0
    container.y = 0

    // Center the bunny sprites in local container coordinates
    // container.pivot.x = container.width / 2
    // container.pivot.y = container.height / 2

    // Listen for animate update
    app.ticker.add((time) => {
      // Continuously rotate the container!
      // * use delta to create frame-independent transform *
      // container.rotation -= 0.01 * time.deltaTime
      bunnies.forEach((bunny, index) => {
        const pixel = newPixels[index]

        const currentPoint = new Point(bunny.x, bunny.y)
        const targetPoint = new Point(pixel.originalX, pixel.originalY)

        const vector = new Vector(
          targetPoint.x - currentPoint.x,
          targetPoint.y - currentPoint.y
        )

        if (vector.mag() > 5) {
          bunny.x += vector.x / 100
          bunny.y += vector.y / 100
        }
      })
    })
    app.stage.eventMode = 'static'
    app.stage.addEventListener('pointermove', (e) => {
      const { x, y } = e.data

      // newPixels.forEach((pixel, index) => {
      //   const result = new Vector(pixel.x, pixel.y).sub(x, y)

      //   if (result.mag() < 20) {
      //     bunnies[index].alpha -= 0.1
      //   }
      // })
    })
  }, [])

  useEffect(() => {
    if (!isMounted) return

    setTimeout(() => {
      init()
    }, 1000)
  }, [init, isMounted])

  return (
    <div>
      {children}

      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 600,
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
      </div>
    </div>
  )
}
