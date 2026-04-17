(function () {
    const GAME_CONFIG = window.GAME_CONFIG;
    const COLLECTIBLE_TYPES = window.COLLECTIBLE_TYPES;
    const POWER_STATES = window.POWER_STATES;
    const Collision = window.Collision;

    function createCollectible(def) {
        const ts = GAME_CONFIG.TILE_SIZE * 0.6;
        return {
            x: def.x,
            y: def.y,
            width: ts,
            height: ts,
            type: def.type,
            taken: false
        };
    }

    function checkCollectibles(player, list, particles) {
        const audio = window.audio;
        for (const c of list) {
            if (c.taken) continue;
            if (!Collision.checkEntityCollision(player, c)) continue;
            c.taken = true;
            if (c.type === COLLECTIBLE_TYPES.GOLDEN_DUMBBELL) {
                player.gains += 100;
                if (audio && audio.playSound) audio.playSound('coin');
                if (particles) particles.emit(c.x, c.y, 6, '#FFD700');
            } else if (c.type === COLLECTIBLE_TYPES.PROTEIN_SHAKE) {
                if (player.powerState === POWER_STATES.SMALL) {
                    player.powerState = POWER_STATES.PUMP;
                    window.Player.applyPowerStateVisual(player);
                } else {
                    player.gains += 50;
                }
                if (audio && audio.playSound) audio.playSound('powerup');
            } else if (c.type === COLLECTIBLE_TYPES.PRE_WORKOUT) {
                if (player.powerState === POWER_STATES.PUMP) {
                    player.powerState = POWER_STATES.BEAST;
                    window.Player.applyPowerStateVisual(player);
                } else {
                    player.gains += 75;
                }
                if (audio && audio.playSound) audio.playSound('powerup');
            } else {
                player.gains += 25;
                if (audio && audio.playSound) audio.playSound('coin');
            }
        }
    }

    window.Collectibles = { createCollectible, checkCollectibles };
})();
