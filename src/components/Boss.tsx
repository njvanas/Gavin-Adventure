import React, { useState, useEffect } from 'react';

interface BossProps {
  bossId: number;
  playerAttackPower: number;
  onDefeat: () => void;
  onPlayerHit: () => void;
  onClose: () => void;
}

const Boss: React.FC<BossProps> = ({ bossId, playerAttackPower, onDefeat, onPlayerHit, onClose }) => {
  const [bossHealth, setBossHealth] = useState(200);
  const [bossMaxHealth, setBossMaxHealth] = useState(200);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleEnded, setBattleEnded] = useState(false);
  const [bossPhase, setBossPhase] = useState(1);
  const [bossAnimation, setBossAnimation] = useState('idle');
  const [screenShake, setScreenShake] = useState(false);

  const bosses = [
    { 
      name: "Jungle Guardian", 
      emoji: "🦍", 
      health: 200, 
      attack: 30,
      description: "A massive gorilla protecting the ancient ruins",
      attacks: ["Vine Whip", "Boulder Throw", "Ground Pound"],
      phase2Attacks: ["Jungle Rage", "Earthquake Slam", "Thorn Barrage"]
    },
    { 
      name: "Desert Pharaoh", 
      emoji: "🧙‍♂️", 
      health: 250, 
      attack: 35,
      description: "An ancient ruler with mystical sand powers",
      attacks: ["Sand Storm", "Mummy Curse", "Solar Beam"],
      phase2Attacks: ["Pyramid Collapse", "Sandstorm Fury", "Ancient Wrath"]
    },
    { 
      name: "Ice King", 
      emoji: "❄️", 
      health: 300, 
      attack: 40,
      description: "Ruler of the frozen peaks with ice magic",
      attacks: ["Ice Shard", "Blizzard", "Frozen Spear"],
      phase2Attacks: ["Absolute Zero", "Ice Age", "Glacier Crush"]
    },
    { 
      name: "Cyber Overlord", 
      emoji: "🤖", 
      health: 350, 
      attack: 45,
      description: "AI ruler of the futuristic city",
      attacks: ["Laser Beam", "EMP Blast", "Drone Strike"],
      phase2Attacks: ["System Override", "Nuclear Pulse", "Digital Apocalypse"]
    },
    { 
      name: "Shadow Lord", 
      emoji: "👹", 
      health: 400, 
      attack: 50,
      description: "The ultimate evil lurking in the haunted forest",
      attacks: ["Dark Bolt", "Soul Drain", "Shadow Clone"],
      phase2Attacks: ["Nightmare Realm", "Void Consume", "Final Darkness"]
    }
  ];

  const currentBoss = bosses[bossId - 1];

  useEffect(() => {
    const initialHealth = currentBoss.health + (bossId - 1) * 50;
    setBossHealth(initialHealth);
    setBossMaxHealth(initialHealth);
    setBattleLog([`💥 Epic Boss Battle! Face the ${currentBoss.name}!`]);
  }, [currentBoss, bossId]);

  useEffect(() => {
    // Check for phase 2 transition
    if (bossHealth <= bossMaxHealth * 0.4 && bossPhase === 1) {
      setBossPhase(2);
      setBattleLog(prev => [...prev, `🔥 ${currentBoss.name} enters Phase 2! The battle intensifies!`]);
      setBossAnimation('transform');
      setTimeout(() => setBossAnimation('idle'), 2000);
    }
  }, [bossHealth, bossMaxHealth, bossPhase, currentBoss.name]);

  useEffect(() => {
    if (!battleEnded && !isPlayerTurn && bossHealth > 0 && playerHealth > 0) {
      const timer = setTimeout(() => {
        bossTurn();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, battleEnded, bossHealth, playerHealth]);

  const playerAttack = () => {
    if (!isPlayerTurn || battleEnded) return;

    setBossAnimation('hurt');
    setTimeout(() => setBossAnimation('idle'), 500);

    const damage = Math.floor(playerAttackPower * (0.8 + Math.random() * 0.4));
    const newBossHealth = Math.max(0, bossHealth - damage);
    setBossHealth(newBossHealth);
    
    setBattleLog(prev => [...prev, `⚔️ You deal ${damage} damage to ${currentBoss.name}!`]);

    if (newBossHealth <= 0) {
      setBattleLog(prev => [...prev, `🎉 Victory! ${currentBoss.name} is defeated!`]);
      setBattleEnded(true);
      setBossAnimation('defeat');
      setTimeout(() => {
        onDefeat();
      }, 3000);
    } else {
      setIsPlayerTurn(false);
    }
  };

  const bossTurn = () => {
    setBossAnimation('attack');
    setScreenShake(true);
    setTimeout(() => {
      setScreenShake(false);
      setBossAnimation('idle');
    }, 1000);

    const attacks = bossPhase === 1 ? currentBoss.attacks : currentBoss.phase2Attacks;
    const attackName = attacks[Math.floor(Math.random() * attacks.length)];
    const baseDamage = currentBoss.attack + (bossPhase === 2 ? 15 : 0);
    const damage = Math.floor(baseDamage * (0.7 + Math.random() * 0.6));
    
    const newPlayerHealth = Math.max(0, playerHealth - damage);
    setPlayerHealth(newPlayerHealth);
    
    setBattleLog(prev => [...prev, `${currentBoss.emoji} ${currentBoss.name} uses ${attackName} for ${damage} damage!`]);

    if (newPlayerHealth <= 0) {
      setBattleLog(prev => [...prev, `💀 Defeat! You need more power to face this boss!`]);
      setBattleEnded(true);
      onPlayerHit();
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      if (Math.random() < 0.3) {
        onPlayerHit(); // 30% chance to reduce player attack power
        setBattleLog(prev => [...prev, `⚠️ Your attack power is weakened by the boss's presence!`]);
      }
      setIsPlayerTurn(true);
    }
  };

  return (
    <div className={`fixed inset-0 z-60 flex items-center justify-center bg-black/95 ${screenShake ? 'animate-pulse' : ''}`}>
      <div className="bg-black/95 border-4 border-red-400 rounded-lg p-8 max-w-6xl w-full mx-4">
        {/* Boss Battle Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-red-400 pixel-font mb-2 animate-pulse">
            ⚔️ BOSS BATTLE ⚔️
          </h2>
          <div className="text-2xl pixel-font text-white mb-2">
            {currentBoss.name}
          </div>
          <div className="text-sm pixel-font text-gray-400">
            {currentBoss.description}
          </div>
          <div className="text-lg pixel-font text-yellow-400 mt-2">
            Phase {bossPhase}/2
          </div>
        </div>

        {/* Battle Arena */}
        <div className="grid grid-cols-2 gap-12 mb-6">
          {/* Player Side */}
          <div className="text-center">
            <div className="text-6xl mb-4">🦸‍♂️</div>
            <div className="pixel-font text-lg text-blue-400 mb-3">HERO</div>
            <div className="bg-gray-700 rounded-full h-6 border-2 border-gray-500 mb-2">
              <div 
                className="bg-green-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${playerHealth}%` }}
              ></div>
            </div>
            <div className="pixel-font text-sm text-white mb-2">
              HP: {playerHealth}/100
            </div>
            <div className="pixel-font text-sm text-yellow-400">
              Attack Power: {playerAttackPower}
            </div>
          </div>

          {/* Boss Side */}
          <div className="text-center">
            <div 
              className={`text-8xl mb-4 transition-all duration-300 ${
                bossAnimation === 'hurt' ? 'animate-bounce text-red-300' :
                bossAnimation === 'attack' ? 'animate-pulse scale-110' :
                bossAnimation === 'transform' ? 'animate-spin scale-125' :
                bossAnimation === 'defeat' ? 'animate-bounce opacity-50' :
                'animate-pulse'
              }`}
            >
              {currentBoss.emoji}
            </div>
            <div className={`pixel-font text-lg mb-3 ${bossPhase === 2 ? 'text-red-300 animate-pulse' : 'text-red-400'}`}>
              {currentBoss.name}
            </div>
            <div className="bg-gray-700 rounded-full h-6 border-2 border-gray-500 mb-2">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  bossPhase === 2 ? 'bg-red-600' : 'bg-red-500'
                }`}
                style={{ width: `${(bossHealth / bossMaxHealth) * 100}%` }}
              ></div>
            </div>
            <div className="pixel-font text-sm text-white mb-2">
              HP: {bossHealth}/{bossMaxHealth}
            </div>
            <div className="pixel-font text-sm text-red-400">
              Attack: {currentBoss.attack + (bossPhase === 2 ? 15 : 0)}
            </div>
          </div>
        </div>

        {/* Phase Indicator */}
        {bossPhase === 2 && (
          <div className="text-center mb-4">
            <div className="bg-red-900/50 border-2 border-red-400 rounded-lg p-3">
              <div className="pixel-font text-red-300 text-lg animate-pulse">
                🔥 PHASE 2: ULTIMATE POWER UNLEASHED! 🔥
              </div>
            </div>
          </div>
        )}

        {/* Battle Log */}
        <div className="bg-gray-900 border-2 border-gray-600 rounded-lg p-4 h-40 overflow-y-auto mb-6">
          {battleLog.map((log, index) => (
            <div key={index} className="pixel-font text-xs text-white mb-1 animate-fadeIn">
              {log}
            </div>
          ))}
        </div>

        {/* Battle Actions */}
        <div className="flex justify-center space-x-6">
          {!battleEnded ? (
            <>
              <button
                onClick={playerAttack}
                disabled={!isPlayerTurn}
                className={`px-8 py-4 rounded pixel-font text-lg border-2 transition-all duration-200 ${
                  isPlayerTurn
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-400 hover:scale-105 hover:shadow-lg hover:shadow-green-400/50'
                    : 'bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed'
                }`}
              >
                ⚔️ ATTACK
              </button>
              <button
                onClick={onClose}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 rounded pixel-font text-lg border-2 border-yellow-400 hover:scale-105 transition-all duration-200"
              >
                🏃 RETREAT
              </button>
            </>
          ) : (
            <button
              onClick={playerHealth > 0 ? onDefeat : onClose}
              className={`px-12 py-4 rounded pixel-font text-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                playerHealth > 0
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-400 hover:shadow-lg hover:shadow-green-400/50'
                  : 'bg-red-600 hover:bg-red-700 text-white border-red-400'
              }`}
            >
              {playerHealth > 0 ? '🎉 CLAIM VICTORY' : '💀 TRY AGAIN'}
            </button>
          )}
        </div>

        {/* Boss Tips */}
        <div className="mt-6 text-center">
          <div className="pixel-font text-xs text-gray-400">
            💡 Tip: Hit the boss to double your attack power! Avoid getting hit to maintain your strength!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boss;