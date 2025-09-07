/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { AccordState, FactionState, NPCState } from '../../accord/types';

export const INITIAL_FACTIONS: Record<string, FactionState> = {
  "COUNCIL": {
    id: "COUNCIL", name: "The Council", ideals: ["oath", "order"], cohesion: 50,
    stance: { "HERALD": 10, "TRICKSTER": -10 }
  },
  "REBELS": {
    id: "REBELS", name: "The Rebels", ideals: ["freedom", "secrecy"], cohesion: 30,
    stance: { "HERALD": -5, "TRICKSTER": 15 }
  }
};

export const INITIAL_NPCS: Record<string, NPCState> = {
  "ELDER_ANAH": {
    id: "ELDER_ANAH", name: "Elder Anah", factions: ["COUNCIL"],
    loyalties: { "COUNCIL": 25, "oath": 40 },
    recognition: { trust: 0, fear: 0, awe: 0 },
    memory: []
  }
};

export const INITIAL_ACCORD: AccordState = {
  stability: 0,
  vector: 'NEUTRAL',
  drivers: [],
  thresholds: { unity: 40, fracture: -40 },
  scheduledBeats: []
};