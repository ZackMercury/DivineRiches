export interface ReelSymbolData {
  index: number;
  texture: string;
  position?: number;
}

const reelSymbols: ReelSymbolData[] = [
  {
    index: 0,
    texture: "Low1.png"
  },
  {
    index: 1,
    texture: "Low2.png"
  },
  {
    index: 2,
    texture: "Low3.png"
  },
  {
    index: 3,
    texture: "Low4.png"
  },
  {
    index: 4,
    texture: "High1.png"
  },
  {
    index: 5,
    texture: "High2.png"
  },
  {
    index: 6,
    texture: "High3.png"
  },
  {
    index: 7,
    texture: "High4.png"
  },
  {
    index: 8,
    texture: "Wild.png"
  },
  {
    index: 9,
    texture: "Bonus.png"
  },
  {
    index: 10,
    texture: "Coin.png"
  }
];

export default reelSymbols;