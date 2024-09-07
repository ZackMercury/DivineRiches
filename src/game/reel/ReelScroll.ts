import { Container, Graphics, Sprite, Texture, Ticker, BlurFilter } from "pixi.js";
import Reel, { SymbolID } from "./Reel";
import SymbolItem from "./SymbolItem";
import reelSymbols from "../../constants/reelSymbols";
import Tween, { TweenType } from "../../util/static/Tween";
import { Sound } from "@pixi/sound";
import Settings from "../../util/static/Settings";
// import System from "../../util/static/System";


enum ReelState {
  IDLE,
  STARTING,
  SPINNING,
  STOPPING,
}

export default class ReelScroll extends Reel {

  private static readonly MAX_SPEED: number = 5000;

  private _state: ReelState;
  private items: SymbolItem[];
  private background: Graphics = new Graphics();
  // private _mask: Graphics;
  private lighting: Sprite = new Sprite({
    texture: Texture.from("./reelmask.png"),
    blendMode: "multiply"
  });
  // private itemContainer: Container;
  private blurFilter: BlurFilter = new BlurFilter();
  private offset: number = 0;
  private lastOffset: number = 0;
  private reelLength: number;
  private speed: number = 0;

  private static runSound: Sound = Sound.from("./sm_run.wav");
  private static startSound: Sound = Sound.from("./sm_start.wav");
  private static stopSound: Sound = Sound.from('./sm_stop.wav');

  constructor (ticker: Ticker, config: SymbolID[]) {
    super(ticker, config);

    this._state = ReelState.IDLE;

    const container = new Container();
    // this.itemContainer = container;

    const items = config
      .map(id => reelSymbols.find(sym => sym.index === id)!)
      .map((symbol, i) => new SymbolItem(symbol, i));

    items.forEach(item => {
      const ar = item.width / item.height;
      item.height = Reel.ITEM_SIZE;
      item.width = Reel.ITEM_SIZE * ar;
      item.y = item.reelPosition * (Reel.ITEM_SIZE + Reel.MARGIN);

      container.addChild(item);
    });

    this.reelLength = (Reel.ITEM_SIZE + Reel.MARGIN) * items.length;

    this.background
      .rect(0, 0, items[0].width, Reel.HEIGHT)
      .fill('#ffffcc');

    const mask = this.background.clone();
    // this._mask = mask;
    container.mask = mask;

    this.addChild(this.background);
    this.addChild(container);
    this.addChild(mask);
    this.lighting.width = this.width;
    this.lighting.height = this.height;
  
    this.addChild(this.lighting);
    this.items = items;

    this.blurFilter.quality = 2;
    this.blurFilter.strength = 0;

    // if (!System.checkMobile()) {
      container.filters = [this.blurFilter];
    // }

    ticker.add(this.update.bind(this));

    ReelScroll.runSound.preload = true;
    ReelScroll.startSound.preload = true;
    ReelScroll.stopSound.preload = true;

    ReelScroll.runSound.volume = Number(Settings.get("sound"));
    ReelScroll.startSound.volume = Number(Settings.get("sound"));
    ReelScroll.stopSound.volume = Number(Settings.get("sound"));


    Settings.addListener("sound", this.onSoundVolumeChange.bind(this));
  }

  private onSoundVolumeChange(value: any) {
    ReelScroll.runSound.volume = Number(value);
    ReelScroll.startSound.volume = Number(value);
    ReelScroll.stopSound.volume = Number(value);
  }

  private update(ticker: Ticker) {

    const items = this.items;

    for(let i = 0; i < items.length; i ++) {
      items[i].y = ( 
        i * (Reel.ITEM_SIZE + Reel.MARGIN)
        + this.offset
        + (Reel.ITEM_SIZE + Reel.MARGIN)
      ) % this.reelLength - (Reel.ITEM_SIZE + Reel.MARGIN);
    }

    if (this._state != ReelState.STOPPING) {
      this.lastOffset = this.offset;
      this.offset += this.speed * (ticker.deltaMS / 1000);
    }


    const speed = Math.abs(this.offset - this.lastOffset) / ticker.deltaMS;

    this.blurFilter.strengthY = speed * 10;

    this.lastOffset = this.offset;
  }

  private set state(state: ReelState) {
    this._state = state;
    console.log(Object.values(ReelState)[state]);
  }

  public async start (): Promise<void> {
    this.state = ReelState.STARTING;
    ReelScroll.startSound.play();
    await Tween.ease(
      this, 
      { speed: 0 },
      { speed: ReelScroll.MAX_SPEED },
      500,
      TweenType.LINEAR
    );
    this.state = ReelState.SPINNING;

    ReelScroll.runSound.play({ loop: true });
  }

  public async stop(index: number): Promise<void> {
    ReelScroll.runSound.stop();
    this.state = ReelState.STOPPING;
    this.offset  %= this.reelLength;
    this.speed = 0;

    ReelScroll.stopSound.play({ speed: 1.2 });

    await Tween.ease(
      this,
      { offset: this.offset },
      { offset: 
        this.reelLength * 7 -
        index * (Reel.ITEM_SIZE + Reel.MARGIN) 
      },
      6000,
      TweenType.CUBIC_OUT
    );

    this.state = ReelState.IDLE;
  }
}