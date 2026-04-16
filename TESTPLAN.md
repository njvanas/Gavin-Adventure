# Gavin Adventure - Test Plan

## Overview
This document outlines the testing procedures and quality assurance checklist for Gavin Adventure. All tests should be performed on multiple platforms (desktop, mobile, different browsers) to ensure consistent gameplay experience.

## Core Systems Testing

### Physics & Movement
**Test ID**: PHYS-001
**Description**: Verify core movement mechanics work correctly
**Steps**:
1. Start a new game
2. Test basic left/right movement - should be responsive and smooth
3. Test jumping - short tap for small jump, hold for higher jump
4. Test running - hold run button for increased speed
5. Test crouching - down arrow should make Gavin crouch
6. Verify coyote time - player can still jump briefly after leaving a platform
7. Verify jump buffering - pressing jump slightly before landing should execute jump

**Expected Results**:
- Movement speed: Walk = 1.2 tiles/s, Run = 2.0 tiles/s
- Gravity: 0.42 tiles/frame at 60 FPS
- Jump impulse: Small = 6.0, Running = 7.0 tiles/s
- Coyote time: 4 frames
- Jump buffer: 5 frames

### Power-Up System
**Test ID**: POW-001
**Description**: Verify power state transitions work correctly
**Steps**:
1. Start as Small Gavin
2. Collect a Protein Shake - should transform to Pump Mode
3. Collect a Pre-Workout - should transform to Beast Mode
4. Verify Beast Mode can throw projectiles with C key
5. Take damage - should revert to previous power state
6. Take damage as Small Gavin - should lose a life

**Expected Results**:
- Smooth visual transitions between states
- Hitbox changes appropriately
- Projectile throwing only available in Beast Mode
- 1 second invulnerability after taking damage

### Collision Detection
**Test ID**: COL-001  
**Description**: Verify collision system works correctly
**Steps**:
1. Test solid tile collision - Gavin should not pass through walls/ground
2. Test platform collision - Gavin should land on top, pass through from below
3. Test enemy collision - Should damage Gavin or be defeated if stomped
4. Test collectible collision - Items should be collected on contact
5. Test projectile collision - Should hit enemies and walls appropriately

**Expected Results**:
- No clipping through solid objects
- Consistent collision responses
- Proper damage/collection mechanics

## Elevated Jump Mechanics

### Run-Up Ledge
**Test ID**: JUMP-001
**Description**: Test long-distance jumping challenges
**Steps**:
1. Navigate to a run-up ledge challenge
2. Attempt to clear gap with walking speed - should fail
3. Build up running speed and jump - should successfully clear gap
4. Test with various gap distances (3-4 tiles with 2-tile height difference)

**Expected Results**:
- Walking jumps fail to clear gaps
- Running jumps successfully clear gaps
- Landing feels satisfying and responsive

### Stair Rhythm
**Test ID**: JUMP-002
**Description**: Test rhythmic jumping on staggered platforms
**Steps**:
1. Find stair rhythm section (staggered 1-tile steps)
2. Attempt with long-held jumps - should overshoot
3. Use short, rhythmic taps - should maintain perfect rhythm
4. Verify safe lower route exists if rhythm is missed

### Wind/Updraft
**Test ID**: JUMP-003
**Description**: Test wind mechanics (Worlds 2, 7)
**Steps**:
1. Navigate to wind zone (should see particle effects)
2. Jump in wind zone - should achieve higher than normal height
3. Test drift control during enhanced jump
4. Verify wind effect is 20-40% jump bonus

**Expected Results**:
- Visible particle effects indicate wind zones
- Significant jump height increase
- Controllable drift mechanics

## Enemy Behavior Testing

### Sloucher AI
**Test ID**: ENE-001
**Description**: Verify Sloucher walking behavior
**Steps**:
1. Observe Sloucher movement patterns
2. Verify they turn around at edges and walls
3. Test stomping mechanism - should defeat enemy
4. Test side collision - should damage Gavin

### Form Police Shell Mechanic
**Test ID**: ENE-002
**Description**: Test Form Police transformation
**Steps**:
1. Stomp a Form Police enemy
2. Verify transformation to sliding clipboard shell
3. Test shell sliding mechanics and wall bouncing
4. Verify shells can defeat other enemies
5. Test Gavin can ride shells safely

