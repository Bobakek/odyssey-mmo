export interface Ship {
  id: string;
  name: string;
  type: ShipType;
  hull: number;
  maxHull: number;
  shield: number;
  maxShield: number;
  energy: number;
  maxEnergy: number;
  cargo: {
    capacity: number;
    used: number;
    items: CargoItem[];
  };
  weapons: Weapon[];
  equipment: Equipment[];
  experience: number;
  level: number;
}

export interface Player {
  id: string;
  name: string;
  credits: number;
  ship: Ship;
  location: StarSystemLocation;
  reputation: {
    [faction: string]: number;
  };
  discoveredSystems: string[];
  completedMissions: string[];
  researchPoints: number;
  technologies: Technology[];
}

export interface StarSystem {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
  type: 'normal' | 'binary' | 'black-hole' | 'neutron';
  faction?: string;
  dangerLevel: number; // 0-10
  planets: Planet[];
  stations: SpaceStation[];
  resources: Resource[];
  missions: Mission[];
}

export interface StarSystemLocation {
  systemId: string;
  position: {
    x: number;
    y: number;
  };
  locationType: 'space' | 'station' | 'planet';
  locationId?: string;
}

export interface Planet {
  id: string;
  name: string;
  type: 'rocky' | 'gas' | 'ice' | 'lava' | 'earth-like';
  resources: Resource[];
  position: {
    x: number;
    y: number;
  };
}

export interface SpaceStation {
  id: string;
  name: string;
  type: 'trading' | 'military' | 'research' | 'mining';
  faction: string;
  position: {
    x: number;
    y: number;
  };
  services: ('market' | 'repair' | 'missions' | 'upgrade')[];
  marketPrices: {
    [resourceId: string]: number;
  };
}

export interface Resource {
  id: string;
  name: string;
  type: 'mineral' | 'gas' | 'biological' | 'artifact' | 'manufactured';
  baseValue: number;
  rarity: number; // 1-10
}

export interface CargoItem {
  resourceId: string;
  quantity: number;
}

export interface Weapon {
  id: string;
  name: string;
  type: 'laser' | 'missile' | 'projectile' | 'beam';
  damage: number;
  energyUsage: number;
  range: number;
  cooldown: number; // seconds
  level: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'shield' | 'engine' | 'scanner' | 'drill' | 'computer';
  effect: {
    property: string;
    value: number;
  };
  energyUsage: number;
  level: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'delivery' | 'combat' | 'exploration' | 'mining';
  reward: {
    credits: number;
    experience: number;
    items?: CargoItem[];
  };
  requirements?: {
    minLevel?: number;
    reputation?: {
      faction: string;
      min: number;
    };
  };
  target?: {
    systemId?: string;
    entityId?: string;
    resourceId?: string;
    quantity?: number;
  };
  completed: boolean;
}

export interface Technology {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  effect: {
    target: string;
    property: string;
    value: number;
  };
  prerequisites: string[];
  researched: boolean;
}

export type ShipType = 'scout' | 'fighter' | 'freighter' | 'miner' | 'cruiser' | 'battleship';

export interface GameState {
  player: Player;
  galaxy: StarSystem[];
  currentSystem: StarSystem | null;
  inCombat: boolean;
  enemies?: Ship[];
  activeMission?: Mission;
  marketPrices: {
    [stationId: string]: {
      [resourceId: string]: number;
    };
  };
  notifications: Notification[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  timestamp: number;
  read: boolean;
}