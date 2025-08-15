// Particle System
class Particle {
    constructor(x, y, type = 'dust') {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.type = type;
        this.life = 1.0;
        this.maxLife = 1.0;
        this.size = Math.random() * 3 + 1;
        this.color = this.getColorForType(type);
        this.gravity = type === 'spark' ? 0.1 : 0.05;
        
        // Enhanced particle properties
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.scale = 1.0;
        this.alpha = 1.0;
        this.bounce = 0.3;
        this.friction = 0.98;
    }
    
    getColorForType(type) {
        switch (type) {
            case 'spark':
                return '#FFD700';
            case 'sparkle':
                return '#FFD700';
            case 'dust':
                return '#8B4513';
            case 'coin':
                return '#FFD700';
            case 'powerup':
                return '#FF6B6B';
            case 'enemy':
                return '#FF4444';
            case 'break':
                return '#8B4513';
            case 'muscle_flex':
                return '#FFD700';
            case 'protein_splash':
                return '#FFFFFF';
            case 'sweat':
                return '#87CEEB';
            default:
                return '#FFFFFF';
        }
    }
    
    update(deltaTime) {
        const timeScale = deltaTime / 16.67;
        
        // Update position
        this.x += this.vx * timeScale;
        this.y += this.vy * timeScale;
        
        // Apply gravity
        this.vy += this.gravity * timeScale;
        
        // Apply friction
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // Update rotation
        this.rotation += this.rotationSpeed * timeScale;
        
        // Update life and derived properties
        this.life -= timeScale / 60; // 1 second lifetime at 60 FPS
        this.alpha = this.life / this.maxLife;
        
        // Fade out
        if (this.life <= 0.3) {
            this.size *= 0.98;
            this.scale *= 0.98;
        }
        
        // Type-specific updates
        this.updateTypeSpecific(timeScale);
        
        return this.life > 0 && this.size > 0.1;
    }
    
    updateTypeSpecific(timeScale) {
        switch (this.type) {
            case 'sparkle':
                // Sparkle particles twinkle
                this.alpha = 0.5 + 0.5 * Math.sin(this.life * 10);
                break;
            case 'muscle_flex':
                // Muscle flex particles rise and sparkle
                this.vy -= 0.05 * timeScale;
                this.alpha = 0.7 + 0.3 * Math.sin(this.life * 8);
                break;
            case 'protein_splash':
                // Protein particles have liquid physics
                if (this.y > 500) { // Ground level
                    this.vy *= -this.bounce;
                    this.y = 500;
                }
                break;
            case 'sweat':
                // Sweat drops fall straight down
                this.vx *= 0.95;
                this.gravity = 0.3;
                break;
        }
    }
    
    render(ctx, camera) {
        ctx.save();
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        ctx.globalAlpha = this.alpha;
        ctx.translate(screenX, screenY);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        
        switch (this.type) {
            case 'sparkle':
            case 'muscle_flex':
                this.renderSparkle(ctx);
                break;
            case 'protein_splash':
                this.renderLiquid(ctx);
                break;
            case 'sweat':
                this.renderDroplet(ctx);
                break;
            default:
                this.renderDefault(ctx);
                break;
        }
        
        ctx.restore();
    }
    
    renderSparkle(ctx) {
        ctx.fillStyle = this.color;
        // Draw star shape
        ctx.fillRect(-1, -1, 3, 3);
        ctx.fillRect(-2, 0, 5, 1);
        ctx.fillRect(0, -2, 1, 5);
    }
    
