# c2-smb1–derived graphics

PNG frames and tiles copied from **[Jcw87/c2-smb1](https://github.com/Jcw87/c2-smb1)** (Construct 2 Super Mario Bros. 1 demake).  
Upstream is typically **MIT-licensed**; **Nintendo** still holds trademark/copyright on Mario characters and designs—use at your own risk for public releases.

## Regenerating these files

1. Clone the reference next to this repo (or anywhere):

   `git clone https://github.com/Jcw87/c2-smb1.git _ref_c2-smb1`

2. From the **Gavin-Adventure** root, run:

   `powershell -ExecutionPolicy Bypass -File tools/import-c2-smb1.ps1`

The script copies normalized filenames into `Assets/c2/`. The game loads them in `game/sprites.js` via `loadC2Smb1Assets()` after the generic Mario paths.

## Filenames

See `tools/import-c2-smb1.ps1` for the full map (grounds, bricks, Small/Big Mario, Goomba, Koopa, items, pipes, HUD-adjacent props, etc.).
