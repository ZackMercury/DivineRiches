import { Sprite, Texture } from "pixi.js";
import { ReelSymbolData } from "../../constants/reelSymbols";

export default class SymbolItem extends Sprite {
  public readonly reelPosition: number;

  constructor (protected symbol: ReelSymbolData, reelPosition: number) {
    super(Texture.from(symbol.texture));

    this.reelPosition = reelPosition;
  }
}