### Snapper Timing
**Test ID**: ENE-003
**Description**: Test Snapper plant emergence timing
**Steps**:
1. Observe Snapper tube rig
2. Time the rise/fall cycle (should be predictable)
3. Stand on tube lip - Snapper should not emerge
4. Move away - Snapper should emerge normally

### Boss Shredder Patterns
**Test ID**: ENE-004
**Description**: Test boss escalation across worlds
**Steps**:
1. Fight World 2 Shredder - should use fire arcs + hops (3 hits)
2. Fight World 4 Shredder - should add charge dash (4 hits)
3. Fight World 6 Shredder - should add projectile reflect (5 hits)
4. Fight World 8 Shredder - should use all patterns + arena hazards (6 hits)

## Collectibles & Secrets

### Hidden Block System  
**Test ID**: SEC-001
**Description**: Verify invisible blocks and secret detection
**Steps**:
1. Look for visual hints (off-hue tiles, particle sparkles)
2. Jump underneath suspected areas
3. Verify blocks become visible when hit
4. Test multi-hit benches for progressive rewards

### Secret Room Access
**Test ID**: SEC-002
**Description**: Test secret area entry methods
**Steps**:
1. Find Supplement Tunnels (pipe-like entrances)
2. Enter tunnel - should transport to secret room
3. Verify high density of collectibles in secret areas
4. Test return mechanism to main level

### Checkpoint System
**Test ID**: SEC-003
**Description**: Verify checkpoint functionality
**Steps**:
1. Pass a checkpoint flag
2. Collect some items after checkpoint
3. Die intentionally
4. Verify respawn at checkpoint with collected items retained

## Mobile & Touch Controls

### Touch Interface
**Test ID**: MOB-001
**Description**: Test mobile touch controls
**Steps**:
1. Load game on mobile device
2. Verify on-screen controls appear
3. Test directional pad responsiveness
4. Test action buttons (jump, run, throw)
5. Test multi-touch support

**Expected Results**:
- Controls should be appropriately sized for touch
- No input lag or missed touches
- Visual feedback on button press

### Responsive Scaling
**Test ID**: MOB-002
**Description**: Test display scaling across screen sizes
**Steps**:
1. Test on various screen resolutions
2. Verify pixel-perfect scaling
3. Test orientation changes (mobile)
4. Verify UI elements remain accessible

## Audio System Testing

### Sound Effects
**Test ID**: AUD-001
**Description**: Verify all sound effects work correctly
**Steps**:
1. Test jump sounds (small vs charged jump)
2. Test collectible pickup sounds
3. Test enemy defeat sounds
4. Test power-up transformation sounds
5. Test boss hit/defeat sounds

### Music System
**Test ID**: AUD-002
**Description**: Test background music functionality
**Steps**:
1. Verify different music for each world theme
2. Test music transitions between areas
3. Test audio settings (volume controls, mute)
4. Verify music loops seamlessly

## Save System Testing

### Progress Persistence
**Test ID**: SAV-001
**Description**: Test save/load functionality
**Steps**:
1. Play through several levels
2. Close browser completely
3. Reopen game
4. Verify progress is maintained
5. Test settings persistence

### Data Integrity
**Test ID**: SAV-002
**Description**: Test save data corruption handling
**Steps**:
1. Manually corrupt localStorage data
2. Restart game
3. Verify graceful fallback to defaults
4. Test save export/import feature

## Performance Testing

### Frame Rate
**Test ID**: PERF-001
**Description**: Verify target 60 FPS performance
**Steps**:
1. Enable debug overlay (F1)
2. Monitor FPS counter during normal gameplay
3. Test performance during particle-heavy scenes
4. Test with multiple enemies on screen
5. Measure on both desktop and mobile

**Expected Results**:
- Consistent 60 FPS on desktop
- Minimum 30 FPS on mobile devices
- No frame drops during normal gameplay

### Memory Usage
**Test ID**: PERF-002
**Description**: Monitor memory consumption
**Steps**:
1. Play for extended periods (30+ minutes)
2. Monitor browser memory usage
3. Test level transitions for memory leaks
4. Verify audio pool management

