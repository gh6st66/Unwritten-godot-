/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { World, WorldGenConfig, Region, Site, GridCell, Faction } from './types';
import { makeRNG } from './rng';
import { DialectId } from '../systems/dialect/types';
import DIALECTS_DATA from '../data/dialects.js';
import { REGION_PREFIXES, REGION_SUFFIXES } from '../content/names/regions';
import { BIOMES } from '../content/biomes';
import { SITE_DEFS } from '../content/sites';
import { generateFactions } from './factions';

interface Dialect {
  id: DialectId;
}

export function generateWorld(cfg: WorldGenConfig): { world: World, worldFacts: string[] } {
  const rng = makeRNG(cfg.worldSeed);
  const worldId = `world_${rng.int(1e9).toString(36)}`;

  const numRegions = rng.int(5) + 8; // 8-12 regions
  const regions: Record<string, Region> = {};
  const regionIds: string[] = [];
  const grid: GridCell[] = [];

  // 1. Create regions
  for (let i = 0; i < numRegions; i++) {
    const regionId = `region_${i}_${rng.int(1e9).toString(36)}`;
    regionIds.push(regionId);
    
    const biome = rng.pick(BIOMES);
    const sites: Site[] = [];
    const numSites = rng.int(3) + 1; // 1-3 sites per region
    const sitePool = SITE_DEFS.filter(def => biome.allowedSiteTags.some(tag => def.tags.includes(tag)));
    
    for (let j = 0; j < numSites && sitePool.length > 0; j++) {
        const siteDef = rng.pick(sitePool);
        sites.push({
            id: `site_${rng.int(1e9).toString(36)}`,
            defId: siteDef.id,
            name: siteDef.name,
        });
    }

    const dialectId = rng.pick(DIALECTS_DATA as Dialect[]).id;
    const cellIndex = grid.length;
    grid.push({ biome: biome.id });

    regions[regionId] = {
      id: regionId,
      name: `${rng.pick(REGION_PREFIXES)} ${rng.pick(REGION_SUFFIXES)}`,
      neighbors: [],
      biome: biome.id,
      dialectId: dialectId,
      sites,
      identity: {
          wealth: rng.float(0, 1),
          law: rng.float(-1, 1),
          temperament: rng.float(-1, 1),
          dialectId: dialectId,
      },
      cells: [cellIndex],
    };
  }

  // 2. Connect regions into a graph, ensuring it's connected
  const connected = new Set<string>([regionIds[0]]);
  const unconnected = new Set<string>(regionIds.slice(1));
  
  while (unconnected.size > 0) {
    const fromId = rng.pick(Array.from(connected));
    const toId = rng.pick(Array.from(unconnected));

    regions[fromId].neighbors.push(toId);
    regions[toId].neighbors.push(fromId);
    
    connected.add(toId);
    unconnected.delete(toId);
  }
  
  // Add a few more random connections to create cycles
  const extraConnections = Math.floor(numRegions / 3);
  for (let i = 0; i < extraConnections; i++) {
    const r1 = rng.pick(regionIds);
    const r2 = rng.pick(regionIds);
    if (r1 !== r2 && !regions[r1].neighbors.includes(r2)) {
        regions[r1].neighbors.push(r2);
        regions[r2].neighbors.push(r1);
    }
  }

  // 3. Generate world-level factions and relations
  const { factions, relations } = generateFactions(rng, cfg.numFactions);
  const factionsById = factions.reduce((acc, f) => ({ ...acc, [f.id]: f }), {});

  const worldFacts: string[] = [];
  worldFacts.push(`The world was shaped by the inscription: ${cfg.worldSeed.substring(0, 8)}...`);

  // Find most extreme relationship
  let mostHated: {f1: Faction, f2: Faction, val: number} | null = null;
  for(const key in relations) {
      const [id1, id2] = key.split(':');
      if (id1 === id2 || !factionsById[id1] || !factionsById[id2]) continue;
      
      const val = relations[key];
      if (mostHated === null || val < mostHated.val) {
          mostHated = { f1: factionsById[id1], f2: factionsById[id2], val };
      }
  }
  if (mostHated) {
      worldFacts.push(`A deep-seated rivalry exists between The ${mostHated.f1.name} and The ${mostHated.f2.name}.`);
  }

  // Find most extreme region
  let mostExtremeRegion: Region | null = null;
  let maxIntensity = -1;
  for(const region of Object.values(regions)) {
      const intensity = Math.abs(region.identity.law) + Math.abs(region.identity.temperament);
      if (intensity > maxIntensity) {
          maxIntensity = intensity;
          mostExtremeRegion = region;
      }
  }
  if (mostExtremeRegion) {
      const law = mostExtremeRegion.identity.law > 0.5 ? 'strictly lawful' : mostExtremeRegion.identity.law < -0.5 ? 'lawless' : 'unruly';
      const temp = mostExtremeRegion.identity.temperament > 0.5 ? 'militant' : mostExtremeRegion.identity.temperament < -0.5 ? 'pacifist' : 'volatile';
      worldFacts.push(`The region of ${mostExtremeRegion.name} is known for being ${law} and ${temp}.`);
  }
  
  const world: World = {
    id: worldId,
    seed: cfg.worldSeed,
    regions,
    factions: factionsById,
    relations,
    history: [],
    grid,
  };

  return { world, worldFacts: worldFacts.slice(0, 3) };
}
