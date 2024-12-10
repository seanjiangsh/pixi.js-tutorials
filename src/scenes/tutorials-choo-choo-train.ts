import { Application, Assets, Container, Graphics } from "pixi.js";

import moonSvg from "../assets/moon.svg";

async function setup() {
  // Intialize the application.
  const app = new Application();
  await app.init({ background: "#021f4b", resizeTo: window });

  // Then adding the application's canvas to the DOM body.
  document.body.appendChild(app.canvas);

  return app;
}

function addStars(app: Application) {
  const starCount = 20;
  const graphics = new Graphics();

  for (let index = 0; index < starCount; index++) {
    const x = (index * 0.78695 * app.screen.width) % app.screen.width;
    const y = (index * 0.9382 * app.screen.height) % app.screen.height;
    const radius = 2 + Math.random() * 3;
    const rotation = Math.random() * Math.PI * 2;

    graphics
      .star(x, y, 5, radius, 0, rotation)
      .fill({ color: 0xffdf00, alpha: radius / 5 });
  }

  app.stage.addChild(graphics);
}

async function addMoon(app: Application) {
  // Create a moon graphics object from an SVG code.
  const moonSvgAsset = await Assets.load({
    src: moonSvg,
    data: { parseAsGraphicsContext: true },
  });
  const graphics = new Graphics(moonSvgAsset);

  // Position the moon.
  graphics.x = app.screen.width / 2 + 100;
  graphics.y = app.screen.height / 8;

  // Add the moon to the stage.
  app.stage.addChild(graphics);
}

function createMountainGroup(app: Application) {
  const { width, height } = app.screen;
  const graphics = new Graphics();
  const halfWidth = width / 2;
  const startY = height;
  const startXLeft = 0;
  const startXMiddle = Number(width) / 4;
  const startXRight = width / 2;
  const heightLeft = height / 2;
  const heightMiddle = (height * 4) / 5;
  const heightRight = (height * 2) / 3;
  const colorLeft = 0xc1c0c2;
  const colorMiddle = 0x7e818f;
  const colorRight = 0x8c919f;

  graphics
    // Draw the middle mountain
    .moveTo(startXMiddle, startY)
    .bezierCurveTo(
      startXMiddle + halfWidth / 2,
      startY - heightMiddle,
      startXMiddle + halfWidth / 2,
      startY - heightMiddle,
      startXMiddle + halfWidth,
      startY
    )
    .fill({ color: colorMiddle })

    // Draw the left mountain
    .moveTo(startXLeft, startY)
    .bezierCurveTo(
      startXLeft + halfWidth / 2,
      startY - heightLeft,
      startXLeft + halfWidth / 2,
      startY - heightLeft,
      startXLeft + halfWidth,
      startY
    )
    .fill({ color: colorLeft })

    // Draw the right mountain
    .moveTo(startXRight, startY)
    .bezierCurveTo(
      startXRight + halfWidth / 2,
      startY - heightRight,
      startXRight + halfWidth / 2,
      startY - heightRight,
      startXRight + halfWidth,
      startY
    )
    .fill({ color: colorRight });

  return graphics;
}

function addMountains(app: Application) {
  const group1 = createMountainGroup(app);
  const group2 = createMountainGroup(app);
  const mountains = [group1, group2];

  group2.x = app.screen.width;
  app.stage.addChild(group1, group2);

  app.ticker.add(({ deltaTime }) => {
    const dx = deltaTime * 0.5;
    mountains.forEach((mountain) => {
      mountain.x -= dx;
      if (mountain.x <= -app.screen.width) {
        mountain.x += app.screen.width * 2;
      }
    });
  });

  return mountains;
}

function createTree(width: number, height: number) {
  const trunkWidth = 30;
  const trunkHeight = height / 4;
  const trunkColor = 0x563929;
  const graphics = new Graphics()
    .rect(-trunkWidth / 2, -trunkHeight, trunkWidth, trunkHeight)
    .fill({ color: trunkColor });
  const crownHeight = height - trunkHeight;
  const crownLevels = 4;
  const crownLevelHeight = crownHeight / crownLevels;
  const crownWidthIncrement = width / crownLevels;
  const crownColor = 0x264d3d;

  for (let index = 0; index < crownLevels; index++) {
    const y = -trunkHeight - crownLevelHeight * index;
    const levelWidth = width - crownWidthIncrement * index;
    const offset = index < crownLevels - 1 ? crownLevelHeight / 2 : 0;

    graphics
      .moveTo(-levelWidth / 2, y)
      .lineTo(0, y - crownLevelHeight - offset)
      .lineTo(levelWidth / 2, y)
      .fill({ color: crownColor });
  }

  return graphics;
}

