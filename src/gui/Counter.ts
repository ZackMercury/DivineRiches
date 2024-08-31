import { Container, Texture, Text, Sprite } from "pixi.js";
import TextWorks from "../factory/TextWorks";


export default class Counter extends Container {
  private static readonly MARGIN: number = 8;

  private text: Text = new Text({
    text: "",
    style: TextWorks.getNormalStyle("#ffffff", 24)
  });

  private sprite: Sprite;
  
  constructor(iconTexture: Texture, count: number) {
    super();
    this.sprite = new Sprite(iconTexture);
    this.addChild(this.sprite);
    this.addChild(this.text);
    this.sprite.width = 32;
    this.sprite.height = 32;
    this.text.x = this.sprite.width + Counter.MARGIN;
    this.text.text = count.toString();
  }

  public set count(c: number) {
    this.text.text = c.toString();
  }

  public add (c: number) {
    const num = parseInt(this.text.text);
    this.text.text = (num + c).toString();
  }
}