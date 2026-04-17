(function () {
    const GAME_CONFIG = window.GAME_CONFIG;

    function applyGravity(entity, deltaMs) {
        if (entity.onGround) return;
        const g = GAME_CONFIG.PHYSICS.GRAVITY;
        entity.vy += g * (deltaMs / 16.67);
        const maxFall = GAME_CONFIG.PHYSICS.MAX_FALL_SPEED * (GAME_CONFIG.TILE_SIZE / 16);
        if (entity.vy > maxFall) entity.vy = maxFall;
    }

    function applyFriction(entity, deltaMs) {
        if (!entity.onGround) return;
        const f = GAME_CONFIG.PHYSICS.FRICTION;
        entity.vx *= Math.pow(f, deltaMs / 16.67);
        if (Math.abs(entity.vx) < 0.1) entity.vx = 0;
    }

    function applyAirFriction(entity, deltaMs) {
        if (entity.onGround) return;
        const f = GAME_CONFIG.PHYSICS.AIR_FRICTION;
        entity.vx *= Math.pow(f, deltaMs / 16.67);
    }

    window.Physics = { applyGravity, applyFriction, applyAirFriction };
})();
