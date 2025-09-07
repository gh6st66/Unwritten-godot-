/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Resources, Effect, ActionOutcome, ResourceId } from '../game/types';

export type SplitEffects = {
  costs: Effect[];
  gains: Effect[];
};

/**
 * Splits an array of effects into separate costs (negative delta) and gains (positive delta).
 */
export function splitEffects(effects: Effect[]): SplitEffects {
  const costs: Effect[] = [];
  const gains: Effect[] = [];
  for (const effect of effects) {
    if (effect.delta < 0) {
      costs.push(effect);
    } else if (effect.delta > 0) {
      gains.push(effect);
    }
  }
  return { costs, gains };
}

/**
 * Checks if an action outcome can be applied to a given resource pool.
 * @param pool The player's current resources.
 * @param outcome The action being considered.
 * @returns True if the action is affordable, false otherwise.
 */
export function canApply(pool: Resources, outcome: ActionOutcome): boolean {
  const { costs } = splitEffects(outcome.effects);
  for (const cost of costs) {
    if (pool[cost.resource] + cost.delta < 0) {
      return false; // Not enough resources
    }
  }
  return true;
}

/**
 * Applies the effects of an action outcome to a resource pool.
 * Assumes `canApply` has already been checked.
 * @param pool The player's current resources.
 * @param outcome The action being taken.
 * @returns The new resource pool after applying all effects.
 */
export function apply(pool: Resources, outcome: ActionOutcome): Resources {
  const newPool = { ...pool };
  for (const effect of outcome.effects) {
    newPool[effect.resource] = Math.max(0, (newPool[effect.resource] || 0) + effect.delta);
  }
  return newPool;
}

/**
 * Maps resource IDs to their thematic icons.
 */
export const resourceIcons: Record<ResourceId, string> = {
  [ResourceId.TIME]: "⏳",
  [ResourceId.CLARITY]: "👁",
  [ResourceId.CURRENCY]: "🪙",
};
