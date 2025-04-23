import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Ship } from '../../types';
import { Shield, Crosshair, Zap, AlertOctagon } from 'lucide-react';

const CombatView: React.FC = () => {
  const { state, dispatch } = useGame();
  const { player, enemies } = state;
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<Ship | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  // Handle weapon firing
  const handleWeaponFire = (weaponId: string, target: Ship) => {
    const weapon = player.ship.weapons.find(w => w.id === weaponId);
    if (!weapon || cooldowns[weaponId] > 0) return;

    // Calculate hit chance (based on distance, ship computer, etc)
    const hitChance = 0.8; // Base hit chance, can be modified by equipment
    const hit = Math.random() < hitChance;

    if (hit) {
      // Apply damage
      dispatch({
        type: 'DAMAGE_ENEMY',
        payload: {
          enemyId: target.id,
          amount: weapon.damage
        }
      });

      // Add combat notification
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: `Direct hit on ${target.name} for ${weapon.damage} damage!`,
          type: 'success'
        }
      });
    } else {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: `Missed shot at ${target.name}!`,
          type: 'warning'
        }
      });
    }

    // Set cooldown
    setCooldowns(prev => ({
      ...prev,
      [weaponId]: weapon.cooldown
    }));
  };

  // Handle cooldowns
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldowns(prev => {
        const newCooldowns: Record<string, number> = {};
        let hasChanges = false;

        Object.entries(prev).forEach(([id, time]) => {
          if (time > 0) {
            newCooldowns[id] = time - 0.1;
            hasChanges = true;
          }
        });

        return hasChanges ? newCooldowns : prev;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Enemy AI
  useEffect(() => {
    if (!enemies || enemies.length === 0) return;

    const aiTimer = setInterval(() => {
      enemies.forEach(enemy => {
        if (enemy.hull <= 0) return;

        // Simple AI: randomly choose to attack
        if (Math.random() < 0.3) {
          const damage = enemy.weapons[0]?.damage || 5;
          
          dispatch({
            type: 'DAMAGE_SHIP',
            payload: { amount: damage }
          });

          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              message: `${enemy.name} hits you for ${damage} damage!`,
              type: 'danger'
            }
          });
        }
      });
    }, 2000);

    return () => clearInterval(aiTimer);
  }, [enemies, dispatch]);

  if (!state.inCombat || !enemies) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-4xl bg-gray-900/90 rounded-lg border border-red-900/50 p-4">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
              <AlertOctagon className="animate-pulse" />
              Combat Engaged
            </h2>
            <p className="text-sm text-gray-400">
              {enemies.length} hostile {enemies.length === 1 ? 'ship' : 'ships'} detected
            </p>
          </div>
        </div>

        {/* Combat Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Player Ship */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-900/30">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3">{player.ship.name}</h3>
            
            {/* Ship Status */}
            <div className="space-y-2 mb-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Hull</span>
                  <span>{Math.round(player.ship.hull)}/{player.ship.maxHull}</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-400"
                    style={{ width: `${(player.ship.hull / player.ship.maxHull) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Shields</span>
                  <span>{Math.round(player.ship.shield)}/{player.ship.maxShield}</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                    style={{ width: `${(player.ship.shield / player.ship.maxShield) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Weapons */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Weapons</h4>
              {player.ship.weapons.map(weapon => (
                <button
                  key={weapon.id}
                  className={`w-full p-2 rounded border transition-colors ${
                    selectedWeapon === weapon.id
                      ? 'bg-cyan-900/50 border-cyan-700/50 text-cyan-300'
                      : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50'
                  }`}
                  onClick={() => setSelectedWeapon(weapon.id)}
                  disabled={cooldowns[weapon.id] > 0}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{weapon.name}</span>
                    {cooldowns[weapon.id] > 0 && (
                      <span className="text-xs text-gray-400">
                        {cooldowns[weapon.id].toFixed(1)}s
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Damage: {weapon.damage} • Range: {weapon.range}m
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Enemy Ships */}
          <div className="space-y-4">
            {enemies.map(enemy => (
              <div 
                key={enemy.id}
                className={`bg-gray-800/50 rounded-lg p-4 border transition-colors ${
                  selectedTarget?.id === enemy.id
                    ? 'border-red-700/50 bg-red-900/20'
                    : 'border-gray-700/30'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-red-400">{enemy.name}</h4>
                  <button
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      selectedTarget?.id === enemy.id && selectedWeapon
                        ? 'bg-red-900/50 text-red-300 border border-red-800/50 hover:bg-red-900/70'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-800/70'
                    }`}
                    onClick={() => {
                      setSelectedTarget(enemy);
                      if (selectedWeapon) {
                        handleWeaponFire(selectedWeapon, enemy);
                      }
                    }}
                    disabled={!selectedWeapon || enemy.hull <= 0}
                  >
                    <div className="flex items-center gap-1">
                      <Crosshair size={14} />
                      {selectedTarget?.id === enemy.id && selectedWeapon ? 'Fire!' : 'Target'}
                    </div>
                  </button>
                </div>

                {/* Enemy Status */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Hull</span>
                      <span>{Math.round(enemy.hull)}/{enemy.maxHull}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-600 to-red-400"
                        style={{ width: `${(enemy.hull / enemy.maxHull) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Shields</span>
                      <span>{Math.round(enemy.shield)}/{enemy.maxShield}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                        style={{ width: `${(enemy.shield / enemy.maxShield) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 mt-2">
                    Threat Level: {enemy.level} • Type: {enemy.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Combat Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button 
            className="px-4 py-2 bg-yellow-900/40 hover:bg-yellow-900/60 text-yellow-300 rounded border border-yellow-800/50"
            onClick={() => {
              // Add escape logic here
              dispatch({ type: 'END_COMBAT' });
              dispatch({
                type: 'ADD_NOTIFICATION',
                payload: {
                  message: 'Successfully escaped from combat!',
                  type: 'warning'
                }
              });
            }}
          >
            Attempt Escape
          </button>
        </div>
      </div>
    </div>
  );
};

export default CombatView;