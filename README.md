# Gavin Adventure

**Gavin Adventure** is a browser-based, gym-themed platformer: run and jump through procedurally varied stages, collect **GAINS**, grab protein power-ups, and face the **Boss Shredder** at the end of each world.

## Run locally

Static files only — serve over HTTP (not `file://`) so audio unlock behaves consistently:

```bash
npm start
```

Then open the URL printed by `http-server` (for example `http://127.0.0.1:8000/`).

## Controls

- **Move:** Arrow keys or **A** / **D**
- **Jump:** Space or **Z**
- **Run:** Shift or **X** / **C**
- **Menu:** **Enter** or Space to start a new run. Hold **Shift** while pressing Enter to **continue** from the saved world/stage (if a save exists).

Progress (world, stage, gains, power state) is stored in `localStorage`.

## Project layout

- `index.html`, `style.css`, `main.js` — shell and bootstrap
- `engine/` — loop, input, collision, rendering, particles, audio
- `game/` — player tuning (SMB-style integrator), campaign, levels, entities, HUD, scenes, save data

## Deploy

GitHub Actions publishes the repository root as a GitHub Pages artifact (see `.github/workflows/deploy.yml`). Pages **Source** should be **GitHub Actions**.

## License

Add your preferred license for original game code. Third-party references or inspirations should be credited separately if you reintroduce them.
