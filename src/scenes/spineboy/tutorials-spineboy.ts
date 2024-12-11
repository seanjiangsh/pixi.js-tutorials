import { Assets, Application } from "pixi.js";

import SpineBoy from "./Spineboy";
import InputController from "./Input-controller";
import { Scene } from "./Scene";

async function setup() {
  // Create a PixiJS application.
  const app = new Application();

  // Intialize the application.
  await app.init({ background: "#1099bb", resizeTo: window });

  // Then adding the application's canvas to the DOM body.
  document.body.appendChild(app.canvas);

  // Load the assets.
  await Assets.load([
    {
      alias: "spineSkeleton",
      src: "https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pro.skel",
    },
    {
      alias: "spineAtlas",
      src: "https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pma.atlas",
    },
    {
      alias: "sky",
      src: "https://pixijs.com/assets/tutorials/spineboy-adventure/sky.png",
    },
    {
      alias: "background",
      src: "https://pixijs.com/assets/tutorials/spineboy-adventure/background.png",
    },
    {
      alias: "midground",
      src: "https://pixijs.com/assets/tutorials/spineboy-adventure/midground.png",
    },
    {
      alias: "platform",
      src: "https://pixijs.com/assets/tutorials/spineboy-adventure/platform.png",
    },
  ]);
  return app;
}

export default async function initScene() {
  const app = await setup();
  const inputController = new InputController();
  const spineBoy = new SpineBoy(app, inputController);
  const scene = new Scene(app, spineBoy);

  // Adjust views' transformation.
  scene.view.y = app.screen.height;
  spineBoy.view.x = app.screen.width / 2;
  spineBoy.view.y = app.screen.height - scene.floorHeight;
  spineBoy.spine.scale.set(scene.scale * 0.32);

  // Add character and scene to the stage.
  app.stage.addChild(scene.view, spineBoy.view);

  // Trigger character's spawn animation.
  spineBoy.spawn();

  return () => {
    inputController.dispose();
    document.body.removeChild(app.canvas);
    app.destroy(true, { children: true });
  };
}
