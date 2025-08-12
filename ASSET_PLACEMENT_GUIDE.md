# Asset Placement Guide for Gavin Adventure

## 📁 Directory Structure

Your assets should be organized in the following structure:

```
public/
├── assets/
│   ├── images/          # Static images, backgrounds, UI elements
│   ├── sprites/         # Game character and object sprites
│   └── audio/           # Sound effects and music
```

## 🎮 Required Assets

### 1. Main Character - Gavin

**Location:** `public/assets/sprites/`

| Asset Name | Filename | Size | Frames | Description |
|------------|----------|------|--------|-------------|
| Gavin Idle | `gavin-idle.png` | 64x64 | 4 | Standing still animation |
| Gavin Run | `gavin-run.png` | 64x64 | 6 | Running animation |
| Gavin Jump | `gavin-jump.png` | 64x64 | 3 | Jumping animation |
| Gavin Flex | `gavin-flex.png` | 64x64 | 4 | Flexing/battle pose |

**Sprite Sheet Format:** Horizontal strip with frames side by side
**Example:** 4-frame idle animation = 256x64 pixels (4 × 64)

### 2. Blocks (Coin Generators)

**Location:** `public/assets/sprites/`

| Asset Name | Filename | Size | Frames | Description |
|------------|----------|------|--------|-------------|
| Question Block | `question-block.png` | 32x32 | 4 | Animated question mark block |
| Brick Block | `brick-block.png` | 32x32 | 1 | Static brick block |

**Note:** Question blocks should have a pulsing question mark animation

### 3. Collectibles

**Location:** `public/assets/sprites/`

| Asset Name | Filename | Size | Frames | Description |
|------------|----------|------|--------|-------------|
| Gold Coin | `gold-coin.png` | 16x16 | 6 | Spinning gold coin |
| Silver Coin | `silver-coin.png` | 16x16 | 4 | Spinning silver coin |
| Chicken | `chicken.png` | 24x24 | 3 | Animated chicken |
| Small Dumbbell | `small-dumbbell.png` | 20x20 | 2 | Small weight |
| Medium Dumbbell | `medium-dumbbell.png` | 24x24 | 2 | Medium weight |
| Large Dumbbell | `large-dumbbell.png` | 28x28 | 2 | Large weight |
| Super Serum | `super-serum.png` | 20x20 | 4 | Glowing serum vial |

### 4. Enemies

**Location:** `public/assets/sprites/`

| Asset Name | Filename | Size | Frames | Description |
|------------|----------|------|--------|-------------|
| Mini Fat Woman | `mini-fat-woman.png` | 32x32 | 4 | Standard enemy |

### 5. Bosses (5 World Variants)

**Location:** `public/assets/sprites/`

| Asset Name | Filename | Size | Frames | Description |
|------------|----------|------|--------|-------------|
| Jungle Fat Woman | `jungle-fat-woman.png` | 96x96 | 6 | Jungle-themed boss |
| Desert Fat Woman | `desert-fat-woman.png` | 96x96 | 6 | Desert-themed boss |
| Snow Fat Woman | `snow-fat-woman.png` | 96x96 | 6 | Snow-themed boss |
| Cyber Fat Woman | `cyber-fat-woman.png` | 96x96 | 6 | Futuristic boss |
| Haunted Fat Woman | `haunted-fat-woman.png` | 96x96 | 6 | Final boss |

## 🎨 Asset Specifications

### Sprite Sheet Requirements

1. **Frame Alignment**: All frames must be perfectly aligned
2. **Transparency**: Use PNG format with transparent backgrounds
3. **Pixel Art**: Maintain consistent pixel art style
4. **Color Palette**: Use consistent colors across all assets

### Size Guidelines

- **Player Character**: 64x64 pixels (base size)
- **Small Items**: 16x24 pixels (coins, small power-ups)
- **Medium Items**: 24x32 pixels (chicken, medium power-ups)
- **Large Items**: 28x40 pixels (large power-ups)
- **Enemies**: 32x32 pixels
- **Bosses**: 96x96 pixels
- **Blocks**: 32x32 pixels

