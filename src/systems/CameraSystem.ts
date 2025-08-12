import { CameraState, PlayerState } from '../types/GameTypes';

export interface CameraConfig {
  followSpeed: number;
  lookAheadDistance: number;
  verticalOffset: number;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

export interface CameraTarget {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class CameraSystem {
  private config: CameraConfig;
  private position: { x: number; y: number };
  private target: CameraTarget | null;
  private viewport: { width: number; height: number };

  constructor(
    viewportWidth: number,
    viewportHeight: number,
    config: Partial<CameraConfig> = {}
  ) {
    this.viewport = { width: viewportWidth, height: viewportHeight };
    
    this.config = {
      followSpeed: 0.1,
      lookAheadDistance: 100,
      verticalOffset: 0,
      bounds: {
        minX: 0,
        maxX: Infinity,
        minY: 0,
        maxY: Infinity
      },
      ...config
    };

    this.position = { x: 0, y: 0 };
    this.target = null;
  }

  setTarget(target: CameraTarget): void {
    this.target = target;
  }

  clearTarget(): void {
    this.target = null;
  }

  update(deltaTime: number): void {
    if (!this.target) return;

    // Calculate target camera position with look-ahead
    const targetX = this.target.x + this.target.width / 2 - this.viewport.width / 2;
    const targetY = this.target.y + this.target.height / 2 - this.viewport.height / 2 + this.config.verticalOffset;

    // Add look-ahead based on target's movement direction
    // This would need velocity information from the target
    // For now, we'll use a simple look-ahead
    const lookAheadX = this.config.lookAheadDistance;

    // Smooth camera following
    this.position.x += (targetX + lookAheadX - this.position.x) * this.config.followSpeed;
    this.position.y += (targetY - this.position.y) * this.config.followSpeed;

    // Apply bounds
    this.position.x = Math.max(this.config.bounds.minX, Math.min(this.config.bounds.maxX, this.position.x));
    this.position.y = Math.max(this.config.bounds.minY, Math.min(this.config.bounds.maxY, this.position.y));
  }

  // Get the camera's current position
  getPosition(): { x: number; y: number } {
    return { ...this.position };
  }

  // Get the camera's viewport dimensions
  getViewport(): { width: number; height: number } {
    return { ...this.viewport };
  }

  // Convert world coordinates to screen coordinates
  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: worldX - this.position.x,
      y: worldY - this.position.y
    };
  }

  // Convert screen coordinates to world coordinates
  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: screenX + this.position.x,
      y: screenY + this.position.y
    };
  }

  // Check if a world position is visible in the viewport
  isVisible(worldX: number, worldY: number, width: number = 0, height: number = 0): boolean {
    const screenPos = this.worldToScreen(worldX, worldY);
    
    return (
      screenPos.x + width >= 0 &&
      screenPos.x <= this.viewport.width &&
      screenPos.y + height >= 0 &&
      screenPos.y <= this.viewport.height
    );
  }

  // Check if a rectangle is visible in the viewport
  isRectVisible(worldX: number, worldY: number, width: number, height: number): boolean {
    return this.isVisible(worldX, worldY, width, height);
  }

  // Set camera bounds
  setBounds(bounds: Partial<CameraConfig['bounds']>): void {
    this.config.bounds = { ...this.config.bounds, ...bounds };
  }

  // Set camera follow speed
  setFollowSpeed(speed: number): void {
    this.config.followSpeed = Math.max(0, Math.min(1, speed));
  }

  // Set look-ahead distance
  setLookAheadDistance(distance: number): void {
    this.config.lookAheadDistance = distance;
  }

  // Set vertical offset
  setVerticalOffset(offset: number): void {
    this.config.verticalOffset = offset;
  }

  // Update viewport dimensions (for window resize)
  updateViewport(width: number, height: number): void {
    this.viewport.width = width;
    this.viewport.height = height;
  }

  // Get camera configuration
  getConfig(): CameraConfig {
    return { ...this.config };
  }

  // Reset camera to initial position
  reset(): void {
    this.position = { x: 0, y: 0 };
    this.target = null;
  }

  // Shake the camera (for effects like explosions)
  shake(intensity: number, duration: number): void {
    // Implementation for camera shake effect
    // This would add a temporary offset to the camera position
    console.log(`Camera shake: ${intensity} for ${duration}ms`);
  }

  // Focus camera on a specific point instantly
  focusOn(x: number, y: number): void {
    this.position.x = x - this.viewport.width / 2;
    this.position.y = y - this.viewport.height / 2;
    
    // Apply bounds
    this.position.x = Math.max(this.config.bounds.minX, Math.min(this.config.bounds.maxX, this.position.x));
    this.position.y = Math.max(this.config.bounds.minY, Math.min(this.config.bounds.maxY, this.position.y));
  }
}