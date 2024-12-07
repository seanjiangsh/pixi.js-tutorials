import { Application, Assets, Sprite } from "pixi.js";

async function makeLoadScreen(app: Application) {
  // Get the assets from the load screen bundle.
  // If the bundle was already downloaded the promise resolves instantly!
  const loadScreenAssets = await Assets.loadBundle("load-screen");

  // Create a new Sprite from the resolved loaded texture
  const flowerTop = new Sprite(loadScreenAssets.flowerTop);

  flowerTop.anchor.set(0.5);
  flowerTop.x = app.screen.width / 2;
  flowerTop.y = app.screen.height / 2;
  app.stage.addChild(flowerTop);

  flowerTop.eventMode = "static";
  flowerTop.cursor = "pointer";

  flowerTop.on("pointertap", async () => {
    flowerTop.destroy();
    makeGameScreen(app);
  });
}

async function makeGameScreen(app: Application) {
  // Wait here until you get the assets
  // If the user spends enough time in the load screen by the time they reach the game screen
  // the assets are completely loaded and the promise resolves instantly!
  const loadScreenAssets = await Assets.loadBundle("game-screen");

  // Create a new Sprite from the resolved loaded texture
  const eggHead = new Sprite(loadScreenAssets.eggHead);

  eggHead.anchor.set(0.5);
  eggHead.x = app.screen.width / 2;
  eggHead.y = app.screen.height / 2;
  app.stage.addChild(eggHead);

  eggHead.eventMode = "static";
  eggHead.cursor = "pointer";

  eggHead.on("pointertap", async () => {
    eggHead.destroy();
    // The user can go back and the files are already downloaded
    makeLoadScreen(app);
  });
}

export default async function initScene() {
  // Initialize the application
  const app = new Application();
  await app.init({ background: "#575656", resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // Manifest example
  const manifestExample = {
    bundles: [
      {
        name: "load-screen",
        assets: [
          {
            alias: "flowerTop",
            src: "https://pixijs.com/assets/flowerTop.png",
          },
        ],
      },
      {
        name: "game-screen",
        assets: [
          {
            alias: "eggHead",
            src: "https://pixijs.com/assets/eggHead.png",
          },
        ],
      },
    ],
  };

  await Assets.init({ manifest: manifestExample });

  // Bundles can be loaded in the background too!
  Assets.backgroundLoadBundle(["load-screen", "game-screen"]);

  makeLoadScreen(app);

  return () => {
    // Unload all assets
    Object.keys(Assets.cache).forEach((key) => {
      Assets.unload(key);
    });

    // remove the canvas from the DOM
    document.body.removeChild(app.canvas);
    app.destroy(true, { children: true });
  };
}
