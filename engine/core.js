// Core Game Engine
class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.running = false;
        this.targetFPS = 60;
        this.frameTime = 1000 / this.targetFPS;
        
        // Enhanced timing system
        this.lastTime = 0;
        this.deltaTime = 0;
        this.accumulator = 0;
        this.currentTime = performance.now();
        
        // Performance monitoring
        this.frameStats = {
            fps: 60,
            frameTime: 16.67,
            drawCalls: 0,
            entityCount: 0,
            memoryUsage: 0
        };
        this.fpsHistory = [];
        this.performanceProfiler = new PerformanceProfiler();
        
        // Scene management
        this.scenes = new Map();
        this.currentScene = null;
        this.nextScene = null;
        
        // Debug
        this.debug = false;
        this.fpsCounter = 0;
        this.fpsDisplay = 0;
        this.fpsTimer = 0;
        
        // High-DPI support
        this.pixelRatio = window.devicePixelRatio || 1;
        
        this.setupCanvas();
        this.bindDebugKeys();
    }
    
    setupCanvas() {
        // Set canvas size to match config
        this.canvas.width = GAME_CONFIG.CANVAS_WIDTH;
        this.canvas.height = GAME_CONFIG.CANVAS_HEIGHT;
        
        // Scale canvas for better visibility (2x scale)
        this.canvas.style.width = (GAME_CONFIG.CANVAS_WIDTH * 2) + 'px';
        this.canvas.style.height = (GAME_CONFIG.CANVAS_HEIGHT * 2) + 'px';
        
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
            if (e.key === 'F2') {
                e.preventDefault();
                this.performanceProfiler.toggleProfiling();
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
        this.currentTime = performance.now();
        this.gameLoop(this.currentTime);
    }
    
    stop() {
        this.running = false;
    }
    
    gameLoop(timestamp) {
        if (!this.running) return;
        
        // Simple variable timestep for smooth movement
        const newTime = timestamp;
        const deltaTime = Math.min(newTime - this.currentTime, 33.33); // Cap at 30fps minimum
        this.currentTime = newTime;
        
        this.performanceProfiler.startFrame();
        
        // Scene transition
        if (this.nextScene && this.scenes.has(this.nextScene)) {
            if (this.currentScene) {
                this.scenes.get(this.currentScene).exit();
            }
            this.currentScene = this.nextScene;
            this.scenes.get(this.currentScene).enter();
            this.nextScene = null;
        }
        
        // Variable timestep update for smooth movement
        if (this.currentScene && this.scenes.has(this.currentScene)) {
            this.scenes.get(this.currentScene).update(deltaTime);
        }
        
        // Rendering
        if (this.currentScene && this.scenes.has(this.currentScene)) {
            this.scenes.get(this.currentScene).preRender(1.0);
        }
        
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB'; // Sky blue background
        this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        
        // Render current scene
        if (this.currentScene && this.scenes.has(this.currentScene)) {
            this.scenes.get(this.currentScene).render(this.ctx);
        }
        
        // Debug overlay
        if (this.debug) {
            this.renderDebug();
        }
        
        // FPS counter
        this.updateFPS(deltaTime);
        
        this.performanceProfiler.endFrame();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    updateFPS(frameTime) {
        this.fpsCounter++;
        this.fpsTimer += frameTime;
        
        if (this.fpsTimer >= 1000) {
            this.fpsDisplay = Math.round(this.fpsCounter * 1000 / this.fpsTimer);
            this.frameStats.fps = this.fpsDisplay;
            this.frameStats.frameTime = this.fpsTimer / this.fpsCounter;
            
            // Track FPS history for performance analysis
            this.fpsHistory.push(this.fpsDisplay);
            if (this.fpsHistory.length > 60) {
                this.fpsHistory.shift();
            }
            
            this.fpsCounter = 0;
            this.fpsTimer = 0;
        }
    }
    
    renderDebug() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(10, 10, 300, 180);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`FPS: ${this.fpsDisplay}`, 20, 30);
        this.ctx.fillText(`Frame Time: ${this.frameStats.frameTime.toFixed(2)}ms`, 20, 50);
        this.ctx.fillText(`Scene: ${this.currentScene || 'None'}`, 20, 70);
        this.ctx.fillText(`Canvas: ${this.canvas.width}x${this.canvas.height}`, 20, 90);
        this.ctx.fillText(`Draw Calls: ${this.frameStats.drawCalls}`, 20, 110);
        this.ctx.fillText(`Entities: ${this.frameStats.entityCount}`, 20, 130);
        
        // Performance warnings
        if (this.frameStats.fps < 50) {
            this.ctx.fillStyle = 'red';
            this.ctx.fillText('⚠ LOW FPS WARNING', 20, 150);
        }
        
        if (this.frameStats.frameTime > 20) {
            this.ctx.fillStyle = 'orange';
            this.ctx.fillText('⚠ HIGH FRAME TIME', 20, 170);
        }
        
        if (this.currentScene && this.scenes.has(this.currentScene)) {
            const scene = this.scenes.get(this.currentScene);
            if (scene.getDebugInfo) {
                const info = scene.getDebugInfo();
                let y = 190;
                for (const [key, value] of Object.entries(info)) {
                    this.ctx.fillStyle = 'white';
                    this.ctx.fillText(`${key}: ${value}`, 20, y);
                    y += 20;
                }
            }
        }
    }
    
    getPerformanceStats() {
        return {
            ...this.frameStats,
            avgFPS: this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length || 0,
            minFPS: Math.min(...this.fpsHistory) || 0,
            maxFPS: Math.max(...this.fpsHistory) || 0
        };
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
    
    preRender(interpolation) {
        // Override in subclasses for interpolation
    }
    
    render(ctx) {
        // Override in subclasses
    }
    
    getDebugInfo() {
        return {};
    }
}