## Level Editor Testing

### Basic Functionality
**Test ID**: EDIT-001
**Description**: Test level editor core features
**Steps**:
1. Open tools/editor.html
2. Create a simple level layout
3. Place various tile types
4. Add enemies and collectibles
5. Export level as JSON
6. Import JSON back into editor

### Level Validation
**Test ID**: EDIT-002
**Description**: Test exported levels in main game
**Steps**:
1. Create custom level in editor
2. Export JSON
3. Replace test level data in main game
4. Verify level loads and plays correctly
5. Test all placed entities function properly

## Browser Compatibility

### Desktop Browsers
**Test ID**: COMPAT-001
**Description**: Test across major desktop browsers
**Test Matrix**:
- Chrome (latest): Full functionality expected
- Firefox (latest): Full functionality expected  
- Safari (latest): Full functionality expected
- Edge (latest): Full functionality expected

### Mobile Browsers
**Test ID**: COMPAT-002
**Description**: Test mobile browser compatibility
**Test Matrix**:
- Chrome Mobile: Full functionality expected
- Safari iOS: Full functionality expected
- Firefox Mobile: Full functionality expected

## Accessibility Testing

### Visual Accessibility
**Test ID**: ACCESS-001
**Description**: Test color-blind friendly design
**Steps**:
1. Test game with color-blind simulation tools
2. Verify important information isn't color-only dependent
3. Test contrast ratios for UI elements

### Input Accessibility  
**Test ID**: ACCESS-002
**Description**: Test control remapping
**Steps**:
1. Access control settings
2. Remap keys to alternative bindings
3. Verify custom controls work correctly
4. Test gamepad support

## Regression Testing

### Core Gameplay
**Test ID**: REG-001
**Description**: Verify no regressions in core mechanics
**Steps**:
1. Complete full playthrough of World 1
2. Test all major gameplay systems
3. Compare against baseline performance
4. Document any behavioral changes

### Bug Verification
**Test ID**: REG-002  
**Description**: Verify previously fixed bugs remain fixed
**Steps**:
1. Reference previous bug reports
2. Re-test specific scenarios that caused issues
3. Verify fixes are still effective

## Test Execution Checklist

### Pre-Release Testing
- [ ] All PHYS tests passed
- [ ] All POW tests passed  
- [ ] All COL tests passed
- [ ] All JUMP tests passed (each pattern in 2+ levels by World 4)
- [ ] All ENE tests passed
- [ ] All SEC tests passed
- [ ] All MOB tests passed on 3+ device sizes
- [ ] All AUD tests passed
- [ ] All SAV tests passed
- [ ] All PERF tests passed
- [ ] All EDIT tests passed
- [ ] All COMPAT tests passed on target browsers
- [ ] All ACCESS tests passed
- [ ] All REG tests passed

### Test Environment Setup
1. Set up test devices (desktop, tablet, mobile)
2. Install target browsers with various versions
3. Prepare test save data for various scenarios
4. Set up performance monitoring tools
5. Prepare accessibility testing tools

### Test Data Requirements
- Clean browser profile for first-run testing
- Pre-populated save data for continuation testing
- Various level completion states
- Corrupted save data for error handling testing

### Bug Reporting Format
```
Bug ID: [Unique identifier]
Priority: [High/Medium/Low]
Component: [System affected]
Environment: [Browser/OS/Device]
Steps to Reproduce: [Detailed steps]
Expected Result: [What should happen]
Actual Result: [What actually happens]
Severity: [Critical/Major/Minor/Cosmetic]
```

## Pass/Fail Criteria

### Critical Issues (Must Fix)
- Game crashes or becomes unplayable
- Save data corruption or loss
- Controls become unresponsive
- Physics behave unpredictably
- Major performance issues (< 30 FPS)

### Major Issues (Should Fix)
- Audio problems
- Visual glitches
- Minor control issues
- Performance drops in specific scenarios
- UI/UX problems

### Minor Issues (May Fix)
- Minor visual inconsistencies
- Small performance optimizations
- Quality-of-life improvements
- Non-critical accessibility issues

---

**Test Plan Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [Schedule regular reviews]