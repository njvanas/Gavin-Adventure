export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  jumpPressed: boolean;
  action: boolean;
  actionPressed: boolean;
  pause: boolean;
  pausePressed: boolean;
}

export interface InputConfig {
  enableGamepad: boolean;
  deadzone: number;
  keyRepeatDelay: number;
  keyRepeatInterval: number;
}

export class InputSystem {
  private config: InputConfig;
  private currentState: InputState;
  private previousState: InputState;
  private gamepadState: InputState;
  private keysPressed: Set<string>;
  private gamepadIndex: number | null;

  constructor(config: Partial<InputConfig> = {}) {
    this.config = {
      enableGamepad: true,
      deadzone: 0.1,
      keyRepeatDelay: 500,
      keyRepeatInterval: 50,
      ...config
    };

    this.currentState = this.createEmptyInputState();
    this.previousState = this.createEmptyInputState();
    this.gamepadState = this.createEmptyInputState();
    this.keysPressed = new Set();
    this.gamepadIndex = null;

    this.initializeEventListeners();
  }

  private createEmptyInputState(): InputState {
    return {
      left: false,
      right: false,
      jump: false,
      jumpPressed: false,
      action: false,
      actionPressed: false,
      pause: false,
      pausePressed: false
    };
  }

  private initializeEventListeners(): void {
    // Keyboard events
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    
    // Gamepad events
    if (this.config.enableGamepad) {
      window.addEventListener('gamepadconnected', this.handleGamepadConnected.bind(this));
      window.addEventListener('gamepaddisconnected', this.handleGamepadDisconnected.bind(this));
    }

    // Prevent default behavior for game keys
    document.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    this.keysPressed.add(key);
    
    // Update current state
    switch (key) {
      case 'arrowleft':
      case 'a':
      case 'q':
        this.currentState.left = true;
        break;
      case 'arrowright':
      case 'd':
        this.currentState.right = true;
        break;
      case 'arrowup':
      case 'w':
      case ' ':
      case 'z':
        this.currentState.jump = true;
        break;
      case 'enter':
      case 'x':
      case 'c':
        this.currentState.action = true;
        break;
      case 'escape':
      case 'p':
        this.currentState.pause = true;
        break;
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    this.keysPressed.delete(key);
    
    // Update current state
    switch (key) {
      case 'arrowleft':
      case 'a':
      case 'q':
        this.currentState.left = false;
        break;
      case 'arrowright':
      case 'd':
        this.currentState.right = false;
        break;
      case 'arrowup':
      case 'w':
      case ' ':
      case 'z':
        this.currentState.jump = false;
        break;
      case 'enter':
      case 'x':
      case 'c':
        this.currentState.action = false;
        break;
      case 'escape':
      case 'p':
        this.currentState.pause = false;
        break;
    }
  }

  private handleGamepadConnected(event: GamepadEvent): void {
    if (this.gamepadIndex === null) {
      this.gamepadIndex = event.gamepad.index;
      console.log(`Gamepad connected: ${event.gamepad.id}`);
    }
  }

  private handleGamepadDisconnected(event: GamepadEvent): void {
    if (this.gamepadIndex === event.gamepad.index) {
      this.gamepadIndex = null;
      console.log('Gamepad disconnected');
    }
  }

  private updateGamepadState(): void {
    if (this.gamepadIndex === null) return;

    const gamepad = navigator.getGamepads()[this.gamepadIndex];
    if (!gamepad) return;

    // Left stick for movement
    const leftStickX = gamepad.axes[0];
    const leftStickY = gamepad.axes[1];

    // Apply deadzone
    if (Math.abs(leftStickX) > this.config.deadzone) {
      this.gamepadState.left = leftStickX < -this.config.deadzone;
      this.gamepadState.right = leftStickX > this.config.deadzone;
    } else {
      this.gamepadState.left = false;
      this.gamepadState.right = false;
    }

    // Buttons
    this.gamepadState.jump = gamepad.buttons[0]?.pressed || false; // A button
    this.gamepadState.action = gamepad.buttons[1]?.pressed || false; // B button
    this.gamepadState.pause = gamepad.buttons[9]?.pressed || false; // Start button
  }

  update(): void {
    // Update gamepad state
    this.updateGamepadState();

    // Merge keyboard and gamepad input
    const mergedState: InputState = {
      left: this.currentState.left || this.gamepadState.left,
      right: this.currentState.right || this.gamepadState.right,
      jump: this.currentState.jump || this.gamepadState.jump,
      jumpPressed: this.currentState.jump || this.gamepadState.jump,
      action: this.currentState.action || this.gamepadState.action,
      actionPressed: this.currentState.action || this.gamepadState.action,
      pause: this.currentState.pause || this.gamepadState.pause,
      pausePressed: this.currentState.pause || this.gamepadState.pause
    };

    // Calculate "pressed" states (true only on first frame)
    mergedState.jumpPressed = mergedState.jump && !this.previousState.jump;
    mergedState.actionPressed = mergedState.action && !this.previousState.action;
    mergedState.pausePressed = mergedState.pause && !this.previousState.pause;

    // Update states
    this.previousState = { ...this.currentState };
    this.currentState = mergedState;
  }

  getInputState(): InputState {
    return { ...this.currentState };
  }

  // Check if a specific key is currently pressed
  isKeyPressed(key: string): boolean {
    return this.keysPressed.has(key.toLowerCase());
  }

  // Check if any movement input is active
  hasMovementInput(): boolean {
    return this.currentState.left || this.currentState.right;
  }

  // Check if jump was just pressed this frame
  wasJumpPressed(): boolean {
    return this.currentState.jumpPressed;
  }

  // Check if action was just pressed this frame
  wasActionPressed(): boolean {
    return this.currentState.actionPressed;
  }

  // Check if pause was just pressed this frame
  wasPausePressed(): boolean {
    return this.currentState.pausePressed;
  }

  // Get movement direction (-1 for left, 0 for none, 1 for right)
  getMovementDirection(): number {
    if (this.currentState.left) return -1;
    if (this.currentState.right) return 1;
    return 0;
  }

  // Reset all input states
  reset(): void {
    this.currentState = this.createEmptyInputState();
    this.previousState = this.createEmptyInputState();
    this.gamepadState = this.createEmptyInputState();
    this.keysPressed.clear();
  }

  // Cleanup event listeners
  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('gamepadconnected', this.handleGamepadConnected);
    window.removeEventListener('gamepaddisconnected', this.handleGamepadDisconnected);
  }
}