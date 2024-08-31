import { Ticker, Text, Container, Sprite, Texture } from "pixi.js";
import Layout, { Side } from "../util/static/Layout";
import TextWorks from "../factory/TextWorks";
import ProgressBar from "../gui/ProgressBarLoading";
import { lerp } from "../util/math/perlin";

export default class LoadingScreen extends Container {
  private logo: Sprite;
  private progressBar: ProgressBar;
  private _progress: number = 0;
  private _progressTarget: number = 0;
  private progressText: Text;

  private authorText: Text;

  constructor(
    private ticker: Ticker,
  ) {
    super();

    this.logo = new Sprite(Texture.from("./logo.png"));
    this.logo.anchor.set(0.5);
    Layout.center(this.logo);

    this.progressBar = new ProgressBar(500, 20);
    Layout.tlCenterX(this.progressBar);
    Layout.tlOffset(this.progressBar, Side.BOTTOM, 50);

    this.progressText = new Text({
      text: `${(this._progress * 100).toFixed(0)}%`,
      style: TextWorks.getOutlinedStyle("#ff0000", 30)
    });

    this.progressText.anchor.set(0.5, 0.5);
    Layout.centerX(this.progressText);
    Layout.offset(this.progressText, Side.BOTTOM, 70);

    this.authorText = new Text({
      text: `Created by Zachary Litvinenko as a demo for Barstruck AB`,
      style: TextWorks.getNormalStyle('#ffffff', 12)
    });
    Layout.tlOffset(this.authorText, Side.BOTTOM, 10);
    Layout.tlOffset(this.authorText, Side.LEFT, 10);

    this.addEventListener("added", this.onAdded);
    this.addEventListener("removed", this.onRemoved);
  }

  public set progress (r: number) {
    this._progressTarget = r;
  }

  private onRemoved() {
    this.removeChild(this.logo);
    this.removeChild(this.progressBar);
    this.removeChild(this.progressText);
    this.removeChild(this.authorText);
    this.ticker.remove(this.update.bind(this));
  }

  private onAdded() {
    this.addChild(this.logo);
    this.addChild(this.progressBar);
    this.addChild(this.progressText);
    this.addChild(this.authorText);
    this.ticker.add(this.update.bind(this));
  }

  private update() {
    this._progress = lerp(0.025, this._progress, this._progressTarget);
    this.progressText.text = `${(this._progress * 100).toFixed(0)}%`;
    this.progressBar.progress = this._progress;
  }
}