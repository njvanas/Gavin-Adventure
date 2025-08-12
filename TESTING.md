# Testing Guide for Gavin Adventure

## 🧪 Quick Test Checklist

### 1. Game Loading
- [ ] Page loads without errors
- [ ] Start screen appears with title "Gavin Adventure"
- [ ] Three buttons are visible: Start Game, Test GameEngine, Load Test Level
- [ ] No console errors in browser developer tools

### 2. Start Game Button
- [ ] Click "Start Game" button
- [ ] Game transitions from start screen to main game
- [ ] Player character (Gavin) appears on screen
- [ ] Background changes to show game world
- [ ] Game UI elements appear (score, lives, etc.)

### 3. Player Movement
- [ ] Use WASD keys to move left/right
- [ ] Use arrow keys to move left/right
- [ ] Player character moves smoothly
- [ ] Player faces correct direction (left/right)
- [ ] Running animation plays when moving

### 4. Jumping
- [ ] Press Space to jump
- [ ] Press W to jump
- [ ] Press Z to jump
- [ ] Click/tap on player to jump
- [ ] Jump animation plays
- [ ] Player falls back down with gravity

### 5. Flex Battle
- [ ] Press F key
- [ ] Player shows flexing animation
- [ ] Strength value displays above player
- [ ] Visual effects appear (glow, particles)

### 6. Game State
- [ ] Console shows "Game started, initializing basic game..."
- [ ] Console shows "Player component rendered with gameState: ..."
- [ ] Game state changes are logged
- [ ] Input events are logged (key presses, clicks)

## 🐛 Common Issues and Solutions

### Issue: Game Not Starting
**Symptoms:**
- Clicking "Start Game" does nothing
- Game stays on start screen

**Solutions:**
1. Check browser console for errors
2. Refresh the page
3. Ensure development server is running (`npm run dev`)
4. Check if JavaScript is enabled

### Issue: Player Not Moving
**Symptoms:**
- Player appears but doesn't respond to input
- No movement when pressing keys

**Solutions:**
1. Check console for "Player component rendered" message
2. Verify input event listeners are working
3. Check if game state is properly initialized
4. Try different browsers

### Issue: Visual Glitches
**Symptoms:**
- Missing graphics or broken layout
- CSS not loading properly

**Solutions:**
1. Check if Tailwind CSS is loading
2. Verify custom CSS files are imported
3. Clear browser cache
4. Check browser compatibility

### Issue: Performance Problems
**Symptoms:**
- Game runs slowly
- Laggy movement or animations

**Solutions:**
1. Close other browser tabs
2. Check browser performance tools
3. Reduce browser zoom level
4. Use a modern browser

## 🔍 Debug Information

### Console Logs to Look For
```
GameEngine initialized
Game started, initializing basic game...
Player component rendered with gameState: {...}
Key pressed: w
Click detected
Player clicked!
```

### Expected Game State
```javascript
{
  gameStarted: true,
  currentWorld: 1,
  currentLevel: 1,
  lives: 3,
  score: 0,
  coins: 0,
  // ... other properties
}
```

### Player Component Props
```javascript
{
  gameState: GameState,
  onUpdatePosition: Function
}
```

## 📱 Mobile Testing

### Touch Controls
- [ ] Tap player to jump
- [ ] Touch events are detected
- [ ] Game responds to touch input
- [ ] No touch event errors

### Mobile Layout
- [ ] Game fits mobile screen
- [ ] Controls are accessible
- [ ] Text is readable
- [ ] No horizontal scrolling

## 🌐 Browser Compatibility

### Tested Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Required Features
- [ ] ES6+ support
- [ ] CSS Grid/Flexbox
- [ ] requestAnimationFrame
- [ ] Event listeners

## 🚀 Performance Testing

### Frame Rate
- [ ] Game runs at 60fps
- [ ] No frame drops during movement
- [ ] Smooth animations
- [ ] Responsive input

### Memory Usage
- [ ] No memory leaks
- [ ] Stable performance over time
- [ ] Cleanup on component unmount

## 📝 Reporting Issues

When reporting issues, include:
1. **Browser and version**
2. **Operating system**
3. **Console errors (if any)**
4. **Steps to reproduce**
5. **Expected vs actual behavior**
6. **Screenshots or videos**

## ✅ Success Criteria

The game is working correctly when:
- ✅ Start button transitions to game
- ✅ Player responds to all input methods
- ✅ Movement and jumping work smoothly
- ✅ No console errors
- ✅ Visual elements display correctly
- ✅ Game state updates properly
