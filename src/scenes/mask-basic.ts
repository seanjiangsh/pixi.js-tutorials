import { Application, Container, Graphics, Text } from "pixi.js";

export default async function initScene() {
  // Create the application helper and add its render target to the page
  let app = new Application();
  await app.init({ resizeTo: window, backgroundColor: "#575656" });

  document.body.appendChild(app.canvas);

  // Create window frame
  let frame = new Graphics({ x: 320 - 104, y: 180 - 104 })
    .rect(0, 0, 208, 208)
    .fill(0x666666)
    .stroke({ color: 0xffffff, width: 4, alignment: 0 });

  app.stage.addChild(frame);

  // Create a graphics object to define our mask
  let mask = new Graphics()
    // Add the rectangular area to show
    .rect(0, 0, 200, 200)
    .fill(0xffffff);

  // Add container that will hold our masked content
  let maskContainer = new Container();
  // Set the mask to use our graphics object from above
  maskContainer.mask = mask;
  // Add the mask as a child, so that the mask is positioned relative to its parent
  maskContainer.addChild(mask);
  // Offset by the window's frame width
  maskContainer.position.set(4, 4);
  // And add the container to the window!
  frame.addChild(maskContainer);

  // Create contents for the masked container
  let text = new Text({
    text:
      "This text will scroll up and be masked, so you can see how masking works.  Lorem ipsum and all that.\n\n" +
      "You can put anything in the container and it will be masked!",
    style: {
      fontSize: 24,
      fill: 0x1010ff,
      wordWrap: true,
      wordWrapWidth: 180,
    },
    x: 10,
  });

  maskContainer.addChild(text);

  // Add a ticker callback to scroll the text up and down
  let elapsed = 0.0;
  app.ticker.add((ticker) => {
    // Update the text's y coordinate to scroll it
    elapsed += ticker.deltaTime;
    text.y = 10 + -100.0 + Math.cos(elapsed / 50.0) * 100.0;
  });

  return () => {
    // remove the canvas from the DOM
    document.body.removeChild(app.canvas);
    app.destroy(true, { children: true });
  };
}
