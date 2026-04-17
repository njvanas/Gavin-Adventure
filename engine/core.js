(function () {
    class GameEngine {
        constructor(canvas) {
            this.canvas = canvas;
            this.running = false;
            this.lastTime = 0;
            this.scene = null;
            this._boundFrame = (t) => this._frame(t);
        }

        setScene(scene) {
            if (this.scene && this.scene.exit) this.scene.exit();
            this.scene = scene;
            if (scene && scene.enter) scene.enter();
        }

        start() {
            if (this.running) return;
            this.running = true;
            this.lastTime = performance.now();
            requestAnimationFrame(this._boundFrame);
        }

        stop() {
            this.running = false;
        }

        _frame(time) {
            if (!this.running) return;
            let delta = time - this.lastTime;
            this.lastTime = time;
            if (delta > 50) delta = 50;
            if (delta < 0) delta = 16;

            if (this.scene && this.scene.update) this.scene.update(delta);
            if (this.scene && this.scene.render) this.scene.render();

            requestAnimationFrame(this._boundFrame);
        }
    }

    window.GameEngine = GameEngine;
})();
