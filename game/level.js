(function () {
    const GAME_CONFIG = window.GAME_CONFIG;
    const TILES = window.TILES;

    class Level {
        constructor(data) {
            this.width = data.width;
            this.height = data.height;
            this.tiles = data.tiles;
            this.theme = data.theme != null ? data.theme : 0;
            this.spawn = data.spawn;
            this.goalX = data.goalX;
            this.isBoss = !!data.isBoss;
            this.title = data.title || '';
            this.enemyDefs = data.enemyDefs || [];
            this.collectibleDefs = data.collectibleDefs || [];
            const ts = GAME_CONFIG.TILE_SIZE;
            this.widthPx = this.width * ts;
            this.heightPx = this.height * ts;
        }

        getTile(tx, ty) {
            if (ty < 0 || ty >= this.height || tx < 0 || tx >= this.width) return TILES.AIR;
            const row = this.tiles[ty];
            if (!row) return TILES.AIR;
            return row[tx] | 0;
        }
    }

    window.Level = Level;
})();
