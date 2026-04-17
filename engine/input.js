(function () {
    const KeyMap = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
        KeyA: 'left',
        KeyD: 'right',
        KeyW: 'up',
        KeyS: 'down',
        Space: 'jump',
        KeyZ: 'jump',
        KeyX: 'run',
        KeyC: 'run',
        ShiftLeft: 'run',
        ShiftRight: 'run',
        KeyP: 'pause',
        Escape: 'pause',
        Enter: 'confirm'
    };

    class InputManager {
        constructor() {
            this.keys = {};
            this.keysJustPressed = {};
            this.enabled = true;
            this._boundDown = (e) => this._onKeyDown(e);
            this._boundUp = (e) => this._onKeyUp(e);
            window.addEventListener('keydown', this._boundDown);
            window.addEventListener('keyup', this._boundUp);
        }

        _onKeyDown(e) {
            if (!this.enabled) return;
            const a = KeyMap[e.code];
            if (a) {
                if (!this.keys[a]) this.keysJustPressed[a] = true;
                this.keys[a] = true;
                if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
            }
        }

        _onKeyUp(e) {
            const a = KeyMap[e.code];
            if (a) this.keys[a] = false;
        }

        isDown(action) {
            return !!this.keys[action];
        }

        isPressed(action) {
            return !!this.keysJustPressed[action];
        }

        clearJustPressed() {
            this.keysJustPressed = {};
        }

        destroy() {
            window.removeEventListener('keydown', this._boundDown);
            window.removeEventListener('keyup', this._boundUp);
        }
    }

    window.InputManager = InputManager;
})();
