(function () {
    const KEY = 'gavin-adventure-save-v1';

    function load() {
        try {
            const raw = localStorage.getItem(KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function save(data) {
        try {
            localStorage.setItem(KEY, JSON.stringify(data));
        } catch (e) {
            /* ignore */
        }
    }

    function clear() {
        try {
            localStorage.removeItem(KEY);
        } catch (e) {
            /* ignore */
        }
    }

    window.GameSave = { load, save, clear, KEY };
})();
