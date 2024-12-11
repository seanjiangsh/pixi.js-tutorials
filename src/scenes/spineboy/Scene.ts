import { Container, Sprite, Texture, TilingSprite, Application } from "pixi.js";
import SpineBoy from "./Spineboy";

// Class for handling the environment.
export class Scene {
  app: Application;
  spriteBoy: SpineBoy;

  view: Container;
  sky: Sprite;
  background: TilingSprite;
  midground: TilingSprite;
  platform: TilingSprite;

  scale: number;
  floorHeight: number;

  constructor(app: Application, spineBoy: SpineBoy) {
    this.app = app;
    this.spriteBoy = spineBoy;
    const { width, height } = app.screen;

    // Create a main view that holds all layers.
    this.view = new Container();
    this.sky = this.createSky(width, height);
    this.scale = this.calculateScale(height);
    this.floorHeight = this.calculateFloorHeight(height);

    this.background = this.createTilingSprite("background", width);
    this.midground = this.createTilingSprite("midground", width);
    this.platform = this.createTilingSprite(
      "platform",
      width,
      this.floorHeight
    );

    this.background.y = this.midground.y = -this.floorHeight;
    this.view.addChild(
      this.sky,
      this.background,
      this.midground,
      this.platform
    );

    this.app.ticker.add(this.loop, this);
  }

  private createSky(width: number, height: number): Sprite {
    const sky = Sprite.from("sky");
    sky.anchor.set(0, 1);
    sky.width = width;
    sky.height = height;
    return sky;
  }

  private calculateScale(height: number): number {
    const maxPlatformHeight = Texture.from("platform").height;
    return Math.min(maxPlatformHeight, height * 0.4) / maxPlatformHeight;
  }

  private calculateFloorHeight(height: number): number {
    return this.calculateScale(height) * Texture.from("platform").height * 0.43;
  }

  private createTilingSprite(
    alias: string,
    width: number,
    height?: number
  ): TilingSprite {
    const texture = Texture.from(alias);
    return new TilingSprite({
      texture,
      width,
      height: height || texture.height * this.scale,
      tileScale: { x: this.scale, y: this.scale },
      anchor: { x: 0, y: 1 },
      applyAnchorToTexture: true,
    });
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
