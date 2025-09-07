/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Encounter, ResourceId } from '../game/types';

// This serves as a fallback or default encounter if the dynamic generation fails.
export const FALLBACK_ENCOUNTER: Encounter = {
    id: "fallback_confrontation",
    prompt: "A hush falls. Someone speaks your title like a curse. All eyes are on you.",
    internalThoughtHint: "(Pick a direction. Commit.)",
    options: [
      { 
        id: "defy", 
        label: "Defy the room", 
        effects: [{ resource: ResourceId.TIME, delta: -1 }, { resource: ResourceId.CLARITY, delta: 1 }],
        grantsMarks: [{id: 'defiant', label: 'Defiant', value: 1}]
      },
      { 
        id: "yield", 
        label: "Yield and listen", 
        effects: [{ resource: ResourceId.TIME, delta: -1 }],
        grantsMarks: [{id: 'compliant', label: 'Compliant', value: 1}]
      },
      {
        id: "observe",
        label: "Wait and see",
        effects: [{ resource: ResourceId.TIME, delta: -1 }]
      }
    ]
};