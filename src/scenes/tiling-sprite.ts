import {
  Assets,
  Application,
  Container,
  Sprite,
  Texture,
  TilingSprite,
} from "pixi.js";

async function setup() {
  // Create a PixiJS application.
  const app = new Application();

  // Intialize the application.
  await app.init({ background: "#000", resizeTo: window });

  // Then adding the application's canvas to the DOM body.
  document.body.appendChild(app.canvas);

  // Load the assets.
  await Assets.load([
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

function setupScene(app: Application) {
  const { width, height } = app.screen;
  console.log({ width, height });

  // Create a main view that holds all layers.
  const view = new Container();

  // Create the stationary sky that fills the entire screen.
  const sky = Sprite.from("sky");
  sky.label = "sky";
  sky.width = width;
  sky.height = height;

  // Create textures for the background, mid-ground, and platform.
  const backgroundTexture = Texture.from("background");
  const midgroundTexture = Texture.from("midground");
  const platformTexture = Texture.from("platform");

  const scale = calculateScale(app);
  // const platformHeight = platformTexture.height;
  // const floorHeight = scale * platformHeight * 0.43;

  const baseOptions = {
    width,
    tileScale: { x: scale, y: scale },
  };

  // Create the tiling sprite layers.
  const background = new TilingSprite({
    label: "background",
    texture: backgroundTexture,
    height: backgroundTexture.height * scale,
    ...baseOptions,
  });
  const midground = new TilingSprite({
    label: "midground",
    texture: midgroundTexture,
    height: midgroundTexture.height * scale,
    ...baseOptions,
  });
  const platform = new TilingSprite({
    label: "platform",
    texture: platformTexture,
    height: platformTexture.height,
    ...baseOptions,
  });

  // view.addChild(sky, background, platform);
  view.addChild(sky, background, midground, platform);

  resizeScene(app, view);
  console.log(view);

  app.ticker.add((ticker) => {
    const value = ticker.lastTime * 0.1;
    background.tilePosition.x = value * 0.1;
    midground.tilePosition.x = value * 0.25;
    platform.tilePosition.x = value;
  });

  window.onresize = () => {
    // resizeScene(app, sky, platform);
    setTimeout(() => resizeScene(app, view), 50);
  };

  return view;
}

function calculateScale(app: Application): number {
  const { height } = app.screen;
  const platformHeight = Texture.from("platform").height;
  return Math.min(platformHeight, height * 0.4) / platformHeight;
}

function resizeScene(app: Application, view: Container) {
  const { width, height } = app.screen;
  const sky = view.getChildByName("sky") as Sprite;
  const background = view.getChildByName("background") as TilingSprite;
  const midground = view.getChildByName("midground") as TilingSprite;
  const platform = view.getChildByName("platform") as TilingSprite;
  const scale = calculateScale(app);
  // const floorHeight = scale * platformHeight * 0.43;

  sky.width = width;
  sky.height = height;

  background.width = width;
  background.tileScale.set(scale, scale);
  background.height = background.texture.height * scale;
  background.y = height - background.height;

  midground.width = width;
  midground.tileScale.set(scale, scale);
  midground.height = midground.texture.height * scale;
  midground.y = height - midground.height;

  platform.width = width;
  platform.tileScale.set(scale, scale);
  platform.y = height - platform.height * scale;
}

export default async function initScene() {
  const app = await setup();
  const scene = setupScene(app);
  app.stage.addChild(scene);

  return () => {
    app.destroy(true, { children: true });
  };
}
