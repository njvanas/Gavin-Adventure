// Placeholder sprite generator for development/testing
// This creates simple colored rectangles as placeholders until you add real assets

export class PlaceholderSpriteGenerator {
  private static canvas: HTMLCanvasElement | null = null;
  private static ctx: CanvasRenderingContext2D | null = null;

  private static initCanvas() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    }
  }

  static generateSprite(
    width: number,
    height: number,
    color: string,
    text: string,
    frames: number = 1
  ): string {
    this.initCanvas();
    if (!this.ctx) return '';

    const totalWidth = width * frames;
    this.canvas!.width = totalWidth;
    this.canvas!.height = height;

    // Clear canvas
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, totalWidth, height);

    // Add text
    this.ctx.fillStyle = 'white';
    this.ctx.font = `${Math.min(width, height) / 3}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Add text to each frame
    for (let i = 0; i < frames; i++) {
      const x = width * i + width / 2;
      const y = height / 2;
      this.ctx.fillText(text, x, y);
    }

    // Add frame borders
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= frames; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(width * i, 0);
      this.ctx.lineTo(width * i, height);
      this.ctx.stroke();
    }

    return this.canvas!.toDataURL();
  }

  static generateGavinSprites(): { [key: string]: string } {
    return {
      'gavin-idle': this.generateSprite(64, 64, '#FF6B6B', 'IDLE', 4),
      'gavin-run': this.generateSprite(64, 64, '#4ECDC4', 'RUN', 6),
      'gavin-jump': this.generateSprite(64, 64, '#45B7D1', 'JUMP', 3),
      'gavin-flex': this.generateSprite(64, 64, '#FFA07A', 'FLEX', 4)
    };
  }

  static generateCoinSprites(): { [key: string]: string } {
    return {
      'gold-coin': this.generateSprite(16, 16, '#FFD700', 'C', 6),
      'silver-coin': this.generateSprite(16, 16, '#C0C0C0', 'S', 4)
    };
  }

  static generatePowerUpSprites(): { [key: string]: string } {
    return {
      'chicken': this.generateSprite(24, 24, '#8B4513', 'CH', 3),
      'small-dumbbell': this.generateSprite(20, 20, '#696969', 'S', 2),
      'medium-dumbbell': this.generateSprite(24, 24, '#808080', 'M', 2),
      'large-dumbbell': this.generateSprite(28, 28, '#A9A9A9', 'L', 2),
      'super-serum': this.generateSprite(20, 20, '#FF1493', 'SS', 4)
    };
  }

  static generateBlockSprites(): { [key: string]: string } {
    return {
      'question-block': this.generateSprite(32, 32, '#FFD700', '?', 4),
      'brick-block': this.generateSprite(32, 32, '#8B4513', 'B', 1)
    };
  }

  static generateEnemySprites(): { [key: string]: string } {
    return {
      'mini-fat-woman': this.generateSprite(32, 32, '#FF69B4', 'MFW', 4)
    };
  }

  static generateBossSprites(): { [key: string]: string } {
    return {
      'jungle-fat-woman': this.generateSprite(96, 96, '#228B22', 'JFW', 6),
      'desert-fat-woman': this.generateSprite(96, 96, '#DAA520', 'DFW', 6),
      'snow-fat-woman': this.generateSprite(96, 96, '#87CEEB', 'SFW', 6),
      'cyber-fat-woman': this.generateSprite(96, 96, '#00FFFF', 'CFW', 6),
      'haunted-fat-woman': this.generateSprite(96, 96, '#8B008B', 'HFW', 6)
    };
  }

  static generateAllPlaceholders(): { [key: string]: string } {
    return {
      ...this.generateGavinSprites(),
      ...this.generateCoinSprites(),
      ...this.generatePowerUpSprites(),
      ...this.generateBlockSprites(),
      ...this.generateEnemySprites(),
      ...this.generateBossSprites()
    };
  }

  static createPlaceholderImageElement(dataUrl: string): HTMLImageElement {
    const img = new Image();
    img.src = dataUrl;
    return img;
  }

  static downloadPlaceholderAsFile(dataUrl: string, filename: string) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }

  static downloadAllPlaceholders() {
    const placeholders = this.generateAllPlaceholders();
    
    Object.entries(placeholders).forEach(([name, dataUrl]) => {
      setTimeout(() => {
        this.downloadPlaceholderAsFile(dataUrl, `${name}.png`);
      }, 100);
    });
  }
}

// Usage example:
// PlaceholderSpriteGenerator.downloadAllPlaceholders();
// This will download all placeholder sprites as PNG files
