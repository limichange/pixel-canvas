'use client'

import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import p5 from 'p5'

export interface P5ApplicationProps {
  children?: ReactNode
}

export const P5Application: FC<P5ApplicationProps> = (props) => {
  const { children } = props
  const p5instanceRef = useRef<p5 | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  const s = useCallback((p: p5) => {
    let x = 120
    let y = 100

    p.setup = function () {
      p.createCanvas(700, 410)
    }

    p.draw = function () {
      p.background(0)
      p.fill(255)
      p.rect(x, y, 50, 50)
      p.ellipse(150, 150, 80, 80)
    }
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    import('p5').then(({ default: p5 }) => {
      const p5instance = new p5(s)

      p5instance.createCanvas(700, 410).parent(elementRef.current!)

      p5instanceRef.current = p5instance
    })

    return () => {
      p5instanceRef.current?.remove()
    }
  }, [isMounted, s])

  return (
    <div>
      <div ref={elementRef}></div>
      {children}
    </div>
  )
}
