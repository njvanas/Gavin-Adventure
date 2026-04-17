(function () {
    window.SMB_CONST = {
        MIN_WALK: 4.453125,
        MAX_WALK: 93.75,
        MAX_RUN: 153.75,
        ACC_WALK: 133.59375,
        ACC_RUN: 200.390625,
        DEC_REL: 182.8125,
        DEC_SKID: 365.625,
        MIN_SKID: 33.75,
        STOP_FALL: 1575,
        WALK_FALL: 1800,
        RUN_FALL: 2025,
        STOP_FALL_A: 450,
        WALK_FALL_A: 421.875,
        RUN_FALL_A: 562.5,
        MAX_FALL: 270,
        /** SMB-style gravity acceleration while airborne (SMB units / sec²). */
        DEFAULT_GRAVITY: 562.5,
        DISPLAY_SCALE: 3,
        WORLD_SCALE: 1,
        get POS_SCALE() {
            return this.DISPLAY_SCALE * this.WORLD_SCALE;
        }
    };
})();
