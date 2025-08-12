// Asset configuration for Gavin Adventure
export interface AssetConfig {
  id: string;
  name: string;
  type: 'sprite' | 'image' | 'audio' | 'animation';
  path: string;
  width?: number;
  height?: number;
  frames?: number;
  frameTime?: number;
  loop?: boolean;
}

export interface ItemConfig {
  id: string;
  name: string;
  type: 'collectible' | 'powerup' | 'enemy' | 'boss' | 'block';
  sprite: AssetConfig;
  properties: {
    value?: number;
    strength?: number;
    health?: number;
    damage?: number;
    duration?: number;
    rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  };
  behavior: {
    movement?: 'static' | 'patrol' | 'chase' | 'boss';
    attackPattern?: string[];
    dropRate?: number;
  };
}

// Main Character - Gavin
export const GAVIN_SPRITES: AssetConfig[] = [
  {
    id: 'gavin-idle',
    name: 'Gavin Idle',
    type: 'sprite',
    path: '/assets/sprites/gavin-idle.png',
    width: 64,
    height: 64,
    frames: 4,
    frameTime: 200,
    loop: true
  },
  {
    id: 'gavin-run',
    name: 'Gavin Running',
    type: 'sprite',
    path: '/assets/sprites/gavin-run.png',
    width: 64,
    height: 64,
    frames: 6,
    frameTime: 100,
    loop: true
  },
  {
    id: 'gavin-jump',
    name: 'Gavin Jumping',
    type: 'sprite',
    path: '/assets/sprites/gavin-jump.png',
    width: 64,
    height: 64,
    frames: 3,
    frameTime: 150,
    loop: false
  },
  {
    id: 'gavin-flex',
    name: 'Gavin Flexing',
    type: 'sprite',
    path: '/assets/sprites/gavin-flex.png',
    width: 64,
    height: 64,
    frames: 4,
    frameTime: 200,
    loop: false
  }
];

// Blocks that generate coins
export const COIN_BLOCKS: ItemConfig[] = [
  {
    id: 'question-block',
    name: 'Question Block',
    type: 'block',
    sprite: {
      id: 'question-block-sprite',
      name: 'Question Block',
      type: 'sprite',
      path: '/assets/sprites/question-block.png',
      width: 32,
      height: 32,
      frames: 4,
      frameTime: 300,
      loop: true
    },
    properties: {
      value: 10,
      rarity: 'common'
    },
    behavior: {
      movement: 'static',
      dropRate: 1.0
    }
  },
  {
    id: 'brick-block',
    name: 'Brick Block',
    type: 'block',
    sprite: {
      id: 'brick-block-sprite',
      name: 'Brick Block',
      type: 'sprite',
      path: '/assets/sprites/brick-block.png',
      width: 32,
      height: 32,
      frames: 1,
      frameTime: 0,
      loop: false
    },
    properties: {
      value: 5,
      rarity: 'common'
    },
    behavior: {
      movement: 'static',
      dropRate: 0.7
    }
  }
];

// Coins
export const COINS: ItemConfig[] = [
  {
    id: 'gold-coin',
    name: 'Gold Coin',
    type: 'collectible',
    sprite: {
      id: 'gold-coin-sprite',
      name: 'Gold Coin',
      type: 'sprite',
      path: '/assets/sprites/gold-coin.png',
      width: 16,
      height: 16,
      frames: 6,
      frameTime: 150,
      loop: true
    },
    properties: {
      value: 10,
      rarity: 'common'
    },
    behavior: {
      movement: 'static',
      dropRate: 1.0
    }
  },
  {
    id: 'silver-coin',
    name: 'Silver Coin',
    type: 'collectible',
    sprite: {
      id: 'silver-coin-sprite',
      name: 'Silver Coin',
      type: 'sprite',
      path: '/assets/sprites/silver-coin.png',
      width: 16,
      height: 16,
      frames: 4,
      frameTime: 200,
      loop: true
    },
    properties: {
      value: 5,
      rarity: 'common'
    },
    behavior: {
      movement: 'static',
      dropRate: 1.0
    }
  }
];

// Chicken - consumed to increase strength
export const CHICKEN: ItemConfig = {
  id: 'chicken',
  name: 'Chicken',
  type: 'powerup',
  sprite: {
    id: 'chicken-sprite',
    name: 'Chicken',
    type: 'sprite',
    path: '/assets/sprites/chicken.png',
    width: 24,
    height: 24,
    frames: 3,
    frameTime: 250,
    loop: true
  },
  properties: {
    strength: 5,
    duration: 0,
    rarity: 'common'
  },
  behavior: {
    movement: 'static',
    dropRate: 0.3
  }
};

