# Super Platformer Adventure

A complete 2D side-scrolling platformer game inspired by Super Mario Bros., built with React and TypeScript. Features 5 unique worlds, 25 levels, epic boss battles, and classic platformer mechanics.

## 🎮 Game Features

### Core Gameplay
- **25 Levels** across 5 unique worlds
- **Epic Boss Battles** every 5th level with two-phase mechanics
- **Classic Platformer Physics** - smooth jumping, running, and collision detection
- **Power-up System** - Attack boosts, shields, and speed enhancements
- **Lives & Score System** - Traditional arcade-style progression
- **Progressive Difficulty** - Each world introduces new challenges

### Worlds & Themes
1. **🌿 Jungle Ruins** - Ancient temples with mysterious creatures
2. **🏜️ Desert Wastelands** - Scorching sands with buried secrets
3. **🏔️ Snowy Mountains** - Frozen peaks with icy challenges
4. **🏙️ Futuristic City** - High-tech metropolis with robot enemies
5. **🌲 Haunted Forest** - Dark woods where the final boss awaits

### Boss Battle Mechanics
- **Dynamic Attack Power** - Doubles when you hit the boss, decreases by 25% when hit
- **Two-Phase Fights** - Bosses become more dangerous at low health
- **Unique Abilities** - Each boss has themed attacks and special moves
- **Screen Effects** - Visual feedback with screen shake and animations

## 🎯 Controls

- **WASD / Arrow Keys** - Move and jump
- **X** - Attack (when available)
- **ESC** - Pause/Menu
- **Jump on enemies** to defeat them
- **Collect coins and power-ups** for bonuses
- **Reach the flag** to complete levels

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/super-platformer-adventure.git

# Navigate to project directory
cd super-platformer-adventure

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production
```bash
# Build the game
npm run build

# Preview the build
npm run preview
```

## 🌐 GitHub Pages Deployment

### Automatic Deployment
1. Fork this repository
2. Go to repository Settings → Pages
3. Select "GitHub Actions" as the source
4. The game will automatically deploy on every push to main branch

### Manual Deployment
1. Build the project: `npm run build`
2. Copy the `dist` folder contents to your `docs` folder
3. Enable GitHub Pages in repository settings
4. Select `/docs` folder as the source
5. Your game will be available at `https://yourusername.github.io/super-platformer-adventure`

## 🎨 Technical Features

### Performance Optimizations
- **Efficient Rendering** - Only renders visible elements
- **Smooth Animations** - 60fps gameplay with requestAnimationFrame
- **Responsive Design** - Works on desktop and mobile devices
- **Optimized Assets** - Compressed sprites and efficient CSS

### Code Architecture
- **Modular Components** - Easy to extend and maintain
- **TypeScript** - Type-safe development
- **React Hooks** - Modern state management
- **CSS Animations** - Hardware-accelerated effects

## 📁 Project Structure

```
src/
├── components/
│   ├── Boss.tsx           # Boss battle system
│   ├── Collectible.tsx    # Coins and gems
│   ├── Enemy.tsx          # Enemy AI and behavior
│   ├── GameBackground.tsx # World-themed backgrounds
│   ├── GameMenu.tsx       # Main menu system
│   ├── GameUI.tsx         # HUD and interface
│   ├── LevelGoal.tsx      # Level completion flags
│   ├── Obstacle.tsx       # Platforms and blocks
│   ├── Player.tsx         # Player character and physics
│   ├── PowerUp.tsx        # Power-up items
│   └── WorldMap.tsx       # Level selection screen
├── App.tsx                # Main game logic
├── index.css              # Styles and animations
└── main.tsx               # React entry point
```

## 🎵 Audio & Visual Design

### Art Style
- **16-bit Pixel Art** aesthetic
- **Vibrant Color Palettes** for each world
- **Smooth Animations** with CSS transitions
- **Particle Effects** for enhanced visual feedback

### Responsive Design
- **Mobile-Friendly** controls and layout
- **Scalable UI** elements
- **Optimized Performance** across devices

## 🏆 Game Progression

### Scoring System
- **Coins**: 100 points each
- **Gems**: 500 points each
- **Power-ups**: 1,000 points each
- **Level Completion**: 2,000 points
- **Boss Defeat**: 5,000 points

### Unlocking Content
- Complete levels to unlock the next
- Defeat bosses to access new worlds
- Collect coins to increase your score
- Find hidden power-ups for advantages

## 🛠️ Development

### Adding New Levels
1. Modify the level generation in `App.tsx`
2. Adjust enemy spawning patterns
3. Add new collectible placements
4. Test difficulty progression

### Creating New Worlds
1. Add world theme to `GameBackground.tsx`
2. Update enemy types in `Enemy.tsx`
3. Modify obstacle appearances in `Obstacle.tsx`
4. Add world-specific boss in `Boss.tsx`

### Customizing Bosses
1. Edit boss data in `Boss.tsx`
2. Add new attack patterns
3. Implement phase transitions
4. Create unique visual effects

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎉 Acknowledgments

- Inspired by classic Super Mario Bros. gameplay
- Built with modern web technologies
- Designed for educational and entertainment purposes
- Ready for GitHub Pages deployment

---

**Ready to play?** Visit the [live demo](https://yourusername.github.io/super-platformer-adventure) or clone the repository to start your platformer adventure!