
import { APPLICATION_HEIGHT, APPLICATION_WIDTH } from "../../constants/application";

export interface DisplayObject {
  x: number;
  y: number;
  width: number;
  height: number;
  parent: DisplayObject;
}

export enum Side {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT
}

export default abstract class Layout {
  /** centers horizontally based on the origin in top left corner */
  public static tlCenterX(sbj: DisplayObject) {
    sbj.x = APPLICATION_WIDTH / 2 - sbj.width / 2;
  }

  /** centers vertically based on the origin in top left corner */
  public static tlCenterY(sbj: DisplayObject) {
    sbj.y = APPLICATION_HEIGHT / 2 - sbj.height / 2;
  }

  /** centers based on the origin in top left corner */
  public static tlCenter(sbj: DisplayObject) {
    sbj.x = (APPLICATION_WIDTH - sbj.width) / 2;
    sbj.y = (APPLICATION_HEIGHT - sbj.height) / 2;
  }

  public static centerX(sbj: DisplayObject) {
    sbj.x = APPLICATION_WIDTH / 2;
  }

  public static centerY(sbj: DisplayObject) {
    sbj.y = APPLICATION_HEIGHT / 2;
  }

  public static center(sbj: DisplayObject) {
    sbj.x = APPLICATION_WIDTH / 2;
    sbj.y = APPLICATION_HEIGHT / 2;
  }

  public static tl(sbj: DisplayObject) {
    sbj.x = sbj.y = 0;
  }

  public static tlOffset(sbj: DisplayObject, side: Side, offset: number = 0) {
    switch (side) {
      case Side.TOP: 
        sbj.y = offset;
        break;
      case Side.BOTTOM:
        sbj.y = APPLICATION_HEIGHT - sbj.height - offset;
        break;
      case Side.LEFT:
        sbj.x = offset;
        break;
      case Side.RIGHT: 
        sbj.x = APPLICATION_WIDTH - sbj.width - offset;
        break;
    }
  }

  public static offset(sbj: DisplayObject, side: Side, offset: number = 0) {
    switch (side) {
      case Side.TOP: 
        sbj.y = offset + sbj.height / 2;
        break;
      case Side.BOTTOM:
        sbj.y = APPLICATION_HEIGHT - sbj.height / 2 - offset;
        break;
      case Side.LEFT:
        sbj.x = offset + sbj.width / 2;
        break;
      case Side.RIGHT: 
        sbj.x = APPLICATION_WIDTH - sbj.width / 2 - offset;
        break;
    }
  }

  public static parentCenter(sbj: DisplayObject) {
    sbj.x = (sbj.parent.width - sbj.width) / 2;
    sbj.y = (sbj.parent.height - sbj.height) / 2;
  }

  public static parentCenterX(sbj: DisplayObject) {
    sbj.x = (sbj.parent.width - sbj.width) / 2;
  }

  public static parentCenterY(sbj: DisplayObject) {
    sbj.y = (sbj.parent.height - sbj.height) / 2;
  }

  public static fitX(sbj: DisplayObject) {
    const ratio = sbj.height / sbj.width;
    sbj.width = APPLICATION_WIDTH;
    sbj.height = ratio * APPLICATION_WIDTH;
  }

  public static gridCols(sbjs: DisplayObject[], cols: number, gap: number = 0) {
    let rowX = 0;

    for (let i = 0; i < sbjs.length; i ++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      sbjs[i].x = rowX;
      sbjs[i].y = row * sbjs[0].height;
      rowX += sbjs[i].width + gap;

      if (col === cols - 1) rowX = 0;
    }
  }
}