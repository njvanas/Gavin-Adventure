# Gavin Adventure

<p align="center">
  <strong>Make GAINS. Beat The Shredder.</strong><br/>
  <em>A browser-native platformer with the heart of a classic side-scroller — starring a lifter, not a plumber.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License MIT"/>
  <img src="https://img.shields.io/badge/platform-Web%20%28Canvas%29-14b8a6" alt="Platform Web Canvas"/>
  <img src="https://img.shields.io/badge/runtime-Zero%20install%20to%20play-f97316" alt="Zero install"/>
</p>

---

## Why play this?

If **Super Mario Bros.** is the gold standard for “run right, jump on heads, grab a power-up, survive the boss,” **Gavin Adventure** chases that same *tight, readable, just-one-more-try* loop — then swaps the mushroom kingdom for chalk, iron, and gym chaos.

You are **Gavin**: small at first, **pumped** after a pickup, and downright **beastly** when you earn the top form — complete with ranged attacks when the iron gets heavy. Enemies are not goombas; they are **Slouchers**, **Form Police**, **Snappers**, **Kettle Bells**, **Protein Drones**, and the capstone **Boss Shredder**. Collect **Golden Dumbbells**, **Gym Cards**, shakes, pre-workouts, and macros; keep an eye on the **GAINS** meter for that extra push when the stage turns nasty.

**Simple to pick up. Hard to put down.** No install required — it is HTML5 Canvas and JavaScript, tuned for keyboard, gamepad, and touch.

---

## The loop (in one breath)

Run → jump → **power up** → learn enemy patterns → **survive hazards** (wind, water, belts, spikes) → **face the boss** → chase the next checkpoint. Same dopamine arc as the classics; completely its own flavor.

---

## What you get

| Pillar | What it means in-game |
|--------|------------------------|
| **Feel** | 60 FPS target, coyote time, jump buffering, variable jump height — the kind of polish platformer fans notice in the first minute. |
| **Growth** | Three **power states**: Small → **Pump** → **Beast** (projectiles when you have earned the big guns). |
| **Opposition** | A full roster of gym-themed foes plus **The Shredder** as the marquee boss fight. |
| **Worlds** | **Eight themed biomes** — from the **Neighborhood Gym** to the **Championship Coliseum** — each with its own vibe and hazards (rooftop wind, locker tunnels, water sections, factory belts, neon bounce pads, ice and updrafts, and the final arena). |
| **Progress** | Collectibles, checkpoints, autosave via **localStorage**, and a **GAINS** meter that rewards clean play. |
| **Input** | Keyboard, **gamepad**, and **on-screen touch** controls on mobile. |
| **Tools** | Built-in **level editor** (`tools/editor.html`) — paint tiles, place entities, export **JSON**, iterate fast. |

The project ships with **demo / generator-driven stages** you can play immediately; the **editor and JSON pipeline** are there so you (or your team) can grow the campaign without rewriting the engine.

---

## Controls

### Keyboard

| Action | Keys |
|--------|------|
| Move / crouch | **Arrow keys** or **WASD** |
| Jump (hold for height) | **Space** or **Z** |
| Run | **X** or **Shift** |
| Throw (Beast mode) | **C** |
| Start / pause | **Enter** |
| Debug | **F1** |

### Gamepad

| Action | Control |
|--------|---------|
| Move | D-pad or left stick |
| Jump | **A** |
| Run | **X** |
| Throw | **B** |
| Pause | **Start** |

### Touch

On narrow screens, on-screen **direction** and **action** buttons appear automatically — same moves, thumbs-friendly.

---

## Run it locally

**Prerequisites:** [Node.js](https://nodejs.org/) 14+ (only needed for the dev server — the game itself has **no runtime npm dependencies**).

```bash
git clone https://github.com/Dolfie/Gavin-Adventure.git
cd Gavin-Adventure
npm install
npm run dev
```

That serves the project and opens your browser (see `package.json` — `dev` uses `http-server` on port **8000**).  
Prefer a one-liner without opening a tab? Use `npm start` instead.

No Node? Serve the folder with any static server, e.g. `python -m http.server 8000`, then open the printed localhost URL.

---

## Deploy

GitHub Actions can publish to **GitHub Pages** from `main`. Fork, enable Actions, push — your site follows the usual `https://<user>.github.io/<repo>/` pattern.

**Details:** [DEPLOYMENT.md](./DEPLOYMENT.md)

**Live site (this fork’s GitHub Pages):** [njvanas.github.io/Gavin-Adventure](https://njvanas.github.io/Gavin-Adventure)

If you bookmarked an old link or another fork, you may see a different build. Your deploy URL is always `https://<your-github-username>.github.io/Gavin-Adventure/` (enable **Actions** + **Pages → GitHub Actions** on that repo). The upstream repo [Barend183/Gavin-Adventure](https://github.com/Barend183/Gavin-Adventure) may still serve an older `index.html` on its Pages site until those commits are merged and deployed there.

---

## Project layout

```
gavin-adventure/
├── index.html              # Canvas shell + mobile controls
├── style.css               # Layout & responsive UI
├── main.js                 # Bootstrap
├── engine/                 # Loop, input, physics, collision, render, audio, particles
├── game/                   # Gavin, enemies, campaign, levels, HUD, scenes, save
├── tools/
│   └── editor.html         # Tile / entity editor → JSON
├── docs/                   # Design notes and roadmaps
├── DEPLOYMENT.md
└── TESTPLAN.md
```

---

## Level editor (quick start)

1. Open `tools/editor.html` in a browser.
2. Paint geometry, place enemies and pickups, set spawn and theme.
3. Export JSON and wire it into the game data path you use for levels.

Use it to prototype a new gauntlet in minutes — same pipeline the main game reads.

---

## Tech notes

- **Rendering:** HTML5 Canvas, pixel-crisp presentation.  
- **Audio:** Web Audio–driven chiptune-style SFX and music.  
- **Save data:** Browser `localStorage` for progress.  
- **Compatibility:** Modern Chrome, Edge, Firefox, Safari — desktop and mobile.

---

## License

MIT — see `license` in [`package.json`](./package.json).

---

<p align="center">
  <strong>Load the page. Hit Start. Chase the next PR.</strong><br/>
  <sub>Gavin Adventure — classic platformer energy, gym-bro soul, 100% in the browser.</sub>
</p>
