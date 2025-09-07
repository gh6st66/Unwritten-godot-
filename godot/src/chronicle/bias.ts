/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChronicleEvent } from '../domain/events';
import { BiasDeltas } from './types';

/**
 * Calculates biases for a new run based on the entire history of events.
 * This function creates a simple model of cause-and-effect across runs.
 */
export function calculateBias(events: ChronicleEvent[]): BiasDeltas {
  const deltas: BiasDeltas = {
    factionStanceDeltas: {},
  };
  
  // A simplified map of intents to their long-term faction stance consequences.
  const STANCE_CHANGE_MAP: Record<string, { faction: string, mask: string, delta: number}[]> = {
      'OATH_SWEAR': [{ faction: 'COUNCIL', mask: 'HERALD', delta: 0.05 }, { faction: 'REBELS', mask: 'HERALD', delta: -0.02 }],
      'OATH_RENOUNCE': [{ faction: 'COUNCIL', mask: 'HERALD', delta: -0.1 }],
      'BETRAY_ACT': [{ faction: 'COUNCIL', mask: 'TRICKSTER', delta: -0.08 }, { faction: 'REBELS', mask: 'TRICKSTER', delta: 0.05 }],
      'ALLY_DECLARE': [{ faction: 'REBELS', mask: 'TRICKSTER', delta: 0.06 }],
  };

  for (const event of events) {
    if (event.type === 'ACCORD_DELTA_APPLIED') {
      const changes = STANCE_CHANGE_MAP[event.intentId];
      if (changes) {
          for (const change of changes) {
            const key = `${change.faction}:${change.mask}`;
            deltas.factionStanceDeltas[key] = (deltas.factionStanceDeltas[key] || 0) + change.delta;
          }
      }
    }
  }
  
  // Cap the biases to a reasonable range to prevent wild swings.
  for(const key in deltas.factionStanceDeltas) {
      deltas.factionStanceDeltas[key] = Math.max(-0.5, Math.min(0.5, deltas.factionStanceDeltas[key]));
  }

  return deltas;
}
