# 🏋️‍♂️ Gavin Adventure - Make GAINS! 💪

A fully playable, side-scrolling platform game inspired by the original NES Super Mario Bros., but with a unique bodybuilding twist! Help Gavin, a muscular gym-obsessed bodybuilder, collect protein shakes and defeat lazy gym-goers in this retro-style HTML5/JavaScript game.

## 🎮 Game Overview

**Gavin Adventure** is a complete, browser-based platformer that recreates the classic Super Mario Bros. experience with:
- **32 levels** across 8 worlds (World 1-1 through 8-4)
- **Original pixel art** generated programmatically
- **Chiptune music** and sound effects
- **Authentic physics** matching the original SMB feel
- **Bodybuilding theme** throughout all elements

## 🎯 Main Character: Gavin

Meet **Gavin**, a dedicated bodybuilder on a mission to make GAINS! 

### Power-Up States:
- **Gavin (Small)** - Basic form, starts here
- **Gavin (Pump Mode)** - Bigger muscles from protein shakes
- **Gavin (Beast Mode)** - Full pre-workout effect, can throw protein powder scoops

### Animations:
- Idle, walk, run, jump, squat, deadlift, and victory poses
- All original 16-bit style pixel art
- Exaggerated bodybuilding poses and muscle flexing

## 🥤 Items & Power-Ups

| Original SMB Item | Gavin Adventure Replacement | Effect |
|------------------|----------------------------|---------|
| 🍄 Mushroom | 🥤 Protein Shake | Increases size and strength |
| 🔥 Fire Flower | ⚡ Pre-Workout | Allows throwing protein scoops |
| 🪙 Coin | 🏋️ Golden Dumbbell | +50 points, fills GAINS meter |
| 💚 1-UP Mushroom | 🆔 Gym Membership Card | Extra life |

## 👹 Enemies & NPCs

| Original SMB Enemy | Gavin Adventure Replacement | Description |
|-------------------|----------------------------|-------------|
| 🍄 Goomba | 😴 Sloucher | Lazy gym-goers who slouch around |
| 🐢 Koopa Troopa | 📋 Form Police | Trainers with clipboards checking form |
| 🌱 Piranha Plant | 🟢 Resistance Band | Overgrown bands that snap when you get close |
| 🐉 Bowser | 💪 The Shredder | Rival bodybuilder boss guarding the final protein stash |

## 🏟️ Level Themes

- **Overworld Levels**: Gym equipment, weight plates, squat racks
- **Underground Levels**: Locker rooms with mysterious vibes
- **Underwater Levels**: Protein shake mixing vats
- **Castle Levels**: Massive gyms with treadmills, cable machines, and posing stages

## 🎮 Controls

### Desktop Controls:
- **Arrow Keys** or **WASD**: Move left/right
- **Space** or **W/Up Arrow**: Jump
- **Shift**: Run (hold while moving)
- **C** or **S/Down Arrow**: Crouch
- **X**: Attack (when powered up)
- **Escape**: Pause/Resume game
- **M**: Toggle music
- **S**: Toggle sound effects

### Mobile/Touch Controls:
- **Swipe Left/Right**: Move left/right
- **Swipe Up**: Jump
- **Swipe Down**: Crouch
- **Tap**: Attack (when powered up)

### Easter Egg:
- **Konami Code**: ↑↑↓↓←→←→BA (unlocks all levels temporarily!)

## 🎯 Game Modes

### 1. Story Mode
- Progress through all 32 levels
- Unlock new worlds by completing levels
- Save progress automatically
- Classic progression system

### 2. Free Play Mode
- Play any unlocked level
- Perfect for practicing specific sections
- No progress tracking

### 3. Time Attack Mode
- Beat your best times on each level
- Leaderboard tracking
- Compete for speed records

## 🏆 Features

### Core Gameplay:
- ✅ **32 complete levels** with authentic SMB geometry
- ✅ **Original sprite system** with programmatically generated pixel art
- ✅ **Physics engine** matching original Super Mario Bros. feel
- ✅ **Collision detection** and enemy AI
- ✅ **Power-up system** with visual transformations
- ✅ **Score system** and lives management

### Audio & Visual:
- ✅ **Chiptune music** for each level type
- ✅ **Sound effects** for all actions
- ✅ **Background parallax** effects
- ✅ **Smooth animations** at 60 FPS
- ✅ **Responsive design** for all screen sizes

