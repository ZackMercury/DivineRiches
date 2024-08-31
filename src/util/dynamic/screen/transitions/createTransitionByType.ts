import Transition from "./Transition";
import TransitionCrossFade from "./TransitionCrossFade";
import TransitionInstant from "./TransitionInstant";
import TransitionZoomFade from "./TransitionZoomFade";
import { Screen } from "./Transition";

export enum TransitionType {
  ZOOM_FADE, CROSS_FADE, INSTANT
}

const createTransitionByType = (type: TransitionType, screenA: Screen, screenB: Screen, duration: number): Transition => {
  switch (type) {
    case TransitionType.INSTANT: 
      return new TransitionInstant(screenA, screenB);
    case TransitionType.ZOOM_FADE: 
      return new TransitionZoomFade(screenA, screenB, duration);
    case TransitionType.CROSS_FADE:
      return new TransitionCrossFade(screenA, screenB, duration);
  }
}

export default createTransitionByType;