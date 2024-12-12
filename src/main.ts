import helloWorld from "./scenes/hello-world";
import parentAndChild from "./scenes/parent-and-children";
import renderOrder from "./scenes/render-order";
import assetsBundle from "./scenes/assets-bundle";
import maskBasic from "./scenes/mask-basic";
import maskFilter from "./scenes/mask-filter";
import graphicsDynamic from "./scenes/graphics-dynamic";
import graphicsSvgs from "./scenes/graphics-svg";
import eventDragging from "./scenes/events-dragging";
import spriteAnimateJet from "./scenes/sprite-animate-jet";
import tutorialFishPond from "./scenes/tutorials-fish-pond";
import tutorialChooChooTrain from "./scenes/tutorials-choo-choo-train";
import spineBoy from "./scenes/spineboy/tutorials-spineboy";
import tilingsprite from "./scenes/tiling-sprite";

const scenes: { [key: string]: () => Promise<() => void> } = {
  "hello-world": helloWorld,
  "parent-and-child": parentAndChild,
  "render-order": renderOrder,
  "assets-bundle": assetsBundle,
  "mask-basic": maskBasic,
  "mask-filter": maskFilter,
  "graphics-dynamic": graphicsDynamic,
  "graphics-svg": graphicsSvgs,
  "events-dragging": eventDragging,
  "sprite-animate-jet": spriteAnimateJet,
  "tutorial-fish-pond": tutorialFishPond,
  "tutorial-choo-choo-train": tutorialChooChooTrain,
  "tutorial-spineboy": spineBoy,
  "tiling-sprite": tilingsprite,
};

let currentSceneCleanup: (() => void) | null = null;
const sceneListToggle = document.getElementById("scene-list-toggle")!;
const sceneContainer = document.getElementById("scene-list-container")!;
const sceneList = document.getElementById("scene-list")!;

async function loadScene(scene: string) {
  if (currentSceneCleanup) {
    currentSceneCleanup();
  }

  const sceneFunction = scenes[scene];

  if (sceneFunction) {
    currentSceneCleanup = await sceneFunction();
  }
  document.title = `Pixi.js - ${scene}`;

  // * show scene list if it's development
  if (import.meta.env.DEV) {
    sceneContainer.style.display = "block";
  } else {
    sceneContainer.style.display = "none";
  }
}

document.querySelectorAll("#scene-list a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const scene = (event.target as HTMLElement).getAttribute("data-scene");
    if (scene) {
      loadScene(scene);
    }
  });
});

sceneListToggle.addEventListener("click", () => {
  sceneList.classList.toggle("open");
});

for (const scene in scenes) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.textContent = scene;
  a.setAttribute("data-scene", scene);
  a.addEventListener("click", (event) => {
    event.preventDefault();
    const scene = (event.target as HTMLElement).getAttribute("data-scene");
    if (scene) loadScene(scene);
  });
  li.appendChild(a);
  sceneList.appendChild(li);
}

// Load default scene
loadScene("tutorial-spineboy");
