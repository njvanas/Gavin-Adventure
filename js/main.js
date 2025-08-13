// Gavin Adventure - Main Entry Point
// Initializes the game and sets up UI event listeners

let game = null;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Gavin Adventure - Loading...');
    
    // Initialize audio
    AUDIO_MANAGER.playMusic('title');
    
    // Set up UI event listeners
    setupUI();
    
    // Initialize game
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        game = new Game(canvas);
        console.log('Gavin Adventure - Ready!');
    } else {
        console.error('Game canvas not found!');
    }
});

// Set up all UI event listeners
function setupUI() {
    // Title screen buttons
    const startGameBtn = document.getElementById('startGame');
    const freePlayBtn = document.getElementById('freePlay');
    const timeAttackBtn = document.getElementById('timeAttack');
    const loadGameBtn = document.getElementById('loadGame');
    
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            if (game) {
                game.startGame();
            }
        });
    }
    
    if (freePlayBtn) {
        freePlayBtn.addEventListener('click', () => {
            if (game) {
                game.startFreePlay();
            }
        });
    }
    
    if (timeAttackBtn) {
        timeAttackBtn.addEventListener('click', () => {
            if (game) {
                game.startTimeAttack();
            }
        });
    }
    
    if (loadGameBtn) {
        loadGameBtn.addEventListener('click', () => {
            if (game) {
                game.loadGame();
            }
        });
    }
    
    // Level select back button
    const backToMenuBtn = document.getElementById('backToMenu');
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', () => {
            showScreen('titleScreen');
        });
    }
    
    // Game over screen buttons
    const restartBtn = document.getElementById('restart');
    const backToMenu2Btn = document.getElementById('backToMenu2');
    
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            if (game) {
                game.restart();
            }
        });
    }
    
    if (backToMenu2Btn) {
        backToMenu2Btn.addEventListener('click', () => {
            showScreen('titleScreen');
        });
    }
    
    // Victory screen buttons
    const playAgainBtn = document.getElementById('playAgain');
    const backToMenu3Btn = document.getElementById('backToMenu3');
    
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
            if (game) {
                game.startGame();
            }
        });
    }
    
    if (backToMenu3Btn) {
        backToMenu3Btn.addEventListener('click', () => {
            showScreen('titleScreen');
        });
    }
    
    // Pause menu buttons
    const resumeBtn = document.getElementById('resume');
    const quitToMenuBtn = document.getElementById('quitToMenu');
    
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            if (game) {
                game.togglePause();
            }
        });
    }
    
    if (quitToMenuBtn) {
        quitToMenuBtn.addEventListener('click', () => {
            if (game) {
                game.gameState = 'title';
                game.showScreen('titleScreen');
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Pause game
        if (e.code === 'Escape' && game && game.gameState === 'playing') {
            game.togglePause();
        }
        
        // Resume game
        if (e.code === 'Escape' && game && game.gameState === 'paused') {
            game.togglePause();
        }
        
        // Restart on game over
        if (e.code === 'KeyR' && game && game.gameState === 'gameOver') {
            game.restart();
        }
        
        // Mute/unmute music
        if (e.code === 'KeyM') {
            AUDIO_MANAGER.toggleMusic();
        }
        
        // Mute/unmute sound effects
        if (e.code === 'KeyS') {
            AUDIO_MANAGER.toggleSound();
        }
    });
    
    // Touch controls for mobile
    setupTouchControls();
    
    // Window resize handling
    window.addEventListener('resize', handleResize);
    
    // Auto-save every 30 seconds
    setInterval(() => {
        if (game && game.gameState === 'playing') {
            game.saveGame();
        }
    }, 30000);
}

// Set up touch controls for mobile devices
function setupTouchControls() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
    });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;
        const touchEndTime = Date.now();
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const touchDuration = touchEndTime - touchStartTime;
        
        // Determine gesture type
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swipe right - move right
                    if (game && game.player) {
                        game.player.velocityX = PHYSICS.maxWalkSpeed;
                        game.player.facing = 1;
                    }
                } else {
                    // Swipe left - move left
                    if (game && game.player) {
                        game.player.velocityX = -PHYSICS.maxWalkSpeed;
                        game.player.facing = -1;
                    }
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(deltaY) > 50) {
                if (deltaY < 0) {
                    // Swipe up - jump
                    if (game && game.player) {
                        game.player.jump();
                    }
                } else {
                    // Swipe down - crouch
                    if (game && game.player) {
                        game.player.crouch();
                    }
                }
            }
        }
        
        // Tap detection
        if (touchDuration < 200 && Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) {
            // Short tap - attack
            if (game && game.player) {
                game.player.attack();
            }
        }
        
        // Reset movement after gesture
        setTimeout(() => {
            if (game && game.player) {
                game.player.velocityX = 0;
                game.player.stand();
            }
        }, 100);
    });
}

