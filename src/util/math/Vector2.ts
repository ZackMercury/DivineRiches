
export default class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}

  normalize (length: number = 1) {
    const currLength = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x = this.x / currLength * length;
    this.y = this.y / currLength * length;

    return this;
  }

  get length (): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  subtract (v: Vector2) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  add (v: Vector2) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  dot (v: Vector2) {
    return this.x * v.x + this.y * v.y;
  }

  scale (val: number) {
    this.x *= val;
    this.y *= val;
    return this;
  }

  clone () {
    return new Vector2(this.x, this.y);
  }
}