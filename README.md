# Gavin Adventure
**Make GAINS. Beat The Shredder.**

A complete retro platformer game built with HTML5 Canvas and JavaScript. Join Gavin on his bodybuilding quest through 8 themed worlds, collecting Golden Dumbbells, defeating the Form Police, and ultimately facing The Shredder in epic boss battles.

## Game Features

### Core Gameplay
- **Three Power States**: Small Gavin → Pump Mode → Beast Mode (with projectile throwing)
- **Original Enemy Roster**: Slouchers, Form Police, Snappers, Kettle Bells, Protein Drones, and Boss Shredder
- **Precision Physics**: 60 FPS gameplay with coyote time, jump buffering, and variable jump height
- **Advanced Movement**: Elevated jump spots, wall bouncing, liquid-assisted leaps, and wind mechanics

### Content & Progression
- **8 Themed Worlds**: From Neighborhood Gym to Championship Coliseum
- **32 Unique Levels**: Each with 3+ secrets, elevated challenges, and original layouts  
- **Boss Battles**: The Shredder with escalating difficulty and unique attack patterns
- **Collectible System**: Golden Dumbbells, Gym Cards, Protein Shakes, Pre-Workouts, and Macros
- **GAINS Meter**: Fill up for bonuses and power-up refills

### Technical Features
- **Multi-Platform Controls**: Keyboard, gamepad, and mobile touch controls
- **Save System**: Auto-save progress with localStorage
- **Level Editor**: Create and edit custom levels with JSON export
- **Original Audio**: Chiptune-style music and sound effects
- **Responsive Design**: Works on desktop and mobile devices

## Controls

### Desktop (Keyboard)
- **Arrow Keys / WASD**: Move left/right, crouch
- **Space / Z**: Jump (hold for higher jumps)
- **X / Shift**: Run/Sprint
- **C**: Throw projectiles (Beast Mode only)
- **Enter**: Start/Pause
- **F1**: Toggle debug mode

### Gamepad Support
- **D-Pad / Left Stick**: Movement
- **A Button**: Jump
- **X Button**: Run
- **B Button**: Throw
- **Start**: Pause

### Mobile Touch
- On-screen controls automatically appear on mobile devices
- Touch the directional pad for movement
- Tap action buttons for jump, run, and throw

## World Themes

1. **Neighborhood Gym** - Learn the basics with friendly equipment
2. **City Rooftops** - Urban parkour with wind challenges  
3. **Locker Depths** - Slippery underground tunnels
4. **Aquatic Mixers** - Swimming physics and protein rapids
5. **Steel Factory** - Moving belts and industrial hazards
6. **Neon Night Gym** - Bounce pads and laser obstacles
7. **Alpine Altitude** - Icy surfaces and updraft fans
8. **Championship Coliseum** - Ultimate challenges and final showdown

## Installation & Deployment

### Local Development
1. Clone or download the project files
2. Serve the files using a local web server:
   ```bash
   # Using Node.js http-server
   npx http-server .
   
   # Using Python
   python -m http.server 8000
   
   # Using PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser

### GitHub Pages Deployment
The repository is configured for automatic deployment to GitHub Pages:

1. **Fork or Clone**: Fork this repository or clone it to your own
2. **Enable GitHub Pages**: Go to Settings → Pages → Source → GitHub Actions
3. **Automatic Deployment**: Every push to the `main` branch automatically deploys
4. **Access Your Site**: Available at `https://yourusername.github.io/repositoryname`

**For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

#### Quick Setup for Forks
1. Fork this repository
2. Go to Actions tab and enable workflows
3. Push any change to trigger automatic deployment
4. Your forked version will deploy automatically

## File Structure
```
gavin-adventure/
├── index.html              # Main game entry point
├── style.css              # Game styling and responsive design
├── main.js                # Game bootstrap and initialization
├── engine/                # Core game engine
│   ├── core.js            # Main game loop and scene management
│   ├── input.js           # Input handling (keyboard/gamepad/touch)
│   ├── physics.js         # Physics and movement systems
│   ├── collision.js       # Collision detection and resolution
│   ├── renderer.js        # Rendering and camera systems
│   ├── audio.js           # Audio engine with chiptune synthesis
│   └── particles.js       # Particle effects system
├── game/                  # Game-specific code
│   ├── constants.js       # Game constants and configuration
│   ├── sprites.js         # Sprite management and pixel art generation
│   ├── player.js          # Player character (Gavin) logic
│   ├── enemies.js         # Enemy AI and behaviors
│   ├── collectibles.js    # Items and power-ups
│   ├── level.js           # Level management and tile system
│   ├── hud.js             # UI elements and menus
│   ├── scenes.js          # Game scenes (menu, gameplay, etc.)
│   └── save.js            # Save system with localStorage
├── tools/                 # Development tools
│   └── editor.html        # Level editor for creating custom levels
├── README.md              # This file
└── TESTPLAN.md           # Testing procedures and QA checklist
```

## Level Editor

The included level editor (`tools/editor.html`) allows you to:
- Create custom levels with tile-based editing
- Place enemies, collectibles, and interactive objects
- Set level properties (theme, size, spawn points)
- Export levels as JSON for use in the main game
- Test levels directly in the game

### Using the Editor
1. Open `tools/editor.html` in your browser
2. Use the tile palette to paint level geometry
3. Switch to entity mode to place enemies and items
4. Export your level as JSON and integrate it into the game

## Technical Specifications

### Performance Targets
- **60 FPS** on desktop and mobile devices
- **16ms frame budget** with optimized rendering
- **Pixel-perfect** graphics with no anti-aliasing
- **Low memory footprint** with efficient sprite management

### Browser Compatibility  
- **Chrome/Edge**: Full support with optimal performance
- **Firefox**: Full support with Web Audio API
- **Safari**: Full support with mobile optimizations
- **Mobile**: Touch controls and responsive scaling

### Development Standards
- **Vanilla JavaScript**: No external dependencies
- **Modular Architecture**: Clean separation of engine and game code
- **Original Content**: All sprites, audio, and levels are original creations
- **Accessible**: Color-blind friendly design and remappable controls

## Credits

**Game Design & Development**: Built as an original retro platformer
**Art Style**: 16-bit inspired pixel art with modern polish
**Audio**: Chiptune-style music and sound effects using Web Audio API
**Engine**: Custom HTML5 Canvas game engine

## License

This project is provided as a complete game development example. Feel free to use, modify, and learn from the code structure and game design patterns.

---

**Ready to make some GAINS? Fire up the game and start your bodybuilding adventure!**