function addTrees(app: Application) {
  const treeWidth = 200;
  const spacing = 15;
  const { width, height } = app.screen;
  const count = width / (treeWidth + spacing) + 1;
  const y = height - 20;

  const trees: Array<Graphics> = [];

  for (let index = 0; index < count; index++) {
    const treeHeight = 225 + Math.random() * 50;
    const tree = createTree(treeWidth, treeHeight);

    tree.x = index * (treeWidth + spacing);
    tree.y = y;

    app.stage.addChild(tree);
    trees.push(tree);
  }

  app.ticker.add(({ deltaTime }) => {
    const dx = deltaTime * 3;
    trees.forEach((tree) => {
      tree.x -= dx;
      if (tree.x <= -(treeWidth / 2 + spacing)) {
        tree.x += count * (treeWidth + spacing) + spacing * 3;
      }
    });
  });

  return trees;
}

function addGround(app: Application) {
  // * snow layer
  const { width, height } = app.screen;
  const groundHeight = 20;
  const ground = new Graphics()
    .rect(0, height - groundHeight, width, groundHeight)
    .fill({ color: 0xdddddd });

  app.stage.addChild(ground);

  // * planks
  const trackHeight = 15;
  const plankWidth = 50;
  const plankHeight = trackHeight / 2;
  const plankGap = 20;
  const plankCount = width / (plankWidth + plankGap) + 1;
  const plankY = height - groundHeight;
  const planks: Array<Graphics> = [];

  for (let index = 0; index < plankCount; index++) {
    const plank = new Graphics()
      .rect(0, plankY - plankHeight, plankWidth, plankHeight)
      .fill({ color: 0x241811 });

    plank.x = index * (plankWidth + plankGap);
    app.stage.addChild(plank);
    planks.push(plank);
  }

  // * rail
  const railHeight = trackHeight / 2;
  const railY = plankY - plankHeight;
  const rail = new Graphics()
    .rect(0, railY - railHeight, width, railHeight)
    .fill({ color: 0x5c5c5c });

  app.stage.addChild(rail);

  app.ticker.add((time) => {
    // Calculate the amount of distance to move the planks per tick.
    const dx = time.deltaTime * 6;

    planks.forEach((plank) => {
      // Move the planks leftwards.
      plank.x -= dx;

      // Reposition the planks when they move off screen.
      if (plank.x <= -(plankWidth + plankGap)) {
        plank.x += plankCount * (plankWidth + plankGap) + plankGap * 1.5;
      }
    });
  });

  return { ground, planks, rail };
}

function addTrain(app: Application) {
  const container = new Container();

  const head = createTrainHead(app);
  const carriage = createTrainCarriage(app);

  // Position the carriage behind the head.
  carriage.x = -carriage.width;
  container.addChild(head, carriage);

  const { width, height } = app.screen;
  const baseY = height - 35 - 55;

  container.x = width / 2 - head.width;
  container.y = baseY;

  app.stage.addChild(container);

  // Animate the train - bobbing it up and down a tiny bit on the track.
  let elapsed = 0;
  const speed = 0.5;
  const shakeDistance = 3;

  app.ticker.add((time) => {
    elapsed += time.deltaTime;
    const offset =
      (Math.sin(elapsed * 0.5 * speed) * 0.5 + 0.5) * shakeDistance;
    container.y = baseY + offset;
  });

  return container;
}

