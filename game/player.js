(function () {
    const GAME_CONFIG = window.GAME_CONFIG;
    const TILES = window.TILES;
    const POWER_STATES = window.POWER_STATES;
    const Collision = window.Collision;

    function sizeForPower(ps) {
        const ts = GAME_CONFIG.TILE_SIZE;
        const w = ts * 0.875;
        const h = ps === POWER_STATES.SMALL ? ts * 1.25 : ts * 1.75;
        return { width: w, height: h };
    }

    function createPlayer(px, py, powerState) {
        const s = sizeForPower(powerState);
        return {
            x: px,
            y: py,
            width: s.width,
            height: s.height,
            vx: 0,
            vy: 0,
            smbVelX: 0,
            smbVelY: 0,
            fallAcc: window.SMB_CONST.DEFAULT_GRAVITY,
            smbState: 0,
            smbFacing: 0,
            onGround: false,
            wasOnGround: false,
            coyoteTime: 0,
            jumpBuffer: 0,
            direction: 1,
            running: false,
            animationState: 'idle',
            powerState: powerState,
            invuln: 0,
            gains: 0,
            alive: true
        };
    }

    function applyPowerStateVisual(p) {
        const s = sizeForPower(p.powerState);
        const feet = p.y + p.height;
        p.width = s.width;
        p.height = s.height;
        p.y = feet - p.height;
    }

    function updatePlayer(player, input, level, deltaMs) {
        if (!player.alive) return;

        const TICK = deltaMs / 1000;
        const coyoteSec = GAME_CONFIG.PHYSICS.COYOTE_TIME_SEC;
        const bufSec = GAME_CONFIG.PHYSICS.JUMP_BUFFER_SEC;

        player.wasOnGround = player.onGround;
        if (player.wasOnGround) player.coyoteTime = coyoteSec;
        else player.coyoteTime = Math.max(0, player.coyoteTime - TICK);

        if (input.isPressed('jump')) player.jumpBuffer = bufSec;
        else player.jumpBuffer = Math.max(0, player.jumpBuffer - TICK);

        const grounded = player.onGround;
        window.SMBIntegrator.stepGavin(player, input, deltaMs);

        player.x += player.vx * TICK;
        Collision.checkTileCollisionHorizontal(player, level, GAME_CONFIG.TILE_SIZE);
        player.y += player.vy * TICK;
        const landed = Collision.checkTileCollisionVertical(player, level, GAME_CONFIG.TILE_SIZE);

        if (!grounded && landed) {
            player.smbVelY = 0;
        }
        if (!player.onGround && player.wasOnGround) {
            /* left ground */
        }

        const tx = Math.floor(player.x / GAME_CONFIG.TILE_SIZE);
        const ty = Math.floor(player.y / GAME_CONFIG.TILE_SIZE);
        const tw = Math.floor((player.x + player.width) / GAME_CONFIG.TILE_SIZE);
        const th = Math.floor((player.y + player.height) / GAME_CONFIG.TILE_SIZE);
        for (let iy = ty; iy <= th; iy++) {
            for (let ix = tx; ix <= tw; ix++) {
                if (level.getTile(ix, iy) === TILES.SPIKES) {
                    hurtPlayer(player, level);
                }
            }
        }

        player.invuln = Math.max(0, player.invuln - deltaMs);
    }

    function hurtPlayer(player, level) {
        if (player.invuln > 0) return;
        if (player.powerState === POWER_STATES.BEAST) {
            player.powerState = POWER_STATES.PUMP;
            applyPowerStateVisual(player);
            player.invuln = 2000;
            if (window.audio && window.audio.playSound) window.audio.playSound('hurt');
            return;
        }
        if (player.powerState === POWER_STATES.PUMP) {
            player.powerState = POWER_STATES.SMALL;
            applyPowerStateVisual(player);
            player.invuln = 2000;
            if (window.audio && window.audio.playSound) window.audio.playSound('hurt');
            return;
        }
        player.alive = false;
        if (window.audio && window.audio.playSound) window.audio.playSound('game_over');
    }

    function stompBounce(player) {
        player.smbVelY = -200;
        player.vy = player.smbVelY * window.SMB_CONST.POS_SCALE;
        player.smbState = 4;
        player.onGround = false;
    }

    window.Player = { createPlayer, updatePlayer, applyPowerStateVisual, hurtPlayer, stompBounce, sizeForPower };
})();
