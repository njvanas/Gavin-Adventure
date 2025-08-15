// Main Game Bootstrap
class Game {
    constructor() {
        this.canvas = null;
        this.engine = null;
        this.debug = false;
        this.loaded = false;
        this.loadingProgress = 0;
        this.version = '2.0.0'; // Modernized version
        
        // Global systems
        this.input = null;
        this.audio = null;
        this.renderer = null;
        this.particles = null;
        this.sprites = null;
        this.saveManager = null;
        
        // Performance monitoring
        this.performanceMonitor = null;
        this.lastPerformanceCheck = 0;
        
        this.init();
    }
    
    async init() {
        console.log('🎮 Initializing Gavin Adventure v' + this.version);
        
        // Initialize canvas
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Game canvas not found!');
            return;
        }
        
        // Show loading progress
        this.updateLoadingProgress(10, 'Initializing systems...');
        
        // Initialize systems
        this.input = new InputManager();
        this.updateLoadingProgress(20, 'Setting up input...');
        
        this.audio = new AudioManager();
        this.updateLoadingProgress(30, 'Loading audio...');
        
        this.renderer = new Renderer(this.canvas.getContext('2d'));
        this.updateLoadingProgress(40, 'Initializing renderer...');
        
        this.particles = new ParticleSystem();
        this.updateLoadingProgress(50, 'Creating particle system...');
        
        this.sprites = new SpriteManager();
        this.updateLoadingProgress(60, 'Loading sprites...');
        
        this.saveManager = new SaveManager();
        this.updateLoadingProgress(70, 'Setting up save system...');
        
        // Create game engine
        this.engine = new GameEngine(this.canvas);
        this.updateLoadingProgress(80, 'Starting game engine...');
        
        // Add scenes
        this.engine.addScene('loading', new LoadingScene());
        this.engine.addScene('menu', new MenuScene());
        this.engine.addScene('game', new GameScene());
        this.updateLoadingProgress(90, 'Loading game scenes...');
        
        // Expose globally for debugging
        window.game = this;
        window.input = this.input;
        window.audio = this.audio;
        window.renderer = this.renderer;
        window.particles = this.particles;
        window.sprites = this.sprites;
        window.saveManager = this.saveManager;
        
        // Initialize performance monitoring
        this.performanceMonitor = new PerformanceMonitor();
        window.performanceMonitor = this.performanceMonitor;
        
        // Initialize audio on first user interaction
        this.setupAudioInit();
        
