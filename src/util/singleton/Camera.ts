

// Singleton

import { Container } from "pixi.js";
// import Tween, { TweenType } from "../static/Tween";
// import Box from "../math/Box";
// import { DisplayObject } from "../static/Layout";


export enum CameraTransitionType {
  INSTANT
}


// TODO implement class Camera

export default class Camera extends Container {
  private static instance: Camera;
  
  // private viewBox: Box = new Box();
  // private zoom: number = 1;

  constructor () {
    super();

    if (Camera.instance) throw new Error ("Attempt to break singleton in class Camera");
  }

  public static getInstance(): Camera {
    if (Camera.instance) return Camera.instance;
    else return new Camera();
  }

  // public lookAt(obj: DisplayObject, transitionType: CameraTransitionType | TweenType) {
    
  //   if (transitionType == CameraTransitionType.INSTANT) {

  //   } else {
  //   }
  // }
}