function createTrainHead(app: Application) {
  // Create a container to hold all the train head parts.
  const container = new Container();

  // Define the dimensions of the head front.
  const frontHeight = 100;
  const frontWidth = 140;
  const frontRadius = frontHeight / 2;

  // Define the dimensions of the cabin.
  const cabinHeight = 200;
  const cabinWidth = 150;
  const cabinRadius = 15;

  // Define the dimensions of the chimney.
  const chimneyBaseWidth = 30;
  const chimneyTopWidth = 50;
  const chimneyHeight = 70;
  const chimneyDomeHeight = 25;
  const chimneyTopOffset = (chimneyTopWidth - chimneyBaseWidth) / 2;
  const chimneyStartX =
    cabinWidth + frontWidth - frontRadius - chimneyBaseWidth;
  const chimneyStartY = -frontHeight;

  // Define the dimensions of the roof.
  const roofHeight = 25;
  const roofExcess = 20;

  // Define the dimensions of the door.
  const doorWidth = cabinWidth * 0.7;
  const doorHeight = cabinHeight * 0.7;
  const doorStartX = (cabinWidth - doorWidth) * 0.5;
  const doorStartY = -(cabinHeight - doorHeight) * 0.5 - doorHeight;

  // Define the dimensions of the window.
  const windowWidth = doorWidth * 0.8;
  const windowHeight = doorHeight * 0.4;
  const offset = (doorWidth - windowWidth) / 2;

  const graphics = new Graphics()
    // Draw the chimney
    .moveTo(chimneyStartX, chimneyStartY)
    .lineTo(
      chimneyStartX - chimneyTopOffset,
      chimneyStartY - chimneyHeight + chimneyDomeHeight
    )
    .quadraticCurveTo(
      chimneyStartX + chimneyBaseWidth / 2,
      chimneyStartY - chimneyHeight - chimneyDomeHeight,
      chimneyStartX + chimneyBaseWidth + chimneyTopOffset,
      chimneyStartY - chimneyHeight + chimneyDomeHeight
    )
    .lineTo(chimneyStartX + chimneyBaseWidth, chimneyStartY)
    .fill({ color: 0x121212 })

    // Draw the head front
    .roundRect(
      cabinWidth - frontRadius - cabinRadius,
      -frontHeight,
      frontWidth + frontRadius + cabinRadius,
      frontHeight,
      frontRadius
    )
    .fill({ color: 0x7f3333 })

    // Draw the cabin
    .roundRect(0, -cabinHeight, cabinWidth, cabinHeight, cabinRadius)
    .fill({ color: 0x725f19 })

    // Draw the roof
    .rect(
      -roofExcess / 2,
      cabinRadius - cabinHeight - roofHeight,
      cabinWidth + roofExcess,
      roofHeight
    )
    .fill({ color: 0x52431c })

    // Draw the door
    .roundRect(doorStartX, doorStartY, doorWidth, doorHeight, cabinRadius)
    .stroke({ color: 0x52431c, width: 3 })

    // Draw the window
    .roundRect(
      doorStartX + offset,
      doorStartY + offset,
      windowWidth,
      windowHeight,
      10
    )
    .fill({ color: 0x848484 });

  // Define the dimensions of the wheels.
  const bigWheelRadius = 55;
  const smallWheelRadius = 35;
  const wheelGap = 5;
  const wheelOffsetY = 5;

  // Create all the wheels.
  const backWheel = createTrainWheel(bigWheelRadius);
  const midWheel = createTrainWheel(smallWheelRadius);
  const frontWheel = createTrainWheel(smallWheelRadius);

  // Position the wheels.
  backWheel.x = bigWheelRadius;
  backWheel.y = wheelOffsetY;
  midWheel.x = backWheel.x + bigWheelRadius + smallWheelRadius + wheelGap;
  midWheel.y = backWheel.y + bigWheelRadius - smallWheelRadius;
  frontWheel.x = midWheel.x + smallWheelRadius * 2 + wheelGap;
  frontWheel.y = midWheel.y;

  // Add all the parts to the container.
  container.addChild(graphics, backWheel, midWheel, frontWheel);

  // Animate the wheels - making the big wheel rotate proportionally slower than the small wheels.
  app.ticker.add((time) => {
    const dr = time.deltaTime * 0.15;

    backWheel.rotation += dr * (smallWheelRadius / bigWheelRadius);
    midWheel.rotation += dr;
    frontWheel.rotation += dr;
  });

  return container;
}

function createTrainWheel(radius: number) {
  const strokeThickness = radius / 3;
  const innerRadius = radius - strokeThickness;

  return (
    new Graphics()
      .circle(0, 0, radius)
      // Draw the wheel
      .fill({ color: 0x848484 })
      // Draw the tyre
      .stroke({ color: 0x121212, width: strokeThickness, alignment: 1 })
      // Draw the spokes
      .rect(
        -strokeThickness / 2,
        -innerRadius,
        strokeThickness,
        innerRadius * 2
      )
      .rect(
        -innerRadius,
        -strokeThickness / 2,
        innerRadius * 2,
        strokeThickness
      )
      .fill({ color: 0x4f4f4f })
  );
}

