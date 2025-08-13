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
    }
    
    getColorForType(type) {
        switch (type) {
            case 'spark':
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
            default:
                return '#FFFFFF';
        }
    }
    
    update(deltaTime) {
        const timeScale = deltaTime / 16.67;
        
        this.x += this.vx * timeScale;
        this.y += this.vy * timeScale;
        this.vy += this.gravity * timeScale;
        
        this.life -= timeScale / 60; // 1 second lifetime at 60 FPS
        
        // Fade out
        if (this.life <= 0.3) {
            this.size *= 0.98;
        }
        
        return this.life > 0 && this.size > 0.1;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 200;
    }
    
    emit(x, y, count = 5, type = 'dust', spread = 1) {
        for (let i = 0; i < count && this.particles.length < this.maxParticles; i++) {
            const particle = new Particle(
                x + (Math.random() - 0.5) * spread * 16,
                y + (Math.random() - 0.5) * spread * 16,
                type
            );
            
            // Type-specific velocity modifications
            switch (type) {
                case 'spark':
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
            }
            
            this.particles.push(particle);
        }
    }
    
    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            if (!particle.update(deltaTime)) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    render(renderer) {
        for (const particle of this.particles) {
            renderer.drawParticle(particle);
        }
    }
    
    clear() {
        this.particles = [];
    }
    
    // Preset effects
    coinCollected(x, y) {
        this.emit(x + 8, y + 8, 8, 'coin', 0.5);
        this.emit(x + 8, y + 8, 3, 'spark', 0.3);
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
        this.emit(x + 8, y + 8, 6, 'spark', 0.8);
    }
    
    bossHit(x, y) {
        this.emit(x, y, 15, 'spark', 2);
        this.emit(x, y, 8, 'enemy', 1.5);
    }
}

// Export to global scope
window.Particle = Particle;
window.ParticleSystem = ParticleSystem;