### Technical Features:
- ✅ **Save/Load system** using localStorage
- ✅ **Mobile touch controls** with gesture recognition
- ✅ **Performance optimization** for smooth gameplay
- ✅ **Modular architecture** for easy expansion
- ✅ **No external dependencies** - pure HTML5/JavaScript

## 🚀 How to Play

1. **Open the game** in your web browser
2. **Choose your game mode** from the title screen
3. **Navigate through levels** using classic platformer controls
4. **Collect items** to power up Gavin
5. **Defeat enemies** by jumping on them or using projectiles
6. **Reach the end flag** to complete each level
7. **Unlock new worlds** as you progress

## 🛠️ Technical Details

### Built With:
- **HTML5 Canvas** for rendering
- **Vanilla JavaScript** (ES6+) for game logic
- **CSS3** for styling and animations
- **Web Audio API** for chiptune music generation

### Architecture:
- **Modular design** with separate systems for sprites, audio, physics, etc.
- **Entity-Component system** for game objects
- **State management** for game progression
- **Event-driven input handling**

### Performance:
- **60 FPS target** with smooth gameplay
- **Efficient collision detection** using spatial partitioning
- **Optimized rendering** with viewport culling
- **Memory management** for long play sessions

## 🌐 Deployment

### GitHub Pages:
1. Push all files to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to main branch
4. Game will be available at `https://username.github.io/repository-name`

### Local Development:
1. Clone or download the repository
2. Open `index.html` in a modern web browser
3. No build process or server required!

### File Structure:
```
Gavin-Adventure/
├── index.html          # Main game file
├── style.css           # Game styling
├── js/
│   ├── sprites.js      # Sprite generation system
│   ├── audio.js        # Audio and music system
│   ├── physics.js      # Physics and collision detection
│   ├── levels.js       # Level data and management
│   ├── entities.js     # Game entities and AI
│   ├── game.js         # Main game engine
│   └── main.js         # Entry point and UI setup
└── README.md           # This file
```

## 🎨 Customization

The game is designed to be easily customizable:

### Adding New Levels:
- Modify `js/levels.js` to add new level data
- Use the existing level generation functions
- Follow the established pattern for consistency

### New Sprites:
- Extend the `SpriteSheet` class in `js/sprites.js`
- Add new sprite generation methods
- Integrate with the existing sprite system

### Audio:
- Modify `js/audio.js` to add new music tracks
- Create custom sound effects
- Adjust volume and timing

## 🐛 Troubleshooting

### Common Issues:

**Game won't start:**
- Ensure JavaScript is enabled in your browser
- Check browser console for error messages
- Try refreshing the page

**Audio not working:**
- Click anywhere on the page to activate audio context
- Check browser audio permissions
- Ensure system volume is not muted

**Performance issues:**
- Close other browser tabs
- Reduce browser window size
- Check if hardware acceleration is enabled

**Mobile controls not responding:**
- Ensure touch events are enabled
- Try refreshing the page
- Check if device supports touch events

## 🤝 Contributing

This is a complete, standalone game, but if you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Submit a pull request

## 📜 License

This project is open source and available under the MIT License.

## 🙏 Credits

- **Inspired by**: Nintendo's Super Mario Bros. (1985)
- **Game Design**: Original concept with bodybuilding theme
- **Code**: Built from scratch in HTML5/JavaScript
- **Art**: Programmatically generated pixel art
- **Audio**: Original chiptune compositions

## 🎉 Special Features

### Easter Eggs:
- **Konami Code**: Unlocks all levels temporarily
- **Secret Level**: Space training level (hidden)
- **Developer Mode**: Add `?debug` to URL for FPS counter

### Hidden Content:
- **Bonus Rooms**: Secret areas with extra items
- **Warp Zones**: Shortcuts between worlds
- **1-UP Secrets**: Hidden extra lives throughout levels

---

## 🏁 Ready to Make GAINS?

**Gavin Adventure** is a complete, fully playable platformer that captures the magic of classic Nintendo games while adding a unique bodybuilding twist. With 32 levels, authentic physics, original music, and smooth gameplay, it's ready to provide hours of retro gaming fun!

**Play now and help Gavin achieve his ultimate goal: MAXIMUM GAINS! 💪**

---

*Built with ❤️ and 💪 for the retro gaming community*
