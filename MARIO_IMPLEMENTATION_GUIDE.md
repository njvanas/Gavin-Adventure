# Mario Bros-Style Platformer Implementation Guide

## Overview
This implementation provides a comprehensive Mario Bros-style platformer system built on React/TypeScript with modular architecture for 60fps gameplay.

## Core Systems Architecture

### 1. Physics System (`src/systems/PhysicsSystem.ts`)
**Key Features:**
- Variable jump height based on button hold duration
- Coyote time (grace period for jumping after leaving platform)
- Jump buffering (registers jump input slightly before landing)
- Realistic gravity and friction
- Collision detection with multiple platform types

**Implementation Highlights:**
```typescript
// Variable jump mechanics
initiateJump(player: PlayerState): PlayerState {
  if (player.isGrounded || this.coyoteTimer > 0) {
    player.velocity.y = -player.jumpPower;
    player.isJumping = true;
    player.jumpHoldTime = 0;
  }
  return player;
}

continueJump(player: PlayerState, deltaTime: number): PlayerState {
  if (player.isJumping && player.jumpHoldTime < player.maxJumpHoldTime) {
    player.jumpHoldTime += deltaTime;
    const jumpForce = (1 - player.jumpHoldTime / player.maxJumpHoldTime) * 0.5;
    player.velocity.y -= jumpForce;
  }
  return player;
}
```

### 2. Input System (`src/systems/InputSystem.ts`)
**Features:**
- Keyboard and gamepad support
- Analog stick support for smooth movement
- Input buffering and dead zone handling
- Configurable key bindings

**Usage:**
```typescript
const input = inputSystem.getInputState();
// Returns: { left, right, jump, run, fire, pause, horizontalAxis }
```

### 3. Camera System (`src/systems/CameraSystem.ts`)
**Mario-Style Camera Behavior:**
- Follows player with smooth interpolation
- Prevents backward scrolling (classic Mario behavior)
- Configurable camera bounds
- Screen shake effects for impacts
- Maintains player in lower third of screen

### 4. Player Character (`src/components/MarioPlayer.tsx`)
**Power-Up States:**
- **Small Mario**: Basic form, dies in one hit
- **Super Mario**: Taller, can break blocks, takes 2 hits
- **Fire Mario**: Can shoot fireballs, takes 2 hits

**Movement Mechanics:**
- Acceleration-based running (hold run button for max speed)
- Variable jump height (hold jump longer = higher jump)
- Momentum preservation during jumps
- Invulnerability frames after taking damage

## Level Design Elements

### Platform Types (`src/components/MarioPlatform.tsx`)
1. **Solid Blocks**: Standard collision platforms
2. **Breakable Bricks**: Can be broken by Super/Fire Mario from below
3. **Question Blocks**: Contain power-ups or coins, animate when hit
4. **Pipes**: Decorative/functional warp pipes
5. **Moving Platforms**: Platforms with configurable movement patterns

### Enemy System (`src/components/MarioEnemy.tsx`)
**Enemy Types:**
- **Goomba**: Walks forward, turns at edges/walls, defeated by jumping
- **Koopa**: Walks forward, becomes shell when jumped on, shell can be kicked
- **Piranha Plant**: Emerges from pipes, chomping animation
- **Spiny**: Cannot be jumped on safely, must be hit with fireballs

**AI Behavior:**
```typescript
// Basic enemy movement with edge detection
updateEnemies(enemies: Enemy[], platforms: Platform[]): Enemy[] {
  return enemies.map(enemy => {
    // Apply movement based on type
    enemy.velocity.x = enemy.direction * enemy.speed;
    
    // Check for edge/wall collision
    if (this.checkEdgeOrWall(enemy, platforms)) {
      enemy.direction *= -1; // Turn around
    }
    
    return enemy;
  });
}
```

## Game Systems Integration

### Score System
- **Coins**: 100 points each
- **Enemy Defeat**: 100-1000 points (combo multiplier)
- **Power-ups**: 1000 points
- **Level Completion**: Time bonus
- **Score Display**: Floating point indicators

