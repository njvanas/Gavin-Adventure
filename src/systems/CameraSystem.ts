import { CameraState, PlayerState } from '../types/GameTypes';

export class CameraSystem {
  private camera: CameraState;
  private screenWidth: number;
  private screenHeight: number;

  constructor(screenWidth: number, screenHeight: number, levelWidth: number, levelHeight: number) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    
    this.camera = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      smoothing: 0.1,
      bounds: {
        left: 0,
        right: levelWidth - screenWidth,
        top: 0,
        bottom: levelHeight - screenHeight
      }
    };
  }

  update(player: PlayerState, deltaTime: number): CameraState {
    // Calculate target position based on player position
    this.camera.targetX = player.position.x - this.screenWidth / 2;
    this.camera.targetY = player.position.y - this.screenHeight * 0.7; // Keep player in lower third

    // Apply camera bounds
    this.camera.targetX = Math.max(this.camera.bounds.left, 
      Math.min(this.camera.bounds.right, this.camera.targetX));
    this.camera.targetY = Math.max(this.camera.bounds.top, 
      Math.min(this.camera.bounds.bottom, this.camera.targetY));

    // Smooth camera movement
    const smoothingFactor = 1 - Math.pow(1 - this.camera.smoothing, deltaTime / 16.67); // 60fps normalized
    this.camera.x += (this.camera.targetX - this.camera.x) * smoothingFactor;
    this.camera.y += (this.camera.targetY - this.camera.y) * smoothingFactor;

    // Prevent camera from moving backwards (classic Mario behavior)
    if (this.camera.x < this.camera.targetX) {
      this.camera.x = Math.max(this.camera.x, this.camera.targetX - this.screenWidth * 0.3);
    }

    return { ...this.camera };
  }

  // Get world position from screen position
  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: screenX + this.camera.x,
      y: screenY + this.camera.y
    };
  }

  // Get screen position from world position
  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: worldX - this.camera.x,
      y: worldY - this.camera.y
    };
  }

  // Check if object is visible on screen
  isVisible(x: number, y: number, width: number, height: number): boolean {
    return x + width > this.camera.x && 
           x < this.camera.x + this.screenWidth &&
           y + height > this.camera.y && 
           y < this.camera.y + this.screenHeight;
  }

  // Shake effect for impacts
  shake(intensity: number, duration: number) {
    // Implementation for camera shake effect
    const shakeX = (Math.random() - 0.5) * intensity;
    const shakeY = (Math.random() - 0.5) * intensity;
    
    this.camera.x += shakeX;
    this.camera.y += shakeY;
    
    // Reset after duration (would need proper timing system)
    setTimeout(() => {
      this.camera.x -= shakeX;
      this.camera.y -= shakeY;
    }, duration);
  }

  getCamera(): CameraState {
    return { ...this.camera };
  }

  setBounds(left: number, right: number, top: number, bottom: number) {
    this.camera.bounds = { left, right, top, bottom };
  }
}