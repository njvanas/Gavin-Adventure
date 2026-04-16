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
        
        // Enhanced audio features
        this.audioNodes = new Map();
        this.spatialAudio = true;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.compressor = null;
        this.reverb = null;
        
        // Performance tracking
        this.loadedSounds = 0;
        this.totalSounds = 0;
        
        this.initAudioContext();
        this.createSyntheticSounds();
    }
    
    initAudioContext() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.createAudioGraph();
        } catch (e) {
            console.warn('Web Audio API not supported, using fallback');
        }
    }
    
    createAudioGraph() {
        if (!this.context) return;
        
        // Master output
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
        
        // Music bus
        this.musicGain = this.context.createGain();
        this.musicGain.connect(this.masterGain);
        
        // SFX bus with compression
        this.sfxGain = this.context.createGain();
        this.compressor = this.context.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-24, this.context.currentTime);
        this.compressor.knee.setValueAtTime(30, this.context.currentTime);
        this.compressor.ratio.setValueAtTime(12, this.context.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.context.currentTime);
        this.compressor.release.setValueAtTime(0.25, this.context.currentTime);
        
        this.sfxGain.connect(this.compressor);
        this.compressor.connect(this.masterGain);
        
        // Reverb send
        this.reverb = this.createReverb();
        this.reverb.connect(this.masterGain);
        
        // Update gain values
        this.updateGainValues();
    }
    
    createReverb() {
        if (!this.context) return null;
        
        const convolver = this.context.createConvolver();
        const length = this.context.sampleRate * 2; // 2 second reverb
        const impulse = this.context.createBuffer(2, length, this.context.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }
        
        convolver.buffer = impulse;
        return convolver;
    }
    
    updateGainValues() {
        if (!this.context) return;
        
        const currentTime = this.context.currentTime;
        
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.masterVolume, currentTime);
        }
        if (this.musicGain) {
            this.musicGain.gain.setValueAtTime(this.musicVolume, currentTime);
        }
        if (this.sfxGain) {
            this.sfxGain.gain.setValueAtTime(this.sfxVolume, currentTime);
        }
    }
    
    createSyntheticSounds() {
        // Create synthetic 8-bit style sounds using Web Audio API
        this.totalSounds = 12; // Update as we add more sounds
        
        this.createJumpSound();
        this.createCoinSound();
        this.createPowerUpSound();
        this.createEnemyDeathSound();
        this.createHurtSound();
        this.createBreakSound();
        this.createBossHitSound();
        this.createVictorySound();
        
        // Enhanced bodybuilding-themed sounds
        this.createMuscleFlexSound();
        this.createProteinShakeSound();
        this.createWeightClankSound();
        this.createGruntSound();
    }
    
    createTone(frequency, duration, type = 'square') {
        if (!this.context) return null;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain || this.context.destination);
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
        
        gainNode.gain.setValueAtTime(0.3 * this.sfxVolume * this.masterVolume, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        return { oscillator, gainNode };
    }
    
    createComplexTone(frequencies, duration, type = 'square') {
        if (!this.context) return null;
        
        const gainNode = this.context.createGain();
        gainNode.connect(this.sfxGain || this.context.destination);
        
        const oscillators = frequencies.map(freq => {
            const osc = this.context.createOscillator();
            const oscGain = this.context.createGain();
            
            osc.connect(oscGain);
            oscGain.connect(gainNode);
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.context.currentTime);
            oscGain.gain.setValueAtTime(0.2 / frequencies.length, this.context.currentTime);
            
            return osc;
        });
        
        gainNode.gain.setValueAtTime(0.3 * this.sfxVolume * this.masterVolume, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        return { oscillators, gainNode };
    }
    
    createJumpSound() {
        this.sounds.set('jump', () => {
            const tone = this.createTone(330, 0.1);
            if (tone) {
                tone.oscillator.start();
                tone.oscillator.stop(this.context.currentTime + 0.1);
            }
        });
        this.loadedSounds++;
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
        this.loadedSounds++;
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
        this.loadedSounds++;
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
        this.loadedSounds++;
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
        this.loadedSounds++;
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
        this.loadedSounds++;
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
        this.loadedSounds++;
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
        this.loadedSounds++;
    }
    
    // Enhanced bodybuilding-themed sounds
    createMuscleFlexSound() {
        this.sounds.set('muscle_flex', () => {
            // Satisfying "pump" sound with harmonic content
            const complex = this.createComplexTone([130, 260, 390], 0.6, 'triangle');
            if (complex) {
                complex.oscillators.forEach(osc => {
                    osc.start();
                    osc.stop(this.context.currentTime + 0.6);
                });
            }
        });
        this.loadedSounds++;
    }
    
    createProteinShakeSound() {
        this.sounds.set('protein_shake', () => {
            // Liquid mixing sound
            const noise = this.context.createBufferSource();
            const buffer = this.context.createBuffer(1, this.context.sampleRate * 0.3, this.context.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < data.length; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.1 * Math.sin(i * 0.01);
            }
            
            noise.buffer = buffer;
            
            const filter = this.context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, this.context.currentTime);
            
            const gain = this.context.createGain();
            gain.gain.setValueAtTime(0.3 * this.sfxVolume * this.masterVolume, this.context.currentTime);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.sfxGain || this.context.destination);
            
            noise.start();
            noise.stop(this.context.currentTime + 0.3);
        });
        this.loadedSounds++;
    }
    
    createWeightClankSound() {
        this.sounds.set('weight_clank', () => {
            // Metallic clank sound
            const tone1 = this.createTone(200, 0.1, 'triangle');
            const tone2 = this.createTone(150, 0.15, 'sawtooth');
            
            if (tone1 && tone2) {
                tone1.oscillator.start();
                tone1.oscillator.stop(this.context.currentTime + 0.1);
                
                tone2.oscillator.start(this.context.currentTime + 0.05);
                tone2.oscillator.stop(this.context.currentTime + 0.2);
            }
        });
        this.loadedSounds++;
    }
    
    createGruntSound() {
        this.sounds.set('grunt', () => {
            // Effort grunt sound
            const tone = this.createTone(120, 0.4, 'sawtooth');
            if (tone) {
                tone.oscillator.frequency.exponentialRampToValueAtTime(80, this.context.currentTime + 0.4);
                tone.gainNode.gain.setValueAtTime(0.2 * this.sfxVolume * this.masterVolume, this.context.currentTime);
                tone.oscillator.start();
                tone.oscillator.stop(this.context.currentTime + 0.4);
            }
        });
        this.loadedSounds++;
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
    
    playSoundWithPosition(name, x, y, listenerX, listenerY) {
        if (!this.spatialAudio) {
            this.playSound(name);
            return;
        }
        
        if (this.muted || !this.context) return;
        
        const distance = Math.sqrt((x - listenerX) ** 2 + (y - listenerY) ** 2);
        const maxDistance = 500; // pixels
        const volume = Math.max(0, 1 - (distance / maxDistance));
        
        if (volume > 0.01) {
            // Create a modified version of the sound with spatial properties
            const soundFn = this.sounds.get(name);
            if (soundFn) {
                try {
                    // For now, just adjust volume based on distance
                    const originalSfxVolume = this.sfxVolume;
                    this.sfxVolume *= volume;
                    soundFn();
                    this.sfxVolume = originalSfxVolume;
                } catch (e) {
                    console.warn('Failed to play positioned sound:', name, e);
                }
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
        } else if (name === 'menu') {
            this.playBackgroundLoop([330, 392, 440, 523], 1.2);
        }
    }
    
    playBackgroundLoop(notes, speed = 1.0) {
        if (!this.context) return;
        
        let noteIndex = 0;
        const playNote = () => {
            if (this.currentMusic && !this.muted) {
                const tone = this.createTone(notes[noteIndex], 0.5 / speed);
                if (tone) {
                    // Connect to music gain instead of direct output
                    tone.gainNode.disconnect();
                    tone.gainNode.connect(this.musicGain || this.context.destination);
                    tone.gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
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
        this.updateGainValues();
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.updateGainValues();
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.updateGainValues();
    }
    
    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopMusic();
        }
        return this.muted;
    }
    
    enableSpatialAudio(enabled = true) {
        this.spatialAudio = enabled;
    }
    
    // Initialize audio on first user interaction
    initialize() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }
    
    getLoadProgress() {
        return this.totalSounds > 0 ? this.loadedSounds / this.totalSounds : 1;
    }
    
    getStats() {
        return {
            context: this.context ? 'Available' : 'Not Available',
            state: this.context ? this.context.state : 'Unknown',
            loadedSounds: this.loadedSounds,
            totalSounds: this.totalSounds,
            spatialAudio: this.spatialAudio,
            masterVolume: this.masterVolume,
            sfxVolume: this.sfxVolume,
            musicVolume: this.musicVolume,
            muted: this.muted
        };
    }
}

// Export to global scope
window.AudioManager = AudioManager;