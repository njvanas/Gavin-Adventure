// Rendering System
class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.camera = { x: 0, y: 0 };
        this.shake = { x: 0, y: 0, intensity: 0, duration: 0 };
        this.scale = 1;
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
    
    clear(color = '#87CEEB') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
    }
    
    drawRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            Math.floor(x - this.camera.x + this.shake.x),
            Math.floor(y - this.camera.y + this.shake.y),
            width,
            height
        );
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
    }
    
    drawText(text, x, y, color = 'white', font = '12px monospace') {
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.fillText(text, x, y);
    }
    
    drawTextCentered(text, x, y, color = 'white', font = '12px monospace') {
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, x, y);
        this.ctx.textAlign = 'left'; // Reset
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
        }
        
        this.ctx.restore();
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
    }
}

// Export to global scope
window.Renderer = Renderer;