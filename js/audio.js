// Gavin Adventure - Audio System
// Generates chiptune music and sound effects programmatically

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.musicEnabled = true;
        this.soundEnabled = true;
        this.currentMusic = null;
        this.sounds = {};
        
        this.initAudio();
        this.generateSounds();
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    generateSounds() {
        if (!this.audioContext) return;
        
        this.generateJumpSound();
        this.generateStompSound();
        this.generatePowerUpSound();
        this.generateCoinSound();
        this.generateDeathSound();
        this.generateVictorySound();
    }

    generateJumpSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
        
        this.sounds.jump = { oscillator, gainNode };
    }

    generateStompSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
        
        this.sounds.stomp = { oscillator, gainNode };
    }

    generatePowerUpSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(900, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
        
        this.sounds.powerUp = { oscillator, gainNode };
    }

    generateCoinSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
        
        this.sounds.coin = { oscillator, gainNode };
    }

    generateDeathSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.6);
        
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.6);
        
        this.sounds.death = { oscillator, gainNode };
    }

    generateVictorySound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Victory fanfare
        const notes = [523, 659, 784, 1047, 1319, 1568]; // C, E, G, C, E, G
        const noteTime = 0.1;
        
        notes.forEach((freq, index) => {
            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * noteTime);
        });
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + notes.length * noteTime);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + notes.length * noteTime);
        
        this.sounds.victory = { oscillator, gainNode };
    }

    playSound(soundName) {
        if (!this.soundEnabled || !this.audioContext) return;
        
        try {
            this.generateSounds(); // Regenerate sounds for each play
            const sound = this.sounds[soundName];
            if (sound) {
                sound.oscillator.start();
                sound.oscillator.stop(this.audioContext.currentTime + 0.1);
            }
        } catch (e) {
            console.warn('Error playing sound:', e);
        }
    }

    playMusic(trackName) {
        if (!this.musicEnabled || !this.audioContext) return;
        
        this.stopMusic();
        
        switch (trackName) {
            case 'title':
                this.currentMusic = this.generateTitleMusic();
                break;
            case 'overworld':
                this.currentMusic = this.generateOverworldMusic();
                break;
            case 'underground':
                this.currentMusic = this.generateUndergroundMusic();
                break;
            case 'underwater':
                this.currentMusic = this.generateUnderwaterMusic();
                break;
            case 'castle':
                this.currentMusic = this.generateCastleMusic();
                break;
            case 'boss':
                this.currentMusic = this.generateBossMusic();
                break;
        }
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    generateTitleMusic() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Title screen melody
        const melody = [
            { freq: 523, duration: 0.5 }, // C
            { freq: 659, duration: 0.5 }, // E
            { freq: 784, duration: 0.5 }, // G
            { freq: 1047, duration: 1.0 }, // C
            { freq: 784, duration: 0.5 }, // G
            { freq: 659, duration: 0.5 }, // E
            { freq: 523, duration: 1.0 }  // C
        ];
        
        let currentTime = this.audioContext.currentTime;
        melody.forEach(note => {
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            currentTime += note.duration;
        });
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(currentTime);
        
        return oscillator;
    }

    generateOverworldMusic() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Overworld theme - upbeat gym energy
        const melody = [
            { freq: 523, duration: 0.25 }, // C
            { freq: 659, duration: 0.25 }, // E
            { freq: 784, duration: 0.25 }, // G
            { freq: 1047, duration: 0.25 }, // C
            { freq: 784, duration: 0.25 }, // G
            { freq: 659, duration: 0.25 }, // E
            { freq: 523, duration: 0.5 },  // C
            { freq: 523, duration: 0.25 }, // C
            { freq: 659, duration: 0.25 }, // E
            { freq: 784, duration: 0.25 }, // G
            { freq: 1047, duration: 0.25 }, // C
            { freq: 784, duration: 0.25 }, // G
            { freq: 659, duration: 0.25 }, // E
            { freq: 523, duration: 0.5 }   // C
        ];
        
        let currentTime = this.audioContext.currentTime;
        melody.forEach(note => {
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            currentTime += note.duration;
        });
        
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(currentTime);
        
        return oscillator;
    }

    generateUndergroundMusic() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Underground theme - mysterious locker room vibe
        const melody = [
            { freq: 261, duration: 0.5 }, // C (low)
            { freq: 329, duration: 0.5 }, // E
            { freq: 261, duration: 0.5 }, // C
            { freq: 329, duration: 0.5 }, // E
            { freq: 349, duration: 0.5 }, // F
            { freq: 392, duration: 0.5 }, // G
            { freq: 349, duration: 0.5 }, // F
            { freq: 329, duration: 0.5 }  // E
        ];
        
        let currentTime = this.audioContext.currentTime;
        melody.forEach(note => {
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            currentTime += note.duration;
        });
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(currentTime);
        
        return oscillator;
    }

    generateUnderwaterMusic() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Underwater theme - protein shake mixing vats
        const melody = [
            { freq: 196, duration: 0.75 }, // G (low)
            { freq: 220, duration: 0.75 }, // A
            { freq: 196, duration: 0.75 }, // G
            { freq: 220, duration: 0.75 }, // A
            { freq: 196, duration: 0.75 }, // G
            { freq: 220, duration: 0.75 }, // A
            { freq: 196, duration: 0.75 }, // G
            { freq: 220, duration: 0.75 }  // A
        ];
        
        let currentTime = this.audioContext.currentTime;
        melody.forEach(note => {
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            currentTime += note.duration;
        });
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(currentTime);
        
        return oscillator;
    }

    generateCastleMusic() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Castle theme - massive gym with equipment
        const melody = [
            { freq: 523, duration: 0.5 }, // C
            { freq: 466, duration: 0.5 }, // Bb
            { freq: 415, duration: 0.5 }, // Ab
            { freq: 370, duration: 0.5 }, // F#
            { freq: 415, duration: 0.5 }, // Ab
            { freq: 466, duration: 0.5 }, // Bb
            { freq: 523, duration: 1.0 }, // C
            { freq: 523, duration: 0.5 }, // C
            { freq: 466, duration: 0.5 }, // Bb
            { freq: 415, duration: 0.5 }, // Ab
            { freq: 370, duration: 0.5 }, // F#
            { freq: 415, duration: 0.5 }, // Ab
            { freq: 466, duration: 0.5 }, // Bb
            { freq: 523, duration: 1.0 }  // C
        ];
        
        let currentTime = this.audioContext.currentTime;
        melody.forEach(note => {
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            currentTime += note.duration;
        });
        
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(currentTime);
        
        return oscillator;
    }

    generateBossMusic() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Boss theme - The Shredder battle
        const melody = [
            { freq: 261, duration: 0.25 }, // C (low)
            { freq: 261, duration: 0.25 }, // C
            { freq: 261, duration: 0.25 }, // C
            { freq: 261, duration: 0.25 }, // C
            { freq: 329, duration: 0.25 }, // E
            { freq: 329, duration: 0.25 }, // E
            { freq: 329, duration: 0.25 }, // E
            { freq: 329, duration: 0.25 }, // E
            { freq: 349, duration: 0.25 }, // F
            { freq: 349, duration: 0.25 }, // F
            { freq: 349, duration: 0.25 }, // F
            { freq: 349, duration: 0.25 }, // F
            { freq: 392, duration: 0.5 }, // G
            { freq: 440, duration: 0.5 }, // A
            { freq: 523, duration: 1.0 }  // C
        ];
        
        let currentTime = this.audioContext.currentTime;
        melody.forEach(note => {
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            currentTime += note.duration;
        });
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(currentTime);
        
        return oscillator;
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
            this.stopMusic();
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
    }

    resumeAudio() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}

// Create global audio manager instance
const AUDIO_MANAGER = new AudioManager();
