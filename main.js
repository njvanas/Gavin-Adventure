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

    /** Logical size in CSS pixels; backing store scaled for sharp retina output. */
    const maxDpr = 2;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    canvas.width = Math.round(GAME_CONFIG.CANVAS_WIDTH * dpr);
    canvas.height = Math.round(GAME_CONFIG.CANVAS_HEIGHT * dpr);
    canvas.dataset.logicalWidth = String(GAME_CONFIG.CANVAS_WIDTH);
    canvas.dataset.logicalHeight = String(GAME_CONFIG.CANVAS_HEIGHT);

    const bootCtx = canvas.getContext('2d');
    if (bootCtx) {
        bootCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        bootCtx.imageSmoothingEnabled = true;
        if (bootCtx.imageSmoothingQuality !== undefined) bootCtx.imageSmoothingQuality = 'high';
    }
    window.__gameDpr = dpr;

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
