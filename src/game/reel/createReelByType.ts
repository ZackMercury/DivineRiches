import { Ticker } from "pixi.js";
import Reel, { SymbolID } from "./Reel";
import ReelScroll from "./ReelScroll";

export enum ReelType {
  SCROLL
}

const createReelByType = (type: ReelType, ticker: Ticker, config: SymbolID[]): Reel => {
  switch (type) {
    case ReelType.SCROLL: 
      return new ReelScroll(ticker, config);
  }
}

export default createReelByType;