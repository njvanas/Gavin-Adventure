/**
 * NES SMB-style physics literals from:
 * - github.com/algorithm0r/SuperMarioBros (mario.js — jdaster64-derived notes)
 * - github.com/Jcw87/c2-smb1 (Event sheets/Level.xml — Construct tuning, same family)
 *
 * Stored in "SMB internal" units as the reference uses before * dt * display scale.
 */
(function () {
    window.SMB_CONST = {
        // Horizontal (mario.js)
        MIN_WALK: 4.453125,
        MAX_WALK: 93.75,
        MAX_RUN: 153.75,
        ACC_WALK: 133.59375,
        ACC_RUN: 200.390625,
        DEC_REL: 182.8125,
        DEC_SKID: 365.625,
        MIN_SKID: 33.75,

        // Vertical / gravity tiers (mario.js)
        STOP_FALL: 1575,
        WALK_FALL: 1800,
        RUN_FALL: 2025,
        STOP_FALL_A: 450,
        WALK_FALL_A: 421.875,
        RUN_FALL_A: 562.5,
        MAX_FALL: 270,
        /** Default downward acceleration while airborne */
        DEFAULT_GRAVITY: 562.5,

        /**
         * Maps SMB internal velocity units → world pixels/sec (c2-smb1 / algorithm0r use ~×3 display scale).
         * WORLD_SCALE was 0.36 and made movement ~3× too slow vs NES SMB feel.
         */
        DISPLAY_SCALE: 3,
        WORLD_SCALE: 1,

        get POS_SCALE() {
            return this.DISPLAY_SCALE * this.WORLD_SCALE;
        }
    };
})();
