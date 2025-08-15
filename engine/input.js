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
            // Don't prevent default for all keys - only game-specific ones
            const action = this.keyMap[e.code];
            if (action) {
                e.preventDefault();
                console.log(`🔽 Key pressed: ${e.code} -> ${action} (was: ${this.keys[action]})`); // Enhanced debug log
                if (!this.keys[action]) {
                    this.keysPressed[action] = true;
                }
                this.keys[action] = true;
                console.log(`✅ Key state after press: ${action} = ${this.keys[action]}, all keys:`, this.keys); // Enhanced state confirmation
            }
        });
        
        window.addEventListener('keyup', (e) => {
            const action = this.keyMap[e.code];
            if (action) {
                e.preventDefault();
                console.log(`🔼 Key released: ${e.code} -> ${action} (was: ${this.keys[action]})`); // Enhanced debug log
                this.keys[action] = false;
                this.keysReleased[action] = true;
                console.log(`✅ Key state after release: ${action} = ${this.keys[action]}, all keys:`, this.keys); // Enhanced state confirmation
            }
        });
        
        // Handle window focus/blur to prevent stuck keys
        window.addEventListener('blur', () => {
            console.log('🔄 Window blur - clearing inputs');
            this.clearAllInputs();
        });
        
        window.addEventListener('focus', () => {
            console.log('🔄 Window focus - clearing inputs');
            this.clearAllInputs();
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
        
        // Mouse events for desktop testing
        element.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.touchControls[action] = true;
            if (!this.keys[action]) {
                this.keysPressed[action] = true;
            }
            this.keys[action] = true;
        });
        
        element.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.touchControls[action] = false;
            this.keys[action] = false;
            this.keysReleased[action] = true;
        });
        
        element.addEventListener('mouseleave', (e) => {
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
        
        // Clear frame-specific states at the END of the frame
        // This ensures all systems have processed the input
        // REMOVED: requestAnimationFrame clearing that was causing keys to be cleared immediately
        
        // Only clear the frame-specific states, not the main keys state
        // The main keys state should persist until keys are actually released
    }
    
    // Clear frame-specific states (called after all systems have processed input)
    clearFrameStates() {
        console.log(`🧹 Clearing frame states, keys before:`, this.keys); // Debug: show keys before clearing
        this.keysPressed = {};
        this.keysReleased = {};
        console.log(`🧹 Frame states cleared, keys after:`, this.keys); // Debug: show keys after clearing
    }
    
    // Force clear all input states (useful for debugging)
    clearAllInputs() {
        this.keys = {};
        this.keysPressed = {};
        this.keysReleased = {};
        this.touchControls = {
            left: false,
            right: false,
            down: false,
            jump: false,
            run: false,
            throw: false
        };
    }
    
    // Check if any input is currently active
    hasActiveInput() {
        return Object.values(this.keys).some(key => key === true) ||
               Object.values(this.touchControls).some(control => control === true);
    }
    
    // Validate input states and fix any inconsistencies
    validateInputs() {
        // Check for stuck keys and fix them
        for (const [key, value] of Object.entries(this.keys)) {
            if (value === true) {
                // If a key is "down" but we haven't seen it in a while, it might be stuck
                if (!this.keysPressed[key] && !this.keysReleased[key]) {
                    // This key might be stuck - reset it
                    this.resetKey(key);
                }
            }
        }
        
        // Ensure touch controls are consistent with key states
        for (const [control, value] of Object.entries(this.touchControls)) {
            if (value === true && !this.keys[control]) {
                // Touch control is active but key state is not - sync them
                this.keys[control] = true;
            }
        }
    }
    
    // Enhanced input checking with validation
    isDown(action) {
        // Simple, direct input checking without validation
        const result = this.keys[action] || false;
        // Debug: Log when isDown is called (but limit frequency to avoid spam)
        if (Math.random() < 0.05) { // 5% chance to log
            console.log(`🔍 isDown(${action}) called, returning: ${result}, current keys:`, this.keys);
        }
        return result;
    }
    
    isPressed(action) {
        return this.keysPressed[action] || false;
    }
    
    isReleased(action) {
        return this.keysReleased[action] || false;
    }
    
    // Debug methods
    getInputState() {
        return {
            keys: { ...this.keys },
            keysPressed: { ...this.keysPressed },
            keysReleased: { ...this.keysReleased },
            touchControls: { ...this.touchControls },
            gamepadIndex: this.gamepadIndex,
            hasActiveInput: this.hasActiveInput()
        };
    }
    
    logInputState() {
        console.log('Input State:', this.getInputState());
    }
    
    // Force reset a specific key
    resetKey(action) {
        this.keys[action] = false;
        this.keysPressed[action] = false;
        this.keysReleased[action] = false;
        if (this.touchControls.hasOwnProperty(action)) {
            this.touchControls[action] = false;
        }
    }
    
    // Check if a key is stuck
    isKeyStuck(action) {
        return this.keys[action] && !this.hasActiveInput();
    }
}

// Export to global scope
window.InputManager = InputManager;

// Global input debugging functions
window.resetAllInputs = () => {
    if (window.input) {
        window.input.clearAllInputs();
        console.log('✅ All inputs reset');
    } else {
        console.log('❌ Input system not available');
    }
};

window.debugInputs = () => {
    if (window.input) {
        window.input.logInputState();
    } else {
        console.log('❌ Input system not available');
    }
};

window.fixStuckKeys = () => {
    if (window.input) {
        const stuckKeys = [];
        for (const [key, value] of Object.entries(window.input.keys)) {
            if (window.input.isKeyStuck(key)) {
                stuckKeys.push(key);
                window.input.resetKey(key);
            }
        }
        
        if (stuckKeys.length > 0) {
            console.log(`✅ Fixed ${stuckKeys.length} stuck keys:`, stuckKeys);
        } else {
            console.log('✅ No stuck keys found');
        }
    } else {
        console.log('❌ Input system not available');
    }
};

// Test input system
window.testInputs = () => {
    if (window.input) {
        console.log('🧪 Testing Input System...');
        
        // Test key states
        console.log('Current key states:', window.input.keys);
        console.log('Left key:', window.input.isDown('left'));
        console.log('Right key:', window.input.isDown('right'));
        console.log('Jump key:', window.input.isDown('jump'));
        
        // Test if input system is responsive
        console.log('Input system ready:', !!window.input);
        console.log('Key map:', window.input.keyMap);
    } else {
        console.log('❌ Input system not available');
    }
};

// Manually set a key state for testing
window.setKeyState = (action, state) => {
    if (window.input) {
        console.log(`🔧 Manually setting ${action} to ${state}`);
        window.input.keys[action] = state;
        if (state) {
            window.input.keysPressed[action] = true;
        } else {
            window.input.keysReleased[action] = true;
        }
        console.log(`✅ Key state set: ${action} = ${window.input.keys[action]}`);
    } else {
        console.log('❌ Input system not available');
    }
};