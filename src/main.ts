import { Application, Assets } from 'pixi.js';
import './style.scss';
import LoadingScreen from './screens/LoadingScreen';
import { APPLICATION_HEIGHT, APPLICATION_WIDTH } from './constants/application';
import assets from './constants/assets.json';
import GameScreen from './screens/GameScreen';
import ScreenManager from './util/dynamic/screen/ScreenManager';
import { TransitionType } from './util/dynamic/screen/transitions/createTransitionByType';
import Tween from './util/static/Tween';
import Settings from './util/static/Settings';
import defaultSettings from './constants/defaultSettings';
import System from './util/static/System';
import FPSCounter from './util/singleton/FPSCounter';
import Layout, { Side } from './util/static/Layout';

(async () => {
  Settings.init(defaultSettings);
  
  // App init
  const application = new Application();

  await application.init({
    width: APPLICATION_WIDTH,
    height: APPLICATION_HEIGHT,
    antialias: true,
    powerPreference: "low-power",
    background: "#071115",
    renderableGCActive: false,
  });

  await Assets.load(assets.loading);

  const app = document.getElementById("app")!;
  app.appendChild(application.canvas);

  const fpsCounter = FPSCounter.getInstance(application.ticker);
  fpsCounter.zIndex = 500;
  Layout.offset(fpsCounter, Side.BOTTOM, 15);
  Layout.offset(fpsCounter, Side.LEFT, 20);
  application.stage.addChild(fpsCounter);

  // Initialize the Tween util
  Tween.init(application.ticker);

  const screenManager = new ScreenManager(application.stage);

  // Loading screen, shown before the game screen
  const screenLoading = new LoadingScreen(application.ticker);

  screenManager.switch(
    screenLoading,
    1000,
    TransitionType.CROSS_FADE
  );

  await Assets.load(assets.game, (progress: number) => {
    screenLoading.progress = progress;
  });

  // TODO remove in prod
  // Showcase the loading screen for demo purposes
  await System.sleep(2000);

  // The loading is now complete, remove the loading screen and add the game screen
  // if the first transition still isn't over, we can hurry it like this
  await screenManager.hurry();

  await screenManager.switch(
    new GameScreen(application.ticker),
    1000,
    TransitionType.ZOOM_FADE
  );
})();



