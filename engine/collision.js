// Collision Detection System
class Collision {
    static checkTileCollision(entity, level) {
        if (!level || !level.tiles) return false;
        
        const bounds = entity.getBounds();
        const tileSize = GAME_CONFIG.TILE_SIZE;
        
        // Get tile coordinates
        const leftTile = Math.floor(bounds.left / tileSize);
        const rightTile = Math.floor(bounds.right / tileSize);
        const topTile = Math.floor(bounds.top / tileSize);
        const bottomTile = Math.floor(bounds.bottom / tileSize);
        
        // Check all tiles entity overlaps
        for (let y = topTile; y <= bottomTile; y++) {
            for (let x = leftTile; x <= rightTile; x++) {
                const tileType = level.getTile(x, y);
                if (tileType === TILES.SOLID || tileType === TILES.PLATFORM) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    static resolveEntityTiles(entity, level) {
        if (!level || !level.tiles) return;
        
        const tileSize = GAME_CONFIG.TILE_SIZE;
        const originalX = entity.x;
        const originalY = entity.y;
        
        // Check horizontal collision using hitbox bounds
        const bounds = entity.getBounds();
        const leftTile = Math.floor(bounds.left / tileSize);
        const rightTile = Math.floor(bounds.right / tileSize);
        const topTile = Math.floor(bounds.top / tileSize);
        const bottomTile = Math.floor(bounds.bottom / tileSize);
        
        let hitWall = false;
        let hitGround = false;
        
        // Horizontal collision
        for (let y = topTile; y <= bottomTile; y++) {
            // Check left side
            if (entity.vx < 0 && level.getTile(leftTile, y) === TILES.SOLID) {
                // Calculate exact position to prevent overlap
                const newX = (leftTile + 1) * tileSize - entity.hitboxOffsetX;
                entity.x = newX;
                entity.vx = 0;
                hitWall = true;
            }
            // Check right side
            else if (entity.vx > 0 && level.getTile(rightTile, y) === TILES.SOLID) {
                // Calculate exact position to prevent overlap
                const newX = rightTile * tileSize - entity.hitboxOffsetX - entity.hitboxWidth;
                entity.x = newX;
                entity.vx = 0;
                hitWall = true;
            }
        }
        
        // Vertical collision - use updated bounds after horizontal resolution
        const newBounds = entity.getBounds();
        const newLeftTile = Math.floor(newBounds.left / tileSize);
        const newRightTile = Math.floor(newBounds.right / tileSize);
        const newTopTile = Math.floor(newBounds.top / tileSize);
        const newBottomTile = Math.floor(newBounds.bottom / tileSize);
        
        for (let x = newLeftTile; x <= newRightTile; x++) {
            // Check ceiling
            if (entity.vy < 0 && level.getTile(x, newTopTile) === TILES.SOLID) {
                const newY = (newTopTile + 1) * tileSize - entity.hitboxOffsetY;
                entity.y = newY;
                entity.vy = 0;
            }
            // Check ground - handle both solid and platform tiles
            else if (entity.vy >= 0) {
                const tileType = level.getTile(x, newBottomTile);
                if (tileType === TILES.SOLID || tileType === TILES.PLATFORM) {
                    const newY = newBottomTile * tileSize - entity.hitboxOffsetY - entity.hitboxHeight;
                    entity.y = newY;
                    entity.vy = 0;
                    entity.onGround = true;
                    hitGround = true;
                }
            }
        }
        
        // Check if entity fell off ground
        if (!hitGround && entity.onGround) {
            // Quick check below entity using hitbox bounds
            const belowY = Math.floor((newBounds.bottom + 1) / tileSize);
            let foundGround = false;
            
            for (let x = newLeftTile; x <= newRightTile; x++) {
                const tileType = level.getTile(x, belowY);
                if (tileType === TILES.SOLID || tileType === TILES.PLATFORM) {
                    foundGround = true;
                    break;
                }
            }
            
            if (!foundGround) {
                entity.onGround = false;
            }
        }
        
        // Check for block breaking (player hitting blocks from below)
        if (entity.vy < 0 && entity.canBreakBlocks !== undefined) {
            this.checkBlockBreaking(entity, level, newLeftTile, newRightTile, newTopTile);
        }
        
        // Keep entity within level bounds using hitbox bounds
        const finalBounds = entity.getBounds();
        if (finalBounds.left < 0) {
            entity.x = -entity.hitboxOffsetX;
        }
        if (finalBounds.right > level.width * tileSize) {
            entity.x = level.width * tileSize - entity.hitboxOffsetX - entity.hitboxWidth;
        }
        if (finalBounds.top < 0) {
            entity.y = -entity.hitboxOffsetY;
        }
        if (finalBounds.bottom > level.height * tileSize) {
            entity.y = level.height * tileSize - entity.hitboxOffsetY - entity.hitboxHeight;
        }
    }
    
    static checkEntityCollision(entity1, entity2) {
        if (!entity1.active || !entity2.active) return false;
        return entity1.overlaps(entity2);
    }
    
    static resolveEntityCollision(entity1, entity2) {
        if (!this.checkEntityCollision(entity1, entity2)) return false;
        
        const bounds1 = entity1.getBounds();
        const bounds2 = entity2.getBounds();
        
        // Calculate overlap
        const overlapX = Math.min(bounds1.right - bounds2.left, bounds2.right - bounds1.left);
        const overlapY = Math.min(bounds1.bottom - bounds2.top, bounds2.bottom - bounds1.top);
        
        // Resolve collision based on smallest overlap
        if (overlapX < overlapY) {
            // Horizontal collision
            if (bounds1.left < bounds2.left) {
                entity1.x = bounds2.left - entity1.width;
            } else {
                entity1.x = bounds2.right;
            }
            entity1.vx = 0;
        } else {
            // Vertical collision
            if (bounds1.top < bounds2.top) {
                entity1.y = bounds2.top - entity1.height;
                if (entity1.vy > 0) {
                    entity1.vy = 0;
                    entity1.onGround = true;
                }
            } else {
                entity1.y = bounds2.bottom;
                if (entity1.vy < 0) {
                    entity1.vy = 0;
                }
            }
        }
        
        return true;
    }
    
    static sweepAABB(entity, dx, dy, target) {
        // Swept AABB collision detection
        const bounds = entity.getBounds();
        const targetBounds = target.getBounds();
        
        if (dx === 0 && dy === 0) {
            return Physics.rectOverlap(bounds, targetBounds) ? 0 : 1;
        }
        
        const xInvEntry = dx > 0 ? 
            targetBounds.left - bounds.right : 
            targetBounds.right - bounds.left;
        const yInvEntry = dy > 0 ? 
            targetBounds.top - bounds.bottom : 
            targetBounds.bottom - bounds.top;
        
        const xInvExit = dx > 0 ? 
            targetBounds.right - bounds.left : 
            targetBounds.left - bounds.right;
        const yInvExit = dy > 0 ? 
            targetBounds.bottom - bounds.top : 
            targetBounds.top - bounds.bottom;
        
        if (dx === 0) {
            return dy === 0 ? 1 : (yInvEntry / dy);
        }
        if (dy === 0) {
            return xInvEntry / dx;
        }
        
        const xEntry = xInvEntry / dx;
        const xExit = xInvExit / dx;
        const yEntry = yInvEntry / dy;
        const yExit = yInvExit / dy;
        
        const entryTime = Math.max(xEntry, yEntry);
        const exitTime = Math.min(xExit, yExit);
        
        if (entryTime > exitTime || xEntry < 0 || yEntry < 0) {
            return 1;
        }
        
        return Math.max(0, Math.min(1, entryTime));
    }

    // Check if player can break blocks by hitting them from below
    static checkBlockBreaking(entity, level, leftTile, rightTile, topTile) {
        if (!entity.canBreakBlocks) return;
        
        const tileSize = GAME_CONFIG.TILE_SIZE;
        
        for (let x = leftTile; x <= rightTile; x++) {
            const tileType = level.getTile(x, topTile);
            
            // Check if it's a breakable block and player has enough power
            if (tileType === TILES.BREAKABLE && entity.powerState >= POWER_STATES.PUMP) {
                // Break the block
                level.breakTile(x, topTile, window.particles);
                
                // Bounce the player down slightly
                entity.vy = 1;
                
                // Play break sound
                if (window.audio) {
                    window.audio.playSound('break');
                }
            } else if (tileType === TILES.BREAKABLE && entity.powerState < POWER_STATES.PUMP) {
                // Player is too small to break the block, but still bounce
                entity.vy = 1;
                
                // Play hit sound
                if (window.audio) {
                    window.audio.playSound('hit');
                }
            }
        }
    }
}

// Export to global scope
window.Collision = Collision;