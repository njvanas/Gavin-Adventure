import React from 'react';

interface GameBackgroundProps {
  world: number;
}

const GameBackground: React.FC<GameBackgroundProps> = ({ world }) => {
  const getWorldTheme = () => {
    switch (world) {
      case 1: // Jungle Ruins
        return {
          skyGradient: 'from-green-900 via-emerald-800 to-green-700',
          mountainColor: '#2d5016',
          treeColor: '#1a3d0a',
          groundColor: '#8B4513',
          accentColor: '#228B22'
        };
      case 2: // Desert Wastelands
        return {
          skyGradient: 'from-orange-900 via-yellow-800 to-orange-700',
          mountainColor: '#8B4513',
          treeColor: '#DAA520',
          groundColor: '#CD853F',
          accentColor: '#DAA520'
        };
      case 3: // Snowy Mountains
        return {
          skyGradient: 'from-blue-900 via-cyan-800 to-blue-700',
          mountainColor: '#4682B4',
          treeColor: '#87CEEB',
          groundColor: '#F0F8FF',
          accentColor: '#87CEEB'
        };
      case 4: // Futuristic City
        return {
          skyGradient: 'from-purple-900 via-indigo-800 to-cyan-700',
          mountainColor: '#4B0082',
          treeColor: '#00FFFF',
          groundColor: '#2F4F4F',
          accentColor: '#00FFFF'
        };
      case 5: // Haunted Forest
        return {
          skyGradient: 'from-gray-900 via-purple-900 to-black',
          mountainColor: '#2F2F2F',
          treeColor: '#8B008B',
          groundColor: '#1C1C1C',
          accentColor: '#8B008B'
        };
      default:
        return {
          skyGradient: 'from-blue-900 via-purple-800 to-cyan-700',
          mountainColor: '#4a5568',
          treeColor: '#228B22',
          groundColor: '#8B4513',
          accentColor: '#228B22'
        };
    }
  };

  const theme = getWorldTheme();

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Sky gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.skyGradient}`}></div>
      
      {/* Stars */}
      <div className="absolute inset-0 opacity-60">
        <div className="w-full h-full bg-stars"></div>
      </div>
      
      {/* Far mountains */}
      <div className="absolute bottom-0 left-0 w-full h-full">
        <div 
          className="mountain-far"
          style={{ background: `linear-gradient(135deg, ${theme.mountainColor} 0%, ${theme.mountainColor}80 100%)` }}
        ></div>
      </div>
      
      {/* Medium mountains */}
      <div className="absolute bottom-0 left-0 w-full h-full">
        <div 
          className="mountain-medium"
          style={{ background: `linear-gradient(135deg, ${theme.mountainColor} 0%, ${theme.mountainColor}CC 100%)` }}
        ></div>
      </div>
      
      {/* Clouds */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="clouds-container">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
        </div>
      </div>
      
      {/* Near mountains */}
      <div className="absolute bottom-0 left-0 w-full h-full">
        <div 
          className="mountain-near"
          style={{ background: `linear-gradient(135deg, ${theme.mountainColor} 0%, ${theme.mountainColor}FF 100%)` }}
        ></div>
      </div>
      
      {/* World-specific decorations */}
      {world === 1 && (
        <div className="absolute bottom-32 left-0 w-full h-full">
          <div className="trees-container">
            <div className="tree tree-1" style={{ color: theme.treeColor }}></div>
            <div className="tree tree-2" style={{ color: theme.treeColor }}></div>
            <div className="tree tree-3" style={{ color: theme.treeColor }}></div>
          </div>
        </div>
      )}
      
      {world === 2 && (
        <div className="absolute bottom-32 left-0 w-full h-full">
          <div className="desert-dunes"></div>
        </div>
      )}
      
      {world === 3 && (
        <div className="absolute bottom-32 left-0 w-full h-full">
          <div className="snow-particles"></div>
        </div>
      )}
      
      {world === 4 && (
        <div className="absolute bottom-32 left-0 w-full h-full">
          <div className="cyber-grid"></div>
        </div>
      )}
      
      {world === 5 && (
        <div className="absolute bottom-32 left-0 w-full h-full">
          <div className="haunted-mist"></div>
        </div>
      )}
      
      {/* Ground layer */}
      <div className="absolute bottom-0 left-0 w-full h-32">
        <div 
          className="ground-surface"
          style={{ background: theme.accentColor }}
        ></div>
        <div 
          className="ground-base"
          style={{ background: `linear-gradient(to bottom, ${theme.groundColor} 0%, ${theme.groundColor}CC 100%)` }}
        ></div>
      </div>
    </div>
  );
};

export default GameBackground;