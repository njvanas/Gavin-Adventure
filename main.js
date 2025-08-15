// Main Game Bootstrap
class Game {
    constructor() {
        this.canvas = null;
        this.engine = null;
        this.debug = false;
        this.loaded = false;
        
        // Global systems
        this.input = null;
        this.audio = null;
        this.renderer = null;
        this.particles = null;
        this.sprites = null;
        this.saveManager = null;
        
        this.init();
    }
    
    async init() {
        // Initialize canvas
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Game canvas not found!');
            return;
        }
        
        // Initialize systems
        this.input = new InputManager();
        this.audio = new AudioManager();
        this.renderer = new Renderer(this.canvas.getContext('2d'));
        this.particles = new ParticleSystem();
        this.sprites = new SpriteManager();
        this.saveManager = new SaveManager();
        
        // Create game engine
        this.engine = new GameEngine(this.canvas);
        
        // Add scenes
        this.engine.addScene('loading', new LoadingScene());
        this.engine.addScene('menu', new MenuScene());
        this.engine.addScene('game', new GameScene());
        
        // Expose globally for debugging
        window.game = this;
        window.input = this.input;
        window.audio = this.audio;
        window.renderer = this.renderer;
        window.particles = this.particles;
        window.sprites = this.sprites;
        window.saveManager = this.saveManager;
        
        // Initialize audio on first user interaction
        this.setupAudioInit();
        
        // Load assets and start
        await this.loadAssets();
        this.start();
    }
    
    setupAudioInit() {
        const initAudio = () => {
            this.audio.initialize();
            document.removeEventListener('click', initAudio);
            document.removeEventListener('keydown', initAudio);
            document.removeEventListener('touchstart', initAudio);
        };
        
        document.addEventListener('click', initAudio);
        document.addEventListener('keydown', initAudio);
        document.addEventListener('touchstart', initAudio);
    }
    
    async loadAssets() {
        // Hide loading screen after sprites are ready
        if (this.sprites.isLoaded()) {
            this.hideLoadingScreen();
            this.loaded = true;
        }
    }
    
    start() {
        if (!this.loaded) {
            // Wait for assets to load
            setTimeout(() => this.start(), 100);
            return;
        }
        
        // Start with loading scene (which will quickly transition to menu)
        this.engine.setScene('loading');
        this.engine.start();
        
        // Force scale update after everything is initialized
        setTimeout(() => {
            if (this.engine.forceScaleUpdate) {
                this.engine.forceScaleUpdate();
            }
        }, 200);
        
        // Set up game loop
        this.gameLoop();
    }
    
    gameLoop() {
        // Update input first
        this.input.update();
        
        // Update particles
        this.particles.update(16.67); // Assume 60 FPS for particles
        
        // Update renderer shake
        this.renderer.updateShake(16.67);
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }
    
    toggleDebug() {
        this.debug = !this.debug;
        console.log('Debug mode:', this.debug);
    }
}

// World and level data
const WORLD_DATA = {
    1: {
        name: 'Neighborhood Gym',
        theme: WORLD_THEMES.NEIGHBORHOOD_GYM,
        levels: [
            { name: 'Morning Warm-up', difficulty: 1 },
            { name: 'Equipment Tour', difficulty: 2 },
            { name: 'First Workout', difficulty: 2 },
            { name: 'Gym Manager Boss', difficulty: 3, boss: true }
        ]
    },
    2: {
        name: 'City Rooftops',
        theme: WORLD_THEMES.CITY_ROOFTOPS,
        levels: [
            { name: 'Urban Parkour', difficulty: 3 },
            { name: 'Wind Challenge', difficulty: 4 },
            { name: 'Skyscraper Sprint', difficulty: 4 },
            { name: 'Shredder\'s Lair', difficulty: 5, boss: true }
        ]
    },
    3: {
        name: 'Locker Depths',
        theme: WORLD_THEMES.LOCKER_DEPTHS,
        levels: [
            { name: 'Steam Tunnels', difficulty: 4 },
            { name: 'Slippery Slopes', difficulty: 5 },
            { name: 'Forgotten Lockers', difficulty: 5 },
            { name: 'Underground Arena', difficulty: 6, boss: true }
        ]
    },
    4: {
        name: 'Aquatic Mixers',
        theme: WORLD_THEMES.AQUATIC_MIXERS,
        levels: [
            { name: 'Pool Training', difficulty: 5 },
            { name: 'Protein Rapids', difficulty: 6 },
            { name: 'Deep End Challenge', difficulty: 6 },
            { name: 'Shredder Returns', difficulty: 7, boss: true }
        ]
    },
    5: {
        name: 'Steel Factory',
        theme: WORLD_THEMES.STEEL_FACTORY,
        levels: [
            { name: 'Assembly Line', difficulty: 6 },
            { name: 'Crusher Gauntlet', difficulty: 7 },
            { name: 'Molten Core', difficulty: 7 },
            { name: 'Industrial Complex', difficulty: 8, boss: true }
        ]
    },
    6: {
        name: 'Neon Night Gym',
        theme: WORLD_THEMES.NEON_NIGHT,
        levels: [
            { name: 'Laser Light Show', difficulty: 7 },
            { name: 'Bounce Pad Mania', difficulty: 8 },
            { name: 'Neon Maze', difficulty: 8 },
            { name: 'Shredder\'s Revenge', difficulty: 9, boss: true }
        ]
    },
    7: {
        name: 'Alpine Altitude',
        theme: WORLD_THEMES.ALPINE_ALTITUDE,
        levels: [
            { name: 'Mountain Climb', difficulty: 8 },
            { name: 'Icy Peaks', difficulty: 9 },
            { name: 'Avalanche Escape', difficulty: 9 },
            { name: 'Summit Challenge', difficulty: 10, boss: true }
        ]
    },
    8: {
        name: 'Championship Coliseum',
        theme: WORLD_THEMES.CHAMPIONSHIP,
        levels: [
            { name: 'Qualifier Round', difficulty: 9 },
            { name: 'Semi-Finals', difficulty: 10 },
            { name: 'Championship Match', difficulty: 10 },
            { name: 'Ultimate Shredder', difficulty: 11, boss: true }
        ]
    }
};

// Start the game when page loads
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});

// Export world data
window.WORLD_DATA = WORLD_DATA;