### Animation Requirements

- **Idle Animations**: 4-6 frames, 200-300ms per frame
- **Movement Animations**: 6-8 frames, 100-150ms per frame
- **Action Animations**: 3-4 frames, 150-200ms per frame
- **Boss Animations**: 6-8 frames, 150ms per frame

## 📱 Creating Your Assets

### Option 1: Pixel Art Software
- **Aseprite** (Recommended for pixel art)
- **Piskel** (Free online pixel art editor)
- **GraphicsGale** (Windows pixel art editor)

### Option 2: Image Editing Software
- **Photoshop** with pixel art brushes
- **GIMP** (Free alternative)
- **Krita** (Free digital painting)

### Option 3: AI-Generated Assets
- **Midjourney** with pixel art prompts
- **DALL-E** with specific art style instructions
- **Stable Diffusion** with pixel art models

## 🔧 Asset Integration

### 1. Place Assets in Correct Directories
```bash
# Create directories (if not already created)
mkdir -p public/assets/sprites
mkdir -p public/assets/images
mkdir -p public/assets/audio

# Copy your sprite files
cp your-sprites/*.png public/assets/sprites/
```

### 2. Verify Asset Loading
The game will automatically load assets from the `public/assets/` directory. Make sure:
- All filenames match exactly (case-sensitive)
- File formats are PNG for sprites
- File sizes match the specifications

### 3. Test Asset Display
- Start the development server: `npm run dev`
- Check browser console for asset loading errors
- Verify sprites appear correctly in the game

## 🎯 Asset Design Tips

### Character Design (Gavin)
- **Muscular Build**: Emphasize strength and fitness
- **Friendly Face**: Approachable, determined expression
- **Athletic Clothing**: Gym shorts, tank top, sneakers
- **Color Scheme**: Red/blue/yellow for energy and strength

### Enemy Design (Fat Women)
- **Varied Themes**: Each world should have distinct visual elements
- **Jungle**: Green/brown colors, leaf accessories
- **Desert**: Tan/orange colors, sand/rock elements
- **Snow**: White/blue colors, ice/snow effects
- **Cyber**: Neon colors, tech elements
- **Haunted**: Dark colors, spooky elements

### Power-up Design
- **Chicken**: Golden brown, appetizing appearance
- **Dumbbells**: Metallic gray, weight-focused design
- **Super Serum**: Glowing, magical appearance

## 🚨 Common Issues & Solutions

### Asset Not Loading
- Check file path in browser console
- Verify filename spelling and case
- Ensure file is in correct directory

### Sprite Animation Issues
- Verify frame count matches configuration
- Check frame dimensions are consistent
- Ensure sprite sheet is properly formatted

### Performance Issues
- Optimize sprite sizes (don't make them too large)
- Use appropriate frame rates
- Compress PNG files if needed

## 📋 Asset Checklist

Before submitting your assets, verify:

- [ ] All required sprites are created
- [ ] File names match exactly
- [ ] Sprite dimensions are correct
- [ ] Frame counts are accurate
- [ ] Animations are smooth
- [ ] Transparent backgrounds
- [ ] Consistent art style
- [ ] Proper file formats (PNG)
- [ ] Assets are in correct directories

## 🎮 Testing Your Assets

1. **Visual Check**: Ensure sprites look correct
2. **Animation Test**: Verify animations play smoothly
3. **Performance Test**: Check for frame rate drops
4. **Cross-browser Test**: Verify compatibility
5. **Mobile Test**: Check touch responsiveness

## 📞 Support

If you encounter issues with asset integration:
1. Check the browser console for error messages
2. Verify all file paths are correct
3. Ensure assets are properly formatted
4. Test with a simple sprite first
5. Check the `TESTING.md` file for debugging steps

---

**Remember**: Quality assets make a great game! Take your time to create polished, consistent sprites that match your game's theme and style.
