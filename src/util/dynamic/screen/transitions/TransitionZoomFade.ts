import { APPLICATION_HEIGHT, APPLICATION_WIDTH } from "../../../../constants/application";
import Layout from "../../../static/Layout";
import Tween, { TweenType } from "../../../static/Tween";
import Transition from "./Transition";


export default class TransitionZoomFade extends Transition {
  public async run(): Promise<void> {
    const promises: Promise<void>[] = [];
    if (this.screenA) {
      this.screenA.pivot.set(APPLICATION_WIDTH / 2, APPLICATION_HEIGHT / 2);
      Layout.center(this.screenA);

      promises.push(
        Tween.ease(
          this.screenA,
          { alpha: 1, "scale.x": 1, "scale.y": 1 },
          { alpha: 0, "scale.x": 2, "scale.y": 2 },
          this.duration || 0,
          TweenType.CUBIC_IN
        )
      );
    }

    if (this.screenB) {
      this.screenB.pivot.set(APPLICATION_WIDTH / 2, APPLICATION_HEIGHT / 2);
      Layout.center(this.screenB);

      promises.push(
        Tween.ease(
          this.screenB,
          { alpha: 0 },
          { alpha: 1 },
          this.duration || 0,
          TweenType.CUBIC_IN
        )
      );
    }

    this.screenB?.parent.addChild(this.screenB);
    this.screenA?.parent.addChild(this.screenA);

    await Promise.all(promises);
    this.screenA?.pivot.set(0, 0);
    this.screenB?.pivot.set(0, 0);
    this.screenA && Layout.tl(this.screenA);
    this.screenB && Layout.tl(this.screenB);
  }

  public hurry(): void {
    this.screenA && Tween.hurry(this.screenA);
    this.screenB && Tween.hurry(this.screenB);
  }
}