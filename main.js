(function () {
    const GAME_CONFIG = window.GAME_CONFIG;
    const GameEngine = window.GameEngine;
    const InputManager = window.InputManager;
    const AudioManager = window.AudioManager;
    const MenuScene = window.MenuScene;
    const GameScene = window.GameScene;
    const GameSave = window.GameSave;

    const canvas = document.getElementById('game');
    if (!canvas) return;

    canvas.width = GAME_CONFIG.CANVAS_WIDTH;
    canvas.height = GAME_CONFIG.CANVAS_HEIGHT;

    const bootCtx = canvas.getContext('2d');
    if (bootCtx) {
        bootCtx.imageSmoothingEnabled = true;
        if (bootCtx.imageSmoothingQuality !== undefined) bootCtx.imageSmoothingQuality = 'high';
    }

    window.audio = new AudioManager();

    const input = new InputManager();
    const engine = new GameEngine(canvas);

    function goPlay(opts) {
        if (!opts || !opts.resume) GameSave.clear();
        engine.setScene(new GameScene(engine, input, opts));
    }

    engine.setScene(
        new MenuScene(engine, input, function (opts) {
            goPlay(opts);
        })
    );

    engine.start();

    window.addEventListener('beforeunload', () => input.destroy());
})();
