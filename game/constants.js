// Game Constants and Configuration
//
// Physics feel targets (walk/run/skid/gravity) are informed by:
// - github.com/algorithm0r/SuperMarioBros (JS NES-style clone)
// - github.com/Jcw87/c2-smb1 (Construct 2; Event sheets/Level.xml defines PLAYER_WALK_SPEED 93.75,
//   PLAYER_RUN_SPEED 153.75, PLAYER_WALK_ACCEL 135, PLAYER_RUN_ACCEL 200, PLAYER_SKID_ACCEL 365,
//   PLAYER_DECEL 183, PLAYER_GRAVITY 562.5 — Construct Platform units, not used verbatim here)
//
const GAME_CONFIG = {
    CANVAS_WIDTH: 1024,
    CANVAS_HEIGHT: 576,
    TILE_SIZE: 16,
    TARGET_FPS: 60,
    
    PHYSICS: {
        GRAVITY: 0.42,
        MAX_FALL_SPEED: 8,
        FRICTION: 0.85,
        AIR_FRICTION: 0.92,

        // Legacy instant-speed caps (used as fallbacks / tuning reference)
        WALK_SPEED: 1.2,
        RUN_SPEED: 2.0,

        /**
         * SMB-style horizontal tuning (accel / skid / release). Ratios align ~NES-like sources above;
         * values are for this engine’s per-frame integration (~60fps), not C2 pixels/sec.
         */
        MIN_WALK: 0.14,
        MAX_WALK: 1.25,
        MAX_RUN: 2.08,
        ACC_WALK: 0.32,
        ACC_RUN: 0.46,
        DEC_REL: 0.4,
        DEC_SKID: 0.78,
        SKID_VEL_THRESHOLD: 0.18,
        AIR_CONTROL_ACCEL: 0.24,

        JUMP_IMPULSE_SMALL: 6.0,
        JUMP_IMPULSE_RUN: 7.0,
        VARIABLE_JUMP_FRAMES: 12,
        /** Extra upward each frame while rising and holding jump (SMB hold-A apex) */
        JUMP_RISE_HOLD_BOOST: 0.055,

        COYOTE_TIME: 4,
        JUMP_BUFFER: 5
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
    WARP_PIPE: 8,
};

const POWER_STATES = {
    SMALL: 0,
    PUMP: 1,
    BEAST: 2
};

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
    // Primary palette
    PRIMARY: '#3B82F6',
    SECONDARY: '#14B8A6',
    ACCENT: '#F97316',
    
    // State colors
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    
    // Neutrals
    BLACK: '#000000',
    WHITE: '#FFFFFF',
    GRAY_DARK: '#374151',
    GRAY: '#6B7280',
    GRAY_LIGHT: '#D1D5DB',
    
    // Game specific
    SKY_BLUE: '#87CEEB',
    GROUND_BROWN: '#8B4513',
    COIN_GOLD: '#FFD700',
    POWER_BLUE: '#4169E1',
    POWER_RED: '#DC143C',
    
    // World theme colors
    NEIGHBORHOOD: '#90EE90',
    CITY: '#696969',
    LOCKER: '#2F4F4F',
    AQUATIC: '#1E90FF',
    FACTORY: '#708090',
    NEON: '#FF1493',
    ALPINE: '#F0F8FF',
    CHAMPIONSHIP: '#DAA520'
};

const SPRITES = {
    GAVIN_SMALL: { width: 16, height: 16 },
    GAVIN_PUMP: { width: 16, height: 24 },
    GAVIN_BEAST: { width: 24, height: 24 },
    ENEMIES: { width: 16, height: 16 },
    COLLECTIBLES: { width: 16, height: 16 },
    TILES: { width: 16, height: 16 }
};

const GAME_STATES = {
    LOADING: 'loading',
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over',
    LEVEL_COMPLETE: 'level_complete',
    WORLD_COMPLETE: 'world_complete'
};

const AUDIO_SETTINGS = {
    MASTER_VOLUME: 0.7,
    SFX_VOLUME: 0.8,
    MUSIC_VOLUME: 0.6
};

// Export to global scope
window.GAME_CONFIG = GAME_CONFIG;
window.TILES = TILES;
window.POWER_STATES = POWER_STATES;
window.ENEMY_TYPES = ENEMY_TYPES;
window.COLLECTIBLE_TYPES = COLLECTIBLE_TYPES;
window.WORLD_THEMES = WORLD_THEMES;
window.COLORS = COLORS;
window.SPRITES = SPRITES;
window.GAME_STATES = GAME_STATES;
window.AUDIO_SETTINGS = AUDIO_SETTINGS;