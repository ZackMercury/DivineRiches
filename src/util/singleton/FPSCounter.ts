import { Text, Ticker } from "pixi.js";
import TextWorks from "../../factory/TextWorks";


export default class FPSCounter extends Text {
  private static instance: FPSCounter;

  private lastTick: number = performance.now();
  private frames: number = 0;
  
  private constructor (
    private ticker: Ticker
  ) {
    if (FPSCounter.instance) throw new Error("Attempt to break singleton at FPSCounter. Use getInstance()");

    super({
      style: TextWorks.getNormalStyle("#ffffff", 16)
    });

    this.ticker.add(this.update, this);
  }

  public static getInstance(ticker: Ticker): FPSCounter {
    if (FPSCounter.instance) return FPSCounter.instance
    else return new FPSCounter(ticker);
  }

  private update () {
    const now = performance.now();
    const frames = ++ this.frames;
    
    if (now - this.lastTick >= 1000) {
      this.text = "FPS: " + frames;
      this.lastTick = now;
      this.frames = 0;
    }
  } 
}