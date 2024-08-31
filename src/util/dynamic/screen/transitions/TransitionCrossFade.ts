import Tween, { TweenType } from "../../../static/Tween";
import Transition from "./Transition";


export default class TransitionCrossFade extends Transition {
  public async run(): Promise<void> {
    const promises: Promise<void>[] = [];
    if (this.screenA) {
      promises.push(
        Tween.ease(
          this.screenA,
          { "alpha": 1 },
          { "alpha": 0 },
          this.duration || 0,
          TweenType.LINEAR
        )
      );
    }

    if (this.screenB) {
      promises.push(
        Tween.ease(
          this.screenB,
          { "alpha": 0 },
          { "alpha": 1 },
          this.duration || 0,
          TweenType.LINEAR
        )
      );
    }

    await Promise.all(promises);
  }

  public hurry(): void {
    this.screenA && Tween.hurry(this.screenA);
    this.screenB && Tween.hurry(this.screenB);
  }
}