// Performance Profiler
class PerformanceProfiler {
    constructor() {
        this.enabled = false;
        this.frameStart = 0;
        this.samples = [];
        this.maxSamples = 120; // 2 seconds at 60fps
    }
    
    toggleProfiling() {
        this.enabled = !this.enabled;
        console.log('Performance profiling:', this.enabled ? 'ON' : 'OFF');
    }
    
    startFrame() {
        if (!this.enabled) return;
        this.frameStart = performance.now();
    }
    
    endFrame() {
        if (!this.enabled) return;
        
        const frameTime = performance.now() - this.frameStart;
        this.samples.push({
            frameTime,
            timestamp: Date.now(),
            memoryUsage: this.getMemoryUsage()
        });
        
        if (this.samples.length > this.maxSamples) {
            this.samples.shift();
        }
        
        // Check for performance issues
        if (frameTime > 20) {
            console.warn(`Performance warning: Frame time ${frameTime.toFixed(2)}ms`);
        }
    }
    
    getMemoryUsage() {
        if (performance.memory) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }
    
    getReport() {
        if (this.samples.length === 0) return null;
        
        const frameTimes = this.samples.map(s => s.frameTime);
        const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const maxFrameTime = Math.max(...frameTimes);
        const minFrameTime = Math.min(...frameTimes);
        
        return {
            avgFrameTime: avgFrameTime.toFixed(2),
            maxFrameTime: maxFrameTime.toFixed(2),
            minFrameTime: minFrameTime.toFixed(2),
            avgFPS: (1000 / avgFrameTime).toFixed(1),
            sampleCount: this.samples.length
        };
    }
}
// Entity System
class Entity {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.prevX = x; // For interpolation
        this.prevY = y;
        this.vx = 0;
        this.vy = 0;
        this.width = 16;
        this.height = 16;
        this.active = true;
        this.solid = true;
        this.onGround = false;
        this.type = 'entity';
        this.id = Date.now() + Math.random(); // Unique ID
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
window.PerformanceProfiler = PerformanceProfiler;