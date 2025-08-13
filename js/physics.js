// Gavin Adventure - Physics System
// Handles collision detection, gravity, and movement physics

class Physics {
    constructor() {
        this.gravity = 0.8;
        this.friction = 0.85;
        this.jumpForce = -15;
        this.maxFallSpeed = 12;
        this.maxRunSpeed = 6;
        this.maxWalkSpeed = 3;
    }

    // Check collision between two rectangles
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    // Check if entity is on ground
    isOnGround(entity, tiles) {
        const feetY = entity.y + entity.height;
        const feetX = entity.x + entity.width / 2;
        
        for (let tile of tiles) {
            if (tile.solid && 
                feetY >= tile.y && 
                feetY <= tile.y + 5 && 
                feetX >= tile.x && 
                feetX <= tile.x + tile.width) {
                return true;
            }
        }
        return false;
    }

    // Check if entity is hitting ceiling
    isHittingCeiling(entity, tiles) {
        const headY = entity.y;
        const headX = entity.x + entity.width / 2;
        
        for (let tile of tiles) {
            if (tile.solid && 
                headY <= tile.y + tile.height && 
                headY >= tile.y + tile.height - 5 && 
                headX >= tile.x && 
                headX <= tile.x + tile.width) {
                return true;
            }
        }
        return false;
    }

    // Check if entity is hitting wall
    isHittingWall(entity, tiles, direction) {
        const checkX = direction > 0 ? entity.x + entity.width : entity.x;
        const checkY = entity.y + entity.height / 2;
        
        for (let tile of tiles) {
            if (tile.solid && 
                checkY >= tile.y && 
                checkY <= tile.y + tile.height) {
                if (direction > 0 && checkX >= tile.x && checkX <= tile.x + 5) {
                    return true;
                }
                if (direction < 0 && checkX <= tile.x + tile.width && checkX >= tile.x + tile.width - 5) {
                    return true;
                }
            }
        }
        return false;
    }

    // Apply gravity to entity
    applyGravity(entity) {
        if (!entity.onGround) {
            entity.velocityY += this.gravity;
            if (entity.velocityY > this.maxFallSpeed) {
                entity.velocityY = this.maxFallSpeed;
            }
        }
    }

    // Apply friction to entity
    applyFriction(entity) {
        if (entity.onGround) {
            entity.velocityX *= this.friction;
            if (Math.abs(entity.velocityX) < 0.1) {
                entity.velocityX = 0;
            }
        }
    }

    // Move entity horizontally
    moveHorizontal(entity, tiles) {
        entity.x += entity.velocityX;
        
        // Check wall collisions
        if (entity.velocityX > 0) {
            if (this.isHittingWall(entity, tiles, 1)) {
                entity.x = Math.floor((entity.x + entity.width) / 16) * 16 - entity.width;
                entity.velocityX = 0;
            }
        } else if (entity.velocityX < 0) {
            if (this.isHittingWall(entity, tiles, -1)) {
                entity.x = Math.ceil(entity.x / 16) * 16;
                entity.velocityX = 0;
            }
        }
    }

    // Move entity vertically
    moveVertical(entity, tiles) {
        entity.y += entity.velocityY;
        
        // Check ground collision
        if (entity.velocityY > 0) {
            if (this.isOnGround(entity, tiles)) {
                entity.y = Math.floor((entity.y + entity.height) / 16) * 16 - entity.height;
                entity.velocityY = 0;
                entity.onGround = true;
            }
        } else if (entity.velocityY < 0) {
            if (this.isHittingCeiling(entity, tiles)) {
                entity.y = Math.ceil(entity.y / 16) * 16;
                entity.velocityY = 0;
            }
        }
        
        // Update ground state
        if (!this.isOnGround(entity, tiles)) {
            entity.onGround = false;
        }
    }

    // Update entity physics
    updateEntity(entity, tiles) {
        this.applyGravity(entity);
        this.applyFriction(entity);
        this.moveHorizontal(entity, tiles);
        this.moveVertical(entity, tiles);
    }

    // Check if entity can jump
    canJump(entity) {
        return entity.onGround && !entity.isJumping;
    }

    // Make entity jump
    makeJump(entity) {
        if (this.canJump(entity)) {
            entity.velocityY = this.jumpForce;
            entity.onGround = false;
            entity.isJumping = true;
            return true;
        }
        return false;
    }

    // Check if entity can move in direction
    canMove(entity, tiles, direction) {
        const testX = entity.x + (direction * entity.width);
        const testY = entity.y + entity.height / 2;
        
        for (let tile of tiles) {
            if (tile.solid && 
                testY >= tile.y && 
                testY <= tile.y + tile.height &&
                testX >= tile.x && 
                testX <= tile.x + tile.width) {
                return false;
            }
        }
        return true;
    }

