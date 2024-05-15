export class Pixel {
  lum: number

  originalX: number
  originalY: number

  constructor(x: number, y: number, lum: number) {
    this.originalX = x
    this.originalY = y
    this.lum = lum
  }
}
