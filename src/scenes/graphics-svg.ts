import { Application, Graphics, Assets } from "pixi.js";

export default async function initScene() {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ antialias: true, resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  const tigerSvg = await Assets.load({
    src: "https://pixijs.com/assets/tiger.svg",
    data: { parseAsGraphicsContext: true },
  });

  const graphics = new Graphics(tigerSvg);

  // line it up as this svg is not centered
  const bounds = graphics.getLocalBounds();

  graphics.pivot.set(
    (bounds.x + bounds.width) / 2,
    (bounds.y + bounds.height) / 2
  );

  graphics.position.set(app.screen.width / 2, app.screen.height / 2);

  app.stage.addChild(graphics);

  // app.ticker.add((ticker) => {
  //   graphics.rotation += 0.01;
  //   graphics.scale.set(2 + Math.sin(graphics.rotation));
  // });

  window.onresize = () => {
    app.resize();
    graphics.position.set(app.screen.width / 2, app.screen.height / 2);
  };

  return () => {
    graphics.destroy();
    // remove the canvas from the DOM
    document.body.removeChild(app.canvas);
    app.destroy(true, { children: true });
  };
}
