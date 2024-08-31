import { HTMLText, HTMLTextStyle } from "pixi.js";
import Modal from "./Modal";


const content = `
<b>Gambling Responsibility Warning</b>

Please Play Responsibly

Gambling can be a fun and entertaining activity, but it's important to remember the risks associated with it. Compulsive or problem gambling can lead to serious financial, emotional, and social consequences. If you find yourself gambling more than you can afford to lose, feeling the need to bet more money to achieve the same level of excitement, or experiencing stress, anxiety, or depression due to gambling, please seek help immediately.

If you or someone you know is struggling with gambling addiction, please reach out to a professional organization for support:

National Problem Gambling Helpline: 1-800-522-4700
Gamblers Anonymous: www.gamblersanonymous.org
BeGambleAware: www.begambleaware.org

<b>Return to Player (RTP) Notice</b>

The Return to Player (RTP) for Divine Riches is 97%.

This means that, on average, for every $100 wagered, the game is designed to return $97 over the long run. Please note that this is an average figure based on extended play and individual outcomes may vary significantly in the short term.
`;

export default class WarningModal extends Modal {
  public static readonly MARGIN: number = 20;
  // private text: HTMLText;

  constructor() {
    super();

    const style = new HTMLTextStyle({
      wordWrap: true,
      wordWrapWidth: this.window.width - 2 * WarningModal.MARGIN,
      fontSize: 16,
    })

    const text = new HTMLText({
      text: content,
      style      
    });
    text.x = WarningModal.MARGIN;

    // this.text = text;

    this.contentContainer.addChild(text);
  }
}