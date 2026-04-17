const GAME_CONFIG = {
    /** Minimum target: 720p (1280×720). CSS scales display to fit the viewport. */
    CANVAS_WIDTH: 1280,
    CANVAS_HEIGHT: 720,
    TILE_SIZE: 24,
    SPRITE_DRAW_SCALE: 2,
    HUD_HEIGHT: 64,
    TARGET_FPS: 60,
    PHYSICS: {
        GRAVITY: 0.42,
        MAX_FALL_SPEED: 8,
        FRICTION: 0.85,
        AIR_FRICTION: 0.92,
        COYOTE_TIME_SEC: 0.1,
        JUMP_BUFFER_SEC: 0.12
    }
};

const TILES = {
    AIR: 0,
    SOLID: 1,
    PLATFORM: 2,
    BREAKABLE: 3,
    STRONG_PLATE: 4,
    INVISIBLE_BLOCK: 5,
    SPIKES: 6,
    CHECKPOINT: 7,
    WARP_PIPE: 8
};

const POWER_STATES = { SMALL: 0, PUMP: 1, BEAST: 2 };

const ENEMY_TYPES = {
    SLOUCHER: 0,
    FORM_POLICE: 1,
    SNAPPER: 2,
    KETTLE_BELL: 3,
    PROTEIN_DRONE: 4,
    BOSS_SHREDDER: 5
};

const COLLECTIBLE_TYPES = {
    GOLDEN_DUMBBELL: 0,
    GYM_CARD: 1,
    PROTEIN_SHAKE: 2,
    PRE_WORKOUT: 3,
    MACRO: 4,
    TROPHY: 5
};

const WORLD_THEMES = {
    NEIGHBORHOOD_GYM: 0,
    CITY_ROOFTOPS: 1,
    LOCKER_DEPTHS: 2,
    AQUATIC_MIXERS: 3,
    STEEL_FACTORY: 4,
    NEON_NIGHT: 5,
    ALPINE_ALTITUDE: 6,
    CHAMPIONSHIP: 7
};

const COLORS = {
    PRIMARY: '#3B82F6',
    SECONDARY: '#14B8A6',
    ACCENT: '#F97316',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    BLACK: '#000000',
    WHITE: '#FFFFFF',
    GRAY_DARK: '#374151',
    GRAY: '#6B7280',
    GRAY_LIGHT: '#D1D5DB',
    SKY_BLUE: '#5b9cff',
    GROUND_BROWN: '#8B4513',
    COIN_GOLD: '#FFD700'
};

const GAME_STATES = {
    LOADING: 'loading',
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over',
    LEVEL_COMPLETE: 'level_complete'
};

window.GAME_CONFIG = GAME_CONFIG;
window.TILES = TILES;
window.POWER_STATES = POWER_STATES;
window.ENEMY_TYPES = ENEMY_TYPES;
window.COLLECTIBLE_TYPES = COLLECTIBLE_TYPES;
window.WORLD_THEMES = WORLD_THEMES;
window.COLORS = COLORS;
window.GAME_STATES = GAME_STATES;
