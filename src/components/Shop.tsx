import React from 'react';
import { GameState } from '../App';

interface ShopProps {
  gameState: GameState;
  onBuyChicken: (amount: number) => void;
  onClose: () => void;
}

const Shop: React.FC<ShopProps> = ({ gameState, onBuyChicken, onClose }) => {
  const shopItems = [
    { amount: 1, cost: 50, strength: 5, name: "Chicken Breast" },
    { amount: 5, cost: 200, strength: 25, name: "Chicken Pack" },
    { amount: 10, cost: 350, strength: 50, name: "Chicken Feast" },
    { amount: 25, cost: 750, strength: 125, name: "Chicken Mountain" }
  ];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80">
      <div className="bg-black/95 border-4 border-green-400 rounded-lg p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-400 pixel-font">
            🏪 GAVIN'S PROTEIN SHOP
          </h2>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-300 pixel-font text-xl"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-6 text-center">
          <div className="text-yellow-400 pixel-font text-lg mb-2">
            💰 Your Coins: {gameState.coins}
          </div>
          <div className="text-orange-400 pixel-font text-sm">
            🍗 Current Chicken: {gameState.chicken} | 💪 Current Strength: {gameState.strength}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shopItems.map((item, index) => {
            const canAfford = gameState.coins >= item.cost;
            
            return (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                  canAfford 
                    ? 'border-green-400 bg-green-900/20 hover:bg-green-800/30' 
                    : 'border-gray-600 bg-gray-900/20'
                }`}
              >
                <div className="text-center mb-3">
                  <div className="text-2xl mb-2">🍗</div>
                  <div className="pixel-font text-lg text-white mb-1">
                    {item.name}
                  </div>
                  <div className="pixel-font text-sm text-gray-300">
                    {item.amount} Chicken • +{item.strength} Strength
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="pixel-font text-yellow-400 mb-3">
                    💰 {item.cost} Coins
                  </div>
                  
                  <button
                    onClick={() => onBuyChicken(item.amount)}
                    disabled={!canAfford}
                    className={`w-full py-2 px-4 rounded pixel-font text-sm border-2 transition-all duration-200 ${
                      canAfford
                        ? 'bg-green-600 hover:bg-green-700 text-white border-green-400 hover:scale-105'
                        : 'bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'BUY NOW' : 'NOT ENOUGH COINS'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 text-center">
          <div className="pixel-font text-xs text-gray-400">
            💡 Tip: More chicken = More strength = Defeat stronger bosses!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;