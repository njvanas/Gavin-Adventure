# Copies textures/animations from a local c2-smb1 clone into Assets/c2/
# Usage: place clone at <repo-root>/_ref_c2-smb1 or set $RefRoot

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot

$RefRoot = if ($env:C2_SMB1_ROOT) { $env:C2_SMB1_ROOT } else { Join-Path $RepoRoot "_ref_c2-smb1" }
$Dst = Join-Path $RepoRoot "Assets\c2"

if (-not (Test-Path $RefRoot)) {
    Write-Host "Clone c2-smb1 first:"
    Write-Host "  git clone https://github.com/Jcw87/c2-smb1.git `"$RefRoot`""
    exit 1
}

New-Item -ItemType Directory -Force -Path $Dst | Out-Null

function Copy-C2($relDst, $relSrc) {
    $from = Join-Path $RefRoot $relSrc
    $to = Join-Path $Dst $relDst
    if (Test-Path $from) {
        Copy-Item -Force $from $to
        Write-Host "OK $relDst"
    } else {
        Write-Warning "Missing: $relSrc"
    }
}

# Textures
Copy-C2 "c2_ground.png" "Textures\Ground.png"
Copy-C2 "c2_brick.png" "Textures\Block.png"
Copy-C2 "c2_brick_alt.png" "Textures\Block2.png"
Copy-C2 "c2_hard_block.png" "Textures\CastleBrick.png"
Copy-C2 "c2_cloud.png" "Textures\Cloud.png"
Copy-C2 "c2_bush.png" "Textures\Bush.png"
Copy-C2 "c2_flag_pole.png" "Textures\FlagPole.png"
Copy-C2 "c2_horizontal_pipe.png" "Textures\HorizontalPipe.png"
Copy-C2 "c2_pipe_vertical.png" "Textures\VerticalPipe.png"
Copy-C2 "c2_pipe_intersection.png" "Textures\PipeIntersection.png"
Copy-C2 "c2_underground_brick.png" "Textures\CastleBrick.png"
Copy-C2 "c2_underground_block.png" "Textures\WaterBlock.png"

# Small Mario
Copy-C2 "c2_mario_small_idle.png" "Animations\SmallMario\Standing\000.png"
Copy-C2 "c2_mario_small_run1.png" "Animations\SmallMario\Walking\000.png"
Copy-C2 "c2_mario_small_run2.png" "Animations\SmallMario\Walking\001.png"
Copy-C2 "c2_mario_small_run3.png" "Animations\SmallMario\Walking\002.png"
Copy-C2 "c2_mario_small_jump.png" "Animations\SmallMario\Jumping\000.png"
Copy-C2 "c2_mario_small_skid.png" "Animations\SmallMario\Skidding\000.png"
Copy-C2 "c2_mario_small_die.png" "Animations\SmallMario\Die\000.png"

# Big Mario
Copy-C2 "c2_mario_big_idle.png" "Animations\BigMario\Standing\000.png"
Copy-C2 "c2_mario_big_run1.png" "Animations\BigMario\Walking\000.png"
Copy-C2 "c2_mario_big_run2.png" "Animations\BigMario\Walking\001.png"
Copy-C2 "c2_mario_big_run3.png" "Animations\BigMario\Walking\002.png"
Copy-C2 "c2_mario_big_jump.png" "Animations\BigMario\Jumping\000.png"
Copy-C2 "c2_mario_big_skid.png" "Animations\BigMario\Skidding\000.png"

# Enemies
Copy-C2 "c2_goomba_walk1.png" "Animations\Goomba\BrownWalking\000.png"
Copy-C2 "c2_goomba_walk2.png" "Animations\Goomba\BrownWalking\001.png"
Copy-C2 "c2_goomba_flat.png" "Animations\Goomba\BrownSquished\000.png"
Copy-C2 "c2_koopa_walk1.png" "Animations\Koopa\GreenWalking\000.png"
Copy-C2 "c2_koopa_walk2.png" "Animations\Koopa\GreenWalking\001.png"
Copy-C2 "c2_koopa_shell.png" "Animations\Koopa\GreenShell\000.png"

# Blocks & items
Copy-C2 "c2_mystery_block.png" "Animations\QuestionBlock\Default\000.png"
Copy-C2 "c2_empty_block.png" "Animations\QuestionBlock\Empty\000.png"
Copy-C2 "c2_coin.png" "Animations\Coin\Default\000.png"
Copy-C2 "c2_1up_mushroom.png" "Animations\1UP\Default\000.png"
Copy-C2 "c2_starman.png" "Animations\Starman\Default\000.png"
Copy-C2 "c2_fire_flower.png" "Animations\FireFlower\Default\000.png"
Copy-C2 "c2_castle_flag.png" "Animations\CastleFlag\Default\000.png"
Copy-C2 "favicon-32.png" "Files\icon-32.png"

Write-Host "Done. Output: $Dst"
