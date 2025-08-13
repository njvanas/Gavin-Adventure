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
                if (level.getTile(x, y) === TILES.SOLID) {
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
        
        // Check horizontal collision
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
                entity.x = (leftTile + 1) * tileSize;
                entity.vx = 0;
                hitWall = true;
            }
            // Check right side
            else if (entity.vx > 0 && level.getTile(rightTile, y) === TILES.SOLID) {
                entity.x = rightTile * tileSize - entity.width;
                entity.vx = 0;
                hitWall = true;
            }
        }
        
        // Vertical collision
        const newBounds = entity.getBounds();
        const newLeftTile = Math.floor(newBounds.left / tileSize);
        const newRightTile = Math.floor(newBounds.right / tileSize);
        const newTopTile = Math.floor(newBounds.top / tileSize);
        const newBottomTile = Math.floor(newBounds.bottom / tileSize);
        
        for (let x = newLeftTile; x <= newRightTile; x++) {
            // Check ceiling
            if (entity.vy < 0 && level.getTile(x, newTopTile) === TILES.SOLID) {
                entity.y = (newTopTile + 1) * tileSize;
                entity.vy = 0;
            }
            // Check ground
            else if (entity.vy >= 0 && level.getTile(x, newBottomTile) === TILES.SOLID) {
                entity.y = newBottomTile * tileSize - entity.height;
                entity.vy = 0;
                entity.onGround = true;
                hitGround = true;
            }
        }
        
        // Check if entity fell off ground
        if (!hitGround && entity.onGround) {
            // Quick check below entity
            const belowY = Math.floor((entity.y + entity.height + 1) / tileSize);
            let foundGround = false;
            
            for (let x = newLeftTile; x <= newRightTile; x++) {
                if (level.getTile(x, belowY) === TILES.SOLID) {
                    foundGround = true;
                    break;
                }
            }
            
            if (!foundGround) {
                entity.onGround = false;
            }
        }
        
        // Keep entity within level bounds
        entity.x = Math.max(0, Math.min(entity.x, level.width * tileSize - entity.width));
        
        // Check for death pits
        if (entity.y > level.height * tileSize + 100) {
            if (entity.onDeath) {
                entity.onDeath();
            }
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
}

// Export to global scope
window.Collision = Collision;