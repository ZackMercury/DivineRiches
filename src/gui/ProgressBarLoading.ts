import { Container, Graphics } from "pixi.js";

export default class ProgressBar extends Container {
  private static readonly ROUNDING_RADIUS: number = 50;

  private static readonly MARGIN: number = 2;

  private background: Graphics = new Graphics();
  private bar: Graphics = new Graphics();

  constructor (
    private progressWidth: number,
    private progressHeight: number) {
    super();
    
    // Draw the background 
    this.background
      .clear()
      .roundRect(0, 0, this.progressWidth, this.progressHeight, ProgressBar.ROUNDING_RADIUS)
      .fill(0xFFFFFF);
      
    this.progress = 0;

    this.addChild(this.background);
    this.addChild(this.bar);
  }

  public set progress (progress: number) {
    // Draw the bar
    this.bar
      .clear()
      .roundRect(
        ProgressBar.MARGIN,
        ProgressBar.MARGIN,
        this.progressWidth * progress - ProgressBar.MARGIN * 2,
        this.progressHeight - ProgressBar.MARGIN * 2, ProgressBar.ROUNDING_RADIUS
      )
      .fill(0xFF0000);
      
    this.bar.position = this.background.position;
  }
}