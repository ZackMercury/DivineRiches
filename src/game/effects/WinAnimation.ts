import { AnimatedSprite, Texture } from "pixi.js";


export default class WinAnimation extends AnimatedSprite {
  private static readonly FRAME_COUNT: number = 26;


  constructor () {
    const frames = new Array(WinAnimation.FRAME_COUNT)
      .fill(0)
      .map((_, i) => Texture.from(`WinsweepBox${i.toString().padStart(2, "0")}.png`));
    super(frames);
    this.anchor.set(0);

    this.blendMode = "add";
    this.play();
  }
}