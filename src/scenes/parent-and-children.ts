import { Assets, Application, Container, Sprite } from "pixi.js";

export default async function initScene() {
  // Create the application helper and add its render target to the page
  const app = new Application();
  let width = window.innerWidth;
  let height = window.innerHeight;
  await app.init({ resizeTo: window, backgroundColor: "#575656" });
  document.body.appendChild(app.canvas);

  // Add a container to center our sprite stack on the page
  const container = new Container({ x: width / 2, y: height / 2 });

  app.stage.addChild(container);

  // load the texture
  const bunnyUrl = "https://pixijs.com/assets/bunny.png";
  await Assets.load(bunnyUrl);

  // Create the 3 sprites, each a child of the last
  const bunnies: Array<Container> = [];
  let parent = container;
  for (let i = 0; i < 3; i++) {
    let container = new Container();
    let sprite = Sprite.from(bunnyUrl);

    // center the sprite's anchor point
    sprite.anchor.set(0.5);

    container.addChild(sprite);
    parent.addChild(container);
    bunnies.push(container);
    parent = container;
  }
  console.log(bunnies);

  // Set all sprite's properties to the same value, animated over time
  let elapsed = 0.0;
  app.ticker.add((delta) => {
    elapsed += delta.deltaTime / 60;
    const amount = Math.sin(elapsed);
    const scale = 1.0 + 0.25 * amount;
    const alpha = 0.75 + 0.25 * amount;
    const angle = 40 * amount;
    const x = 75 * amount;
    for (let i = 0; i < bunnies.length; i++) {
      const sprite = bunnies[i];
      sprite.scale.set(scale);
      sprite.alpha = alpha;
      sprite.angle = angle;
      sprite.x = x;
    }
  });

  window.onresize = () => {
    // Resize the app
    width = window.innerWidth;
    height = window.innerHeight;
    app.resize();
    container.position.set(width / 2, height / 2);
  };

  return () => {
    // remove the canvas from the DOM
    document.body.removeChild(app.canvas);
    app.destroy(true, { children: true });
  };
}
