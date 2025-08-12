# 🏋️ Gavin's Quest: Chicken for Gains!

A **bodybuilding-themed Mario-style platformer** from the early 2000s where you play as Gavin, a buff adventurer on a quest to collect coins and buy chicken to grow stronger!

## 🎮 **Game Concept**

Instead of saving a princess, Gavin needs to:
- **Collect coins** 💰 to buy chicken 🍗
- **Maintain strength** 💪 (starts at 100%)
- **Avoid enemies** that steal your gains
- **Run infinitely** through endless terrain!

## 🌍 **Infinite Terrain System**

The game features a revolutionary **infinite terrain system** that dynamically manages memory:

### **Terrain Chunks**
- **Chunk Size**: 400 pixels wide
- **Render Distance**: 3 chunks ahead, 3 chunks behind
- **Dynamic Generation**: New terrain generates as you progress
- **Memory Management**: Old terrain automatically dehydrates

### **Hydration/Dehydration**
- **Hydrate**: New terrain chunks spawn ahead of the player
- **Dehydrate**: Old terrain chunks behind the player are destroyed
- **Performance**: Only keeps active chunks in memory
- **Infinite**: You can run forever without memory issues!

### **Terrain Features**
- **Ground Platforms**: Randomly sized platforms with gaps
- **Floating Platforms**: Various heights and positions
- **Coins**: Scattered throughout for collection
- **Enemies**: Randomly placed slimes
- **Checkpoints**: Every 3rd chunk for respawn points
- **Chicken Shops**: Every 5th chunk for strength restoration

## 🎯 **Gameplay Mechanics**

### **Strength System**
- **Start**: 100% strength (green)
- **Coins**: +2 strength each (small energy boost)
- **Enemies**: -20 strength (they steal your gains!)
- **Cardio zones**: -15 strength (drains your gains!)
- **Chicken shop**: Restores to 100% strength

### **Coin Economy**
- **Chicken cost**: Starts at 50 coins, increases by 25 each level
- **Coin value**: 10 coins each
- **Goal**: Collect enough coins to buy chicken and continue running

### **Controls**
- **WASD/Arrows**: Move and jump
- **Space**: Jump
- **F**: Flex (bodybuilding power move!)
- **Mouse**: Click to interact

## 🎨 **Visual Features**

- **Gavin the Adventurer**: Buff character with blue shirt and brown hair
- **Beautiful forest background**: Mountains, trees, and sky
- **Dynamic terrain**: Endless variety of platforms and challenges
- **Enemy slimes**: Lazy people who don't work out!
- **Golden coins**: Protein sources scattered throughout
- **Chicken shops**: Your goal destinations
- **Motivational messages**: Classic bodybuilding quotes

## 🚀 **How to Play**

1. **Generate sprites** using `simple_sprite_test.html`
2. **Download and place** PNG files in correct directories
3. **Run the game**: `npm run dev`
4. **Run forever** through infinite terrain!
5. **Collect coins** while avoiding enemies
6. **Buy chicken** at shops to restore strength
7. **Never stop running** - the world is endless!

## 🏆 **Victory Conditions**

- **Infinite Progress**: No end point - just keep running!
- **Buy chicken** to restore full strength
- **Maintain high strength** throughout the journey
- **Set distance records** - how far can you go?

## 🎵 **Bodybuilding Theme**

The game features:
- **Motivational messages**: "NO PAIN, NO GAIN!"
- **Protein particles**: Floating orange protein bits
- **Strength-based gameplay**: No hearts, just pure gains
- **Chicken economy**: Protein is power!
- **Enemy theme**: Lazy people who steal your gains
- **Infinite running**: Never stop your gains journey!

## 🛠️ **Technical Features**

- **Infinite terrain generation**: Procedurally generated chunks
- **Memory management**: Automatic hydration/dehydration
- **Smooth animations**: 8-frame character animations
- **Particle effects**: Protein particles and visual feedback
- **Dynamic UI**: Color-coded strength indicators and terrain counter
- **Responsive controls**: Smooth movement and jumping
- **Modern graphics**: Pixel art with professional polish

## 🎮 **Game Flow**

1. **Title Screen** → Motivational bodybuilding intro
2. **Infinite Running** → Endless terrain generation
3. **Dynamic Challenges** → Random platforms, enemies, and coins
4. **Chicken Shops** → Restore strength and continue
5. **Never Ending** → The world is infinite!

## 🚀 **Deployment**

The game is configured for GitHub Pages deployment with automatic workflows.

---

**💪 Ready to start your infinite gains journey? LIFT HEAVY, EAT HEAVY, RUN FOREVER! 🍗🌍**
