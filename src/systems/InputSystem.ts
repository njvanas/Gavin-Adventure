import { PlayerState } from '../types/GameTypes';

export class InputSystem {
  private keys: Set<string> = new Set();
  private gamepadIndex: number | null = null;
  private deadzone: number = 0.1;

  constructor() {
    this.setupEventListeners();
    this.detectGamepad();
  }

  private setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      e.preventDefault();
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
      e.preventDefault();
    });

    window.addEventListener('gamepadconnected', (e) => {
      this.gamepadIndex = e.gamepad.index;
      console.log('Gamepad connected:', e.gamepad.id);
    });

    window.addEventListener('gamepaddisconnected', () => {
      this.gamepadIndex = null;
    });
  }

  private detectGamepad() {
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        this.gamepadIndex = i;
        break;
      }
    }
  }

  getInputState() {
    const keyboard = this.getKeyboardInput();
    const gamepad = this.getGamepadInput();

    return {
      left: keyboard.left || gamepad.left,
      right: keyboard.right || gamepad.right,
      jump: keyboard.jump || gamepad.jump,
      run: keyboard.run || gamepad.run,
      fire: keyboard.fire || gamepad.fire,
      pause: keyboard.pause || gamepad.pause,
      // Analog values for smooth movement
      horizontalAxis: gamepad.horizontalAxis || (keyboard.left ? -1 : keyboard.right ? 1 : 0)
    };
  }

  private getKeyboardInput() {
    return {
      left: this.keys.has('ArrowLeft') || this.keys.has('KeyA'),
      right: this.keys.has('ArrowRight') || this.keys.has('KeyD'),
      jump: this.keys.has('Space') || this.keys.has('ArrowUp') || this.keys.has('KeyW'),
      run: this.keys.has('ShiftLeft') || this.keys.has('ShiftRight'),
      fire: this.keys.has('KeyX') || this.keys.has('ControlLeft'),
      pause: this.keys.has('Escape') || this.keys.has('KeyP')
    };
  }

  private getGamepadInput() {
    if (this.gamepadIndex === null) {
      return {
        left: false,
        right: false,
        jump: false,
        run: false,
        fire: false,
        pause: false,
        horizontalAxis: 0
      };
    }

    const gamepad = navigator.getGamepads()[this.gamepadIndex];
    if (!gamepad) {
      return {
        left: false,
        right: false,
        jump: false,
        run: false,
        fire: false,
        pause: false,
        horizontalAxis: 0
      };
    }

    const leftStickX = Math.abs(gamepad.axes[0]) > this.deadzone ? gamepad.axes[0] : 0;
    const dpadLeft = gamepad.buttons[14]?.pressed || false;
    const dpadRight = gamepad.buttons[15]?.pressed || false;

    return {
      left: dpadLeft || leftStickX < -this.deadzone,
      right: dpadRight || leftStickX > this.deadzone,
      jump: gamepad.buttons[0]?.pressed || false, // A button
      run: gamepad.buttons[1]?.pressed || false, // B button
      fire: gamepad.buttons[2]?.pressed || false, // X button
      pause: gamepad.buttons[9]?.pressed || false, // Start button
      horizontalAxis: leftStickX
    };
  }

  isKeyPressed(key: string): boolean {
    return this.keys.has(key);
  }

  isKeyJustPressed(key: string): boolean {
    // This would need frame-based tracking for "just pressed" detection
    // Implementation depends on your game loop structure
    return false;
  }
}