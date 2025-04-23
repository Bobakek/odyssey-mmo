import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, Player, Ship, StarSystem } from '../types';
import { generateGalaxy } from '../utils/galaxyGenerator';
import { getInitialShip, generateEnemyFleet } from '../utils/shipGenerator';

// Initial game state
const initialGameState: GameState = {
  player: {
    id: '1',
    name: 'Commander',
    credits: 1000,
    ship: getInitialShip(),
    location: {
      systemId: 'sol',
      position: { x: 0, y: 0 },
      locationType: 'space',
    },
    reputation: {
      federation: 10,
      empire: 0,
      pirates: 0,
      traders: 5,
    },
    discoveredSystems: ['sol'],
    completedMissions: [],
    researchPoints: 0,
    technologies: [],
  },
  galaxy: generateGalaxy(30), // Generate 30 star systems
  currentSystem: null,
  inCombat: false,
  enemies: undefined,
  marketPrices: {},
  notifications: [],
};

// Action types
type GameAction =
  | { type: 'MOVE_PLAYER'; payload: { systemId: string; position: { x: number; y: number }; locationType: 'space' | 'station' | 'planet'; locationId?: string } }
  | { type: 'DOCK_AT_STATION'; payload: { stationId: string } }
  | { type: 'ENTER_SYSTEM'; payload: { systemId: string } }
  | { type: 'UPDATE_RESOURCES'; payload: { resourceId: string; quantity: number } }
  | { type: 'UPDATE_CREDITS'; payload: { amount: number } }
  | { type: 'UPGRADE_SHIP'; payload: { property: string; value: number } }
  | { type: 'ADD_NOTIFICATION'; payload: { message: string; type: 'info' | 'warning' | 'danger' | 'success' } }
  | { type: 'READ_NOTIFICATION'; payload: { id: string } }
  | { type: 'ENTER_COMBAT'; payload: { enemies: Ship[] } }
  | { type: 'END_COMBAT' }
  | { type: 'DAMAGE_SHIP'; payload: { amount: number } }
  | { type: 'DAMAGE_ENEMY'; payload: { enemyId: string; amount: number } }
  | { type: 'REPAIR_SHIP'; payload: { amount: number } }
  | { type: 'COMPLETE_MISSION'; payload: { missionId: string } }
  | { type: 'RESEARCH_TECHNOLOGY'; payload: { technologyId: string } };

