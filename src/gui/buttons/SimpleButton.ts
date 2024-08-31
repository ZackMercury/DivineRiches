import { Container, Graphics, Text } from "pixi.js";
import TextWorks from "../../factory/TextWorks";
import Layout from "../../util/static/Layout";
import Color from "../../util/static/Color";


export enum SimpleButtonEvent {
  CLICK = "clicked"
}

export default class SimpleButton extends Container {
  private readonly MIN_WIDTH: number = 300;
  private readonly MIN_HEIGHT: number = 50;

  private readonly STATE_NORMAL: Graphics = new Graphics();
  private readonly STATE_OVER: Graphics = new Graphics();
  private readonly STATE_PRESSED: Graphics = new Graphics();
  private readonly STATE_DISABLED: Graphics = new Graphics();

  private currentState: Graphics = this.STATE_NORMAL;

  private readonly text: Text = new Text({
    text: "",
    style: TextWorks.getNormalStyle('#ffffff', 24)
  });

  constructor (
    private _caption: string,
    private color: string = '#222222',
    private textColor: string = '#ffffff'
  ) {
    super();

    this.text.text = this._caption;

    // draw the states
    this.redrawStates();
    
    this.currentState = this.STATE_NORMAL;
    this.addChild(this.currentState);
    this.addChild(this.text);

    Layout.parentCenter(this.text);

    this.eventMode = "static";
    this.cursor = "pointer";

    this.addEventListener("added", this.onAdded.bind(this));
    this.addEventListener("removed", this.onRemoved.bind(this));
  }

  private redrawStates () {
    this.STATE_NORMAL
      .roundRect(0, 0, Math.max(this.text.width, this.MIN_WIDTH), Math.max(this.text.height, this.MIN_HEIGHT), 5)
      .fill(this.color)

    this.STATE_OVER
      .roundRect(0, 0, Math.max(this.text.width, this.MIN_WIDTH), Math.max(this.text.height, this.MIN_HEIGHT), 5)
      .fill(Color.scale(this.color, 1.15))

    this.STATE_PRESSED
      .roundRect(0, 0, Math.max(this.text.width, this.MIN_WIDTH), Math.max(this.text.height, this.MIN_HEIGHT), 5)
      .fill(Color.scale(this.color, 0.9))

    this.STATE_DISABLED
      .roundRect(0, 0, Math.max(this.text.width, this.MIN_WIDTH), Math.max(this.text.height, this.MIN_HEIGHT), 5)
      .fill(Color.rgbToHex([
        Color.lightness(this.color),
        Color.lightness(this.color),
        Color.lightness(this.color)
      ]));

    this.text.style = TextWorks.getNormalStyle(this.textColor, 24);
  }

  public set disabled (value: boolean) {
    this.removeChild(this.currentState);
    if (value)
      this.currentState = this.STATE_DISABLED;
    else 
      this.currentState = this.STATE_NORMAL;

    this.addChild(this.currentState);
    this.addChild(this.text);
    this.interactive = !value;
  }

  private onAdded() {
    this.addEventListener("mouseover", this.onMouseOver.bind(this));
    this.addEventListener("mouseout", this.onMouseOut.bind(this));
    this.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.addEventListener("pointerup", this.onMouseUp.bind(this));
  }

  private onRemoved () {
    this.removeEventListener("mouseover", this.onMouseOver.bind(this));
    this.removeEventListener("mouseout", this.onMouseOut.bind(this));
    this.removeEventListener("mousedown", this.onMouseDown.bind(this));
    this.removeEventListener("pointerup", this.onMouseUp.bind(this));
  }

  private onMouseOver () {
    this.removeChild(this.currentState);
    this.currentState = this.STATE_OVER;
    this.addChild(this.currentState);
    this.addChild(this.text);
  }

  private onMouseOut () {
    this.removeChild(this.currentState);
    this.currentState = this.STATE_NORMAL;
    this.addChild(this.currentState);
    this.addChild(this.text);
  }

  private onMouseDown () {
    this.removeChild(this.currentState);
    this.currentState = this.STATE_PRESSED;
    this.addChild(this.currentState);
    this.addChild(this.text);
  }

  private onMouseUp () {
    this.removeChild(this.currentState);
    this.currentState = this.STATE_OVER;
    this.addChild(this.currentState);
    this.addChild(this.text);
    
    if (this.currentState !== this.STATE_DISABLED) {
      this.emit(SimpleButtonEvent.CLICK);
    }
  }
}