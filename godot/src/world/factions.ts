/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Rng } from '../world/rng';
import { FACTION_PREFIXES, FACTION_ADJECTIVES, FACTION_NOUNS } from '../content/names/factions';
import { Faction, FactionRelations } from './types';

export function generateFactions(rng: Rng, numFactions: number): { factions: Faction[], relations: FactionRelations } {
  const factions: Faction[] = [];
  const relations: FactionRelations = {};

  // Generate factions
  for (let i = 0; i < numFactions; i++) {
    const id = `wfac_${i}_${rng.int(1e9).toString(36)}`;
    factions.push({
      id,
      name: `${rng.pick(FACTION_PREFIXES)} of the ${rng.pick(FACTION_ADJECTIVES)} ${rng.pick(FACTION_NOUNS)}`,
      ethos: {
        tradition: rng.float(-1, 1),
        ambition: rng.float(-1, 1),
        stoicism: rng.float(-1, 1),
      },
      claims: [], // Can be populated later
    });
  }

  // Generate grudge matrix
  for (let i = 0; i < factions.length; i++) {
    for (let j = i; j < factions.length; j++) {
      const f1 = factions[i];
      const f2 = factions[j];
      
      if (f1.id === f2.id) {
        relations[`${f1.id}:${f2.id}`] = 1; // Factions have perfect relations with themselves
        continue;
      }
      
      // Calculate relation based on ethos difference
      const ethosDiff = 
        Math.abs(f1.ethos.tradition - f2.ethos.tradition) +
        Math.abs(f1.ethos.ambition - f2.ethos.ambition) +
        Math.abs(f1.ethos.stoicism - f2.ethos.stoicism);
      
      // Normalize diff (max diff is 6) and invert (high diff = low relation)
      let relation = 1 - (ethosDiff / 6);
      
      // Add some random noise
      relation += rng.float(-0.2, 0.2);
      
      // Clamp to [-1, 1]
      relation = Math.max(-1, Math.min(1, relation));
      
      const key = [f1.id, f2.id].sort().join(':');
      relations[key] = relation;
    }
  }

  return { factions, relations };
}
