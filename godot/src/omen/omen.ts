/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { OmenTag, OmenWeights } from "./types";

type OmenUpdateAction =
  | { type: "CHOICE"; tag: OmenTag; weight?: number }
  | { type: "MISS"; winningTag: OmenTag };

const TAGS: OmenTag[] = ["embrace", "resist", "mixed"];

/**
 * A pure function that takes the current omen weights and an action,
 * and returns the new, updated weights.
 */
export function updateOmenWeights(current: OmenWeights, action: OmenUpdateAction): OmenWeights {
  const next = structuredClone(current);

  // 1. Decay all values towards the midpoint (0.5)
  for (const tag of TAGS) {
    next.values[tag] = next.values[tag] * next.decay + 0.5 * (1 - next.decay);
  }
  
  // 2. Apply action-specific changes
  if (action.type === 'CHOICE') {
    // A choice strongly pushes the chosen tag up and others down.
    const pushValue = action.weight ?? 0.2;
    next.values[action.tag] += pushValue;
    const otherTags = TAGS.filter(t => t !== action.tag);
    for (const other of otherTags) {
      next.values[other] -= pushValue / otherTags.length;
    }
  } else if (action.type === 'MISS') {
    // Handle pity system for tags that didn't win
    for (const tag of TAGS) {
        if (tag !== action.winningTag) {
            next.missCounters[tag] = (next.missCounters[tag] || 0) + 1;
            const pityRule = next.pity?.[tag];
            if (pityRule && next.missCounters[tag] >= pityRule.misses) {
                // Pity triggers: boost the floor and reset counter
                next.floors[tag] = Math.min(1.0, (next.floors[tag] || 0) + pityRule.floorBoost);
                next.missCounters[tag] = 0;
            }
        } else {
            // Reset miss counter for the winning tag
            next.missCounters[tag] = 0;
        }
    }
  }

  // 3. Normalize values so they sum to 1
  let sum = TAGS.reduce((acc, tag) => acc + Math.max(0, next.values[tag]), 0);
  if (sum === 0) sum = 1; // Avoid division by zero
  for (const tag of TAGS) {
    next.values[tag] = Math.max(0, next.values[tag]) / sum;
  }

  // 4. Enforce floors and ceilings, then re-normalize
  for (const tag of TAGS) {
    next.values[tag] = Math.max(next.floors[tag] || 0, next.values[tag]);
    next.values[tag] = Math.min(next.ceilings[tag] || 1, next.values[tag]);
  }

  sum = TAGS.reduce((acc, tag) => acc + next.values[tag], 0);
  if (sum > 0) {
    for (const tag of TAGS) {
      next.values[tag] /= sum;
    }
  }

  return next;
}