    renderLiquid(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderDroplet(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.7, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderDefault(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 500; // Increased for better effects
        this.emitters = new Map();
        this.particlePool = []; // Object pooling for performance
    }
    
    // Object pooling for better performance
    getParticle() {
        if (this.particlePool.length > 0) {
            return this.particlePool.pop();
        }
        return new Particle(0, 0);
    }
    
    returnParticle(particle) {
        this.particlePool.push(particle);
    }
    
    emit(x, y, count = 5, type = 'dust', spread = 1) {
        for (let i = 0; i < count && this.particles.length < this.maxParticles; i++) {
            const particle = this.getParticle();
            particle.x = x + (Math.random() - 0.5) * spread * 16;
            particle.y = y + (Math.random() - 0.5) * spread * 16;
            particle.type = type;
            particle.life = 1.0;
            particle.maxLife = 1.0;
            particle.size = Math.random() * 3 + 1;
            particle.color = particle.getColorForType(type);
            particle.alpha = 1.0;
            particle.scale = 1.0;
            particle.rotation = 0;
            particle.rotationSpeed = (Math.random() - 0.5) * 0.2;
            
            // Type-specific velocity modifications
            switch (type) {
                case 'spark':
                case 'sparkle':
                    particle.vx *= 2;
                    particle.vy = -Math.abs(particle.vy) * 2;
                    particle.gravity = 0.2;
                    break;
                case 'coin':
                    particle.vy = -Math.abs(particle.vy) * 1.5;
                    particle.vx *= 0.5;
                    break;
                case 'powerup':
                    particle.vy = -Math.abs(particle.vy);
                    particle.life = 2.0;
                    particle.maxLife = 2.0;
                    break;
                case 'break':
                    particle.vx *= 3;
                    particle.vy = -Math.abs(particle.vy) * 1.5;
                    break;
                case 'muscle_flex':
                    particle.vx = (Math.random() - 0.5) * 2;
                    particle.vy = -Math.random() * 3 - 1;
                    particle.life = 1.5;
                    particle.maxLife = 1.5;
                    particle.gravity = 0.05;
                    break;
                case 'protein_splash':
                    particle.vx = (Math.random() - 0.5) * 6;
                    particle.vy = -Math.random() * 4 - 2;
                    particle.gravity = 0.25;
                    particle.bounce = 0.4;
                    break;
                case 'sweat':
                    particle.vx = (Math.random() - 0.5) * 1;
                    particle.vy = Math.random() * 2 + 1;
                    particle.gravity = 0.3;
                    particle.size = Math.random() * 2 + 1;
                    break;
            }
            
            this.particles.push(particle);
        }
    }
    
    createEmitter(x, y, config) {
        const emitter = {
            x, y,
            rate: config.rate || 10,
            lifetime: config.lifetime || 1000,
            particleConfig: config.particle || {},
            active: true,
            timer: 0,
            id: Date.now() + Math.random()
        };
        
        this.emitters.set(emitter.id, emitter);
        return emitter.id;
    }
    
    removeEmitter(id) {
        this.emitters.delete(id);
    }
    
    updateEmitters(deltaTime) {
        for (const [id, emitter] of this.emitters) {
            if (!emitter.active) continue;
            
            emitter.timer += deltaTime;
            
            // Emit particles based on rate
            const particlesToEmit = Math.floor(emitter.timer * emitter.rate / 1000);
            for (let i = 0; i < particlesToEmit; i++) {
                this.emit(
                    emitter.x,
                    emitter.y,
                    1,
                    emitter.particleConfig.type || 'dust',
                    emitter.particleConfig.spread || 1
                );
            }
            
            if (particlesToEmit > 0) {
                emitter.timer = 0;
            }
            
            // Remove expired emitters
            emitter.lifetime -= deltaTime;
            if (emitter.lifetime <= 0) {
                this.emitters.delete(id);
            }
        }
    }
    
    update(deltaTime) {
        this.updateEmitters(deltaTime);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            if (!particle.update(deltaTime)) {
                this.returnParticle(particle);
                this.particles.splice(i, 1);
            }
        }
    }
    
    render(renderer) {
        for (const particle of this.particles) {
            if (particle.render) {
                particle.render(renderer.ctx, renderer.camera);
            } else {
                renderer.drawParticle(particle);
            }
        }
    }
    
    clear() {
        // Return all particles to pool
        for (const particle of this.particles) {
            this.returnParticle(particle);
        }
        this.particles = [];
        this.emitters.clear();
    }
    
    // Preset effects
    coinCollected(x, y) {
        this.emit(x + 8, y + 8, 8, 'coin', 0.5);
        this.emit(x + 8, y + 8, 3, 'sparkle', 0.3);
    }
    
    enemyDefeated(x, y) {
        this.emit(x + 8, y + 8, 6, 'enemy', 1);
        this.emit(x + 8, y + 8, 4, 'dust', 0.8);
    }
    
    playerLand(x, y) {
        this.emit(x + 8, y + 16, 3, 'dust', 1);
    }
    
    blockBreak(x, y) {
        this.emit(x + 8, y + 8, 10, 'break', 1.2);
    }
    
    powerUpCollected(x, y) {
        this.emit(x + 8, y + 8, 12, 'powerup', 1);
        this.emit(x + 8, y + 8, 6, 'sparkle', 0.8);
    }
    
    bossHit(x, y) {
        this.emit(x, y, 15, 'sparkle', 2);
        this.emit(x, y, 8, 'enemy', 1.5);
    }
    
    // Enhanced bodybuilding-themed effects
    muscleFlexEffect(x, y) {
        this.emit(x, y, 15, 'muscle_flex', 0.8);
        this.emit(x, y, 8, 'sparkle', 0.5);
    }
    
    proteinSplashEffect(x, y) {
        this.emit(x, y, 12, 'protein_splash', 1.2);
    }
    
    sweatDrops(x, y) {
        this.emit(x, y, 5, 'sweat', 0.3);
    }
    
    workoutIntensity(x, y, intensity = 1.0) {
        const particleCount = Math.floor(intensity * 10);
        this.emit(x, y, particleCount, 'sparkle', intensity);
        
        if (intensity > 0.7) {
            this.sweatDrops(x, y - 10);
        }
    }
    
    getStats() {
        return {
            activeParticles: this.particles.length,
            maxParticles: this.maxParticles,
            pooledParticles: this.particlePool.length,
            activeEmitters: this.emitters.size
        };
    }
}

// Export to global scope
window.Particle = Particle;
window.ParticleSystem = ParticleSystem;