function createTrainCarriage(app: Application) {
  const container = new Container();

  const containerHeight = 125;
  const containerWidth = 200;
  const containerRadius = 15;
  const edgeHeight = 25;
  const edgeExcess = 20;
  const connectorWidth = 30;
  const connectorHeight = 10;
  const connectorGap = 10;
  const connectorOffsetY = 20;

  const graphics = new Graphics()
    // Draw the body
    .roundRect(
      edgeExcess / 2,
      -containerHeight,
      containerWidth,
      containerHeight,
      containerRadius
    )
    .fill({ color: 0x725f19 })

    // Draw the top edge
    .rect(
      0,
      containerRadius - containerHeight - edgeHeight,
      containerWidth + edgeExcess,
      edgeHeight
    )
    .fill({ color: 0x52431c })

    // Draw the connectors
    .rect(
      containerWidth + edgeExcess / 2,
      -connectorOffsetY - connectorHeight,
      connectorWidth,
      connectorHeight
    )
    .rect(
      containerWidth + edgeExcess / 2,
      -connectorOffsetY - connectorHeight * 2 - connectorGap,
      connectorWidth,
      connectorHeight
    )
    .fill({ color: 0x121212 });

  const wheelRadius = 35;
  const wheelGap = 40;
  const centerX = (containerWidth + edgeExcess) / 2;
  const offsetX = wheelRadius + wheelGap / 2;

  const backWheel = createTrainWheel(wheelRadius);
  const frontWheel = createTrainWheel(wheelRadius);

  backWheel.x = centerX - offsetX;
  frontWheel.x = centerX + offsetX;
  frontWheel.y = backWheel.y = 25;

  container.addChild(graphics, backWheel, frontWheel);

  app.ticker.add((time) => {
    const dr = time.deltaTime * 0.15;

    backWheel.rotation += dr;
    frontWheel.rotation += dr;
  });

  return container;
}

type SmokeGraphic = Graphics & { tick: number };

function addSmokes(app: Application, train: Container) {
  const groupCount = 5;
  const particleCount = 7;
  const groups: Array<SmokeGraphic> = [];
  const baseX = train.x + 170;
  const baseY = train.y - 120;

  for (let index = 0; index < groupCount; index++) {
    const graphic = new Graphics() as SmokeGraphic;

    for (let i = 0; i < particleCount; i++) {
      const radius = 20 + Math.random() * 20;
      const x = (Math.random() * 2 - 1) * 40;
      const y = (Math.random() * 2 - 1) * 40;

      graphic.circle(x, y, radius);
    }

    graphic.fill({ color: 0xc9c9c9, alpha: 0.5 });

    // graphic.x = 300;
    // graphic.y = 300;
    graphic.x = baseX;
    graphic.y = baseY;
    graphic.tick = index * (1 / groupCount);

    app.stage.addChild(graphic);
    groups.push(graphic);
  }
  console.log({ baseX, baseY });

  app.ticker.add(({ deltaTime }) => {
    const dt = deltaTime * 0.01;

    groups.forEach((group) => {
      // Update the animation progress ratio.
      group.tick = (group.tick + dt) % 1;

      // Update the position and scale of the smoke group based on the animation progress ratio.
      group.x = baseX - Math.pow(group.tick, 2) * 400;
      group.y = baseY - group.tick * 200;
      group.scale.set(Math.pow(group.tick, 0.75));
      group.alpha = 1 - Math.pow(group.tick, 0.5);
    });
  });
}

export default async function initScene() {
  const app = await setup();
  addStars(app);
  await addMoon(app);
  addMountains(app);
  addTrees(app);
  addGround(app);
  const trainContainer = addTrain(app);
  addSmokes(app, trainContainer);

  function onResize() {
    // Resize the app
    app.resize();
  }
  window.addEventListener("resize", onResize);

  return () => {
    app.stop();
    document.body.removeChild(app.canvas);
    app.destroy(true, { children: true });
    window.removeEventListener("resize", onResize);
  };
}
