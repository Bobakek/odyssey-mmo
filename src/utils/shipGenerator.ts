import { Ship, ShipType, Weapon, Equipment } from '../types';

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Initial starter ship
export const getInitialShip = (): Ship => {
  return {
    id: generateId(),
    name: 'Nova Scout',
    type: 'scout',
    hull: 100,
    maxHull: 100,
    shield: 50,
    maxShield: 50,
    energy: 100,
    maxEnergy: 100,
    cargo: {
      capacity: 20,
      used: 0,
      items: []
    },
    weapons: [
      {
        id: 'basic-laser',
        name: 'Basic Laser',
        type: 'laser',
        damage: 10,
        energyUsage: 5,
        range: 300,
        cooldown: 2,
        level: 1
      }
    ],
    equipment: [
      {
        id: 'basic-shield',
        name: 'Basic Shield Generator',
        type: 'shield',
        effect: {
          property: 'shieldRecharge',
          value: 2
        },
        energyUsage: 1,
        level: 1
      },
      {
        id: 'basic-engine',
        name: 'Standard Engine',
        type: 'engine',
        effect: {
          property: 'speed',
          value: 100
        },
        energyUsage: 2,
        level: 1
      }
    ],
    experience: 0,
    level: 1
  };
};

// Generate a ship based on type and level
export const generateShip = (type: ShipType, level: number = 1): Ship => {
  // Base stats by ship type
  const baseStats: Record<ShipType, {
    hull: number;
    shield: number;
    energy: number;
    cargoCapacity: number;
  }> = {
    scout: {
      hull: 80,
      shield: 40,
      energy: 100,
      cargoCapacity: 15
    },
    fighter: {
      hull: 120,
      shield: 60,
      energy: 90,
      cargoCapacity: 10
    },
    freighter: {
      hull: 150,
      shield: 30,
      energy: 80,
      cargoCapacity: 100
    },
    miner: {
      hull: 100,
      shield: 50,
      energy: 120,
      cargoCapacity: 60
    },
    cruiser: {
      hull: 200,
      shield: 100,
      energy: 150,
      cargoCapacity: 30
    },
    battleship: {
      hull: 300,
      shield: 150,
      energy: 200,
      cargoCapacity: 50
    }
  };
  
  // Scale stats based on level (simple linear scaling)
  const stats = baseStats[type];
  const levelMultiplier = 1 + (level - 1) * 0.2; // +20% per level
  
  const hull = Math.round(stats.hull * levelMultiplier);
  const shield = Math.round(stats.shield * levelMultiplier);
  const energy = Math.round(stats.energy * levelMultiplier);
  const cargoCapacity = Math.round(stats.cargoCapacity * levelMultiplier);
  
  // Generate appropriate weapons based on ship type and level
  const weapons: Weapon[] = [];
  const weaponCount = {
    scout: 1,
    fighter: 2,
    freighter: 1,
    miner: 1,
    cruiser: 3,
    battleship: 4
  }[type];
  
  for (let i = 0; i < weaponCount; i++) {
    weapons.push(generateWeapon(type, level));
  }
  
  // Generate appropriate equipment based on ship type and level
  const equipment: Equipment[] = [];
  
  // Always add shields, engines and computers
  equipment.push(generateEquipment('shield', level));
  equipment.push(generateEquipment('engine', level));
  equipment.push(generateEquipment('computer', level));
  
  // Add type-specific equipment
  if (type === 'miner') {
    equipment.push(generateEquipment('drill', level));
  }
  
  if (type === 'scout' || type === 'cruiser') {
    equipment.push(generateEquipment('scanner', level));
  }
  
  return {
    id: generateId(),
    name: `${getShipNamePrefix(type)} ${getShipNameSuffix(type)}`,
    type,
    hull,
    maxHull: hull,
    shield,
    maxShield: shield,
    energy,
    maxEnergy: energy,
    cargo: {
      capacity: cargoCapacity,
      used: 0,
      items: []
    },
    weapons,
    equipment,
    experience: 0,
    level
  };
};

// Helper function to generate a weapon
const generateWeapon = (shipType: ShipType, level: number): Weapon => {
  // Weapon types by ship type preference
  const weaponTypes: Record<ShipType, ('laser' | 'missile' | 'projectile' | 'beam')[]> = {
    scout: ['laser', 'beam'],
    fighter: ['laser', 'missile', 'projectile'],
    freighter: ['projectile'],
    miner: ['laser'],
    cruiser: ['laser', 'missile', 'beam'],
    battleship: ['missile', 'projectile', 'beam']
  };
  
  // Choose a random weapon type based on ship preferences
  const type = weaponTypes[shipType][Math.floor(Math.random() * weaponTypes[shipType].length)];
  
  // Base stats by weapon type
  const baseStats: Record<string, {
    damage: number;
    energyUsage: number;
    range: number;
    cooldown: number;
  }> = {
    laser: {
      damage: 10,
      energyUsage: 5,
      range: 300,
      cooldown: 1
    },
    missile: {
      damage: 25,
      energyUsage: 10,
      range: 500,
      cooldown: 3
    },
    projectile: {
      damage: 15,
      energyUsage: 3,
      range: 200,
      cooldown: 0.5
    },
    beam: {
      damage: 5,
      energyUsage: 2,
      range: 250,
      cooldown: 0.2
    }
  };
  
  // Scale stats based on level
  const stats = baseStats[type];
  const levelMultiplier = 1 + (level - 1) * 0.15; // +15% per level
  
  return {
    id: generateId(),
    name: getWeaponName(type, level),
    type,
    damage: Math.round(stats.damage * levelMultiplier),
    energyUsage: Math.round(stats.energyUsage * levelMultiplier),
    range: Math.round(stats.range * levelMultiplier),
    cooldown: Math.max(0.1, stats.cooldown * (1 - (level - 1) * 0.05)), // Reduce cooldown by 5% per level, min 0.1
    level
  };
};

