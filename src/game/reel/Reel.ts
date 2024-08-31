import { Container, Ticker } from "pixi.js";

export type SymbolID = number;

export default abstract class Reel extends Container {
  public static readonly ITEM_SIZE: number = 150;
  public static readonly MARGIN: number = 10;
  protected static readonly HEIGHT: number = (Reel.ITEM_SIZE + Reel.MARGIN) * 3 - Reel.MARGIN;

  constructor (
    protected ticker: Ticker,
    protected config: SymbolID[]
  ) {
    super();
  }

  public abstract start(): Promise<void>;
  public abstract stop(index: number): Promise<void>;
}