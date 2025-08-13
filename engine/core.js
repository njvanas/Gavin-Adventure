// Core Game Engine
class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.running = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.targetFPS = 60;
        this.frameTime = 1000 / this.targetFPS;
        
        // Scene management
        this.scenes = new Map();
        this.currentScene = null;
        this.nextScene = null;
        
        // Debug
        this.debug = false;
        this.fpsCounter = 0;
        this.fpsDisplay = 0;
        this.fpsTimer = 0;
        
        this.setupCanvas();
        this.bindDebugKeys();
    }
    
    setupCanvas() {
        // Set internal resolution
        this.canvas.width = GAME_CONFIG.CANVAS_WIDTH;
        this.canvas.height = GAME_CONFIG.CANVAS_HEIGHT;
        
        // Disable image smoothing for pixel perfect rendering
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
    }
    
    bindDebugKeys() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'F1') {
                e.preventDefault();
                this.debug = !this.debug;
            }
        });
    }
    
    addScene(name, scene) {
        this.scenes.set(name, scene);
        scene.engine = this;
    }
    
    setScene(name) {
        if (this.scenes.has(name)) {
            this.nextScene = name;
        }
    }
    
    start() {
        this.running = true;
        this.gameLoop();
    }
    
    stop() {
        this.running = false;
    }
    
    gameLoop() {
        if (!this.running) return;
        
        const currentTime = performance.now();
        this.deltaTime = Math.min(currentTime - this.lastTime, this.frameTime * 2);
        this.lastTime = currentTime;
        
        // Scene transition
        if (this.nextScene && this.scenes.has(this.nextScene)) {
            if (this.currentScene) {
                this.scenes.get(this.currentScene).exit();
            }
            this.currentScene = this.nextScene;
            this.scenes.get(this.currentScene).enter();
            this.nextScene = null;
        }
        
        // Update current scene
        if (this.currentScene && this.scenes.has(this.currentScene)) {
            this.scenes.get(this.currentScene).update(this.deltaTime);
        }
        
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB'; // Sky blue background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render current scene
        if (this.currentScene && this.scenes.has(this.currentScene)) {
            this.scenes.get(this.currentScene).render(this.ctx);
        }
        
        // Debug overlay
        if (this.debug) {
            this.renderDebug();
        }
        
        // FPS counter
        this.updateFPS();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateFPS() {
        this.fpsCounter++;
        this.fpsTimer += this.deltaTime;
        
        if (this.fpsTimer >= 1000) {
            this.fpsDisplay = Math.round(this.fpsCounter * 1000 / this.fpsTimer);
            this.fpsCounter = 0;
            this.fpsTimer = 0;
        }
    }
    
    renderDebug() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(10, 10, 200, 100);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`FPS: ${this.fpsDisplay}`, 20, 30);
        this.ctx.fillText(`Scene: ${this.currentScene || 'None'}`, 20, 50);
        this.ctx.fillText(`Delta: ${this.deltaTime.toFixed(2)}ms`, 20, 70);
        
        if (this.currentScene && this.scenes.has(this.currentScene)) {
            const scene = this.scenes.get(this.currentScene);
            if (scene.getDebugInfo) {
                const info = scene.getDebugInfo();
                let y = 90;
                for (const [key, value] of Object.entries(info)) {
                    this.ctx.fillText(`${key}: ${value}`, 20, y);
                    y += 20;
                }
            }
        }
    }
}

// Base Scene class
class Scene {
    constructor() {
        this.engine = null;
    }
    
    enter() {
        // Override in subclasses
    }
    
    exit() {
        // Override in subclasses
    }
    
    update(deltaTime) {
        // Override in subclasses
    }
    
    render(ctx) {
        // Override in subclasses
    }
    
    getDebugInfo() {
        return {};
    }
}

// Entity System
class Entity {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.width = 16;
        this.height = 16;
        this.active = true;
        this.solid = true;
        this.onGround = false;
        this.type = 'entity';
    }
    
    update(deltaTime, level) {
        if (!this.active) return;
        
        // Apply physics
        Physics.applyGravity(this, deltaTime);
        Physics.updatePosition(this, deltaTime);
        
        // Collision detection
        if (level) {
            Collision.resolveEntityTiles(this, level);
        }
    }
    
    render(ctx, camera) {
        if (!this.active) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Simple colored rectangle for base entity
        ctx.fillStyle = this.getColor();
        ctx.fillRect(screenX, screenY, this.width, this.height);
        
        // Debug hitbox
        if (window.game && window.game.debug) {
            ctx.strokeStyle = 'red';
            ctx.strokeRect(screenX, screenY, this.width, this.height);
        }
    }
    
    getColor() {
        return '#ffffff';
    }
    
    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
    
    overlaps(other) {
        const a = this.getBounds();
        const b = other.getBounds();
        
        return !(a.right <= b.left || 
                 a.left >= b.right || 
                 a.bottom <= b.top || 
                 a.top >= b.bottom);
    }
    
    destroy() {
        this.active = false;
    }
}

// Export to global scope
window.GameEngine = GameEngine;
window.Scene = Scene;
window.Entity = Entity;