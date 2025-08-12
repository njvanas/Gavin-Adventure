# Gavin Adventure - Bodybuilding Platformer

A Mario-style platformer game featuring Gavin, a bodybuilding character, built with React, TypeScript, and Tailwind CSS.

## 🎮 How to Play

### Controls
- **WASD** or **Arrow Keys**: Move left/right
- **Space/W/Z**: Jump
- **F**: Flex battle (show strength)
- **Click/Tap**: Jump (mobile support)

### Game Features
- Platform jumping mechanics
- Collectible coins and power-ups
- Enemy encounters
- Multiple worlds and levels
- Boss battles
- Shop system for upgrades

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation
1. Clone the repository:
```bash
git clone https://github.com/dolfie/Gavin-Adventure.git
cd Gavin-Adventure
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🧪 Testing the Game

### Basic Functionality Test
1. **Start Screen**: You should see the main menu with "Start Game", "Test GameEngine", and "Load Test Level" buttons
2. **Click "Start Game"**: This should transition to the main game screen
3. **Player Movement**: Use WASD or arrow keys to move Gavin left/right
4. **Jumping**: Press Space, W, or Z to jump, or click/tap on Gavin
5. **Flex Battle**: Press F to show Gavin's strength

### Troubleshooting

#### Game Not Responding to Input
- Check the browser console for any JavaScript errors
- Ensure the development server is running (`npm run dev`)
- Try refreshing the page
- Check if your browser supports the required features

#### Player Not Moving
- Verify that the Player component is rendering (check console logs)
- Check if the game state is properly initialized
- Ensure the input event listeners are working

#### Visual Issues
- Check if Tailwind CSS is loading properly
- Verify that the custom CSS files are being imported
- Check browser compatibility

### Console Debugging
The game includes extensive console logging to help debug issues:
- Game state changes
- Input events (key presses, clicks)
- Player component rendering
- Game engine initialization

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Player.tsx      # Main player character
│   ├── GameBackground.tsx # Background and world themes
│   ├── GameUI.tsx      # User interface elements
│   └── ...            # Other game components
├── systems/            # Game engine systems
│   ├── GameEngine.ts   # Main game loop and logic
│   ├── InputSystem.ts  # Input handling
│   ├── PhysicsSystem.ts # Physics calculations
│   └── CameraSystem.ts # Camera and viewport
├── types/              # TypeScript type definitions
│   └── GameTypes.ts    # Game state and entity types
└── styles/             # CSS and styling
    └── mario-sprites.css # Custom sprite animations
```

## 🔧 Development

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

## 🎨 Customization

### Adding New Worlds
1. Update the `WORLDS` array in `App.tsx`
2. Add corresponding background themes in `GameBackground.tsx`
3. Create world-specific enemies and obstacles

### Modifying Player Physics
1. Edit the physics constants in `Player.tsx`
2. Adjust movement speed, jump power, and gravity
3. Modify collision detection logic

### Adding New Power-ups
1. Define new power-up types in `GameTypes.ts`
2. Implement collection logic in `App.tsx`
3. Add visual effects in the Player component

## 🐛 Known Issues

- Game engine integration is currently simplified for basic functionality
- Some advanced features may not be fully implemented
- Mobile touch controls may need refinement

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by classic Mario platformers
- Built with modern web technologies
- Special thanks to the React and gaming communities