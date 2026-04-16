/**
 * Gavin player motion — NES SMB integrator from algorithm0r/SuperMarioBros (mario.js).
 * One gravity accumulation per frame; jump via coyote/buffer or held A on floor.
 */
(function () {
    function stepGavin(player, input, deltaMs) {
        const S = window.SMB_CONST;
        const TICK = deltaMs / 1000;
        if (TICK <= 0 || TICK > 0.05) return;

        const MIN_WALK = S.MIN_WALK;
        const MAX_WALK = S.MAX_WALK;
        const MAX_RUN = S.MAX_RUN;
        const ACC_WALK = S.ACC_WALK;
        const ACC_RUN = S.ACC_RUN;
        const DEC_REL = S.DEC_REL;
        const DEC_SKID = S.DEC_SKID;
        const STOP_FALL = S.STOP_FALL;
        const WALK_FALL = S.WALK_FALL;
        const RUN_FALL = S.RUN_FALL;
        const STOP_FALL_A = S.STOP_FALL_A;
        const WALK_FALL_A = S.WALK_FALL_A;
        const RUN_FALL_A = S.RUN_FALL_A;
        const MAX_FALL = S.MAX_FALL;
        const PS = S.POS_SCALE;

        let vx = player.smbVelX;
        let vy = player.smbVelY;
        let fallAcc = player.fallAcc;
        let st = player.smbState;

        const left = input.isDown('left') && !(input.isDown('down') && player.onGround);
        const right = input.isDown('right') && !(input.isDown('down') && player.onGround);
        const down = input.isDown('down');
        const runB = input.isDown('run');
        const jumpA = input.isDown('jump');

        function applyJumpImpulse() {
            const ax = Math.abs(vx);
            if (ax < 16) {
                vy = -280;
                fallAcc = STOP_FALL;
            } else if (ax < 40) {
                vy = -280;
                fallAcc = WALK_FALL;
            } else {
                vy = -300;
                fallAcc = RUN_FALL;
            }
            st = 4;
            player.onGround = false;
            window.audio.playSound('jump');
        }

        const canCoyote = player.onGround || player.coyoteTime > 0;
        const bufferedJump = player.jumpBuffer > 0 && canCoyote && !down;
        const edgeJump = input.isPressed('jump') && canCoyote && !down;
        if (bufferedJump) {
            player.jumpBuffer = 0;
            player.coyoteTime = 0;
            applyJumpImpulse();
        } else if (edgeJump) {
            applyJumpImpulse();
        }

        if (st !== 4) {
            if (Math.abs(vx) < MIN_WALK) {
                vx = 0;
                st = 0;
                if (left && !down) vx -= MIN_WALK;
                if (right && !down) vx += MIN_WALK;
            } else if (Math.abs(vx) >= MIN_WALK) {
                const facing = player.smbFacing;
                if (facing === 0) {
                    if (right && !left && !down) {
                        vx += (runB ? ACC_RUN : ACC_WALK) * TICK;
                    } else if (left && !right && !down) {
                        vx -= DEC_SKID * TICK;
                        st = 3;
                    } else {
                        vx -= DEC_REL * TICK;
                    }
                } else {
                    if (left && !right && !down) {
                        vx -= (runB ? ACC_RUN : ACC_WALK) * TICK;
                    } else if (right && !left && !down) {
                        vx += DEC_SKID * TICK;
                        st = 3;
                    } else {
                        vx += DEC_REL * TICK;
                    }
                }
            }
        } else {
            if (vy < 0 && jumpA) {
                if (fallAcc === STOP_FALL) vy -= (STOP_FALL - STOP_FALL_A) * TICK;
                if (fallAcc === WALK_FALL) vy -= (WALK_FALL - WALK_FALL_A) * TICK;
                if (fallAcc === RUN_FALL) vy -= (RUN_FALL - RUN_FALL_A) * TICK;
            }
            if (right && !left) {
                if (Math.abs(vx) > MAX_WALK) vx += ACC_RUN * TICK;
                else vx += ACC_WALK * TICK;
            } else if (left && !right) {
                if (Math.abs(vx) > MAX_WALK) vx -= ACC_RUN * TICK;
                else vx -= ACC_WALK * TICK;
            }
        }

        vy += fallAcc * TICK;

        if (vy >= MAX_FALL) vy = MAX_FALL;
        if (vy <= -MAX_FALL) vy = -MAX_FALL;
        if (vx >= MAX_RUN) vx = MAX_RUN;
        if (vx <= -MAX_RUN) vx = -MAX_RUN;
        if (vx >= MAX_WALK && !runB) vx = MAX_WALK;
        if (vx <= -MAX_WALK && !runB) vx = -MAX_WALK;

        if (down && player.onGround) {
            vx *= 0.82;
        }

        player.smbVelX = vx;
        player.smbVelY = vy;
        player.fallAcc = fallAcc;
        player.smbState = st;

        player.vx = vx * PS;
        player.vy = vy * PS;

        if (vx < 0) player.smbFacing = 1;
        if (vx > 0) player.smbFacing = 0;

        player.direction = vx >= 0 ? 1 : -1;
        player.running = runB;

        if (st === 3) player.animationState = 'skid';
        else if (st === 4 || !player.onGround) player.animationState = 'jump';
        else if (Math.abs(vx) > MAX_WALK && runB) player.animationState = 'run';
        else if (Math.abs(vx) >= MIN_WALK) player.animationState = 'walk';
        else player.animationState = 'idle';
    }

    window.SMBIntegrator = { stepGavin };
})();
