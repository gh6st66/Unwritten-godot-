/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { DialectId } from '../systems/dialect/types';

export type WorldId = string;

export interface WorldGenConfig {
  worldSeed: string;
  historyYears: number;
  variance: number;
  numFactions: number;
}

export interface Site {
    id: string;
    defId: string; // From content/sites.ts
    name: string;
}

export interface RegionIdentity {
    wealth: number;
    law: number;
    temperament: number;
    dialectId: DialectId;
}

export interface GridCell {
    biome: 'tundra' | 'steppe' | 'forest' | 'desert' | 'wetland' | 'alpine' | 'coast';
}

export interface Region {
  id: string;
  name: string;
  neighbors: string[]; // Region IDs
  biome: 'tundra' | 'steppe' | 'forest' | 'desert' | 'wetland' | 'alpine' | 'coast';
  dialectId: DialectId;
  sites: Site[];
  identity: RegionIdentity;
  cells: number[];
}

export interface Faction {
  id: string;
  name:string;
  ethos: {
    tradition: number; // -1 (progress) to +1 (tradition)
    ambition: number;  // -1 (caution) to +1 (ambition)
    stoicism: number;  // -1 (passion) to +1 (stoicism)
  };
  claims: string[]; // regions claimed
}

export type FactionRelations = Record<string, number>; // Key is "faction1_id:faction2_id" sorted alphabetically

export interface World {
  id: WorldId;
  seed: string;
  regions: Record<string, Region>;
  factions: Record<string, Faction>;
  relations: FactionRelations;
  history: any[]; // Placeholder for historical events
  grid: GridCell[];
  civIds?: string[];
}

// Stubs for future systems
export type Beat = any;
export type Echo = any;
export type Pressure = any;
