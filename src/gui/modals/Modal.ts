import { Container, Graphics } from "pixi.js";
import { APPLICATION_HEIGHT, APPLICATION_WIDTH } from "../../constants/application";
import Layout from "../../util/static/Layout";


export default class Modal extends Container {
  protected background: Graphics = new Graphics();
  protected foreground: Container = new Container();
  protected callbackClose: () => void = () => null;
  protected contentContainer = new Container();
  protected window: Graphics;

  constructor() {
    super();

    this.background
      .rect(0, 0, APPLICATION_WIDTH, APPLICATION_HEIGHT)
      .fill({
        color: '#000000',
        alpha: 0.3
      });

    this.background.interactive = true;
    this.background.addEventListener("tap", this.onBackgroundClick.bind(this));
    this.background.addEventListener("click", this.onBackgroundClick.bind(this));


    this.addChild(this.background);

    this.window = new Graphics()
      .roundRect(0, 0, APPLICATION_WIDTH * 0.7, APPLICATION_HEIGHT * 0.7, 10)
      .fill(0xffffff);

    Layout.tlCenter(this.window);
    
    
    this.contentContainer.position = this.window.position;

    
    this.foreground.addChild(this.window);
    this.addChild(this.foreground);
    this.addChild(this.contentContainer);
  }

  protected onBackgroundClick() {
    this.emit("close");
    this.callbackClose && this.callbackClose();
  }

  public awaitClose(): Promise<void> {
    return new Promise(resolve => {
      this.callbackClose = resolve;
    });
  }
}