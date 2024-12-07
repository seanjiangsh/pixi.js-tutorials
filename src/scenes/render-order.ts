import { Application, Container, Sprite, Text, Texture } from "pixi.js";

function getLetter(
  letter: string,
  parent: Container,
  color: number,
  pos: { x: number; y: number }
): Container {
  const bg = new Sprite(Texture.WHITE);
  bg.width = 100;
  bg.height = 100;
  bg.tint = color;

  const text = new Text({ text: letter, style: { fill: "#ffffff" } });

  text.anchor.set(0.5);
  text.position = { x: 50, y: 50 };

  const container = new Container();
  container.position = pos;
  container.visible = false;
  container.addChild(bg, text);
  parent.addChild(container);

  return container;
}

function getLetters(app: Application): Array<Container> {
  const width = window.innerWidth;
  const height = window.innerHeight;
  // Define 4 letters
  let a = getLetter("A", app.stage, 0xff0000, {
    x: width / 2 - 200,
    y: height / 3,
  });
  let b = getLetter("B", a, 0x00ff00, { x: 20, y: 20 });
  let c = getLetter("C", a, 0x0000ff, { x: 40, y: 40 });
  let d = getLetter("D", app.stage, 0xff8800, {
    x: width / 2 - 200,
    y: height / 3 + 100,
  });
  return [a, b, c, d];
}

export default async function initScene() {
  // Create the application helper and add its render target to the page
  const app = new Application();
  let width = window.innerWidth;
  let height = window.innerHeight;
  await app.init({ resizeTo: window, backgroundColor: "#575656" });
  document.body.appendChild(app.canvas);

  // Label showing scene graph hierarchy
  const container = new Text({
    text: "Scene Graph:\n\napp.stage\n  ┗ A\n     ┗ B\n     ┗ C\n  ┗ D",
    style: { fill: "#ffffff" },
    position: { x: width / 2, y: height / 3 },
  });

  app.stage.addChild(container);

  // Helper function to create a block of color with a letter
  let letters: Array<Container> = getLetters(app);

  // Display them over time, in order
  let elapsed = 0.0;
  app.ticker.add((ticker) => {
    elapsed += ticker.deltaTime / 60.0;
    if (elapsed >= letters.length) {
      elapsed = 0.0;
    }
    for (let i = 0; i < letters.length; i++) {
      letters[i].visible = elapsed >= i;
    }
  });

  window.onresize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    app.resize();

    // Clear the stage
    app.stage.removeChildren();

    // Recreate and add the container
    container.position.set(width / 2, height / 3);
    app.stage.addChild(container);

    // Recreate and add the letters
    letters = getLetters(app);

    // Manually request a rerender
    app.render();
  };

  return () => {
    // remove the canvas from the DOM
    document.body.removeChild(app.canvas);
    app.destroy(true, { children: true });
  };
}
