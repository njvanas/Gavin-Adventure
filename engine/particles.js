(function () {
    class Particle {
        constructor(x, y, vx, vy, life, color, size) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.life = life;
            this.maxLife = life;
            this.color = color;
            this.size = size;
        }
        update(dt) {
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            this.vy += 0.15 * dt;
            this.life -= dt;
        }
        draw(ctx) {
            const a = this.life / this.maxLife;
            ctx.save();
            ctx.globalAlpha = a * 0.9;
            const r = this.size * 0.55;
            const g = ctx.createRadialGradient(this.x + r, this.y + r, 0, this.x + r, this.y + r, r * 1.8);
            g.addColorStop(0, this.color);
            g.addColorStop(0.55, this.color);
            g.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(this.x + r, this.y + r, r * 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class ParticleSystem {
        constructor() {
            this.particles = [];
        }
        emit(x, y, count, color) {
            for (let i = 0; i < count; i++) {
                this.particles.push(
                    new Particle(
                        x + Math.random() * 8 - 4,
                        y + Math.random() * 8 - 4,
                        (Math.random() - 0.5) * 4,
                        -Math.random() * 3 - 1,
                        20 + Math.random() * 20,
                        color,
                        2 + Math.random() * 3
                    )
                );
            }
        }
        update(dt) {
            this.particles = this.particles.filter((p) => {
                p.update(dt);
                return p.life > 0;
            });
        }
        draw(ctx) {
            for (const p of this.particles) p.draw(ctx);
        }
        clear() {
            this.particles = [];
        }
    }

    window.ParticleSystem = ParticleSystem;
})();
