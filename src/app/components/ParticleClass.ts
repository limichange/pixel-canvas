import p5 from 'p5'

export class Particle {
  position: p5.Vector
  acceleration: p5.Vector
  velocity: p5.Vector
  lifespan: number
  p: p5

  constructor(x: number, y: number, p: p5) {
    this.p = p
    this.position = p.createVector(x, y)
    this.acceleration = p.createVector(0, 0)
    this.velocity = p.createVector(p.random(-1, 1), p.random(-1, 0))
    this.lifespan = 255.0
  }

  run() {
    let gravity = this.p.createVector(0, 0.01)
    this.applyForce(gravity)
    this.update()
    this.show()
  }

  applyForce(force: p5.Vector) {
    this.acceleration.add(force)
  }

  // Method to update position
  update() {
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
    this.lifespan -= 0.5
    this.acceleration.mult(0)
  }

  // Method to display
  show() {
    // this.p.stroke(0, this.lifespan)
    // this.p.strokeWeight(2)
    this.p.fill(127, this.lifespan)
    this.p.ellipse(this.position.x, this.position.y, 2, 2)
  }

  // Is the particle still useful?
  isDead() {
    return this.lifespan < 0.0
  }
}
