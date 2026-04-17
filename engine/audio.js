(function () {
    class AudioManager {
        constructor() {
            this.ctx = null;
            this.enabled = true;
            try {
                const AC = window.AudioContext || window.webkitAudioContext;
                if (AC) this.ctx = new AC();
            } catch (e) {
                this.ctx = null;
            }
        }

        resume() {
            if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
        }

        _beep(freq, dur, type = 'square', vol = 0.08) {
            if (!this.enabled || !this.ctx) return;
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = type;
            o.frequency.value = freq;
            g.gain.value = vol;
            o.connect(g);
            g.connect(this.ctx.destination);
            o.start();
            o.stop(this.ctx.currentTime + dur);
        }

        playSound(name) {
            if (!this.enabled) return;
            this.resume();
            switch (name) {
                case 'jump':
                    this._beep(320, 0.06, 'square', 0.06);
                    break;
                case 'coin':
                    this._beep(880, 0.05, 'square', 0.05);
                    setTimeout(() => this._beep(1320, 0.05, 'square', 0.04), 40);
                    break;
                case 'powerup':
                    this._beep(440, 0.08, 'triangle', 0.07);
                    setTimeout(() => this._beep(660, 0.08, 'triangle', 0.06), 60);
                    break;
                case 'stomp':
                    this._beep(120, 0.1, 'sawtooth', 0.06);
                    break;
                case 'hurt':
                    this._beep(180, 0.15, 'sawtooth', 0.08);
                    break;
                case 'boss_hit':
                    this._beep(200, 0.12, 'square', 0.09);
                    break;
                case 'level_complete':
                    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this._beep(f, 0.12, 'square', 0.05), i * 100));
                    break;
                case 'game_over':
                    [392, 349, 330, 294].forEach((f, i) => setTimeout(() => this._beep(f, 0.2, 'sawtooth', 0.06), i * 180));
                    break;
                default:
                    break;
            }
        }
    }

    window.AudioManager = AudioManager;
})();
