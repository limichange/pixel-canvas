'use client'

import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import p5 from 'p5'
import { Particle } from './ParticleClass'

export interface P5ApplicationProps {
  children?: ReactNode
}

export const P5Application: FC<P5ApplicationProps> = (props) => {
  const { children } = props
  const p5instanceRef = useRef<p5 | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  const sketch = useCallback((p: p5, element: HTMLDivElement) => {
    let x = 120
    let y = 100
    const height = 800
    const width = 800
    const particles: Particle[] = []

    p.setup = function () {
      p.createCanvas(width, height).parent(element)
    }

    p.draw = function () {
      p.background(244)
      // p.frameRate(30)

      for (let i = 0; i < 10; i++) {
        particles.push(new Particle(x + 300, y, p))
      }

      // Looping through backwards to delete
      for (let i = particles.length - 1; i >= 0; i--) {
        let particle = particles[i]
        particle.run()

        if (particle.isDead()) {
          particles.splice(i, 1)
        }
      }

      const aliveParticles = particles.filter((particle) => !particle.isDead())

      p.text(aliveParticles.length, 10, 20)
      p.stroke(0)
    }
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    import('p5').then(({ default: p5 }) => {
      const p5instance = new p5(sketch, elementRef.current!)

      p5instanceRef.current = p5instance
    })

    return () => {
      p5instanceRef.current?.remove()
    }
  }, [isMounted, sketch])

  return (
    <div>
      <div ref={elementRef}></div>
      {children}
    </div>
  )
}
