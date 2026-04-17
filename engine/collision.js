(function () {
    const TILES = window.TILES;

    function checkTileCollisionHorizontal(entity, level, tileSize) {
        const left = Math.floor(entity.x / tileSize);
        const right = Math.floor((entity.x + entity.width) / tileSize);
        const top = Math.floor(entity.y / tileSize);
        const bottom = Math.floor((entity.y + entity.height - 0.01) / tileSize);

        if (entity.vx > 0) {
            for (let y = top; y <= bottom; y++) {
                const tile = level.getTile(right, y);
                if (tile === TILES.SOLID || tile === TILES.BREAKABLE || tile === TILES.STRONG_PLATE || tile === TILES.INVISIBLE_BLOCK) {
                    entity.x = right * tileSize - entity.width - 0.01;
                    entity.vx = 0;
                    if (entity.smbVelX !== undefined) entity.smbVelX = 0;
                    return true;
                }
            }
        } else if (entity.vx < 0) {
            for (let y = top; y <= bottom; y++) {
                const tile = level.getTile(left, y);
                if (tile === TILES.SOLID || tile === TILES.BREAKABLE || tile === TILES.STRONG_PLATE || tile === TILES.INVISIBLE_BLOCK) {
                    entity.x = (left + 1) * tileSize + 0.01;
                    entity.vx = 0;
                    if (entity.smbVelX !== undefined) entity.smbVelX = 0;
                    return true;
                }
            }
        }
        return false;
    }

    function checkTileCollisionVertical(entity, level, tileSize) {
        const left = Math.floor(entity.x / tileSize);
        const right = Math.floor((entity.x + entity.width - 0.01) / tileSize);
        const top = Math.floor(entity.y / tileSize);
        const bottom = Math.floor((entity.y + entity.height) / tileSize);

        if (entity.vy > 0) {
            for (let x = left; x <= right; x++) {
                const tile = level.getTile(x, bottom);
                if (tile === TILES.SOLID || tile === TILES.BREAKABLE || tile === TILES.STRONG_PLATE || tile === TILES.INVISIBLE_BLOCK) {
                    entity.y = bottom * tileSize - entity.height - 0.01;
                    entity.vy = 0;
                    if (entity.smbVelY !== undefined) entity.smbVelY = 0;
                    entity.onGround = true;
                    if (entity.smbState !== undefined) entity.smbState = 0;
                    return true;
                }
                if (tile === TILES.PLATFORM) {
                    const prevBottom = entity.y + entity.height - entity.vy;
                    const platTop = bottom * tileSize;
                    if (prevBottom <= platTop + 1) {
                        entity.y = platTop - entity.height - 0.01;
                        entity.vy = 0;
                        if (entity.smbVelY !== undefined) entity.smbVelY = 0;
                        entity.onGround = true;
                        if (entity.smbState !== undefined) entity.smbState = 0;
                        return true;
                    }
                }
            }
        } else if (entity.vy < 0) {
            for (let x = left; x <= right; x++) {
                const tile = level.getTile(x, top);
                if (tile === TILES.SOLID || tile === TILES.BREAKABLE || tile === TILES.STRONG_PLATE || tile === TILES.INVISIBLE_BLOCK) {
                    entity.y = (top + 1) * tileSize + 0.01;
                    entity.vy = 0;
                    if (entity.smbVelY !== undefined) entity.smbVelY = 0;
                    return true;
                }
            }
        }
        return false;
    }

    function checkEntityCollision(a, b) {
        return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    }

    window.Collision = {
        checkTileCollisionHorizontal,
        checkTileCollisionVertical,
        checkEntityCollision
    };
})();
