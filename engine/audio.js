// Audio System with Web Audio API and fallback
class AudioManager {
    constructor() {
        this.context = null;
        this.masterVolume = 1.0;
        this.sfxVolume = 1.0;
        this.musicVolume = 0.7;
        this.sounds = new Map();
        this.music = null;
        this.currentMusic = null;
        this.muted = false;
        
        this.initAudioContext();
        this.createSyntheticSounds();
    }
    
    initAudioContext() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported, using fallback');
        }
    }
    
    createSyntheticSounds() {
        // Create synthetic 8-bit style sounds using Web Audio API
        this.createJumpSound();
        this.createCoinSound();
        this.createPowerUpSound();
        this.createEnemyDeathSound();
        this.createHurtSound();
        this.createBreakSound();
        this.createBossHitSound();
        this.createVictorySound();
    }
    
    createTone(frequency, duration, type = 'square') {
        if (!this.context) return null;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
        
        gainNode.gain.setValueAtTime(0.3 * this.sfxVolume * this.masterVolume, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        return { oscillator, gainNode };
    }
    
    createJumpSound() {
        this.sounds.set('jump', () => {
            const tone = this.createTone(330, 0.1);
            if (tone) {
                tone.oscillator.start();
                tone.oscillator.stop(this.context.currentTime + 0.1);
            }
        });
    }
    
    createCoinSound() {
        this.sounds.set('coin', () => {
            const tone1 = this.createTone(660, 0.1);
            const tone2 = this.createTone(880, 0.1);
            if (tone1 && tone2) {
                tone1.oscillator.start();
                tone1.oscillator.stop(this.context.currentTime + 0.05);
                tone2.oscillator.start(this.context.currentTime + 0.05);
                tone2.oscillator.stop(this.context.currentTime + 0.1);
            }
        });
    }
    
    createPowerUpSound() {
        this.sounds.set('powerup', () => {
            const frequencies = [262, 330, 392, 523];
            frequencies.forEach((freq, i) => {
                const tone = this.createTone(freq, 0.15);
                if (tone) {
                    tone.oscillator.start(this.context.currentTime + i * 0.1);
                    tone.oscillator.stop(this.context.currentTime + (i + 1) * 0.1);
                }
            });
        });
    }
    
    createEnemyDeathSound() {
        this.sounds.set('enemy_death', () => {
            const tone = this.createTone(150, 0.3, 'sawtooth');
            if (tone) {
                tone.oscillator.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + 0.3);
                tone.oscillator.start();
                tone.oscillator.stop(this.context.currentTime + 0.3);
            }
        });
    }
    
    createHurtSound() {
        this.sounds.set('hurt', () => {
            const tone = this.createTone(200, 0.2, 'sawtooth');
            if (tone) {
                tone.gainNode.gain.setValueAtTime(0.4 * this.sfxVolume * this.masterVolume, this.context.currentTime);
                tone.oscillator.start();
                tone.oscillator.stop(this.context.currentTime + 0.2);
            }
        });
    }
    
    createBreakSound() {
        this.sounds.set('break', () => {
            // Create noise-like sound for breaking blocks
            const tone = this.createTone(100, 0.15, 'sawtooth');
            if (tone) {
                tone.oscillator.frequency.setValueAtTime(100, this.context.currentTime);
                tone.oscillator.frequency.linearRampToValueAtTime(50, this.context.currentTime + 0.15);
                tone.oscillator.start();
                tone.oscillator.stop(this.context.currentTime + 0.15);
            }
        });
    }
    
    createBossHitSound() {
        this.sounds.set('boss_hit', () => {
            const tone = this.createTone(80, 0.4, 'sawtooth');
            if (tone) {
                tone.gainNode.gain.setValueAtTime(0.5 * this.sfxVolume * this.masterVolume, this.context.currentTime);
                tone.oscillator.start();
                tone.oscillator.stop(this.context.currentTime + 0.4);
            }
        });
    }
    
    createVictorySound() {
        this.sounds.set('victory', () => {
            const melody = [523, 587, 659, 698, 784, 880, 988, 1047];
            melody.forEach((freq, i) => {
                const tone = this.createTone(freq, 0.2);
                if (tone) {
                    tone.oscillator.start(this.context.currentTime + i * 0.1);
                    tone.oscillator.stop(this.context.currentTime + (i * 0.1) + 0.2);
                }
            });
        });
    }
    
    playSound(name) {
        if (this.muted || !this.context) return;
        
        // Resume context if suspended (mobile requirement)
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
        
        const soundFn = this.sounds.get(name);
        if (soundFn) {
            try {
                soundFn();
            } catch (e) {
                console.warn('Failed to play sound:', name, e);
            }
        }
    }
    
    playMusic(name) {
        // For now, just play a simple background tone
        // In a full implementation, this would play longer compositions
        if (this.muted || !this.context || this.currentMusic === name) return;
        
        this.stopMusic();
        this.currentMusic = name;
        
        // Simple background music loop
        if (name === 'level') {
            this.playBackgroundLoop([262, 294, 330, 349]);
        } else if (name === 'boss') {
            this.playBackgroundLoop([196, 220, 247, 262], 0.8);
        }
    }
    
    playBackgroundLoop(notes, speed = 1.0) {
        if (!this.context) return;
        
        let noteIndex = 0;
        const playNote = () => {
            if (this.currentMusic && !this.muted) {
                const tone = this.createTone(notes[noteIndex], 0.5 / speed);
                if (tone) {
                    tone.gainNode.gain.setValueAtTime(0.1 * this.musicVolume * this.masterVolume, this.context.currentTime);
                    tone.oscillator.start();
                    tone.oscillator.stop(this.context.currentTime + 0.5 / speed);
                }
                
                noteIndex = (noteIndex + 1) % notes.length;
                setTimeout(playNote, 500 / speed);
            }
        };
        playNote();
    }
    
    stopMusic() {
        this.currentMusic = null;
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }
    
    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopMusic();
        }
        return this.muted;
    }
    
    // Initialize audio on first user interaction
    initialize() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }
}

// Export to global scope
window.AudioManager = AudioManager;