// Handle window resize
function handleResize() {
    const canvas = document.getElementById('gameCanvas');
    if (canvas && game) {
        // Maintain aspect ratio
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        const aspectRatio = 800 / 600;
        let newWidth = containerWidth;
        let newHeight = containerWidth / aspectRatio;
        
        if (newHeight > containerHeight) {
            newHeight = containerHeight;
            newWidth = containerHeight * aspectRatio;
        }
        
        canvas.style.width = newWidth + 'px';
        canvas.style.height = newHeight + 'px';
    }
}

// Utility function to show screens
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenName);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    // Keep only last 10 keys
    if (konamiCode.length > 10) {
        konamiCode.shift();
    }
    
    // Check for Konami code
    if (konamiCode.length === 10) {
        const isKonami = konamiCode.every((key, index) => key === konamiSequence[index]);
        if (isKonami) {
            activateEasterEgg();
            konamiCode = []; // Reset
        }
    }
});

// Easter egg function
function activateEasterEgg() {
    console.log('🎉 KONAMI CODE ACTIVATED! 🎉');
    
    // Play victory sound
    AUDIO_MANAGER.playSound('victory');
    
    // Show special message
    if (game) {
        // Unlock all levels temporarily
        const allLevels = LEVEL_MANAGER.getAllLevels();
        allLevels.forEach(level => LEVEL_MANAGER.unlockLevel(level));
        
        // Show notification
        showNotification('🎉 SECRET UNLOCKED! All levels unlocked! 🎉');
        
        // Reset after 10 seconds
        setTimeout(() => {
            LEVEL_MANAGER.resetProgress();
            LEVEL_MANAGER.unlockLevel('1-1');
        }, 10000);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(45deg, #ff6b35, #f7b731);
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        font-family: 'Courier New', monospace;
        font-weight: bold;
        font-size: 18px;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        animation: slideDown 0.5s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 5000);
}

// Performance monitoring
let frameCount = 0;
let lastFPSUpdate = 0;

function updateFPS(currentTime) {
    frameCount++;
    
    if (currentTime - lastFPSUpdate >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastFPSUpdate));
        console.log(`FPS: ${fps}`);
        frameCount = 0;
        lastFPSUpdate = currentTime;
    }
}

// Add FPS counter to HUD if in debug mode
if (window.location.search.includes('debug')) {
    const fpsDisplay = document.createElement('div');
    fpsDisplay.id = 'fpsDisplay';
    fpsDisplay.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-family: monospace;
        z-index: 1000;
    `;
    document.body.appendChild(fpsDisplay);
    
    // Update FPS display
    setInterval(() => {
        if (game && game.gameState === 'playing') {
            const fps = Math.round(1000 / (performance.now() - lastFPSUpdate));
            fpsDisplay.textContent = `FPS: ${fps}`;
        }
    }, 1000);
}

// Export game instance for debugging
window.GAVIN_ADVENTURE = {
    game: null,
    AUDIO_MANAGER,
    SPRITE_SHEET,
    PHYSICS,
    LEVEL_MANAGER,
    EntityFactory
};

// Initialize when everything is ready
window.addEventListener('load', () => {
    console.log('Gavin Adventure - Fully Loaded!');
    console.log('Controls: Arrow Keys/WASD to move, Space to jump, Shift to run, C to crouch, X to attack');
    console.log('Easter Egg: Try the Konami code!');
    
    // Set window title
    document.title = 'Gavin Adventure - Make GAINS! 💪';
    
    // Add loading completion indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4ecdc4;
        color: white;
        padding: 10px 15px;
        border-radius: 20px;
        font-family: 'Courier New', monospace;
        font-weight: bold;
        z-index: 1000;
        animation: fadeIn 1s ease-in;
    `;
    loadingIndicator.textContent = '🎮 Ready to Make GAINS! 💪';
    document.body.appendChild(loadingIndicator);
    
    // Add fade in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Remove after 3 seconds
    setTimeout(() => {
        loadingIndicator.remove();
        style.remove();
    }, 3000);
});
