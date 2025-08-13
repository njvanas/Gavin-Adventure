// Save System using localStorage
class SaveManager {
    constructor() {
        this.saveKey = 'gavin_adventure_save';
        this.defaultSave = {
            version: '1.0.0',
            highestWorld: 1,
            highestLevel: 1,
            totalScore: 0,
            lives: 3,
            settings: {
                masterVolume: 0.7,
                sfxVolume: 0.8,
                musicVolume: 0.6,
                muted: false,
                controls: {
                    left: 'ArrowLeft',
                    right: 'ArrowRight',
                    down: 'ArrowDown',
                    jump: 'Space',
                    run: 'KeyX',
                    throw: 'KeyC',
                    pause: 'Escape'
                }
            },
            progress: {
                worldsCompleted: [],
                secretsFound: {},
                bestTimes: {},
                achievements: []
            },
            stats: {
                totalPlayTime: 0,
                enemiesDefeated: 0,
                coinsCollected: 0,
                secretsFound: 0,
                deaths: 0,
                jumps: 0
            }
        };
    }
    
    load() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (saveData) {
                const parsed = JSON.parse(saveData);
                return this.mergeWithDefault(parsed);
            }
        } catch (error) {
            console.warn('Failed to load save data:', error);
        }
        
        return { ...this.defaultSave };
    }
    
    save(saveData) {
        try {
            saveData.lastSaved = Date.now();
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Failed to save game data:', error);
            return false;
        }
    }
    
    mergeWithDefault(saveData) {
        const merged = { ...this.defaultSave };
        
        Object.keys(saveData).forEach(key => {
            if (typeof saveData[key] === 'object' && saveData[key] !== null && !Array.isArray(saveData[key])) {
                merged[key] = { ...merged[key], ...saveData[key] };
            } else {
                merged[key] = saveData[key];
            }
        });
        
        return merged;
    }
    
    unlockLevel(world, level) {
        const saveData = this.load();
        
        if (world > saveData.highestWorld || 
            (world === saveData.highestWorld && level > saveData.highestLevel)) {
            saveData.highestWorld = world;
            saveData.highestLevel = level;
            this.save(saveData);
        }
    }
    
    saveProgress(world, level, score, time, secretsFound = []) {
        const saveData = this.load();
        
        saveData.totalScore = Math.max(saveData.totalScore, score);
        
        const levelKey = `${world}-${level}`;
        if (!saveData.progress.bestTimes[levelKey] || time < saveData.progress.bestTimes[levelKey]) {
            saveData.progress.bestTimes[levelKey] = time;
        }
        
        if (secretsFound.length > 0) {
            if (!saveData.progress.secretsFound[levelKey]) {
                saveData.progress.secretsFound[levelKey] = [];
            }
            
            secretsFound.forEach(secret => {
                if (!saveData.progress.secretsFound[levelKey].includes(secret)) {
                    saveData.progress.secretsFound[levelKey].push(secret);
                }
            });
        }
        
        this.save(saveData);
    }
    
    updateStats(stats) {
        const saveData = this.load();
        Object.keys(stats).forEach(key => {
            if (saveData.stats.hasOwnProperty(key)) {
                saveData.stats[key] += stats[key];
            }
        });
        this.save(saveData);
    }
    
    getSaveData() {
        return this.load();
    }
    
    deleteSave() {
        localStorage.removeItem(this.saveKey);
    }
    
    exportSave() {
        const saveData = this.load();
        return btoa(JSON.stringify(saveData));
    }
    
    importSave(data) {
        try {
            const saveData = JSON.parse(atob(data));
            this.save(saveData);
            return true;
        } catch (error) {
            console.error('Failed to import save:', error);
            return false;
        }
    }
}

window.SaveManager = SaveManager;