import { Assets, Application, Sprite } from "pixi.js";

export default async function initScene() {
  // Create the application helper and add its render target to the page
  const app = new Application();

  let width = window.innerWidth;
  let height = window.innerHeight;
  await app.init({ resizeTo: window, backgroundColor: "#575656" });

  document.body.appendChild(app.canvas);

  // Create the sprite and add it to the stage
  const bunnyUrl = "https://pixijs.com/assets/bunny.png";
  await Assets.load(bunnyUrl);
  let sprite = Sprite.from(bunnyUrl);

  // center the sprite's anchor point
  sprite.anchor.set(0.5);

  app.stage.addChild(sprite);

  // Add a ticker to animate the sprite
  let elapsed = 0;
  app.ticker.add((ticker) => {
    elapsed += ticker.deltaTime;
    sprite.x = width / 2 + Math.cos(elapsed / 50) * (width / 2 - 50);
    sprite.y = height / 2 + Math.sin(elapsed / 50) * (height / 2 - 50);
  });

  window.onresize = () => {
    // Resize the app
    width = window.innerWidth;
    height = window.innerHeight;
    app.resize();
  };

  return () => {
    // remove the canvas from the DOM
    document.body.removeChild(app.canvas);
    app.destroy(true, { children: true });
  };
}