// Dumbbells - used to increase strength
export const DUMBBELLS: ItemConfig[] = [
  {
    id: 'small-dumbbell',
    name: 'Small Dumbbell',
    type: 'powerup',
    sprite: {
      id: 'small-dumbbell-sprite',
      name: 'Small Dumbbell',
      type: 'sprite',
      path: '/assets/sprites/small-dumbbell.png',
      width: 20,
      height: 20,
      frames: 2,
      frameTime: 500,
      loop: true
    },
    properties: {
      strength: 10,
      duration: 0,
      rarity: 'common'
    },
    behavior: {
      movement: 'static',
      dropRate: 0.4
    }
  },
  {
    id: 'medium-dumbbell',
    name: 'Medium Dumbbell',
    type: 'powerup',
    sprite: {
      id: 'medium-dumbbell-sprite',
      name: 'Medium Dumbbell',
      type: 'sprite',
      path: '/assets/sprites/medium-dumbbell.png',
      width: 24,
      height: 24,
      frames: 2,
      frameTime: 500,
      loop: true
    },
    properties: {
      strength: 20,
      duration: 0,
      rarity: 'rare'
    },
    behavior: {
      movement: 'static',
      dropRate: 0.2
    }
  },
  {
    id: 'large-dumbbell',
    name: 'Large Dumbbell',
    type: 'powerup',
    sprite: {
      id: 'large-dumbbell-sprite',
      name: 'Large Dumbbell',
      type: 'sprite',
      path: '/assets/sprites/large-dumbbell.png',
      width: 28,
      height: 28,
      frames: 2,
      frameTime: 500,
      loop: true
    },
    properties: {
      strength: 35,
      duration: 0,
      rarity: 'epic'
    },
    behavior: {
      movement: 'static',
      dropRate: 0.1
    }
  }
];

// Super Serum - exponentially increases strength
export const SUPER_SERUM: ItemConfig = {
  id: 'super-serum',
  name: 'Super Serum',
  type: 'powerup',
  sprite: {
    id: 'super-serum-sprite',
    name: 'Super Serum',
    type: 'sprite',
    path: '/assets/sprites/super-serum.png',
    width: 20,
    height: 20,
    frames: 4,
    frameTime: 200,
    loop: true
  },
  properties: {
    strength: 100,
    duration: 30,
    rarity: 'legendary'
  },
  behavior: {
    movement: 'static',
    dropRate: 0.05
  }
};

// Mini Fat Woman - standard enemies
export const MINI_FAT_WOMAN: ItemConfig = {
  id: 'mini-fat-woman',
  name: 'Mini Fat Woman',
  type: 'enemy',
  sprite: {
    id: 'mini-fat-woman-sprite',
    name: 'Mini Fat Woman',
    type: 'sprite',
    path: '/assets/sprites/mini-fat-woman.png',
    width: 32,
    height: 32,
    frames: 4,
    frameTime: 200,
    loop: true
  },
  properties: {
    health: 50,
    damage: 15,
    value: 25,
    rarity: 'common'
  },
  behavior: {
    movement: 'patrol',
    attackPattern: ['charge'],
    dropRate: 0.6
  }
};

