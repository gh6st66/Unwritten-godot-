/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { World } from '../world/types';
import { Rng, makeRNG } from '../world/rng';
import { Civilization, Faction, NPC, Disposition } from './types';
import { DialectId } from '../systems/dialect/types';
import DIALECTS_DATA from '../data/dialects.js';

const FIRST_NAMES = ["Anya", "Bram", "Cora", "Darian", "Elara", "Finn", "Gwen", "Hale"];
const LAST_NAMES = ["Stonehand", "Swiftwater", "Blackwood", "Ironhide", "Silvermane"];
const ROLES = ["merchant", "guard", "artisan", "scholar", "thief", "noble", "captain", "witch", "outsider", "commoner"];
const DISPOSITIONS: Disposition[] = ["friendly", "neutral", "hostile", "scheming"];

interface Dialect {
    id: DialectId;
}

function generateFaction(rng: Rng, civId: string, worldFactionIds: string[]): Faction {
    const factionId = `faction_${rng.int(1e9).toString(36)}`;
    return {
        id: factionId,
        civId,
        name: `${rng.pick(["Order", "Circle", "Keepers", "Sons", "Daughters"])} of the ${rng.pick(["Crimson", "Ashen", "Iron", "Silent"])} ${rng.pick(["Hand", "Veil", "Blade", "Word"])}`,
        agenda: rng.pick(['expansion', 'trade', 'ascetic', 'heresy', 'seafaring']),
        stance: {},
        power: rng.next(),
        worldFactionId: rng.pick(worldFactionIds), // Align with a world faction
    };
}

function generateNpc(rng: Rng, civId: string, regionId: string, factionId?: string): NPC {
    return {
        id: `npc_${rng.int(1e9).toString(36)}`,
        name: `${rng.pick(FIRST_NAMES)} ${rng.pick(LAST_NAMES)}`,
        age: 20 + rng.int(40),
        role: rng.pick(ROLES),
        civId,
        factionId,
        regionId,
        disposition: rng.pick(DISPOSITIONS),
        marks: [],
        maskStyle: {
          strokes: rng.int(10),
          symmetry: rng.int(10),
          paletteKey: "base",
        },
    };
}


export function generateCivs(world: World, count: number): Civilization[] {
    const rng = makeRNG(`${world.seed}:civs`);
    const civs: Civilization[] = [];
    const regionIds = Object.keys(world.regions);
    const worldFactionIds = Object.keys(world.factions);

    if (regionIds.length === 0 || worldFactionIds.length === 0) return [];

    for (let i = 0; i < count; i++) {
        const civId = `civ_${i}_${rng.int(1e9).toString(36)}`;
        const homeRegionId = rng.pick(regionIds);
        
        // Civ factions are local manifestations of world factions
        const factions = Array.from({ length: rng.int(2) + 2 }, () => generateFaction(rng, civId, worldFactionIds));
        
        const npcs = Array.from({ length: rng.int(10) + 15 }, () => {
            const faction = rng.next() > 0.3 ? rng.pick(factions) : undefined;
            const regionId = rng.next() > 0.8 ? rng.pick(regionIds) : homeRegionId; // Most NPCs are in their home region
            return generateNpc(rng, civId, regionId, faction?.id);
        });

        const civ: Civilization = {
            id: civId,
            name: `${rng.pick(["The Sundered", "The Ashen", "The Gilded", "The Veiled"])} ${rng.pick(["Kingdom", "Compact", "Republic", "Hegemony"])}`,
            regionHome: homeRegionId,
            values: {
                honor: rng.next(),
                pragmatism: rng.next(),
                mysticism: rng.next(),
            },
            population: 1000 + rng.int(9000),
            dialectId: world.regions[homeRegionId]?.dialectId ?? rng.pick(DIALECTS_DATA as Dialect[]).id,
            factions,
            npcs,
            ledger: [],
        };
        civs.push(civ);
    }
    
    world.civIds = civs.map(c => c.id);
    return civs;
}
