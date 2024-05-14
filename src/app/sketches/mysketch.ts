import { P5jsSketch } from '../components/P5jsContainer'

export const mySketch: P5jsSketch = (p5, parentRef) => {
  let parentStyle: CSSStyleDeclaration
  let canvasHeight: number
  let canvasWidth: number
  let audioState: object
  let cnv: any
  let sine: any

  p5.setup = () => {
    // get and set the canvas size inside the parent
    parentStyle = window.getComputedStyle(parentRef)
    canvasWidth = parseInt(parentStyle.width) * 0.99
    canvasHeight = parseInt(parentStyle.width) * 0.4
    cnv = p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef)

    // etc....
  }

  p5.draw = () => {
    // draw stuff on the screen
  }
}
