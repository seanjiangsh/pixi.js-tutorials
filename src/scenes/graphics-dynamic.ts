import { Application, FillGradient, Graphics } from "pixi.js";

export default async function initScene() {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ antialias: true, resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;

  let width = window.innerWidth;
  let height = window.innerHeight;

  const graphics = new Graphics();

  function drawGraphics() {
    graphics.clear();

    // Draw a shape
    graphics
      .moveTo(width * 0.1, height * 0.1)
      .lineTo(width * 0.5, height * 0.1)
      .lineTo(width * 0.2, height * 0.2)
      .lineTo(width * 0.5, height * 0.4)
      .lineTo(width * 0.1, height * 0.4)
      .lineTo(width * 0.1, height * 0.1)
      .fill({ color: 0xff3300 })
      .stroke({ width: 10, color: 0xffd900 });

    // Draw a second shape
    graphics
      .moveTo(width * 0.5, height * 0.7)
      .lineTo(width * 0.9, height * 0.95)
      .quadraticCurveTo(width, height * 0.5, width * 0.8, height * 0.5)
      .lineTo(width * 0.7, height * 0.6)
      .lineTo(width * 0.6, height * 0.33)
      .lineTo(width * 0.5, height * 0.5)
      .fill({ color: 0xff700b })
      .stroke({ width: 10, color: 0xff0000, alpha: 0.8 });

    // Create a color array for the linear gradient
    const colorStops = [0x00ff00, 0xffffff, 0x0000ff];
    // Create a fill gradient
    const gradientFill = new FillGradient(0, 0, width, height);
    // Add the color stops to the fill gradient
    colorStops.forEach((number, index) => {
      const ratio = index / colorStops.length;
      gradientFill.addColorStop(ratio, number);
    });

    // Draw a rectangle
    graphics
      .rect(width * 0.01, height * 0.7, width * 0.5, height * 0.2)
      .stroke({ width: 2, color: 0x0000ff })
      .fill(gradientFill);

    // Draw a circle
    graphics.circle(width * 0.8, height * 0.2, width * 0.1);
    graphics.fill({ color: 0xffff0b, alpha: 0.5 });

    graphics.moveTo(width * 0.05, height * 0.05);
    graphics.lineTo(width * 0.75, height * 0.5);
    graphics.stroke({ width: 20, color: 0x33ff00 });
  }

  drawGraphics();
  app.stage.addChild(graphics);

  // Let's create a moving shape
  const thing = new Graphics();

  app.stage.addChild(thing);
  thing.x = width / 2;
  thing.y = height / 2;

  let count = 0;

  // Just click on the stage to draw random lines
  // window.app = app;
  app.stage.on("pointerdown", () => {
    graphics.moveTo(Math.random() * width, Math.random() * height);
    graphics.bezierCurveTo(
      Math.random() * width,
      Math.random() * height,
      Math.random() * width,
      Math.random() * height,
      Math.random() * width,
      Math.random() * height
    );
    graphics.stroke({
      width: Math.random() * 30,
      color: Math.random() * 0xffffff,
    });
  });

  // Animate the moving shape
  app.ticker.add(() => {
    count += 0.1;

    thing.clear();

    thing
      .moveTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20)
      .lineTo(120 + Math.cos(count) * 20, -100 + Math.sin(count) * 20)
      .lineTo(120 + Math.sin(count) * 20, 100 + Math.cos(count) * 20)
      .lineTo(-120 + Math.cos(count) * 20, 100 + Math.sin(count) * 20)
      .lineTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20)
      .fill({ color: 0xffff00, alpha: 0.5 })
      .stroke({ width: 10, color: 0xff0000 });

    thing.rotation = count * 0.1;
  });

  window.onresize = () => {
    // Resize the app
    width = window.innerWidth;
    height = window.innerHeight;
    app.resize();
    drawGraphics();
    // Reposition the "thing"
    thing.x = width / 2;
    thing.y = height / 2;
  };

  return () => {
    graphics.destroy();
    // remove the canvas from the DOM
    document.body.removeChild(app.canvas);
    app.destroy(true, { children: true });
  };
}
