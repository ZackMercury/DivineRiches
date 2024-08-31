import { Container } from "pixi.js";

export type Screen = Container | undefined;

export default abstract class Transition {
  constructor (
    protected screenA: Screen,
    protected screenB: Screen,
    protected duration?: number,
  ) {}

  public abstract run(): Promise<void>;
  public abstract hurry(): void;
}