import {
  Application,
  Assets,
  Container,
  DisplacementFilter,
  Sprite,
  Texture,
  Ticker,
  TilingSprite,
} from "pixi.js";

interface FishSprite extends Sprite {
  direction: number;
  speed: number;
  turnSpeed: number;
}

async function setup() {
  // Create a PixiJS fishpond application.
  const app = new Application();
  await app.init({ resizeTo: window, backgroundColor: 0x1099bb });
  document.body.appendChild(app.canvas);
  return app;
}

async function preload() {
  const assets = [
    {
      alias: "background",
      src: "https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg",
    },
    {
      alias: "fish1",
      src: "https://pixijs.com/assets/tutorials/fish-pond/fish1.png",
    },
    {
      alias: "fish2",
      src: "https://pixijs.com/assets/tutorials/fish-pond/fish2.png",
    },
    {
      alias: "fish3",
      src: "https://pixijs.com/assets/tutorials/fish-pond/fish3.png",
    },
    {
      alias: "fish4",
      src: "https://pixijs.com/assets/tutorials/fish-pond/fish4.png",
    },
    {
      alias: "fish5",
      src: "https://pixijs.com/assets/tutorials/fish-pond/fish5.png",
    },
    {
      alias: "overlay",
      src: "https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png",
    },
    {
      alias: "displacement",
      src: "https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png",
    },
  ];
  await Assets.load(assets);
}

function addBackground(app: Application) {
  const background = Sprite.from("background");
  background.anchor.set(0.5);

  const { width, height } = app.screen;
  if (width > height) {
    background.width = width * 1.2;
    background.scale.y = background.scale.x;
  } else {
    background.height = height * 1.2;
    background.scale.x = background.scale.y;
  }

  background.x = app.screen.width / 2;
  background.y = app.screen.height / 2;
  app.stage.addChild(background);
}

function addFishes(app: Application, fishes: Array<Sprite>) {
  const fishContainer = new Container();
  app.stage.addChild(fishContainer);

  const fishCount = 10;
  const fishAssets = ["fish1", "fish2", "fish3", "fish4", "fish5"];
  for (let i = 0; i < fishCount; i++) {
    // Cycle through the fish assets for each sprite.
    const fishAsset = fishAssets[i % fishAssets.length];

    // Create a fish sprite.
    const fish = Sprite.from(fishAsset) as FishSprite;
    // const fish = Sprite.from(fishAsset);

    // Center the sprite anchor.
    fish.anchor.set(0.5);

    // Assign additional properties for the animation.
    fish.direction = Math.random() * Math.PI * 2;
    fish.speed = 2 + Math.random() * 2;
    fish.turnSpeed = Math.random() - 0.8;

    // Randomly position the fish sprite around the stage.
    fish.x = Math.random() * app.screen.width;
    fish.y = Math.random() * app.screen.height;

    // Randomly scale the fish sprite to create some variety.
    fish.scale.set(0.5 + Math.random() * 0.2);

    // Add the fish sprite to the fish container.
    fishContainer.addChild(fish);

    // Add the fish sprite to the fish array.
    fishes.push(fish);
  }
}

function animateFishes(app: Application, fishes: Array<FishSprite>) {
  const { width, height } = app.screen;

  const stagePadding = 100;
  const boundWidth = width + stagePadding * 2;
  const boundHeight = height + stagePadding * 2;

  fishes.forEach((fish) => {
    fish.direction += fish.turnSpeed * 0.01;
    fish.x += Math.sin(fish.direction) * fish.speed;
    fish.y += Math.cos(fish.direction) * fish.speed;
    fish.rotation = -fish.direction - Math.PI / 2;

    if (fish.x < -stagePadding) {
      fish.x += boundWidth;
    }
    if (fish.x > width + stagePadding) {
      fish.x -= boundWidth;
    }
    if (fish.y < -stagePadding) {
      fish.y += boundHeight;
    }
    if (fish.y > height + stagePadding) {
      fish.y -= boundHeight;
    }
  });
}

function addWaterOverlay(app: Application) {
  const texture = Texture.from("overlay");
  const { width, height } = app.screen;
  const label = "overlay";
  const overlay = new TilingSprite({ texture, width, height, label });

  app.stage.addChild(overlay);
}

function animateWaterOverlay(app: Application, ticker: Ticker) {
  const delta = ticker.deltaTime;
  const overlay = app.stage.children.find(
    ({ label }) => label === "overlay"
  ) as TilingSprite | undefined;
  if (!overlay) return;

  overlay.tilePosition.x += delta;
  overlay.tilePosition.y += delta;
}

function addDisplacementEffect(app: Application) {
  const sprite = Sprite.from("displacement");

  sprite.texture.source.addressMode = "repeat";
  // * deprecated
  // sprite.texture.baseTexture.wrapMode = "repeat";

  const filter = new DisplacementFilter({ sprite, scale: 50 });
  app.stage.filters = [filter];
}

export default async function initScene() {
  await preload();
  const app = await setup();
  addBackground(app);
  addWaterOverlay(app);
  addDisplacementEffect(app);

  const fishes: Array<FishSprite> = [];
  addFishes(app, fishes);
  app.ticker.add((ticker) => {
    animateFishes(app, fishes);
    animateWaterOverlay(app, ticker);
  });

  const onResize = () => {
    app.resize();
  };

  window.addEventListener("resize", onResize);

  return () => {
    app.stop();
    document.body.removeChild(app.canvas);
    app.destroy(true, { children: true });
    window.removeEventListener("resize", onResize);
  };
}
