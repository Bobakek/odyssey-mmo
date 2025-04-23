import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import GalaxyMap from '../components/galaxy/GalaxyMap';
import ShipStatus from '../components/ship/ShipStatus';
import StationView from '../components/stations/StationView';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/UI/Tabs';
import { StarSystem } from '../types';
import { MapPin, Ship, Map, Navigation, User, Settings, AlertCircle } from 'lucide-react';

const MainView: React.FC = () => {
  const { state, dispatch } = useGame();
  const { player, currentSystem } = state;
  const [selectedTab, setSelectedTab] = useState('galaxy');
  const [selectedSystem, setSelectedSystem] = useState<StarSystem | null>(null);
  const [showStationView, setShowStationView] = useState(false);
  
  // Set current system as selected system initially
  useEffect(() => {
    if (currentSystem && !selectedSystem) {
      setSelectedSystem(currentSystem);
    }
  }, [currentSystem, selectedSystem]);
  
  // Enter system when selected
  useEffect(() => {
    if (selectedSystem && selectedSystem.id !== player.location.systemId) {
      dispatch({
        type: 'ENTER_SYSTEM',
        payload: { systemId: selectedSystem.id }
      });
      
      // Add notification about system entry
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: `Entering ${selectedSystem.name} system.`,
          type: 'info'
        }
      });
    }
  }, [selectedSystem, dispatch, player.location.systemId]);
  
  // Handle system selection from galaxy map
  const handleSystemSelect = (system: StarSystem) => {
    setSelectedSystem(system);
  };
  
  // Find current station if docked
  const currentStation = player.location.locationType === 'station' && currentSystem
    ? currentSystem.stations.find(s => s.id === player.location.locationId)
    : null;
  
  // Handle docking at a station
  const handleDockStation = (stationId: string) => {
    dispatch({
      type: 'DOCK_AT_STATION',
      payload: { stationId }
    });
    
    // Add notification about docking
    const station = currentSystem?.stations.find(s => s.id === stationId);
    if (station) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: `Docked at ${station.name}.`,
          type: 'success'
        }
      });
    }
    
    setShowStationView(true);
  };
  
  return (
    <div className="flex flex-col flex-grow h-full">
      {/* Main tabs navigation */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-grow flex flex-col h-full">
        <TabsList className="mb-2 bg-gray-900/70 backdrop-blur-md rounded-md p-1 border border-gray-700/50">
          <TabsTrigger value="galaxy" className="flex items-center gap-1">
            <Map size={14} />
            <span className="hidden sm:inline">Galaxy</span>
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center gap-1">
            <Navigation size={14} />
            <span className="hidden sm:inline">Navigation</span>
          </TabsTrigger>
          <TabsTrigger value="ship" className="flex items-center gap-1">
            <Ship size={14} />
            <span className="hidden sm:inline">Ship</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-1">
            <User size={14} />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings size={14} />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-grow overflow-hidden flex flex-col">
          {/* Galaxy Map Tab */}
          <TabsContent value="galaxy" className="flex-grow h-full overflow-hidden">
            <GalaxyMap onSystemSelect={handleSystemSelect} />
          </TabsContent>
          
          {/* Navigation Tab */}
          <TabsContent value="navigation" className="h-full overflow-auto">
            {currentSystem && (
              <div className="grid md:grid-cols-2 gap-4 h-full">
                <div className="bg-gray-900/70 backdrop-blur-md rounded-md border border-gray-700/50 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin size={16} className="text-cyan-400" />
                    <h2 className="text-lg font-bold text-cyan-300">{currentSystem.name} System</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-800/50 p-3 rounded-md">
                      <span className="text-xs text-gray-400">Faction</span>
                      <div className="text-sm font-medium">
                        {currentSystem.faction
                          ? currentSystem.faction.charAt(0).toUpperCase() + currentSystem.faction.slice(1)
                          : 'Unclaimed Space'}
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-3 rounded-md">
                      <span className="text-xs text-gray-400">Danger Level</span>
                      <div className={`text-sm font-medium ${
                        currentSystem.dangerLevel > 7 ? 'text-red-400' :
                        currentSystem.dangerLevel > 4 ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {currentSystem.dangerLevel}/10
                        {currentSystem.dangerLevel > 7 && (
                          <span className="inline-flex items-center ml-1">
                            <AlertCircle size={12} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Planets</h3>
                  <div className="space-y-2 mb-4 max-h-32 overflow-y-auto pr-1">
                    {currentSystem.planets.length === 0 ? (
                      <div className="text-xs text-gray-500 italic">No planets detected</div>
                    ) : (
                      currentSystem.planets.map(planet => (
                        <div key={planet.id} className="flex items-center justify-between bg-gray-800/30 p-2 rounded-md">
                          <div>
                            <div className="text-sm font-medium">{planet.name}</div>
                            <div className="text-xs text-gray-400">{planet.type.charAt(0).toUpperCase() + planet.type.slice(1)}</div>
                          </div>
                          <button className="text-xs px-2 py-1 bg-blue-900/30 hover:bg-blue-900/50 transition-colors rounded border border-blue-800/30">
                            Explore
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Stations</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                    {currentSystem.stations.length === 0 ? (
                      <div className="text-xs text-gray-500 italic">No stations detected</div>
                    ) : (
                      currentSystem.stations.map(station => (
                        <div key={station.id} className="flex items-center justify-between bg-gray-800/30 p-2 rounded-md">
                          <div>
                            <div className="text-sm font-medium">{station.name}</div>
                            <div className="text-xs text-gray-400">
                              {station.type.charAt(0).toUpperCase() + station.type.slice(1)} - {station.faction}
                            </div>
                          </div>
                          <button 
                            className="text-xs px-2 py-1 bg-cyan-900/30 hover:bg-cyan-900/50 transition-colors rounded border border-cyan-800/30"
                            onClick={() => handleDockStation(station.id)}
                          >
                            Dock
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-900/70 backdrop-blur-md rounded-md border border-gray-700/50 p-4 overflow-y-auto">
                  <h2 className="text-lg font-bold text-cyan-300 mb-4">Available Missions</h2>
                  
                  {currentSystem.missions.length === 0 ? (
                    <div className="text-sm text-gray-400 italic">No missions available in this system</div>
                  ) : (
                    <div className="space-y-3">
                      {currentSystem.missions.map(mission => (
                        <div key={mission.id} className="bg-gray-800/50 rounded-md border border-gray-700/30 p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-md font-semibold">{mission.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              mission.type === 'combat' ? 'bg-red-900/50 text-red-300 border border-red-800/30' :
                              mission.type === 'delivery' ? 'bg-blue-900/50 text-blue-300 border border-blue-800/30' :
                              mission.type === 'exploration' ? 'bg-purple-900/50 text-purple-300 border border-purple-800/30' :
                              'bg-green-900/50 text-green-300 border border-green-800/30'
                            }`}>
                              {mission.type.charAt(0).toUpperCase() + mission.type.slice(1)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-300 mb-3">{mission.description}</p>
                          
                          <div className="text-xs text-gray-400 mb-2">
                            <span className="font-medium">Reward:</span> {mission.reward.credits} credits, {mission.reward.experience} XP
                            {mission.reward.items && mission.reward.items.length > 0 && (
                              <span> + {mission.reward.items.length} items</span>
                            )}
                          </div>
                          
                          {mission.requirements && (
                            <div className="text-xs text-gray-400 mb-3">
                              <span className="font-medium">Requirements:</span>
                              {mission.requirements.minLevel && <span> Level {mission.requirements.minLevel}+</span>}
                              {mission.requirements.reputation && (
                                <span> {mission.requirements.reputation.faction} reputation {mission.requirements.reputation.min}+</span>
                              )}
                            </div>
                          )}
                          
                          <button className="w-full text-sm px-3 py-1.5 bg-cyan-900/40 hover:bg-cyan-900/60 transition-colors rounded border border-cyan-800/50">
                            Accept Mission
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Ship Tab */}
          <TabsContent value="ship" className="h-full overflow-auto">
            <ShipStatus />
          </TabsContent>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="h-full overflow-auto">
            <div className="bg-gray-900/70 backdrop-blur-md rounded-md border border-gray-700/50 p-4">
              <h2 className="text-lg font-bold text-cyan-300 mb-4">Commander Profile</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-md border border-gray-700/30 p-4">
                  <h3 className="text-md font-semibold mb-3">Pilot Information</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Name:</span>
                      <span className="text-sm font-medium">{player.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Ship:</span>
                      <span className="text-sm font-medium">{player.ship.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Credits:</span>
                      <span className="text-sm font-medium text-yellow-300">{player.credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Discovered Systems:</span>
                      <span className="text-sm font-medium">{player.discoveredSystems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Research Points:</span>
                      <span className="text-sm font-medium text-cyan-300">{player.researchPoints}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-md border border-gray-700/30 p-4">
                  <h3 className="text-md font-semibold mb-3">Faction Reputation</h3>
                  
                  <div className="space-y-3">
                    {Object.entries(player.reputation).map(([faction, value]) => (
                      <div key={faction}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{faction.charAt(0).toUpperCase() + faction.slice(1)}</span>
                          <span className={`text-xs ${
                            value > 50 ? 'text-green-400' :
                            value > 0 ? 'text-blue-400' :
                            value < -50 ? 'text-red-400' :
                            'text-yellow-400'
                          }`}>
                            {value > 75 ? 'Allied' :
                             value > 50 ? 'Friendly' :
                             value > 25 ? 'Cordial' :
                             value > 0 ? 'Neutral' :
                             value > -25 ? 'Unfriendly' :
                             value > -50 ? 'Hostile' :
                             'Enemy'}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              value > 50 ? 'bg-green-500' :
                              value > 0 ? 'bg-blue-500' :
                              value < -50 ? 'bg-red-500' :
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${Math.abs(value)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-md border border-gray-700/30 p-4 md:col-span-2">
                  <h3 className="text-md font-semibold mb-3">Completed Missions</h3>
                  
                  {player.completedMissions.length === 0 ? (
                    <div className="text-sm text-gray-400 italic">No completed missions yet</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {player.completedMissions.map(missionId => (
                        <div key={missionId} className="text-sm bg-gray-800/30 p-2 rounded-md">
                          Mission #{missionId}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="h-full overflow-auto">
            <div className="bg-gray-900/70 backdrop-blur-md rounded-md border border-gray-700/50 p-4">
              <h2 className="text-lg font-bold text-cyan-300 mb-4">Game Settings</h2>
              
              <div className="grid gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Music Volume</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      defaultValue="70" 
                      className="w-full accent-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Sound Effects Volume</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      defaultValue="80" 
                      className="w-full accent-cyan-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <label className="text-sm font-medium">Show FPS Counter</label>
                    <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out rounded-full bg-gray-800 hover:bg-gray-700">
                      <input 
                        type="checkbox"
                        className="absolute w-0 h-0 opacity-0"
                        defaultChecked={false}
                      />
                      <span className="absolute left-1 top-1 w-3 h-3 transition duration-200 ease-in-out rounded-full bg-gray-400"></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <label className="text-sm font-medium">Enable VFX Effects</label>
                    <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out rounded-full bg-cyan-900 hover:bg-cyan-800">
                      <input 
                        type="checkbox"
                        className="absolute w-0 h-0 opacity-0"
                        defaultChecked={true}
                      />
                      <span className="absolute left-[calc(100%-16px)] top-1 w-3 h-3 transition duration-200 ease-in-out rounded-full bg-cyan-300"></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <label className="text-sm font-medium">Auto-save Game</label>
                    <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out rounded-full bg-cyan-900 hover:bg-cyan-800">
                      <input 
                        type="checkbox"
                        className="absolute w-0 h-0 opacity-0"
                        defaultChecked={true}
                      />
                      <span className="absolute left-[calc(100%-16px)] top-1 w-3 h-3 transition duration-200 ease-in-out rounded-full bg-cyan-300"></span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t border-gray-700/50 flex flex-col sm:flex-row gap-2 justify-end">
                  <button className="px-4 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-300 rounded border border-red-800/50">
                    Reset Game
                  </button>
                  <button className="px-4 py-2 bg-cyan-900/40 hover:bg-cyan-900/60 text-cyan-300 rounded border border-cyan-800/50">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
      
      {/* Station view modal */}
      {showStationView && currentStation && (
        <StationView 
          station={currentStation} 
          onClose={() => setShowStationView(false)} 
        />
      )}
    </div>
  );
};

export default MainView;