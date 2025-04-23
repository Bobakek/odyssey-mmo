import { StarSystem, Planet, SpaceStation, Resource, Mission } from '../types';

// Constants for generation
const PLANET_TYPES = ['rocky', 'gas', 'ice', 'lava', 'earth-like'] as const;
const STATION_TYPES = ['trading', 'military', 'research', 'mining'] as const;
const RESOURCE_TYPES = ['mineral', 'gas', 'biological', 'artifact', 'manufactured'] as const;
const FACTIONS = ['federation', 'empire', 'pirates', 'traders', 'neutral'];

// Generate a random number between min and max (inclusive)
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random element from an array
const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Generate resources for planets and systems
const generateResources = (count: number): Resource[] => {
  const resources: Resource[] = [];
  
  for (let i = 0; i < count; i++) {
    resources.push({
      id: generateId(),
      name: `Resource-${generateId().substring(0, 4)}`,
      type: randomElement(RESOURCE_TYPES),
      baseValue: randomInt(10, 500),
      rarity: randomInt(1, 10)
    });
  }
  
  return resources;
};

// Generate planets for a star system
const generatePlanets = (count: number, systemPosition: {x: number, y: number}): Planet[] => {
  const planets: Planet[] = [];
  
  for (let i = 0; i < count; i++) {
    // Position planets in orbit around the star
    const angle = (i / count) * Math.PI * 2;
    const distance = randomInt(100, 300);
    const x = Math.cos(angle) * distance + systemPosition.x;
    const y = Math.sin(angle) * distance + systemPosition.y;
    
    planets.push({
      id: generateId(),
      name: `Planet-${generateId().substring(0, 4)}`,
      type: randomElement(PLANET_TYPES),
      resources: generateResources(randomInt(1, 5)),
      position: { x, y }
    });
  }
  
  return planets;
};

// Generate space stations for a star system
const generateStations = (
  count: number, 
  systemPosition: {x: number, y: number}, 
  faction?: string
): SpaceStation[] => {
  const stations: SpaceStation[] = [];
  
  for (let i = 0; i < count; i++) {
    // Position stations in the system
    const angle = (i / count) * Math.PI * 2;
    const distance = randomInt(50, 150);
    const x = Math.cos(angle) * distance + systemPosition.x;
    const y = Math.sin(angle) * distance + systemPosition.y;
    
    // Generate market prices for resources
    const marketPrices: { [resourceId: string]: number } = {};
    const resourceCount = randomInt(5, 15);
    
    for (let j = 0; j < resourceCount; j++) {
      marketPrices[`resource-${j}`] = randomInt(5, 500);
    }
    
    // Determine services based on station type
    const stationType = randomElement(STATION_TYPES);
    let services: ('market' | 'repair' | 'missions' | 'upgrade')[] = ['market'];
    
    if (stationType === 'trading') {
      services = ['market', 'repair'];
    } else if (stationType === 'military') {
      services = ['repair', 'missions', 'upgrade'];
    } else if (stationType === 'research') {
      services = ['market', 'upgrade'];
    } else if (stationType === 'mining') {
      services = ['market', 'repair'];
    }
    
    // Add missions sometimes
    if (Math.random() > 0.5) {
      services.push('missions');
    }
    
    stations.push({
      id: generateId(),
      name: `Station-${generateId().substring(0, 4)}`,
      type: stationType,
      faction: faction || randomElement(FACTIONS),
      position: { x, y },
      services: [...new Set(services)], // Remove duplicates
      marketPrices
    });
  }
  
  return stations;
};

// Generate missions for a star system
const generateMissions = (count: number): Mission[] => {
  const missions: Mission[] = [];
  const missionTypes = ['delivery', 'combat', 'exploration', 'mining'] as const;
  
  for (let i = 0; i < count; i++) {
    const type = randomElement(missionTypes);
    let description = '';
    let target = {};
    
    switch (type) {
      case 'delivery':
        description = 'Deliver cargo to a distant station.';
        target = {
          systemId: generateId(),
          entityId: generateId(),
          resourceId: generateId(),
          quantity: randomInt(1, 10)
        };
        break;
      case 'combat':
        description = 'Eliminate hostile ships in this sector.';
        target = {
          quantity: randomInt(1, 5)
        };
        break;
      case 'exploration':
        description = 'Explore an uncharted star system.';
        target = {
          systemId: generateId()
        };
        break;
      case 'mining':
        description = 'Mine specific resources for research.';
        target = {
          resourceId: generateId(),
          quantity: randomInt(5, 20)
        };
        break;
    }
    
    missions.push({
      id: generateId(),
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Mission`,
      description,
      type,
      reward: {
        credits: randomInt(100, 5000),
        experience: randomInt(10, 100),
        items: Math.random() > 0.7 ? [{ resourceId: generateId(), quantity: randomInt(1, 3) }] : undefined
      },
      requirements: {
        minLevel: randomInt(1, 5),
        reputation: Math.random() > 0.5 ? {
          faction: randomElement(FACTIONS),
          min: randomInt(-10, 10)
        } : undefined
      },
      target,
      completed: false
    });
  }
  
  return missions;
};

// Generate the "Sol" system (special starting system)
const generateSolSystem = (): StarSystem => {
  return {
    id: 'sol',
    name: 'Sol',
    position: { x: 0, y: 0 },
    type: 'normal',
    faction: 'federation',
    dangerLevel: 1,
    planets: [
      {
        id: 'earth',
        name: 'Earth',
        type: 'earth-like',
        resources: generateResources(3),
        position: { x: 100, y: 0 }
      },
      {
        id: 'mars',
        name: 'Mars',
        type: 'rocky',
        resources: generateResources(4),
        position: { x: 150, y: 50 }
      },
      {
        id: 'jupiter',
        name: 'Jupiter',
        type: 'gas',
        resources: generateResources(5),
        position: { x: 200, y: -80 }
      }
    ],
    stations: [
      {
        id: 'earth-station',
        name: 'Earth Orbital',
        type: 'trading',
        faction: 'federation',
        position: { x: 90, y: 10 },
        services: ['market', 'repair', 'missions', 'upgrade'],
        marketPrices: {
          'iron': 50,
          'titanium': 200,
          'hydrogen': 30,
          'electronics': 350
        }
      }
    ],
    resources: generateResources(5),
    missions: generateMissions(3)
  };
};

// Main function to generate galaxy
export const generateGalaxy = (systemCount: number): StarSystem[] => {
  const galaxy: StarSystem[] = [generateSolSystem()];
  
  // Generate the rest of the star systems
  for (let i = 1; i < systemCount; i++) {
    // Position systems in a spiral pattern outward from Sol
    const angle = i * (Math.PI * 0.618033988749895); // Golden ratio angle
    const distance = 500 * Math.sqrt(i);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    const position = { x, y };
    const faction = Math.random() > 0.3 ? randomElement(FACTIONS) : undefined;
    
    galaxy.push({
      id: generateId(),
      name: `System-${generateId().substring(0, 4)}`,
      position,
      type: Math.random() > 0.8 ? randomElement(['binary', 'black-hole', 'neutron']) : 'normal',
      faction,
      dangerLevel: randomInt(1, 10),
      planets: generatePlanets(randomInt(0, 5), position),
      stations: generateStations(randomInt(0, 3), position, faction),
      resources: generateResources(randomInt(3, 8)),
      missions: generateMissions(randomInt(0, 4))
    });
  }
  
  return galaxy;
};