### Lives System
- Start with 3 lives
- Lose life when taking damage as Small Mario
- Gain life at 100 coins or finding 1-up mushrooms
- Game over when lives reach 0

### Level Progression
- **Checkpoints**: Invisible markers that save progress
- **Goal System**: Flagpole or castle at level end
- **World Map**: Visual level selection
- **Unlocking**: Complete levels to unlock next

## Performance Considerations

### 60fps Optimization Strategies

1. **Object Pooling**:
```typescript
// Reuse enemy/projectile objects instead of creating new ones
class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  
  get(): T {
    return this.pool.pop() || this.createFn();
  }
  
  release(obj: T): void {
    this.pool.push(obj);
  }
}
```

2. **Spatial Partitioning**:
```typescript
// Only update objects visible on screen
const visibleEnemies = enemies.filter(enemy => 
  camera.isVisible(enemy.x, enemy.y, 32, 32)
);
```

3. **Fixed Timestep**:
```typescript
// Consistent physics regardless of framerate
const FIXED_TIMESTEP = 16.67; // 60fps
let accumulator = 0;

function gameLoop(deltaTime: number) {
  accumulator += deltaTime;
  
  while (accumulator >= FIXED_TIMESTEP) {
    updatePhysics(FIXED_TIMESTEP);
    accumulator -= FIXED_TIMESTEP;
  }
  
  render();
}
```

4. **Efficient Collision Detection**:
```typescript
// Broad phase: Check AABB overlap first
// Narrow phase: Detailed collision only if AABB overlaps
function checkCollision(a: GameObject, b: GameObject): boolean {
  // Quick AABB check
  if (!aabbOverlap(a.bounds, b.bounds)) return false;
  
  // Detailed collision detection
  return detailedCollisionCheck(a, b);
}
```

## Technical Implementation Steps

### Phase 1: Core Systems (Week 1)
1. Implement PhysicsSystem with basic gravity and collision
2. Create InputSystem with keyboard support
3. Build basic Player component with movement
4. Add CameraSystem with following behavior

### Phase 2: Game Objects (Week 2)
1. Create Platform system with different types
2. Implement basic Enemy AI (Goomba)
3. Add Collectible system (coins)
4. Build level loading system

### Phase 3: Advanced Features (Week 3)
1. Add power-up system and player states
2. Implement advanced enemies (Koopa, Piranha)
3. Create question blocks and breakable platforms
4. Add sound effects and particle systems

### Phase 4: Polish & Optimization (Week 4)
1. Implement object pooling
2. Add visual effects and animations
3. Create level editor tools
4. Performance profiling and optimization

## Code Structure Recommendations

```
src/
├── systems/           # Core game systems
│   ├── PhysicsSystem.ts
│   ├── InputSystem.ts
│   ├── CameraSystem.ts
│   └── AudioSystem.ts
├── components/        # React components
│   ├── MarioPlayer.tsx
│   ├── MarioPlatform.tsx
│   ├── MarioEnemy.tsx
│   └── MarioCollectible.tsx
├── types/            # TypeScript definitions
│   └── GameTypes.ts
├── utils/            # Helper functions
│   ├── collision.ts
│   ├── math.ts
│   └── constants.ts
├── data/             # Level data and assets
│   ├── levels/
│   └── sprites/
└── styles/           # CSS for sprites and animations
    └── mario-sprites.css
```

## Integration with Existing Codebase

The Mario-style systems are designed to integrate with your existing platformer:

1. **Replace** existing Player component with MarioPlayer
2. **Enhance** existing physics with variable jump mechanics
3. **Add** power-up system to existing game state
4. **Integrate** Mario-style enemies alongside existing ones
5. **Maintain** existing level progression and UI systems

## Testing Strategy

1. **Unit Tests**: Test individual systems (physics, input, collision)
2. **Integration Tests**: Test system interactions
3. **Performance Tests**: Measure frame rate under load
4. **Gameplay Tests**: Verify Mario-style feel and responsiveness

This implementation provides the foundation for authentic Mario Bros-style gameplay while maintaining modern code practices and performance standards.