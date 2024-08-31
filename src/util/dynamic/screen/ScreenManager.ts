import { Container } from "pixi.js";
import Transition from "./transitions/Transition";
import createTransitionByType, { TransitionType } from "./transitions/createTransitionByType";
import System from "../../static/System";

export default class ScreenManager {
  private current?: Container;
  private ongoingTransitions: Transition[] = [];
  
  constructor (private stage: Container) {}

  public async switch(
    screen: Container,
    duration: number = 300,
    transitionType: TransitionType,
  ) {
    if (this.ongoingTransitions.length) this.hurry();

    this.stage.addChild(screen);
    screen.alpha = 0;

    const transition = createTransitionByType(transitionType, this.current, screen, duration);
    this.ongoingTransitions.push(transition);
    await transition.run();
    this.ongoingTransitions.splice(this.ongoingTransitions.indexOf(transition), 1);

    this.current && this.stage.removeChild(this.current);
    this.current = screen;
  }

  public async hurry() {
    this.ongoingTransitions.forEach(transition => transition.hurry());
    if (this.ongoingTransitions.length) await System.sleep(40);
  }
}