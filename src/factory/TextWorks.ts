import { TextStyle } from "pixi.js";

export default abstract class TextWorks {
  public static readonly OUTLINED: TextStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontWeight: 'bold',
    fill: "#ffffff",
    stroke: {
      color: '#8800ff',
      width: 20,
      join: "round"
    },
    dropShadow: {
      angle: Math.PI / 6,
      color: "#000000",
      blur: 5,
      distance: 2
    },
    wordWrap: true,
    wordWrapWidth: 440,
  })

  public static readonly NORMAL: TextStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontWeight: 'bold',
    fill: "#ffffff",
    dropShadow: {
      angle: Math.PI / 6,
      color: "#000000",
      blur: 5,
      distance: 2
    },
    wordWrap: true,
    wordWrapWidth: 440,
  })

  public static getOutlinedStyle(color: string, fontSize: number = 36, outline: number = 15): TextStyle {
    const newStyle = this.OUTLINED.clone();
    newStyle.stroke = {
      color,
      width: outline,
      join: "round"
    }
    newStyle.fontSize = fontSize;

    return newStyle;
  }

  public static getNormalStyle(color: string, fontSize: number = 36): TextStyle {
    const newStyle = this.NORMAL.clone();
    newStyle.fill = color;
    newStyle.fontSize = fontSize;

    return newStyle;
  }
}