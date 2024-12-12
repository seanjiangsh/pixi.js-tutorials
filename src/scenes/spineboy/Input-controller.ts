import JoystickController, {
  JoystickOptions,
  JoystickOnMove,
} from "joystick-controller";

// Map keyboard key codes to controller's state keys
const keyMap: { [key: string]: string } = {
  Space: "space",
  KeyW: "up",
  ArrowUp: "up",
  KeyA: "left",
  ArrowLeft: "left",
  KeyS: "down",
  ArrowDown: "down",
  KeyD: "right",
  ArrowRight: "right",
};

const joystickConfig: JoystickOptions = {
  dynamicPosition: true,
  hideContextMenu: true,
  maxRange: 35,
  mouseClickButton: import.meta.env.PROD ? "ALL" : "RIGHT",
};

// Class for handling keyboard inputs.
type Keys = {
  [key: string]: {
    pressed: boolean;
    doubleTap: boolean;
    timestamp: number;
  };
};

export default class InputController {
  keys: Keys;
  joyStick: JoystickController;

  constructor() {
    // The controller's state.
    this.keys = {
      up: { pressed: false, doubleTap: false, timestamp: 0 },
      left: { pressed: false, doubleTap: false, timestamp: 0 },
      down: { pressed: false, doubleTap: false, timestamp: 0 },
      right: { pressed: false, doubleTap: false, timestamp: 0 },
      space: { pressed: false, doubleTap: false, timestamp: 0 },
    };

    // Register event listeners for keydown and keyup events.
    window.addEventListener("keydown", this.keydownHandler);
    window.addEventListener("keyup", this.keyupHandler);
    // Adding joystick
    this.joyStick = new JoystickController(joystickConfig, this.joyStickOnMove);
  }

  private getTargetKey(code: string) {
    const key = keyMap[code];
    if (!key) return;
    return this.keys[key];
  }

  private keydownHandler = (event: KeyboardEvent) => {
    const key = this.getTargetKey(event.code);
    if (!key) return;

    const now = Date.now();
    key.pressed = true;
    key.doubleTap = key.doubleTap || now - key.timestamp < 300;
  };

  private keyupHandler = (event: KeyboardEvent) => {
    const key = this.getTargetKey(event.code);
    if (!key) return;

    const now = Date.now();
    key.pressed = false;
    if (key.doubleTap) key.doubleTap = false;
    else key.timestamp = now;
  };

  private getDirectionFromJoystick(move: JoystickOnMove) {
    const threshold = 10;
    const { x, y } = move;
    const direction: { [key: string]: boolean } = {
      up: y > threshold,
      space: y < -threshold,
      left: x < -threshold,
      right: x > threshold,
    };
    return direction;
  }

  private joyStickOnMove = (move: JoystickOnMove) => {
    const direction = this.getDirectionFromJoystick(move);

    for (const key in direction) {
      this.keys[key].pressed = direction[key];
    }

    const { x } = move;
    const runThreshold = Math.abs(x) > 30;
    const { left, right } = this.keys;
    // console.log({ x, runThreshold });
    if (direction.left) {
      left.doubleTap = runThreshold;
    } else if (direction.right) {
      right.doubleTap = runThreshold;
    } else {
      left.doubleTap = false;
      right.doubleTap = false;
    }
  };

  dispose() {
    window.removeEventListener("keydown", this.keydownHandler);
    window.removeEventListener("keyup", this.keyupHandler);
  }
}
