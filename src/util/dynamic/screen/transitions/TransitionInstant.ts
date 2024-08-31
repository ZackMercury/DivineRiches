import Transition from "./Transition";


export default class TransitionInstant extends Transition {
  public async run(): Promise<void> {
    if (this.screenA) this.screenA.alpha = 0;
    if (this.screenB) this.screenB.alpha = 1;
  }

  public hurry(): void {}
}