// Helper function to generate equipment
const generateEquipment = (type: 'shield' | 'engine' | 'scanner' | 'drill' | 'computer', level: number): Equipment => {
  // Base stats by equipment type
  const baseStats: Record<string, {
    property: string;
    value: number;
    energyUsage: number;
  }> = {
    shield: {
      property: 'shieldRecharge',
      value: 2,
      energyUsage: 1
    },
    engine: {
      property: 'speed',
      value: 100,
      energyUsage: 2
    },
    scanner: {
      property: 'scanRange',
      value: 500,
      energyUsage: 1
    },
    drill: {
      property: 'miningEfficiency',
      value: 1,
      energyUsage: 3
    },
    computer: {
      property: 'targetingAccuracy',
      value: 0.8,
      energyUsage: 1
    }
  };
  
  // Scale stats based on level
  const stats = baseStats[type];
  const levelMultiplier = 1 + (level - 1) * 0.1; // +10% per level
  
  return {
    id: generateId(),
    name: getEquipmentName(type, level),
    type,
    effect: {
      property: stats.property,
      value: Math.round(stats.value * levelMultiplier * 10) / 10 // Round to 1 decimal place
    },
    energyUsage: Math.round(stats.energyUsage * (1 + (level - 1) * 0.05)), // +5% energy usage per level
    level
  };
};

// Helper function to get a ship name prefix
const getShipNamePrefix = (type: ShipType): string => {
  const prefixes: Record<ShipType, string[]> = {
    scout: ['Swift', 'Rapid', 'Nimble', 'Agile', 'Quick'],
    fighter: ['Fierce', 'Battle', 'War', 'Strike', 'Combat'],
    freighter: ['Heavy', 'Cargo', 'Bulk', 'Trade', 'Merchant'],
    miner: ['Deep', 'Drill', 'Rock', 'Mineral', 'Excavator'],
    cruiser: ['Command', 'Patrol', 'Guardian', 'Sentinel', 'Vigilant'],
    battleship: ['Dreadnought', 'Sovereign', 'Imperial', 'Titan', 'Dominator']
  };
  
  return prefixes[type][Math.floor(Math.random() * prefixes[type].length)];
};

// Helper function to get a ship name suffix
const getShipNameSuffix = (type: ShipType): string => {
  const suffixes: Record<ShipType, string[]> = {
    scout: ['Sparrow', 'Hawk', 'Eagle', 'Falcon', 'Raven'],
    fighter: ['Fang', 'Claw', 'Talon', 'Striker', 'Vector'],
    freighter: ['Hauler', 'Carrier', 'Transporter', 'Mule', 'Ox'],
    miner: ['Excavator', 'Prospector', 'Digger', 'Harvester', 'Extractor'],
    cruiser: ['Voyager', 'Explorer', 'Pathfinder', 'Discoverer', 'Surveyor'],
    battleship: ['Behemoth', 'Colossus', 'Leviathan', 'Juggernaut', 'Goliath']
  };
  
  return suffixes[type][Math.floor(Math.random() * suffixes[type].length)];
};

// Helper function to get weapon names
const getWeaponName = (type: string, level: number): string => {
  const prefixes = ['Basic', 'Standard', 'Advanced', 'Superior', 'Elite'];
  const levelPrefix = level <= prefixes.length ? prefixes[level - 1] : `Mk${level}`;
  
  const typeNames: Record<string, string> = {
    laser: 'Laser Cannon',
    missile: 'Missile Launcher',
    projectile: 'Railgun',
    beam: 'Beam Emitter'
  };
  
  return `${levelPrefix} ${typeNames[type]}`;
};

// Helper function to get equipment names
const getEquipmentName = (type: string, level: number): string => {
  const prefixes = ['Basic', 'Standard', 'Advanced', 'Superior', 'Elite'];
  const levelPrefix = level <= prefixes.length ? prefixes[level - 1] : `Mk${level}`;
  
  const typeNames: Record<string, string> = {
    shield: 'Shield Generator',
    engine: 'Propulsion Engine',
    scanner: 'Sensor Array',
    drill: 'Mining Laser',
    computer: 'Targeting Computer'
  };
  
  return `${levelPrefix} ${typeNames[type]}`;
};

// Generate an enemy ship fleet based on area danger level
export const generateEnemyFleet = (dangerLevel: number): Ship[] => {
  const fleetSize = Math.min(1 + Math.floor(dangerLevel / 3), 5); // 1-5 ships based on danger
  const fleetLevel = Math.max(1, Math.floor(dangerLevel / 2)); // Ship level based on danger
  
  const fleet: Ship[] = [];
  
  for (let i = 0; i < fleetSize; i++) {
    // Higher chance for more dangerous ships in higher danger levels
    let shipType: ShipType;
    const rand = Math.random();
    
    if (dangerLevel <= 3) {
      shipType = rand < 0.7 ? 'scout' : 'fighter';
    } else if (dangerLevel <= 6) {
      if (rand < 0.4) shipType = 'scout';
      else if (rand < 0.8) shipType = 'fighter';
      else shipType = 'cruiser';
    } else {
      if (rand < 0.2) shipType = 'fighter';
      else if (rand < 0.6) shipType = 'cruiser';
      else shipType = 'battleship';
    }
    
    fleet.push(generateShip(shipType, fleetLevel));
  }
  
  return fleet;
};