        // Load assets and start
        await this.loadAssets();
        this.updateLoadingProgress(100, 'Ready to make GAINS!');
        this.start();
    }
    
    updateLoadingProgress(progress, message) {
        this.loadingProgress = progress;
        
        const progressBar = document.getElementById('loadingProgress');
        const loadingText = document.getElementById('loadingText');
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        
        if (loadingText) {
            loadingText.textContent = message;
        }
        
        console.log(`📊 Loading: ${progress}% - ${message}`);
    }
    
    setupAudioInit() {
        const initAudio = () => {
            this.audio.initialize();
            console.log('🔊 Audio system initialized');
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
            console.log('✅ All assets loaded successfully');
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
        
        console.log('🚀 Starting Gavin Adventure');
        
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
        
        // Start performance monitoring
        this.performanceMonitor.start();
    }
    
    gameLoop() {
        // Update input first
        this.input.update();
        
        // Start frame for renderer
        this.renderer.startFrame();
        
        // Update particles
        this.particles.update(16.67); // Assume 60 FPS for particles
        
        // Update renderer shake
        this.renderer.updateShake(16.67);
        
        // End frame for renderer
        this.renderer.endFrame();
        
        // Performance monitoring (every second)
        const now = Date.now();
        if (now - this.lastPerformanceCheck > 1000) {
            this.performanceMonitor.update(this.engine.getPerformanceStats());
            this.lastPerformanceCheck = now;
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    toggleDebug() {
        this.debug = !this.debug;
        this.engine.debug = this.debug;
        console.log('Debug mode:', this.debug);
        
        if (this.debug) {
            console.log('🔧 Debug Info:');
            console.log('Engine Stats:', this.engine.getPerformanceStats());
            console.log('Renderer Stats:', this.renderer.getStats());
            console.log('Particle Stats:', this.particles.getStats());
            console.log('Audio Stats:', this.audio.getStats());
        }
    }
    
    getSystemInfo() {
        return {
            version: this.version,
            loaded: this.loaded,
            debug: this.debug,
            canvas: {
                width: this.canvas.width,
                height: this.canvas.height,
                pixelRatio: window.devicePixelRatio || 1
            },
            performance: this.engine.getPerformanceStats(),
            systems: {
                renderer: this.renderer.getStats(),
                particles: this.particles.getStats(),
                audio: this.audio.getStats()
            }
        };
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.enabled = false;
        this.stats = {
            fps: [],
            frameTime: [],
            memoryUsage: [],
            drawCalls: [],
            entityCount: []
        };
        this.maxSamples = 60; // Keep 60 samples (1 second at 60fps)
        this.warnings = [];
    }
    
    start() {
        this.enabled = true;
        console.log('📊 Performance monitoring started');
    }
    
    stop() {
        this.enabled = false;
        console.log('📊 Performance monitoring stopped');
    }
    
    update(engineStats) {
        if (!this.enabled) return;
        
        // Collect stats
        this.addStat('fps', engineStats.fps);
        this.addStat('frameTime', engineStats.frameTime);
        this.addStat('drawCalls', engineStats.drawCalls);
        this.addStat('entityCount', engineStats.entityCount);
        
        // Memory usage (if available)
        if (performance.memory) {
            this.addStat('memoryUsage', performance.memory.usedJSHeapSize / 1024 / 1024); // MB
        }
        
        // Check for performance issues
        this.checkPerformanceWarnings(engineStats);
    }
    
    addStat(name, value) {
        this.stats[name].push(value);
        if (this.stats[name].length > this.maxSamples) {
            this.stats[name].shift();
        }
    }
    
    checkPerformanceWarnings(stats) {
        const now = Date.now();
        
        // Low FPS warning
        if (stats.fps < 45) {
            this.addWarning('LOW_FPS', `FPS dropped to ${stats.fps}`, now);
        }
        
        // High frame time warning
        if (stats.frameTime > 25) {
            this.addWarning('HIGH_FRAME_TIME', `Frame time: ${stats.frameTime.toFixed(2)}ms`, now);
        }
        
        // High draw calls warning
        if (stats.drawCalls > 1000) {
            this.addWarning('HIGH_DRAW_CALLS', `Draw calls: ${stats.drawCalls}`, now);
        }
        
        // Memory usage warning
        if (performance.memory && performance.memory.usedJSHeapSize > 100 * 1024 * 1024) {
            this.addWarning('HIGH_MEMORY', `Memory: ${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB`, now);
        }
    }
    
    addWarning(type, message, timestamp) {
        // Don't spam the same warning
        const recentWarning = this.warnings.find(w => 
            w.type === type && timestamp - w.timestamp < 5000
        );
        
        if (!recentWarning) {
            this.warnings.push({ type, message, timestamp });
            console.warn(`⚠️ Performance Warning: ${message}`);
            
            // Keep only recent warnings
            this.warnings = this.warnings.filter(w => timestamp - w.timestamp < 30000);
        }
    }
    
    getReport() {
        if (!this.enabled) return null;
        
        const report = {};
        
        for (const [name, values] of Object.entries(this.stats)) {
            if (values.length > 0) {
                const avg = values.reduce((a, b) => a + b, 0) / values.length;
                const min = Math.min(...values);
                const max = Math.max(...values);
                
                report[name] = {
                    current: values[values.length - 1],
                    average: parseFloat(avg.toFixed(2)),
                    min: parseFloat(min.toFixed(2)),
                    max: parseFloat(max.toFixed(2)),
                    samples: values.length
                };
            }
        }
        
        report.warnings = this.warnings.slice(-10); // Last 10 warnings
        
        return report;
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
    console.log('🏋️ Welcome to Gavin Adventure - Make GAINS. Beat The Shredder!');
    new Game();
});

// Global debug functions
window.debugGame = () => {
    if (window.game) {
        window.game.toggleDebug();
    }
};

window.getGameInfo = () => {
    if (window.game) {
        return window.game.getSystemInfo();
    }
    return null;
};

window.getPerformanceReport = () => {
    if (window.performanceMonitor) {
        return window.performanceMonitor.getReport();
    }
    return null;
};

// Export world data