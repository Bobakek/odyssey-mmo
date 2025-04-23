import React from 'react';
import { useGame } from '../../context/GameContext';
import { Shield, Zap, Compass, Target, Hammer } from 'lucide-react';

const ShipStatus: React.FC = () => {
  const { state } = useGame();
  const { ship } = state.player;
  
  return (
    <div className="bg-gray-900/70 backdrop-blur-md rounded-md border border-gray-700/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-cyan-300">{ship.name}</h2>
        <div className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded border border-blue-800/50">
          {ship.type.charAt(0).toUpperCase() + ship.type.slice(1)} Class
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 border-b border-gray-700/50 pb-1">Equipment</h3>
          
          {ship.equipment.map(item => {
            // Choose icon based on equipment type
            let icon;
            let colorClass;
            
            switch (item.type) {
              case 'shield':
                icon = <Shield size={14} />;
                colorClass = 'text-blue-400';
                break;
              case 'engine':
                icon = <Compass size={14} />;
                colorClass = 'text-yellow-400';
                break;
              case 'scanner':
                icon = <Target size={14} />;
                colorClass = 'text-green-400';
                break;
              case 'drill':
                icon = <Hammer size={14} />;
                colorClass = 'text-orange-400';
                break;
              case 'computer':
                icon = <Zap size={14} />;
                colorClass = 'text-purple-400';
                break;
              default:
                icon = <Zap size={14} />;
                colorClass = 'text-gray-400';
            }
            
            return (
              <div key={item.id} className="bg-gray-800/50 rounded border border-gray-700/30 p-2">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1">
                    <span className={colorClass}>{icon}</span>
                    <span className="text-xs font-medium text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">Lvl {item.level}</span>
                </div>
                
                <div className="text-xs text-gray-400 flex justify-between">
                  <span>{item.effect.property}: +{item.effect.value}</span>
                  <span>Energy: {item.energyUsage}/s</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Right column */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 border-b border-gray-700/50 pb-1">Weapons</h3>
          
          {ship.weapons.map(weapon => {
            // Weapon type colors
            let colorClass;
            switch (weapon.type) {
              case 'laser':
                colorClass = 'text-red-400';
                break;
              case 'missile':
                colorClass = 'text-orange-400';
                break;
              case 'projectile':
                colorClass = 'text-yellow-400';
                break;
              case 'beam':
                colorClass = 'text-cyan-400';
                break;
              default:
                colorClass = 'text-gray-400';
            }
            
            return (
              <div key={weapon.id} className="bg-gray-800/50 rounded border border-gray-700/30 p-2">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-medium ${colorClass}`}>{weapon.name}</span>
                  <span className="text-xs text-gray-400">Lvl {weapon.level}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                  <div>Damage: {weapon.damage}</div>
                  <div>Range: {weapon.range}m</div>
                  <div>Energy: {weapon.energyUsage}</div>
                  <div>Cooldown: {weapon.cooldown}s</div>
                </div>
              </div>
            );
          })}
          
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-300 border-b border-gray-700/50 pb-1 mb-2">Ship Stats</h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-800/30 p-2 rounded">
                <span className="text-gray-400">Level:</span>
                <span className="float-right text-gray-200">{ship.level}</span>
              </div>
              
              <div className="bg-gray-800/30 p-2 rounded">
                <span className="text-gray-400">Experience:</span>
                <span className="float-right text-gray-200">{ship.experience}</span>
              </div>
              
              <div className="bg-gray-800/30 p-2 rounded">
                <span className="text-gray-400">Hull:</span>
                <span className="float-right text-gray-200">{ship.hull}/{ship.maxHull}</span>
              </div>
              
              <div className="bg-gray-800/30 p-2 rounded">
                <span className="text-gray-400">Shield:</span>
                <span className="float-right text-gray-200">{ship.shield}/{ship.maxShield}</span>
              </div>
              
              <div className="bg-gray-800/30 p-2 rounded col-span-2">
                <span className="text-gray-400">Cargo:</span>
                <span className="float-right text-gray-200">{ship.cargo.used}/{ship.cargo.capacity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipStatus;