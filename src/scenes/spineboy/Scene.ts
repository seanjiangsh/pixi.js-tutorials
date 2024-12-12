import { Container, Sprite, Texture, TilingSprite, Application } from "pixi.js";
import SpineBoy from "./Spineboy";

// Class for handling the environment.
export class Scene {
  app: Application;
  spriteBoy: SpineBoy;
  view: Container;
  scale: number;
  floorHeight: number;

  private sky: Sprite;
  private background: TilingSprite;
  private midground: TilingSprite;
  private platform: TilingSprite;

  constructor(app: Application, spineBoy: SpineBoy) {
    this.app = app;
    this.spriteBoy = spineBoy;
    const { width, height } = app.screen;

    // Create a main view that holds all layers.
    this.view = new Container();

    // Create the stationary sky that fills the entire screen.
    this.sky = Sprite.from("sky");
    this.sky.width = width;
    this.sky.height = height;

    // Create textures for the background, mid-ground, and platform.
    const backgroundTexture = Texture.from("background");
    const midgroundTexture = Texture.from("midground");
    const platformTexture = Texture.from("platform");

    // Calculate the ideal platform height depending on the passed-in screen height.
    const maxPlatformHeight = platformTexture.height;
    const platformHeight = Math.min(maxPlatformHeight, height * 0.4);

    // Calculate the scale to be apply to all tiling textures for consistency.
    const scale = (this.scale = this.calculateScale());
    // Calculate the floor height for external referencing.
    this.floorHeight = this.calculateFloorHeight();

    const baseOptions = {
      width,
      tileScale: { x: scale, y: scale },
    };

    // Create the tiling sprite layers.
    this.background = new TilingSprite({
      texture: backgroundTexture,
      height: backgroundTexture.height * scale,
      ...baseOptions,
    });
    this.midground = new TilingSprite({
      texture: midgroundTexture,
      height: midgroundTexture.height * scale,
      ...baseOptions,
    });
    this.platform = new TilingSprite({
      texture: platformTexture,
      height: platformHeight,
      ...baseOptions,
    });

    // Add all layers to the main view.
    this.view.addChild(
      this.sky,
      this.background,
      this.midground,
      this.platform
    );

    this.resize();

    this.app.ticker.add(this.loop, this);
  }

  private calculateScale(): number {
    const { height } = this.app.screen;
    const platformHeight = Texture.from("platform").height;
    return Math.min(platformHeight, height * 0.4) / platformHeight;
  }

  private calculateFloorHeight(): number {
    const platformHeight = Texture.from("platform").height;
    return this.calculateScale() * platformHeight * 0.43;
  }

  resize() {
    const { app, sky, background, midground, platform } = this;
    const { width, height } = app.screen;

    const scale = (this.scale = this.calculateScale());
    const floorHeight = (this.floorHeight = this.calculateFloorHeight());

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
    platform.height = platform.texture.height * scale;
    platform.y = height - platform.height;

    return { floorHeight, scale };
  }

  // Use the platform's horizontal position as the key position for the scene.
  get positionX() {
    return this.platform.tilePosition.x;
  }

  // Set the horizontal position of the platform layer while applying parallax scrolling to the backdrop layers.
  set positionX(value) {
    this.background.tilePosition.x = value * 0.1;
    this.midground.tilePosition.x = value * 0.25;
    this.platform.tilePosition.x = value;
  }

  loop() {
    // Update the scene's parallax effect.
    let speed = 1.25;
    const {
      direction,
      state: { hover, run, walk },
    } = this.spriteBoy;

    if (hover) speed = 7.5;
    else if (run) speed = 3.75;

    if (walk) {
      this.positionX -= speed * this.scale * direction;
    }
  }

  dispose() {
    this.app.ticker.remove(this.loop, this);
  }
}
