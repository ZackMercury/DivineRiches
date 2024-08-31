import { Ticker } from "pixi.js";
import { lerp } from "../math/perlin";
import arrayIntersections from "../math/arrayIntersections";

export enum TweenType { LINEAR, CUBIC_IN, CUBIC_OUT, CIRCULAR_IN, CIRCULAR_OUT, BEZIER_IN_OUT }

interface Transition {
  object: any;
  duration: number;
  timeElapsed: number;
  from: Record<string, any>;
  to: Record<string, any>;
  fun: TweenType;
  whenDone?: () => void;
}

export default class Tween {
  private static readonly transitions: Transition[] = [];
  private static lastTick: number = 0;
  private static ticker: Ticker;

  public static init(ticker: Ticker): void {
    ticker.add(Tween.update);
    this.ticker = ticker;
  }

  private static lowestLevel(
    obj: Record<string, any>,
    paramAddress: string
  ): Record<string, any> {
    paramAddress.split(".").forEach((prop: string, i: number, arr: string[]) => {
      if(i < arr.length - 1)
        obj = obj[prop];
    })
    return obj;
  }

  public static ease(
    obj: any,
    fromParams: Record<string, number>,
    toParams: Record<string, number>,
    duration: number,
    easingFunction: TweenType = TweenType.LINEAR
  ): Promise<void> {

    if (this.transitions.find(transition => 
      transition.object === obj &&
      arrayIntersections(Object.keys(transition.from), Object.keys(fromParams)).length > 0
    )) {
      this.hurry(obj);
    }

    let t: Transition = {
      object: obj,
      duration: duration,
      timeElapsed: 0,
      from: fromParams,
      to: toParams,
      fun: easingFunction
    };
    Tween.transitions.push(t);

    return new Promise(resolve => {
        t.whenDone = resolve;
    });
  }

  public static hurry(obj: any) {
    const t = Tween.transitions.find(transition => transition.object === obj);
    if (!t) return; 

    Object.keys(t.to).forEach(key => {
      const b: number = t.to[key];
      let obj: Record<string, number> = Tween.lowestLevel(t.object, key);
      const prop = key.split(".").pop()!;
      obj[prop] = b;
    })

    this.transitions.splice(this.transitions.indexOf(t), 1);
    t.whenDone && t.whenDone();
  }

  public static pause() {
    Tween.ticker.remove(Tween.update);
  }

  public static resume() {
    this.lastTick = performance.now();
    Tween.ticker.add(Tween.update);
  }

  private static update(): void {
    const now = performance.now();
    const dt = (now - Tween.lastTick);
    Tween.lastTick = now;

    Tween.transitions.forEach((t) => {
      t.timeElapsed += dt;
      Object.keys(t.from).forEach(key => {
        const a: number = t.from[key];
        const b: number = t.to[key];
        const x = t.timeElapsed / t.duration;
        let obj: Record<string, number> = Tween.lowestLevel(t.object, key);
        const prop = key.split(".").pop()!;
        switch(t.fun) {
          case TweenType.LINEAR:
            obj[prop] = lerp(x, a, b);
            break;
          case TweenType.CUBIC_IN:
            obj[prop] = lerp(x*x*x, a, b);
            break;
          case TweenType.CUBIC_OUT:
            obj[prop] = lerp(x*x*x-3*x*x+3*x, a, b);
            break; 
          case TweenType.CIRCULAR_IN:
            obj[prop] = lerp(1-Math.sqrt(1-x*x), a, b);
            break;
          case TweenType.CIRCULAR_OUT:
            obj[prop] = lerp(Math.sqrt(x*(2-x)), a, b);
            break;   
          case TweenType.BEZIER_IN_OUT:
            obj[prop] = lerp(x*x*(3-2*x), a, b);
            break;
        }

        if(t.timeElapsed > t.duration)
          obj[prop] = b;
      })
      
      if(t.timeElapsed > t.duration)
      {
        Tween.transitions.splice(Tween.transitions.indexOf(t), 1);
        if(t.whenDone) t.whenDone();
      }
    })
  }
}