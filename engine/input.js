// Input Management System
class InputManager {
    constructor() {
        this.keys = {};
        this.keysPressed = {};
        this.keysReleased = {};
        this.gamepadIndex = -1;
        this.gamepadButtons = {};
        this.gamepadAxes = {};
        
        // Mobile touch controls
        this.touchControls = {
            left: false,
            right: false,
            down: false,
            jump: false,
            run: false,
            throw: false
        };
        
        this.setupKeyboardEvents();
        this.setupGamepadEvents();
        this.setupMobileControls();
        
        // Key mappings
        this.keyMap = {
            'ArrowLeft': 'left',
            'KeyA': 'left',
            'ArrowRight': 'right',
            'KeyD': 'right',
            'ArrowDown': 'down',
            'KeyS': 'down',
            'Space': 'jump',
            'KeyZ': 'jump',
            'KeyX': 'run',
            'ShiftLeft': 'run',
            'KeyC': 'throw',
            'Enter': 'start',
            'Escape': 'pause'
        };
    }
    
    setupKeyboardEvents() {
        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            const action = this.keyMap[e.code];
            if (action) {
                if (!this.keys[action]) {
                    this.keysPressed[action] = true;
                }
                this.keys[action] = true;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            e.preventDefault();
            const action = this.keyMap[e.code];
            if (action) {
                this.keys[action] = false;
                this.keysReleased[action] = true;
            }
        });
        
        // Prevent context menu
        window.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    setupGamepadEvents() {
        window.addEventListener('gamepadconnected', (e) => {
            this.gamepadIndex = e.gamepad.index;
            console.log('Gamepad connected:', e.gamepad.id);
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            if (e.gamepad.index === this.gamepadIndex) {
                this.gamepadIndex = -1;
            }
        });
    }
    
    setupMobileControls() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            document.getElementById('mobileControls').style.display = 'flex';
            
            // Touch event handlers
            this.setupTouchButton('leftBtn', 'left');
            this.setupTouchButton('rightBtn', 'right');
            this.setupTouchButton('downBtn', 'down');
            this.setupTouchButton('jumpBtn', 'jump');
            this.setupTouchButton('runBtn', 'run');
            this.setupTouchButton('throwBtn', 'throw');
        }
    }
    
    setupTouchButton(elementId, action) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchControls[action] = true;
            if (!this.keys[action]) {
                this.keysPressed[action] = true;
            }
            this.keys[action] = true;
        });
        
        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchControls[action] = false;
            this.keys[action] = false;
            this.keysReleased[action] = true;
        });
        
        element.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.touchControls[action] = false;
            this.keys[action] = false;
        });
    }
    
    updateGamepad() {
        if (this.gamepadIndex === -1) return;
        
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[this.gamepadIndex];
        
        if (!gamepad) {
            this.gamepadIndex = -1;
            return;
        }
        
        // D-pad and analog stick
        const leftPressed = gamepad.buttons[14]?.pressed || gamepad.axes[0] < -0.5;
        const rightPressed = gamepad.buttons[15]?.pressed || gamepad.axes[0] > 0.5;
        const downPressed = gamepad.buttons[13]?.pressed || gamepad.axes[1] > 0.5;
        
        // Face buttons (Xbox: A=0, B=1, X=2, Y=3)
        const jumpPressed = gamepad.buttons[0]?.pressed; // A
        const runPressed = gamepad.buttons[2]?.pressed; // X
        const throwPressed = gamepad.buttons[1]?.pressed; // B
        const pausePressed = gamepad.buttons[9]?.pressed; // Start
        
        // Update keys from gamepad
        this.updateGamepadButton('left', leftPressed);
        this.updateGamepadButton('right', rightPressed);
        this.updateGamepadButton('down', downPressed);
        this.updateGamepadButton('jump', jumpPressed);
        this.updateGamepadButton('run', runPressed);
        this.updateGamepadButton('throw', throwPressed);
        this.updateGamepadButton('pause', pausePressed);
    }
    
    updateGamepadButton(action, pressed) {
        const wasPressed = this.gamepadButtons[action] || false;
        this.gamepadButtons[action] = pressed;
        
        if (pressed && !wasPressed) {
            if (!this.keys[action]) {
                this.keysPressed[action] = true;
            }
            this.keys[action] = true;
        } else if (!pressed && wasPressed) {
            this.keys[action] = false;
            this.keysReleased[action] = true;
        }
    }
    
    update() {
        this.updateGamepad();
        
        // Clear frame-specific states
        this.keysPressed = {};
        this.keysReleased = {};
    }
    
    isDown(action) {
        return this.keys[action] || false;
    }
    
    isPressed(action) {
        return this.keysPressed[action] || false;
    }
    
    isReleased(action) {
        return this.keysReleased[action] || false;
    }
}

// Export to global scope
window.InputManager = InputManager;