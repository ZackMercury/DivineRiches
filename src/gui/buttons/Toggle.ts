import { Sprite, Texture } from "pixi.js";
import Color from "../../util/static/Color";

export enum ToggleEvent {
  TOGGLE = "toggle"
}

export default class Toggle extends Sprite {
  public value;

  constructor(texture: Texture, value: boolean) {
    super(texture);

    this.value = value;
    this.eventMode = "static";
    this.cursor = "pointer";

    this.tint = Color.hsvToHex(0, 0, value ? 0.9 : 0.5);

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
    this.tint = Color.hsvToHex(0, 0, this.value ? 1 : 0.6)
  }

  private onMouseOut () {
    this.tint = Color.hsvToHex(0, 0, this.value ? 0.9 : 0.5)
  }

  private onMouseDown () {
    this.tint = "#dddddd"
  }

  private onMouseUp () {
    this.value = !this.value;
    this.tint = Color.hsvToHex(0, 0, this.value ? 1 : 0.6);
    this.emit(ToggleEvent.TOGGLE, this.value);
  }
}