// Reducer function
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'MOVE_PLAYER':
      return {
        ...state,
        player: {
          ...state.player,
          location: {
            systemId: action.payload.systemId,
            position: action.payload.position,
            locationType: action.payload.locationType,
            locationId: action.payload.locationId,
          },
        },
      };
      
    case 'DOCK_AT_STATION':
      return {
        ...state,
        player: {
          ...state.player,
          location: {
            ...state.player.location,
            locationType: 'station',
            locationId: action.payload.stationId,
          },
        },
      };
      
    case 'ENTER_SYSTEM':
      const system = state.galaxy.find(s => s.id === action.payload.systemId);
      
      // Add to discovered systems if not already discovered
      const discoveredSystems = state.player.discoveredSystems.includes(action.payload.systemId)
        ? state.player.discoveredSystems
        : [...state.player.discoveredSystems, action.payload.systemId];
        
      return {
        ...state,
        currentSystem: system || null,
        player: {
          ...state.player,
          location: {
            ...state.player.location,
            systemId: action.payload.systemId,
          },
          discoveredSystems,
        },
      };
      
    case 'UPDATE_RESOURCES':
      const { resourceId, quantity } = action.payload;
      const currentItems = [...state.player.ship.cargo.items];
      const existingItemIndex = currentItems.findIndex(item => item.resourceId === resourceId);
      
      if (existingItemIndex >= 0) {
        const newQuantity = currentItems[existingItemIndex].quantity + quantity;
        if (newQuantity <= 0) {
          // Remove the item if quantity becomes zero or negative
          currentItems.splice(existingItemIndex, 1);
        } else {
          // Update quantity
          currentItems[existingItemIndex] = {
            ...currentItems[existingItemIndex],
            quantity: newQuantity,
          };
        }
      } else if (quantity > 0) {
        // Add new resource
        currentItems.push({ resourceId, quantity });
      }
      
      // Calculate new cargo usage
      const usedCargo = currentItems.reduce((total, item) => total + item.quantity, 0);
      
      return {
        ...state,
        player: {
          ...state.player,
          ship: {
            ...state.player.ship,
            cargo: {
              ...state.player.ship.cargo,
              items: currentItems,
              used: usedCargo,
            },
          },
        },
      };
      
    case 'UPDATE_CREDITS':
      return {
        ...state,
        player: {
          ...state.player,
          credits: state.player.credits + action.payload.amount,
        },
      };
      
    case 'UPGRADE_SHIP':
      const { property, value } = action.payload;
      
      return {
        ...state,
        player: {
          ...state.player,
          ship: {
            ...state.player.ship,
            [property]: value,
          },
        },
      };
      
    case 'ADD_NOTIFICATION':
      const newNotification = {
        id: Date.now().toString(),
        message: action.payload.message,
        type: action.payload.type,
        timestamp: Date.now(),
        read: false,
      };
      
      return {
        ...state,
        notifications: [newNotification, ...state.notifications].slice(0, 10), // Keep only the latest 10 notifications
      };
      
    case 'READ_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map(notif => 
          notif.id === action.payload.id ? { ...notif, read: true } : notif
        ),
      };
      
    case 'ENTER_COMBAT':
      return {
        ...state,
        inCombat: true,
        enemies: action.payload.enemies,
      };
      
    case 'END_COMBAT':
      return {
        ...state,
        inCombat: false,
        enemies: undefined,
      };
      
    case 'DAMAGE_SHIP':
      const currentShield = state.player.ship.shield;
      const damageAmount = action.payload.amount;
      
      let newShield = currentShield;
      let hullDamage = 0;
      
      // If we have shields, damage goes to shields first
      if (currentShield > 0) {
        if (currentShield >= damageAmount) {
          newShield = currentShield - damageAmount;
        } else {
          // Shield is depleted, remaining damage goes to hull
          hullDamage = damageAmount - currentShield;
          newShield = 0;
        }
      } else {
        // No shields, all damage to hull
        hullDamage = damageAmount;
      }
      
      const newHull = Math.max(0, state.player.ship.hull - hullDamage);
      
      return {
        ...state,
        player: {
          ...state.player,
          ship: {
            ...state.player.ship,
            shield: newShield,
            hull: newHull,
          },
        },
      };

    case 'DAMAGE_ENEMY':
      if (!state.enemies) return state;

      return {
        ...state,
        enemies: state.enemies.map(enemy => 
          enemy.id === action.payload.enemyId
            ? {
                ...enemy,
                hull: Math.max(0, enemy.hull - action.payload.amount)
              }
            : enemy
        ),
      };
      
    case 'REPAIR_SHIP':
      return {
        ...state,
        player: {
          ...state.player,
          ship: {
            ...state.player.ship,
            hull: Math.min(
              state.player.ship.maxHull,
              state.player.ship.hull + action.payload.amount
            ),
            shield: state.player.ship.maxShield, // Refill shields when repairing
          },
        },
      };
      
    case 'COMPLETE_MISSION':
      return {
        ...state,
        player: {
          ...state.player,
          completedMissions: [...state.player.completedMissions, action.payload.missionId],
        },
      };
      
    case 'RESEARCH_TECHNOLOGY':
      const tech = {
        id: action.payload.technologyId,
        researched: true,
        name: '',
        description: '',
        cost: 0,
        level: 1,
        maxLevel: 1,
        effect: {
          target: '',
          property: '',
          value: 0
        },
        prerequisites: []
      };
      
      return {
        ...state,
        player: {
          ...state.player,
          technologies: [...state.player.technologies, tech],
        },
      };
      
    default:
      return state;
  }
};

// Create context
type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  
  // Load game state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('cosmic-odyssey-game-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Dispatch multiple actions to restore the state
        dispatch({ 
          type: 'MOVE_PLAYER', 
          payload: parsedState.player.location 
        });
        dispatch({ 
          type: 'ENTER_SYSTEM', 
          payload: { systemId: parsedState.player.location.systemId } 
        });
      } catch (error) {
        console.error('Failed to load saved game:', error);
      }
    }
  }, []);
  
  // Save game state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cosmic-odyssey-game-state', JSON.stringify(state));
  }, [state]);

  // Random combat encounters
  useEffect(() => {
    if (state.inCombat || state.player.location.locationType !== 'space') return;

    const encounterCheck = setInterval(() => {
      const system = state.galaxy.find(s => s.id === state.player.location.systemId);
      if (!system) return;

      // Chance based on system danger level
      const encounterChance = system.dangerLevel * 0.01; // 1-10% chance per check
      if (Math.random() < encounterChance) {
        const enemies = generateEnemyFleet(system.dangerLevel);
        dispatch({
          type: 'ENTER_COMBAT',
          payload: { enemies }
        });

        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            message: 'Hostile ships detected! Prepare for combat!',
            type: 'danger'
          }
        });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(encounterCheck);
  }, [state.inCombat, state.player.location, state.galaxy]);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};