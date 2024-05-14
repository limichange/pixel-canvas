// components/P5jsContainer.tsx
import React, { useEffect, useRef, useState } from 'react'
import p5Types from 'p5'

// can go in "./types/global.d.ts"
type P5jsContainerRef = HTMLDivElement
export type P5jsSketch = (p: p5Types, parentRef: P5jsContainerRef) => void
type P5jsContainer = ({ sketch }: { sketch: P5jsSketch }) => React.JSX.Element

export const P5jsContainer: P5jsContainer = ({ sketch }) => {
  const parentRef = useRef<P5jsContainerRef>(null)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  // on mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // if not mounted, do nothing yet.
    if (!isMounted) return

    // our current p5 sketch instance
    let p5instance: p5Types

    // function that loads p5 and creates the sketch inside the div.
    const initP5 = async () => {
      try {
        if (parentRef.current) {
          // import the p5 and p5-sounds client-side
          const p5 = (await import('p5')).default
          // initalize the sketch
          new p5((p) => {
            sketch(p, parentRef.current!)
            p5instance = p
          })
        }
      } catch (error) {
        console.log(error)
      }
    }

    initP5()

    // when the component unmounts, remove the p5 instance.
    return () => {
      p5instance.remove()
    }
  }, [isMounted, sketch])

  // parent div of the p5 canvas
  return <div ref={parentRef}></div>
}
