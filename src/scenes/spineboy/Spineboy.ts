import { Application, Container } from "pixi.js";
import { Spine } from "@esotericsoftware/spine-pixi-v8";
import InputController from "./Input-controller";

// Define the Spine animation map for the character.
// name: animation track key.
// loop: do the animation once or infinitely.
type Animation = {
  name: string;
  loop?: boolean;
  timeScale?: number;
};

const animationMap: { [key: string]: Animation } = {
  idle: {
    name: "idle",
    loop: true,
  },
  walk: {
    name: "walk",
    loop: true,
  },
  run: {
    name: "run",
    loop: true,
  },
  jump: {
    name: "jump",
    timeScale: 1.5,
  },
  hover: {
    name: "hoverboard",
    loop: true,
  },
  spawn: {
    name: "portal",
  },
};

// Class for handling the character Spine and its animations.
type SpineBoyState = {
  walk: boolean;
  run: boolean;
  hover: boolean;
  jump: boolean;
};

export default class SpineBoy {
  app: Application;
  inputController: InputController;
  state: SpineBoyState;
  view: Container;
  directionalView: Container;
  spine: Spine;

  constructor(app: Application, inputController: InputController) {
    this.app = app;
    this.inputController = inputController;
    this.state = this.createInitialState();
    this.view = new Container();
    this.directionalView = new Container();
    this.spine = this.createSpineInstance();

    this.directionalView.addChild(this.spine);
    this.view.addChild(this.directionalView);
    this.spine.state.data.defaultMix = 0.2;

    this.app.ticker.add(this.loop, this);
  }

  private createInitialState(): SpineBoyState {
    return {
      walk: false,
      run: false,
      hover: false,
      jump: false,
    };
  }

  private createSpineInstance(): Spine {
    return Spine.from({
      skeleton: "spineSkeleton",
      atlas: "spineAtlas",
    });
  }

  spawn() {
    this.playAnimation(animationMap.spawn);
  }

  playAnimation(args: Animation) {
    const { name, loop = false, timeScale = 1 } = args;
    if (this.currentAnimationName === name) return;

    const trackEntry = this.spine.state.setAnimation(0, name, loop);
    trackEntry.timeScale = timeScale;
  }

  isSpawning() {
    return this.isAnimationPlaying(animationMap.spawn);
  }

  isAnimationPlaying(animation: Animation) {
    const { name } = animation;
    return (
      this.currentAnimationName === name &&
      !this.spine.state.getCurrent(0)?.isComplete()
    );
  }

  get currentAnimationName() {
    return this.spine.state.getCurrent(0)?.animation?.name;
  }

  get direction() {
    return this.directionalView.scale.x > 0 ? 1 : -1;
  }

  set direction(value) {
    this.directionalView.scale.x = value;
  }

  update() {
    const { jump, hover, run, walk } = this.state;
    if (jump) this.playAnimation(animationMap.jump);
    if (this.isAnimationPlaying(animationMap.jump)) return;

    if (hover) this.playAnimation(animationMap.hover);
    else if (run) this.playAnimation(animationMap.run);
    else if (walk) this.playAnimation(animationMap.walk);
    else this.playAnimation(animationMap.idle);
  }

  loop() {
    if (this.isSpawning()) return;

    const { right, left, down, space } = this.inputController.keys;
    const rightPressed = right.pressed;
    const leftPressed = left.pressed;
    const downPressed = down.pressed;
    const run = left.doubleTap || right.doubleTap;

    const { state } = this;
    state.walk = rightPressed || leftPressed;
    state.run = state.walk && (state.run || run);
    state.hover = downPressed;
    state.jump = space.pressed;

    if (leftPressed) {
      this.direction = -1;
    } else if (rightPressed) {
      this.direction = 1;
    }

    this.update();
  }

  dispose() {
    this.spine.destroy();
    this.app.ticker.remove(this.update, this);
  }
}
