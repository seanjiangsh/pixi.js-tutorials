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
};

let currentSceneCleanup: (() => void) | null = null;

async function loadScene(scene: string) {
  if (currentSceneCleanup) {
    currentSceneCleanup();
  }

  const sceneFunction = scenes[scene];

  if (sceneFunction) {
    currentSceneCleanup = await sceneFunction();
  }
  document.title = `Pixi.js - ${scene}`;
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

const sceneListToggle = document.getElementById("scene-list-toggle")!;
const sceneList = document.getElementById("scene-list")!;

sceneListToggle.addEventListener("click", () => {
  sceneList.classList.toggle("open");
});

// Create li for each scene in 'scene-list-container'
const sceneContainer = document.getElementById("scene-list")!;
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
  sceneContainer.appendChild(li);
}

// Load default scene
loadScene("tutorial-spineboy");
