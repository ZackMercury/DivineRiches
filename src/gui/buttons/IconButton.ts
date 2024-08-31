import { Sprite, Texture } from "pixi.js";
import Color from "../../util/static/Color";

export enum IconButtonEvent {
  CLICK = "clicked"
}

export default class IconButton extends Sprite {

  constructor(texture: Texture) {
    super(texture);

    this.eventMode = "static";
    this.cursor = "pointer";

    this.tint = Color.hsvToHex(0, 0, 0.9);

    this.addEventListener("added", this.onAdded.bind(this));
    this.addEventListener("removed", this.onRemoved.bind(this));
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
    this.tint = Color.hsvToHex(0, 0, 1)
  }

  private onMouseOut () {
    this.tint = Color.hsvToHex(0, 0, 0.9)
  }

  private onMouseDown () {
    this.tint = Color.hsvToHex(0, 0, 0.8);
  }

  private onMouseUp () {
    this.tint = Color.hsvToHex(0, 0, 1);
    this.emit(IconButtonEvent.CLICK);
  }
}