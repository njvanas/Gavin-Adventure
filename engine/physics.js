// Physics System
class Physics {
    static applyGravity(entity, deltaTime) {
        if (!entity.onGround) {
            entity.vy += GAME_CONFIG.PHYSICS.GRAVITY * deltaTime / 16.67; // Normalize to 60 FPS
        }
        
        // Terminal velocity
        if (entity.vy > GAME_CONFIG.PHYSICS.MAX_FALL_SPEED) {
            entity.vy = GAME_CONFIG.PHYSICS.MAX_FALL_SPEED;
        }
    }
    
    static updatePosition(entity, deltaTime) {
        const timeScale = deltaTime / 16.67; // Normalize to 60 FPS
        
        entity.x += entity.vx * timeScale;
        entity.y += entity.vy * timeScale;
    }
    
    static applyFriction(entity, friction = GAME_CONFIG.PHYSICS.FRICTION) {
        if (entity.onGround) {
            entity.vx *= friction;
            
            // Stop very small movements
            if (Math.abs(entity.vx) < 0.1) {
                entity.vx = 0;
            }
        }
    }
    
    static moveEntity(entity, dx, dy, level) {
        // Store original position
        const originalX = entity.x;
        const originalY = entity.y;
        
        // Move horizontally first
        entity.x += dx;
        if (level && Collision.checkTileCollision(entity, level)) {
            entity.x = originalX;
            entity.vx = 0;
        }
        
        // Then move vertically
        entity.y += dy;
        if (level && Collision.checkTileCollision(entity, level)) {
            entity.y = originalY;
            if (dy > 0) {
                entity.onGround = true;
            }
            entity.vy = 0;
        } else {
            entity.onGround = false;
        }
    }
    
    static pointInRect(px, py, rect) {
        return px >= rect.x && px < rect.x + rect.width &&
               py >= rect.y && py < rect.y + rect.height;
    }
    
    static rectOverlap(a, b) {
        return !(a.x + a.width <= b.x || 
                 b.x + b.width <= a.x || 
                 a.y + a.height <= b.y || 
                 b.y + b.height <= a.y);
    }
    
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }
    
    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    static normalize(x, y) {
        const length = Math.sqrt(x * x + y * y);
        if (length === 0) return { x: 0, y: 0 };
        return { x: x / length, y: y / length };
    }
}

// Export to global scope
window.Physics = Physics;