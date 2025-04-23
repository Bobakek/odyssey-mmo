import React from 'react';
import { useGame } from '../../context/GameContext';
import { Shield, LifeBuoy, Zap, Package, Crosshair } from 'lucide-react';

interface HUDProps {
  className?: string;
}

const HUD: React.FC<HUDProps> = ({ className = '' }) => {
  const { state } = useGame();
  const { player, inCombat } = state;
  const { ship } = player;
  
  // Calculate percentages for bars
  const hullPercentage = (ship.hull / ship.maxHull) * 100;
  const shieldPercentage = (ship.shield / ship.maxShield) * 100;
  const energyPercentage = (ship.energy / ship.maxEnergy) * 100;
  const cargoPercentage = (ship.cargo.used / ship.cargo.capacity) * 100;
  
  return (
    <div className={`${className} flex flex-col gap-2 p-3 text-gray-200 bg-gray-900/50 backdrop-blur-md rounded-md border border-cyan-900/50 min-w-[200px]`}>
      <div className="text-center font-bold text-cyan-300 mb-1">
        {ship.name} <span className="text-xs text-cyan-400">Lvl {ship.level}</span>
      </div>
      
      <div className="text-xs text-center bg-cyan-900/30 py-1 rounded mb-2">
        {ship.type.charAt(0).toUpperCase() + ship.type.slice(1)} Class
      </div>
      
      {/* Hull Status */}
      <div className="flex items-center gap-2">
        <LifeBuoy size={16} className="text-red-400" />
        <div className="flex-1">
          <div className="text-xs flex justify-between mb-1">
            <span>Hull</span>
            <span>{Math.round(ship.hull)}/{ship.maxHull}</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400"
              style={{ width: `${hullPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Shield Status */}
      <div className="flex items-center gap-2">
        <Shield size={16} className="text-blue-400" />
        <div className="flex-1">
          <div className="text-xs flex justify-between mb-1">
            <span>Shield</span>
            <span>{Math.round(ship.shield)}/{ship.maxShield}</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400" 
              style={{ width: `${shieldPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Energy Status */}
      <div className="flex items-center gap-2">
        <Zap size={16} className="text-yellow-400" />
        <div className="flex-1">
          <div className="text-xs flex justify-between mb-1">
            <span>Energy</span>
            <span>{Math.round(ship.energy)}/{ship.maxEnergy}</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400" 
              style={{ width: `${energyPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Cargo Status */}
      <div className="flex items-center gap-2">
        <Package size={16} className="text-green-400" />
        <div className="flex-1">
          <div className="text-xs flex justify-between mb-1">
            <span>Cargo</span>
            <span>{ship.cargo.used}/{ship.cargo.capacity}</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400" 
              style={{ width: `${cargoPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Credits */}
      <div className="mt-2 text-center font-bold text-yellow-300">
        Credits: {player.credits.toLocaleString()}
      </div>
      
      {/* Combat indicator */}
      {inCombat && (
        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-red-400 font-bold bg-red-900/30 py-1 px-2 rounded-md border border-red-700 animate-pulse">
          <Crosshair size={16} /> COMBAT ENGAGED
        </div>
      )}
    </div>
  );
};

export default HUD;