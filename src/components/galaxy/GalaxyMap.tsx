import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { StarSystem } from '../../types';
import { ZoomIn, ZoomOut, Locate, MapPin, Rocket } from 'lucide-react';

interface GalaxyMapProps {
  onSystemSelect?: (system: StarSystem) => void;
}

const GalaxyMap: React.FC<GalaxyMapProps> = ({ onSystemSelect }) => {
  const { state, dispatch } = useGame();
  const { galaxy, player } = state;
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [travelCooldown, setTravelCooldown] = useState(0);
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Center map on player system initially
  useEffect(() => {
    if (mapContainerRef.current) {
      const container = mapContainerRef.current;
      const currentSystem = galaxy.find(s => s.id === player.location.systemId);
      
      if (currentSystem) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        setOffset({
          x: containerWidth / 2 - currentSystem.position.x * zoom,
          y: containerHeight / 2 - currentSystem.position.y * zoom
        });
      }
    }
  }, [galaxy, player.location.systemId, zoom]);
  
  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setOffset({ x: offset.x + dx, y: offset.y + dy });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle zoom in/out
  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      if (direction === 'in' && prev < 2) return prev + 0.2;
      if (direction === 'out' && prev > 0.5) return prev - 0.2;
      return prev;
    });
  };
  
  // Center map on player's current system
  const centerOnPlayer = () => {
    if (mapContainerRef.current) {
      const container = mapContainerRef.current;
      const currentSystem = galaxy.find(s => s.id === player.location.systemId);
      
      if (currentSystem) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        setOffset({
          x: containerWidth / 2 - currentSystem.position.x * zoom,
          y: containerHeight / 2 - currentSystem.position.y * zoom
        });
      }
    }
  };

  // Calculate travel time based on distance
  const calculateTravelTime = (from: StarSystem, to: StarSystem): number => {
    const dx = to.position.x - from.position.x;
    const dy = to.position.y - from.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return Math.max(3, Math.floor(distance / 200)); // Minimum 3 seconds, increases with distance
  };
  
  // Handle system selection
  const handleSystemClick = (system: StarSystem) => {
    if (travelCooldown > 0) return;

    const currentSystem = galaxy.find(s => s.id === player.location.systemId);
    if (!currentSystem) return;

    setSelectedSystemId(system.id);
    
    if (system.id !== player.location.systemId) {
      const travelTime = calculateTravelTime(currentSystem, system);
      setTravelCooldown(travelTime);

      // Start travel countdown
      const timer = setInterval(() => {
        setTravelCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Complete travel
            if (onSystemSelect) {
              onSystemSelect(system);
            }
            setSelectedSystemId(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Add travel notification
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: `Initiating jump to ${system.name} system. ETA: ${travelTime} seconds.`,
          type: 'info'
        }
      });
    }
  };
  
  // Determine system color based on faction
  const getSystemColor = (faction?: string) => {
    switch (faction) {
      case 'federation':
        return 'text-blue-400';
      case 'empire':
        return 'text-purple-400';
      case 'pirates':
        return 'text-red-400';
      case 'traders':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };
  
  // Determine system size based on type
  const getSystemSize = (type: string) => {
    switch (type) {
      case 'binary':
        return 'w-4 h-4';
      case 'black-hole':
        return 'w-5 h-5';
      case 'neutron':
        return 'w-5 h-5';
      default:
        return 'w-3 h-3';
    }
  };
  
  // Custom system icon based on type
  const SystemIcon = ({ type, className = '', dangerLevel = 0 }: { type: string, className?: string, dangerLevel?: number }) => {
    const dangerIndicator = dangerLevel > 7 
      ? 'before:absolute before:inset-0 before:rounded-full before:border-2 before:border-red-600 before:animate-ping before:opacity-75 before:-z-10' 
      : '';
      
    switch (type) {
      case 'binary':
        return (
          <div className={`${className} ${dangerIndicator} relative flex items-center justify-center gap-0.5`}>
            <div className="w-2 h-2 rounded-full bg-yellow-300 shadow-glow-yellow"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-300 shadow-glow-orange -ml-0.5"></div>
          </div>
        );
      case 'black-hole':
        return (
          <div className={`${className} ${dangerIndicator} relative`}>
            <div className="w-full h-full rounded-full bg-gray-950 shadow-glow-purple border-2 border-purple-700"></div>
            <div className="absolute inset-0 rounded-full bg-purple-900/20 animate-pulse"></div>
          </div>
        );
      case 'neutron':
        return (
          <div className={`${className} ${dangerIndicator} relative`}>
            <div className="w-full h-full rounded-full bg-blue-100 shadow-glow-blue"></div>
            <div className="absolute inset-0 rounded-full bg-blue-300/30 animate-ping opacity-75"></div>
          </div>
        );
      default:
        return (
          <div className={`${className} ${dangerIndicator} relative`}>
            <div className="w-full h-full rounded-full bg-yellow-200 shadow-glow-yellow"></div>
          </div>
        );
    }
  };

  // Get current and selected system positions
  const getCurrentSystemPosition = () => {
    const system = galaxy.find(s => s.id === player.location.systemId);
    return system ? system.position : { x: 0, y: 0 };
  };

  const getSelectedSystemPosition = () => {
    const system = galaxy.find(s => s.id === selectedSystemId);
    return system ? system.position : null;
  };
  
  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button 
          className="p-2 bg-gray-800/80 text-cyan-300 rounded-md hover:bg-gray-700/80 transition-colors border border-gray-700/50"
          onClick={() => handleZoom('in')}
        >
          <ZoomIn size={18} />
        </button>
        
        <button 
          className="p-2 bg-gray-800/80 text-cyan-300 rounded-md hover:bg-gray-700/80 transition-colors border border-gray-700/50"
          onClick={() => handleZoom('out')}
        >
          <ZoomOut size={18} />
        </button>
        
        <button 
          className="p-2 bg-gray-800/80 text-cyan-300 rounded-md hover:bg-gray-700/80 transition-colors border border-gray-700/50"
          onClick={centerOnPlayer}
        >
          <Locate size={18} />
        </button>
      </div>

      {/* Travel cooldown indicator */}
      {travelCooldown > 0 && (
        <div className="absolute top-4 left-4 bg-blue-900/80 text-blue-300 px-4 py-2 rounded-md border border-blue-700/50 z-10 flex items-center gap-2">
          <Rocket className="animate-pulse" size={18} />
          <span>Jump in progress: {travelCooldown}s</span>
        </div>
      )}
      
      {/* Galaxy legend */}
      <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm p-3 rounded-md border border-gray-700/50 text-xs text-gray-300 z-10">
        <h4 className="font-semibold mb-2">Legend</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-200"></div>
            <span>Normal Star</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 flex items-center gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-300"></div>
              <div className="w-1 h-1 rounded-full bg-orange-300"></div>
            </div>
            <span>Binary Star</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-950 border border-purple-700"></div>
            <span>Black Hole</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-100"></div>
            <span>Neutron Star</span>
          </div>
          <div className="flex items-center gap-1 text-blue-400">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span>Federation</span>
          </div>
          <div className="flex items-center gap-1 text-purple-400">
            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            <span>Empire</span>
          </div>
          <div className="flex items-center gap-1 text-red-400">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <span>Pirates</span>
          </div>
          <div className="flex items-center gap-1 text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Traders</span>
          </div>
        </div>
      </div>
      
      {/* Galaxy map */}
      <div 
        ref={mapContainerRef}
        className="relative flex-grow overflow-hidden cursor-move bg-gray-950"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Systems */}
        <div 
          className="absolute inset-0"
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          <div
            className="absolute"
            style={{
              transform: `translate(${offset.x / zoom}px, ${offset.y / zoom}px)`
            }}
          >
            {/* Draw trade routes and connections */}
            <svg className="absolute top-0 left-0 w-full h-full">
              {/* Travel path */}
              {selectedSystemId && (
                <g>
                  {/* Dotted line path */}
                  <line
                    x1={getCurrentSystemPosition().x}
                    y1={getCurrentSystemPosition().y}
                    x2={getSelectedSystemPosition()?.x || 0}
                    y2={getSelectedSystemPosition()?.y || 0}
                    className="stroke-cyan-500"
                    strokeWidth="2"
                    strokeDasharray="8,8"
                    strokeLinecap="round"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="32"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </line>
                  
                  {/* Pulse effect along the path */}
                  <circle
                    cx={getCurrentSystemPosition().x}
                    cy={getCurrentSystemPosition().y}
                    r="4"
                    className="fill-cyan-500"
                  >
                    <animate
                      attributeName="opacity"
                      values="1;0"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                    <animateMotion
                      dur={`${travelCooldown}s`}
                      repeatCount="1"
                      path={`M0,0 L${
                        (getSelectedSystemPosition()?.x || 0) - getCurrentSystemPosition().x
                      },${
                        (getSelectedSystemPosition()?.y || 0) - getCurrentSystemPosition().y
                      }`}
                    />
                  </circle>
                </g>
              )}

              {galaxy.map(system => {
                // Connect to 2-3 nearest systems
                const nearestSystems = [...galaxy]
                  .filter(s => s.id !== system.id)
                  .sort((a, b) => {
                    const distA = Math.sqrt(
                      Math.pow(a.position.x - system.position.x, 2) + 
                      Math.pow(a.position.y - system.position.y, 2)
                    );
                    const distB = Math.sqrt(
                      Math.pow(b.position.x - system.position.x, 2) + 
                      Math.pow(b.position.y - system.position.y, 2)
                    );
                    return distA - distB;
                  })
                  .slice(0, 2 + Math.floor(Math.random() * 2));
                  
                return nearestSystems.map(target => {
                  const distance = Math.sqrt(
                    Math.pow(target.position.x - system.position.x, 2) + 
                    Math.pow(target.position.y - system.position.y, 2)
                  );
                  
                  if (target.id > system.id && distance < 1000) {
                    let strokeClass = 'stroke-gray-700';
                    let dashArray = '';
                    
                    if (system.faction && target.faction) {
                      if (system.faction === target.faction) {
                        switch (system.faction) {
                          case 'federation':
                            strokeClass = 'stroke-blue-900/40';
                            break;
                          case 'empire':
                            strokeClass = 'stroke-purple-900/40';
                            break;
                          case 'pirates':
                            strokeClass = 'stroke-red-900/40';
                            break;
                          case 'traders':
                            strokeClass = 'stroke-green-900/40';
                            break;
                        }
                      } else {
                        dashArray = '5,5';
                      }
                    }
                    
                    return (
                      <line 
                        key={`${system.id}-${target.id}`}
                        x1={system.position.x} 
                        y1={system.position.y}
                        x2={target.position.x} 
                        y2={target.position.y}
                        className={`${strokeClass}`}
                        strokeWidth="1" 
                        strokeDasharray={dashArray}
                        opacity="0.5"
                      />
                    );
                  }
                  return null;
                });
              })}
            </svg>
            
            {/* Draw star systems */}
            {galaxy.map(system => {
              const isCurrentSystem = system.id === player.location.systemId;
              const isDiscovered = player.discoveredSystems.includes(system.id);
              const isSelected = system.id === selectedSystemId;
              const systemColor = getSystemColor(system.faction);
              const systemSize = getSystemSize(system.type);
              
              return (
                <div 
                  key={system.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${isDiscovered ? '' : 'opacity-30'}`}
                  style={{ 
                    left: system.position.x,
                    top: system.position.y
                  }}
                >
                  <div 
                    className={`
                      group flex flex-col items-center cursor-pointer 
                      ${isCurrentSystem ? 'animate-pulse' : ''}
                      ${isSelected ? 'scale-125 transition-transform' : ''}
                      ${travelCooldown > 0 ? 'pointer-events-none' : ''}
                    `}
                    onClick={() => handleSystemClick(system)}
                  >
                    <SystemIcon 
                      type={system.type} 
                      className={systemSize} 
                      dangerLevel={system.dangerLevel}
                    />
                    
                    {/* Current system indicator */}
                    {isCurrentSystem && (
                      <div className="absolute -top-1 -right-1">
                        <MapPin size={12} className="text-cyan-300" />
                      </div>
                    )}
                    
                    <div className={`
                      mt-1 text-xs ${systemColor} whitespace-nowrap 
                      opacity-0 group-hover:opacity-100 transition-opacity
                      ${isCurrentSystem || isSelected ? '!opacity-100 font-bold' : ''}
                    `}>
                      {system.name}
                      {isDiscovered && system.faction && (
                        <span className="ml-1 text-[8px] align-text-top">
                          ({system.faction.slice(0, 3)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalaxyMap;