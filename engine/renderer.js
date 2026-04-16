// Rendering System
class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.camera = { x: 0, y: 0 };
        this.shake = { x: 0, y: 0, intensity: 0, duration: 0 };
        this.scale = 1;
        
        // Enhanced rendering features
        this.lightingEnabled = false;
        this.lightingCanvas = null;
        this.lightingCtx = null;
        this.lights = [];
        this.drawCallCount = 0;
        
        // Post-processing effects
        this.effects = {
            bloom: false,
            colorGrading: false,
            scanlines: false
        };
        
        this.initializeLighting();
    }
    
    initializeLighting() {
        this.lightingCanvas = document.createElement('canvas');
        this.lightingCanvas.width = GAME_CONFIG.CANVAS_WIDTH;
        this.lightingCanvas.height = GAME_CONFIG.CANVAS_HEIGHT;
        this.lightingCtx = this.lightingCanvas.getContext('2d');
        this.lightingCtx.imageSmoothingEnabled = false;
    }
    
    setCamera(x, y) {
        this.camera.x = x;
        this.camera.y = y;
    }
    
    addShake(intensity, duration) {
        this.shake.intensity = Math.max(this.shake.intensity, intensity);
        this.shake.duration = Math.max(this.shake.duration, duration);
    }
    
    updateShake(deltaTime) {
        if (this.shake.duration > 0) {
            this.shake.duration -= deltaTime;
            this.shake.x = (Math.random() - 0.5) * this.shake.intensity;
            this.shake.y = (Math.random() - 0.5) * this.shake.intensity;
            
            if (this.shake.duration <= 0) {
                this.shake.x = 0;
                this.shake.y = 0;
                this.shake.intensity = 0;
            }
        }
    }
    
    startFrame() {
        this.drawCallCount = 0;
        
        if (this.lightingEnabled) {
            // Clear lighting canvas
            this.lightingCtx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Ambient light
            this.lightingCtx.fillRect(0, 0, this.lightingCanvas.width, this.lightingCanvas.height);
        }
    }
    
    endFrame() {
        if (this.lightingEnabled && this.lights.length > 0) {
            this.renderLighting();
        }
        
        // Apply post-processing effects
        this.applyPostProcessing();
        
        // Update performance stats
        if (window.game && window.game.frameStats) {
            window.game.frameStats.drawCalls = this.drawCallCount;
        }
    }
    
    clear(color = '#87CEEB') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        this.drawCallCount++;
    }
    
    drawRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            Math.floor(x - this.camera.x + this.shake.x),
            Math.floor(y - this.camera.y + this.shake.y),
            width,
            height
        );
        this.drawCallCount++;
    }
    
    drawSprite(sprite, x, y, width = sprite.width, height = sprite.height) {
        if (!sprite || !sprite.image) return;
        
        this.ctx.drawImage(
            sprite.image,
            sprite.x, sprite.y, sprite.width, sprite.height,
            Math.floor(x - this.camera.x + this.shake.x),
            Math.floor(y - this.camera.y + this.shake.y),
            width, height
        );
        this.drawCallCount++;
    }
    
    drawSpriteWithEffects(sprite, x, y, effects = {}) {
        if (!sprite || !sprite.image) return;
        
        this.ctx.save();
        
        // Apply effects
        if (effects.glow) {
            this.ctx.shadowColor = effects.glow.color || '#ffffff';
            this.ctx.shadowBlur = effects.glow.intensity || 5;
        }
        
        if (effects.alpha) {
            this.ctx.globalAlpha = effects.alpha;
        }
        
        if (effects.scale) {
            const centerX = x + sprite.width / 2;
            const centerY = y + sprite.height / 2;
            this.ctx.translate(centerX, centerY);
            this.ctx.scale(effects.scale, effects.scale);
            this.ctx.translate(-centerX, -centerY);
        }
        
        this.drawSprite(sprite, x, y);
        
        this.ctx.restore();
    }
    
    drawText(text, x, y, color = 'white', font = '12px monospace') {
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.fillText(text, x, y);
        this.drawCallCount++;
    }
    
    drawTextCentered(text, x, y, color = 'white', font = '12px monospace') {
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, x, y);
        this.ctx.textAlign = 'left'; // Reset
        this.drawCallCount++;
    }
    
    drawCircle(x, y, radius, color, fill = true) {
        this.ctx.beginPath();
        this.ctx.arc(
            Math.floor(x - this.camera.x + this.shake.x),
            Math.floor(y - this.camera.y + this.shake.y),
            radius,
            0,
            Math.PI * 2
        );
        
        if (fill) {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }
        this.drawCallCount++;
    }
    
    drawLine(x1, y1, x2, y2, color, width = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(
            Math.floor(x1 - this.camera.x + this.shake.x),
            Math.floor(y1 - this.camera.y + this.shake.y)
        );
        this.ctx.lineTo(
            Math.floor(x2 - this.camera.x + this.shake.x),
            Math.floor(y2 - this.camera.y + this.shake.y)
        );
        this.ctx.stroke();
        this.drawCallCount++;
    }
    
    drawHitbox(entity, color = 'red') {
        const bounds = entity.getBounds();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(
            Math.floor(bounds.left - this.camera.x + this.shake.x),
            Math.floor(bounds.top - this.camera.y + this.shake.y),
            bounds.right - bounds.left,
            bounds.bottom - bounds.top
        );
        this.drawCallCount++;
    }
    
    // Enhanced lighting system
    addLight(x, y, radius, intensity = 1.0, color = '255, 255, 255') {
        this.lights.push({
            x, y, radius, intensity, color,
            id: Date.now() + Math.random()
        });
    }
    
    removeLight(id) {
        this.lights = this.lights.filter(light => light.id !== id);
    }
    
    clearLights() {
        this.lights = [];
    }
    
    renderLighting() {
        if (!this.lightingEnabled || this.lights.length === 0) return;
        
        // Render each light
        this.lights.forEach(light => {
            const gradient = this.lightingCtx.createRadialGradient(
                light.x - this.camera.x, light.y - this.camera.y, 0,
                light.x - this.camera.x, light.y - this.camera.y, light.radius
            );
            
            gradient.addColorStop(0, `rgba(${light.color}, ${light.intensity})`);
            gradient.addColorStop(1, `rgba(${light.color}, 0)`);
            
            this.lightingCtx.globalCompositeOperation = 'screen';
            this.lightingCtx.fillStyle = gradient;
            this.lightingCtx.fillRect(
                light.x - this.camera.x - light.radius,
                light.y - this.camera.y - light.radius,
                light.radius * 2,
                light.radius * 2
            );
        });
        
        // Apply lighting to main canvas
        this.ctx.globalCompositeOperation = 'multiply';
        this.ctx.drawImage(this.lightingCanvas, 0, 0);
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    enableLighting(enabled = true) {
        this.lightingEnabled = enabled;
    }
    
    // Particle system rendering
    drawParticle(particle) {
        const alpha = particle.life / particle.maxLife;
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        
        if (particle.type === 'spark') {
            this.drawCircle(particle.x, particle.y, particle.size, particle.color);
        } else if (particle.type === 'dust') {
            this.drawRect(particle.x, particle.y, particle.size, particle.size, particle.color);
        } else if (particle.type === 'sparkle') {
            // Enhanced sparkle effect for muscle flexing
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x - 1, particle.y - 1, 3, 3);
            this.ctx.fillRect(particle.x - 2, particle.y, 5, 1);
            this.ctx.fillRect(particle.x, particle.y - 2, 1, 5);
        }
        
        this.ctx.restore();
    }
    
    applyPostProcessing() {
        if (this.effects.scanlines) {
            this.applyScanlines();
        }
        
        if (this.effects.colorGrading) {
            this.applyColorGrading();
        }
    }
    
    applyScanlines() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'multiply';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        
        for (let y = 0; y < GAME_CONFIG.CANVAS_HEIGHT; y += 2) {
            this.ctx.fillRect(0, y, GAME_CONFIG.CANVAS_WIDTH, 1);
        }
        
        this.ctx.restore();
    }
    
    applyColorGrading() {
        // Simple color grading effect
        const imageData = this.ctx.getImageData(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            // Slight warm tint
            data[i] = Math.min(255, data[i] * 1.05);     // Red
            data[i + 1] = Math.min(255, data[i + 1] * 1.02); // Green
            data[i + 2] = Math.min(255, data[i + 2] * 0.98); // Blue
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    // Background rendering
    drawBackground(color, pattern = null) {
        // Sky gradient
        if (typeof color === 'object' && color.type === 'gradient') {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.CANVAS_HEIGHT);
            gradient.addColorStop(0, color.top);
            gradient.addColorStop(1, color.bottom);
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        } else {
            this.clear(color);
        }
        
        // Add pattern if specified
        if (pattern) {
            this.drawPattern(pattern);
        }
    }
    
    drawPattern(pattern) {
        const offsetX = -this.camera.x * pattern.parallax;
        const offsetY = -this.camera.y * pattern.parallax;
        
        for (let x = Math.floor(offsetX) % pattern.width; x < GAME_CONFIG.CANVAS_WIDTH; x += pattern.width) {
            for (let y = Math.floor(offsetY) % pattern.height; y < GAME_CONFIG.CANVAS_HEIGHT; y += pattern.height) {
                this.ctx.fillStyle = pattern.color;
                this.ctx.fillRect(x, y, pattern.size, pattern.size);
            }
        }
        this.drawCallCount++;
    }
    
    getStats() {
        return {
            drawCalls: this.drawCallCount,
            lightsActive: this.lights.length,
            lightingEnabled: this.lightingEnabled
        };
    }
}

// Export to global scope
window.Renderer = Renderer;