    // Get tiles in area around entity
    getNearbyTiles(entity, level, radius = 2) {
        const tiles = [];
        const startX = Math.max(0, Math.floor((entity.x - radius * 16) / 16));
        const endX = Math.min(level.width - 1, Math.ceil((entity.x + entity.width + radius * 16) / 16));
        const startY = Math.max(0, Math.floor((entity.y - radius * 16) / 16));
        const endY = Math.min(level.height - 1, Math.ceil((entity.y + entity.height + radius * 16) / 16));
        
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const tile = level.getTile(x, y);
                if (tile && tile.solid) {
                    tiles.push({
                        x: x * 16,
                        y: y * 16,
                        width: 16,
                        height: 16,
                        solid: true,
                        type: tile.type
                    });
                }
            }
        }
        
        return tiles;
    }

    // Check if point is inside entity
    pointInEntity(point, entity) {
        return point.x >= entity.x && 
               point.x <= entity.x + entity.width &&
               point.y >= entity.y && 
               point.y <= entity.y + entity.height;
    }

    // Get distance between two points
    getDistance(point1, point2) {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Check if entity is in camera view
    isInView(entity, camera) {
        return entity.x + entity.width > camera.x &&
               entity.x < camera.x + camera.width &&
               entity.y + entity.height > camera.y &&
               entity.y < camera.y + camera.height;
    }

    // Apply knockback to entity
    applyKnockback(entity, direction, force = 5) {
        entity.velocityX = direction * force;
        entity.velocityY = -force / 2;
    }

    // Check if entity is falling
    isFalling(entity) {
        return entity.velocityY > 0 && !entity.onGround;
    }

    // Check if entity is rising
    isRising(entity) {
        return entity.velocityY < 0;
    }

    // Get entity's facing direction
    getFacingDirection(entity) {
        return entity.velocityX > 0 ? 1 : entity.velocityX < 0 ? -1 : entity.facing || 1;
    }

    // Check if entity is moving
    isMoving(entity) {
        return Math.abs(entity.velocityX) > 0.1;
    }

    // Check if entity is running
    isRunning(entity) {
        return Math.abs(entity.velocityX) > this.maxWalkSpeed;
    }

    // Check if entity is crouching
    isCrouching(entity) {
        return entity.isCrouched;
    }

    // Check if entity can attack
    canAttack(entity) {
        return entity.powerLevel >= 2 && !entity.isAttacking;
    }

    // Get attack hitbox for entity
    getAttackHitbox(entity) {
        const direction = this.getFacingDirection(entity);
        const hitbox = {
            x: direction > 0 ? entity.x + entity.width : entity.x - 16,
            y: entity.y + entity.height / 2,
            width: 16,
            height: 16
        };
        return hitbox;
    }

    // Check if two hitboxes overlap
    checkHitboxCollision(hitbox1, hitbox2) {
        return this.checkCollision(hitbox1, hitbox2);
    }

    // Apply damage to entity
    applyDamage(entity, damage, source) {
        if (!entity.invulnerable) {
            entity.health -= damage;
            entity.invulnerable = true;
            entity.invulnerableTime = 60; // 1 second at 60 FPS
            
            // Apply knockback
            const direction = entity.x < source.x ? -1 : 1;
            this.applyKnockback(entity, direction);
            
            if (entity.health <= 0) {
                entity.die();
            }
        }
    }

    // Update invulnerability
    updateInvulnerability(entity) {
        if (entity.invulnerable) {
            entity.invulnerableTime--;
            if (entity.invulnerableTime <= 0) {
                entity.invulnerable = false;
            }
        }
    }

    // Check if entity should be removed
    shouldRemove(entity) {
        return entity.health <= 0 || entity.y > 800; // Off screen
    }

    // Get entity's center point
    getEntityCenter(entity) {
        return {
            x: entity.x + entity.width / 2,
            y: entity.y + entity.height / 2
        };
    }

    // Check if entity is on screen
    isOnScreen(entity, camera) {
        return this.isInView(entity, camera);
    }

    // Get entity's bounding box
    getEntityBounds(entity) {
        return {
            x: entity.x,
            y: entity.y,
            width: entity.width,
            height: entity.height
        };
    }

    // Check if entity is touching specific tile type
    isTouchingTileType(entity, tiles, tileType) {
        for (let tile of tiles) {
            if (tile.type === tileType && this.checkCollision(entity, tile)) {
                return true;
            }
        }
        return false;
    }

    // Get entities in area
    getEntitiesInArea(area, entities) {
        const found = [];
        for (let entity of entities) {
            if (this.checkCollision(area, entity)) {
                found.push(entity);
            }
        }
        return found;
    }

    // Check line of sight between two points
    hasLineOfSight(point1, point2, tiles) {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.ceil(distance / 8); // Check every 8 pixels
        
        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const checkX = point1.x + dx * t;
            const checkY = point1.y + dy * t;
            
            for (let tile of tiles) {
                if (tile.solid && 
                    checkX >= tile.x && checkX <= tile.x + tile.width &&
                    checkY >= tile.y && checkY <= tile.y + tile.height) {
                    return false;
                }
            }
        }
        return true;
    }
}

// Create global physics instance
const PHYSICS = new Physics();
