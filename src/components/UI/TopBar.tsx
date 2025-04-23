import React from 'react';
import { useGame } from '../../context/GameContext';
import { Navigation, Rocket, MapPin, AlertCircle } from 'lucide-react';

const TopBar: React.FC = () => {
  const { state } = useGame();
  const { player, currentSystem } = state;
  
  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-gray-900/80 backdrop-blur-md border-b border-cyan-900/50 flex items-center px-4 text-gray-200 z-10">
      <div className="flex items-center gap-1 text-lg font-semibold text-cyan-300">
        <Rocket size={20} className="text-cyan-400" />
        <span>Cosmic Odyssey</span>
      </div>
      
      <div className="flex-1"></div>
      
      {currentSystem && (
        <div className="flex items-center gap-2 mx-4">
          <MapPin size={16} className="text-cyan-400" />
          <span className="text-sm">{currentSystem.name} System</span>
          
          {currentSystem.faction && (
            <span className="text-xs py-0.5 px-2 rounded bg-gray-800/50 border border-gray-700/50">
              {currentSystem.faction.charAt(0).toUpperCase() + currentSystem.faction.slice(1)} Space
            </span>
          )}
          
          {currentSystem.dangerLevel > 7 && (
            <span className="text-xs py-0.5 px-2 rounded bg-red-900/50 border border-red-700/50 flex items-center gap-1">
              <AlertCircle size={12} />
              High Danger
            </span>
          )}
        </div>
      )}
      
      <div className="flex-1"></div>
      
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="text-xs text-gray-400">Location:</span> {player.location.locationType.charAt(0).toUpperCase() + player.location.locationType.slice(1)}
        </div>
        
        <div className="text-sm">
          <span className="text-xs text-gray-400">Coordinates:</span> {Math.round(player.location.position.x)}, {Math.round(player.location.position.y)}
        </div>
        
        <div className="w-px h-8 bg-gray-700 mx-2"></div>
        
        <button className="flex items-center gap-1 py-1 px-3 bg-blue-900/30 hover:bg-blue-900/50 transition-colors rounded border border-blue-800/50 text-sm">
          <Navigation size={14} />
          <span>Navigation</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;