// FAT Woman - Boss variants for 5 worlds
export const FAT_WOMAN_BOSSES: ItemConfig[] = [
  {
    id: 'jungle-fat-woman',
    name: 'Jungle Fat Woman',
    type: 'boss',
    sprite: {
      id: 'jungle-fat-woman-sprite',
      name: 'Jungle Fat Woman',
      type: 'sprite',
      path: '/assets/sprites/jungle-fat-woman.png',
      width: 96,
      height: 96,
      frames: 6,
      frameTime: 150,
      loop: true
    },
    properties: {
      health: 200,
      damage: 30,
      value: 1000,
      rarity: 'epic'
    },
    behavior: {
      movement: 'boss',
      attackPattern: ['charge', 'jump', 'throw'],
      dropRate: 1.0
    }
  },
  {
    id: 'desert-fat-woman',
    name: 'Desert Fat Woman',
    type: 'boss',
    sprite: {
      id: 'desert-fat-woman-sprite',
      name: 'Desert Fat Woman',
      type: 'sprite',
      path: '/assets/sprites/desert-fat-woman.png',
      width: 96,
      height: 96,
      frames: 6,
      frameTime: 150,
      loop: true
    },
    properties: {
      health: 250,
      damage: 35,
      value: 1500,
      rarity: 'epic'
    },
    behavior: {
      movement: 'boss',
      attackPattern: ['charge', 'sandstorm', 'earthquake'],
      dropRate: 1.0
    }
  },
  {
    id: 'snow-fat-woman',
    name: 'Snow Fat Woman',
    type: 'boss',
    sprite: {
      id: 'snow-fat-woman-sprite',
      name: 'Snow Fat Woman',
      type: 'sprite',
      path: '/assets/sprites/snow-fat-woman.png',
      width: 96,
      height: 96,
      frames: 6,
      frameTime: 150,
      loop: true
    },
    properties: {
      health: 300,
      damage: 40,
      value: 2000,
      rarity: 'epic'
    },
    behavior: {
      movement: 'boss',
      attackPattern: ['charge', 'ice-breath', 'avalanche'],
      dropRate: 1.0
    }
  },
  {
    id: 'cyber-fat-woman',
    name: 'Cyber Fat Woman',
    type: 'boss',
    sprite: {
      id: 'cyber-fat-woman-sprite',
      name: 'Cyber Fat Woman',
      type: 'sprite',
      path: '/assets/sprites/cyber-fat-woman.png',
      width: 96,
      height: 96,
      frames: 6,
      frameTime: 150,
      loop: true
    },
    properties: {
      health: 350,
      damage: 45,
      value: 2500,
      rarity: 'epic'
    },
    behavior: {
      movement: 'boss',
      attackPattern: ['charge', 'laser', 'teleport'],
      dropRate: 1.0
    }
  },
  {
    id: 'haunted-fat-woman',
    name: 'Haunted Fat Woman',
    type: 'boss',
    sprite: {
      id: 'haunted-fat-woman-sprite',
      name: 'Haunted Fat Woman',
      type: 'sprite',
      path: '/assets/sprites/haunted-fat-woman.png',
      width: 96,
      height: 96,
      frames: 6,
      frameTime: 150,
      loop: true
    },
    properties: {
      health: 500,
      damage: 60,
      value: 5000,
      rarity: 'legendary'
    },
    behavior: {
      movement: 'boss',
      attackPattern: ['charge', 'ghost-summon', 'curse', 'ultimate'],
      dropRate: 1.0
    }
  }
];

// Asset loading utility
export class AssetLoader {
  private static loadedAssets = new Map<string, HTMLImageElement | HTMLAudioElement>();
  private static loadingPromises = new Map<string, Promise<any>>();

  static async loadImage(path: string): Promise<HTMLImageElement> {
    if (this.loadedAssets.has(path)) {
      return this.loadedAssets.get(path) as HTMLImageElement;
    }

    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path);
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedAssets.set(path, img);
        this.loadingPromises.delete(path);
        resolve(img);
      };
      img.onerror = () => {
        this.loadingPromises.delete(path);
        reject(new Error(`Failed to load image: ${path}`));
      };
      img.src = path;
    });

    this.loadingPromises.set(path, promise);
    return promise;
  }

  static async loadAudio(path: string): Promise<HTMLAudioElement> {
    if (this.loadedAssets.has(path)) {
      return this.loadedAssets.get(path) as HTMLAudioElement;
    }

    const audio = new Audio(path);
    this.loadedAssets.set(path, audio);
    return audio;
  }

  static getLoadedAsset(path: string): HTMLImageElement | HTMLAudioElement | undefined {
    return this.loadedAssets.get(path);
  }

  static preloadAssets(assets: AssetConfig[]): Promise<void[]> {
    const promises = assets.map(asset => {
      if (asset.type === 'sprite' || asset.type === 'image') {
        return this.loadImage(asset.path);
      } else if (asset.type === 'audio') {
        return this.loadAudio(asset.path);
      }
      return Promise.resolve();
    });

    return Promise.all(promises);
  }
}

// Export all assets for easy access
export const ALL_ASSETS = {
  gavin: GAVIN_SPRITES,
  blocks: COIN_BLOCKS,
  coins: COINS,
  chicken: CHICKEN,
  dumbbells: DUMBBELLS,
  superSerum: SUPER_SERUM,
  miniFatWoman: MINI_FAT_WOMAN,
  fatWomanBosses: FAT_WOMAN_BOSSES
};
