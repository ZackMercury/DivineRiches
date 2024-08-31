import { Container, Ticker, Text, Texture, Sprite } from "pixi.js";
import Layout, { Side } from "../util/static/Layout";
import SimpleButton, { SimpleButtonEvent } from "../gui/buttons/SimpleButton";
import Reel from "../game/reel/Reel";
import createReelByType, { ReelType } from "../game/reel/createReelByType";
import Settings from "../util/static/Settings";
import reelConfig from "../constants/reelConfig.json";
import { Sound } from "@pixi/sound";
import TextWorks from "../factory/TextWorks";
import checkWin from "../util/static/checkWin";
import WinAnimation from "../game/effects/WinAnimation";
import Toggle, { ToggleEvent } from "../gui/buttons/Toggle";
import IconButton, { IconButtonEvent } from "../gui/buttons/IconButton";
import WarningModal from "../gui/modals/WarningModal";
import Counter from "../gui/Counter";
import Tween, { TweenType } from "../util/static/Tween";
import System from "../util/static/System";

const runs = [
  [10, 5, 6],
  [2, 5, 8],
  [0, 2, 3],
]

export default class GameScreen extends Container {
  private static readonly NUM_REELS: number = 3;

  private btnSpin: SimpleButton = new SimpleButton("SPIN", "#ffcc22");
  private reels: Reel[];
  private spinCount: number = 0;
  private reelContainer: Container;

  private runsText: Text = new Text({
    text: `Free spins: ${3 - this.spinCount}`,
    style: TextWorks.getNormalStyle("#ffffff", 12)
  });

  private foreground: Sprite = new Sprite(Texture.from("./frame.png"));

  private soundtrack = Sound.from("./bg.mp3");
  private winSound = Sound.from("./win.mp3");

  private warningModal: WarningModal = new WarningModal();

  private coinCounter: Counter;
  private particles: Sprite[] = [];

  constructor (
    private readonly ticker: Ticker,
  ) {
    super();

    const reelType = Settings.get("reelStyle") as ReelType;

    this.reels = new Array(GameScreen.NUM_REELS)
      .fill(0)
      .map((_, i) => createReelByType(reelType, this.ticker, reelConfig.reels[i]))

    Layout.gridCols(this.reels, GameScreen.NUM_REELS, 20);
    const container = new Container();
    this.reels.forEach(reel => container.addChild(reel));
    this.addChild(container);
    Layout.tlCenter(container);
    this.reelContainer = container;

    this.btnSpin.addEventListener(SimpleButtonEvent.CLICK, this.spin.bind(this));
    this.addChild(this.btnSpin);
    Layout.tlCenterX(this.btnSpin);
    Layout.tlOffset(this.btnSpin, Side.BOTTOM, 20);

    this.addChild(this.runsText);
    Layout.tlOffset(this.runsText, Side.LEFT, 10);
    Layout.tlOffset(this.runsText, Side.TOP, 10);
    
    this.addChild(this.foreground);
    this.foreground.scale.set(0.707);
    Layout.tlCenter(this.foreground);

    this.soundtrack.preload = true;
    this.soundtrack.volume = Number(Settings.get("music"));

    this.soundtrack.play({
      start: 1,
      loop: true,
    });

    const buttonContainer = new Container();
    
    const musicBtn = new Toggle(Texture.from("./music.png"), Settings.get("music") as boolean);
    musicBtn.addEventListener(ToggleEvent.TOGGLE, (value) => Settings.set("music", value.toString()));

    const soundBtn = new Toggle(Texture.from("./sound.png"), Settings.get("sound") as boolean);
    soundBtn.addEventListener(ToggleEvent.TOGGLE, (value) => Settings.set("sound", value.toString()));

    const warningBtn = new IconButton(Texture.from("./warning.png"));
    warningBtn.on(IconButtonEvent.CLICK, this.openWarningModal.bind(this));

    buttonContainer.addChild(musicBtn);
    buttonContainer.addChild(soundBtn);
    buttonContainer.addChild(warningBtn);

    Layout.gridCols([musicBtn, soundBtn, warningBtn], 3, 10);
    
    this.addChild(buttonContainer);
    Layout.tlOffset(buttonContainer, Side.BOTTOM, 10);
    Layout.tlOffset(buttonContainer, Side.RIGHT, 10);

    const coinCounter = new Counter(Texture.from("./coin.png"), 10);
    this.addChild(coinCounter);
    Layout.tlOffset(coinCounter, Side.TOP, 10);
    Layout.tlOffset(coinCounter, Side.RIGHT, 50);
    this.coinCounter = coinCounter;

    Settings.addListener("music", this.onChangeMusicVolume.bind(this));
    Settings.addListener("sound", this.onChangeSoundVolume.bind(this));
    this.warningModal.addEventListener("close", this.closeWarningModal.bind(this))
  }

  private async openWarningModal() {
    this.addChild(this.warningModal);
  }

  private closeWarningModal() {
    this.removeChild(this.warningModal);
  }

  private onChangeSoundVolume(value: any) {
    this.winSound.volume = Number(value);
  }

  private onChangeMusicVolume(value: any) {
    this.soundtrack.volume = Number(value);
  }

  private async spin() {
    this.btnSpin.disabled = true;

    this.runsText.text = `Free spins: ${2 - this.spinCount}`;
    

    await Promise.all(
      this.reels.map(async reel => await reel.start())
    );

    // Let the reels spin for 2 seconds before we start stopping them
    await System.sleep(2000);

    const run = runs[this.spinCount];
    for (const reelIndex in this.reels) {
      await this.reels[reelIndex].stop(run[reelIndex]);
    }

    this.spinCount ++;
    this.btnSpin.disabled = this.spinCount === 3;

    if (checkWin(run) > -1) {
      this.winSound.play();

      const row = checkWin(run);

      const winAnimContainer = new Container();
      const winAnims = new Array(GameScreen.NUM_REELS)
        .fill(0)
        .map(_ => {
          const anim = new WinAnimation();
          winAnimContainer.addChild(anim);
          return anim;
        });

      this.addChild(winAnimContainer);
      Layout.gridCols(winAnims, GameScreen.NUM_REELS, -15);
      
      Layout.tlCenterX(winAnimContainer);
      
      winAnimContainer.y = this.reelContainer.y + row * (Reel.ITEM_SIZE + Reel.MARGIN) - 25;

      const promises: Promise<void>[] = [];

      winAnims.forEach(winAnim => {
        const origin = {
          x: winAnimContainer.x + winAnim.x + winAnim.width / 2,
          y: winAnimContainer.y + winAnim.y + winAnim.height / 2
        };

        const particle = new Sprite(Texture.from("./coin.png"));
        particle.width = particle.height = 24;

        this.addChild(particle);
        this.particles.push(particle);
        promises.push(Tween.ease(
          particle,
          { "position.x": origin.x, "position.y": origin.y },
          { "position.x": this.coinCounter.x, "position.y": this.coinCounter.y },
          2000,
          TweenType.BEZIER_IN_OUT
        ));
      })

      await Promise.all(promises);

      this.particles.forEach(p => this.removeChild(p));
      this.particles = [];

      this.coinCounter.add(30);
    }
    
  }
}