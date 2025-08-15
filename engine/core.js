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
        
        // Responsive scaling
        this.internalWidth = GAME_CONFIG.CANVAS_WIDTH;
        this.internalHeight = GAME_CONFIG.CANVAS_HEIGHT;
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        
        // Debug
        this.debug = false;
        this.fpsCounter = 0;
        this.fpsDisplay = 0;
        this.fpsTimer = 0;
        
        this.setupCanvas();
        this.bindDebugKeys();
        this.setupResponsiveScaling();
    }
    
    setupCanvas() {
        // Set internal resolution
        this.canvas.width = this.internalWidth;
        this.canvas.height = this.internalHeight;
        
        // Disable image smoothing for pixel perfect rendering
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
    }
    
    setupResponsiveScaling() {
        // Calculate optimal scale for current window size
        this.updateScale();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateScale();
        });
        
        // Handle orientation change on mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.updateScale(), 100);
        });
        
        // Force update after a short delay to ensure DOM is ready
        setTimeout(() => this.updateScale(), 100);
    }
    
    updateScale() {
        const container = this.canvas.parentElement;
        if (!container) return;
        
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Calculate scale to fit within container while maintaining aspect ratio
        const scaleX = containerWidth / this.internalWidth;
        const scaleY = containerHeight / this.internalHeight;
        this.scale = Math.min(scaleX, scaleY, 4); // Max 4x scale for very large screens
        
        // Calculate centering offsets
        this.offsetX = (containerWidth - this.internalWidth * this.scale) / 2;
        this.offsetY = (containerHeight - this.internalHeight * this.scale) / 2;
        
        // Apply scaling by setting canvas size to match the scaled dimensions
        this.canvas.style.width = `${this.internalWidth * this.scale}px`;
        this.canvas.style.height = `${this.internalHeight * this.scale}px`;
        this.canvas.style.marginLeft = `${this.offsetX}px`;
        this.canvas.style.marginTop = `${this.offsetY}px`;
        
        // Keep internal resolution for rendering
        this.canvas.width = this.internalWidth;
        this.canvas.height = this.internalHeight;
        
        console.log(`Scale updated: ${this.scale.toFixed(2)}x, Container: ${containerWidth}x${containerHeight}, Game: ${this.internalWidth}x${this.internalHeight}`);
    }
    
    // Get performance statistics
    getPerformanceStats() {
        return {
            fps: this.fpsDisplay,
            frameTime: this.deltaTime,
            drawCalls: 0, // Will be updated by renderer
            entityCount: 0, // Will be updated by scenes
            scale: this.scale,
            memoryUsage: performance.memory ? performance.memory.usedJSHeapSize / 1024 / 1024 : 0
        };
    }
    
    // Force scale update (useful for debugging)
    forceScaleUpdate() {
        this.updateScale();
    }
    
    // Convert screen coordinates to game coordinates
    screenToGame(screenX, screenY) {
        return {
            x: (screenX - this.offsetX) / this.scale,
            y: (screenY - this.offsetY) / this.scale
        };
    }
    
    // Convert game coordinates to screen coordinates
    gameToScreen(gameX, gameY) {
        return {
            x: gameX * this.scale + this.offsetX,
            y: gameY * this.scale + this.offsetY
        };
    }
    
    bindDebugKeys() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'F1') {
                e.preventDefault();
                this.debug = !this.debug;
                console.log('Debug mode:', this.debug ? 'ON' : 'OFF');
            }
            if (e.key === 'F2') {
                e.preventDefault();
                // Toggle hitbox visibility for all entities
                this.toggleHitboxes();
            }
            if (e.key === 'F3') {
                e.preventDefault();
                // Debug input system
                this.debugInputSystem();
            }
            if (e.key === 'F4') {
                e.preventDefault();
                // Debug enemy movement
                this.debugEnemyMovement();
            }
        });
    }
    
    debugInputSystem() {
        if (window.input) {
            console.log('🔍 Input System Debug:');
            window.input.logInputState();
            
            // Check for stuck keys
            const stuckKeys = [];
            for (const [key, value] of Object.entries(window.input.keys)) {
                if (window.input.isKeyStuck(key)) {
                    stuckKeys.push(key);
                }
            }
            
            if (stuckKeys.length > 0) {
                console.warn('⚠️ Stuck keys detected:', stuckKeys);
                // Auto-fix stuck keys
                stuckKeys.forEach(key => window.input.resetKey(key));
                console.log('✅ Stuck keys auto-fixed');
            } else {
                console.log('✅ No stuck keys detected');
            }
        }
        
        // Debug player state if available
        if (window.game && window.game.engine && window.game.engine.currentScene) {
            const scene = window.game.engine.scenes.get(window.game.engine.currentScene);
            if (scene && scene.player) {
                console.log('🎮 Player State:', {
                    onGround: scene.player.onGround,
                    jumpHeld: scene.player.jumpHeld,
                    jumpBuffer: scene.player.jumpBuffer,
                    isStuck: scene.player.isStuck()
                });
            }
        }
    }
    
    debugEnemyMovement() {
        console.log('🎯 Enemy Movement Debug:');
        
        if (window.game && window.game.engine && window.game.engine.currentScene) {
            const scene = window.game.engine.scenes.get(window.game.engine.currentScene);
            if (scene && scene.entities) {
                const enemies = scene.entities.filter(e => e.type === 'enemy' || e.enemyType !== undefined);
                console.log(`Found ${enemies.length} enemies`);
                
                enemies.forEach((enemy, index) => {
                    console.log(`Enemy ${index + 1}:`, {
                        type: enemy.enemyType,
                        speed: enemy.speed,
                        vx: enemy.vx?.toFixed(3),
                        vy: enemy.vy?.toFixed(3),
                        direction: enemy.direction,
                        onGround: enemy.onGround,
                        position: `${enemy.x.toFixed(1)}, ${enemy.y.toFixed(1)}`
                    });
                });
            }
        }
        
        // Show current input state
        if (window.input) {
            console.log('Current Input State:', window.input.getInputState());
        }
    }
    
    toggleHitboxes() {
        // Toggle hitbox visibility for all entities in current scene
        if (this.currentScene && this.scenes.has(this.currentScene)) {
            const scene = this.scenes.get(this.currentScene);
            if (scene.entities) {
                scene.entities.forEach(entity => {
                    if (entity.showHitbox !== undefined) {
                        entity.showHitbox = !entity.showHitbox;
                    }
                });
            }
        }
        console.log('Hitboxes toggled');
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
        
        // Enhanced hitbox system
        this.hitboxOffsetX = 0;
        this.hitboxOffsetY = 0;
        this.hitboxWidth = this.width;
        this.hitboxHeight = this.height;
        this.hitboxType = 'rectangle'; // 'rectangle', 'circle', 'custom'
        this.hitboxRadius = 0; // For circular hitboxes
        
        // Visual debug
        this.showHitbox = false;
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
        if (this.showHitbox || (window.game && window.game.debug)) {
            this.renderHitbox(ctx, camera);
        }
    }
    
    renderHitbox(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        
        if (this.hitboxType === 'circle') {
            const centerX = screenX + this.hitboxOffsetX + this.hitboxWidth / 2;
            const centerY = screenY + this.hitboxOffsetY + this.hitboxHeight / 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, this.hitboxRadius, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            ctx.strokeRect(
                screenX + this.hitboxOffsetX, 
                screenY + this.hitboxOffsetY, 
                this.hitboxWidth, 
                this.hitboxHeight
            );
        }
    }
    
    getColor() {
        return '#ffffff';
    }
    
    // Set hitbox properties
    setHitbox(offsetX = 0, offsetY = 0, width = null, height = null, type = 'rectangle', radius = 0) {
        this.hitboxOffsetX = offsetX;
        this.hitboxOffsetY = offsetY;
        this.hitboxWidth = width !== null ? width : this.width;
        this.hitboxHeight = height !== null ? height : this.height;
        this.hitboxType = type;
        this.hitboxRadius = radius;
    }
    
    // Get hitbox bounds with offset
    getBounds() {
        if (this.hitboxType === 'circle') {
            const centerX = this.x + this.hitboxOffsetX + this.hitboxWidth / 2;
            const centerY = this.y + this.hitboxOffsetY + this.hitboxHeight / 2;
            return {
                left: centerX - this.hitboxRadius,
                right: centerX + this.hitboxRadius,
                top: centerY - this.hitboxRadius,
                bottom: centerY + this.hitboxRadius,
                centerX: centerX,
                centerY: centerY,
                radius: this.hitboxRadius
            };
        } else {
            return {
                left: this.x + this.hitboxOffsetX,
                right: this.x + this.hitboxOffsetX + this.hitboxWidth,
                top: this.y + this.hitboxOffsetY,
                bottom: this.y + this.hitboxOffsetY + this.hitboxHeight
            };
        }
    }
    
    // Enhanced collision detection
    overlaps(other) {
        const a = this.getBounds();
        const b = other.getBounds();
        
        if (this.hitboxType === 'circle' && other.hitboxType === 'circle') {
            // Circle vs Circle collision
            const dx = a.centerX - b.centerX;
            const dy = a.centerY - b.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < (a.radius + b.radius);
        } else if (this.hitboxType === 'circle') {
            // Circle vs Rectangle collision
            return this.circleRectOverlap(a, b);
        } else if (other.hitboxType === 'circle') {
            // Rectangle vs Circle collision
            return this.circleRectOverlap(b, a);
        } else {
            // Rectangle vs Rectangle collision
            return !(a.right <= b.left || 
                     a.left >= b.right || 
                     a.bottom <= b.top || 
                     a.top >= b.bottom);
        }
    }
    
    // Circle vs Rectangle collision detection
    circleRectOverlap(circle, rect) {
        const closestX = Math.max(rect.left, Math.min(circle.centerX, rect.right));
        const closestY = Math.max(rect.top, Math.min(circle.centerY, rect.bottom));
        
        const distanceX = circle.centerX - closestX;
        const distanceY = circle.centerY - closestY;
        
        return (distanceX * distanceX + distanceY * distanceY) < (circle.radius * circle.radius);
    }
    
    // Get precise collision response
    getCollisionResponse(other) {
        const a = this.getBounds();
        const b = other.getBounds();
        
        if (!this.overlaps(other)) {
            return { overlap: false };
        }
        
        // Calculate overlap amounts
        const overlapX = Math.min(
            Math.abs(a.right - b.left),
            Math.abs(a.left - b.right)
        );
        const overlapY = Math.min(
            Math.abs(a.bottom - b.top),
            Math.abs(a.top - b.bottom)
        );
        
        // Determine push direction (smaller overlap wins)
        let pushX = 0;
        let pushY = 0;
        
        if (overlapX < overlapY) {
            pushX = a.centerX < b.centerX ? -overlapX : overlapX;
        } else {
            pushY = a.centerY < b.centerY ? -overlapY : overlapY;
        }
        
        return {
            overlap: true,
            pushX: pushX,
            pushY: pushY,
            overlapX: overlapX,
            overlapY: overlapY
        };
    }
    
    destroy() {
        this.active = false;
    }
}

// Export to global scope
window.GameEngine = GameEngine;
window.Scene = Scene;
window.Entity = Entity;