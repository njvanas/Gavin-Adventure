# Gavin's Adventure - Modern Mario-Style Platformer

A beautiful, modern platformer game featuring Gavin, a buff adventurer exploring an endless world of challenges!

## 🎮 Features

- **Gavin the Adventurer**: A modern, buff character with smooth animations
- **Beautiful Pixel Art**: Modern sprites and backgrounds generated with custom tools
- **Smooth Gameplay**: Enhanced physics and camera movement
- **Visual Effects**: Particle systems, screen shake, and smooth animations
- **Modern UI**: Clean, readable interface with score tracking

## 🎨 Sprite Generators

The game includes HTML-based sprite generators that create beautiful pixel art:

### Gavin Sprite Generator
- **File**: `public/assets/sprites/gavin_sprite_generator.html`
- **Features**: 8-frame animation sheet (idle, run, jump, fall, hurt)
- **Size**: 24x32 pixels per frame
- **Usage**: Open in browser, click "Generate Gavin Sprite", then "Download PNG"

### Enemy Slime Generator
- **File**: `public/assets/sprites/enemy_slime_generator.html`
- **Features**: 4-frame walking animation
- **Size**: 20x16 pixels per frame
- **Usage**: Generate and download as `enemy_slime.png`

### Coin Generator
- **File**: `public/assets/sprites/coin_generator.html`
- **Features**: 6-frame spinning animation
- **Size**: 16x16 pixels per frame
- **Usage**: Generate and download as `coin.png`

### Background Generator
- **File**: `public/assets/backgrounds/background_generator.html`
- **Features**: Beautiful forest scene with mountains, trees, and sky
- **Size**: 800x600 pixels
- **Usage**: Generate and download as `forest_bg.png`

## 🚀 How to Play

1. **Open the sprite generators** in your web browser
2. **Generate and download** all the sprite sheets
3. **Place the PNG files** in the correct `public/assets/` directories
4. **Run the game** with `npm run dev`

## 🎯 Controls

- **Movement**: Arrow keys or WASD
- **Jump**: Space, Up, or W
- **Duck**: Down or S
- **Collect coins** to increase your score
- **Avoid hazards** and enemies
- **Reach the exit** to complete the level

## 🛠️ Development

- Built with Kaboom.js game engine
- TypeScript for type safety
- Modern ES6+ features
- Responsive design principles

## 🎨 Customization

The sprite generators use modern color palettes and can be easily modified:
- Change colors in the `colors` objects
- Adjust animation timing
- Modify sprite dimensions
- Add new animation frames

## 🚀 Deployment

The game is configured for GitHub Pages deployment with automatic workflows.

---

**Enjoy Gavin's Adventure!** 🗡️⚔️
