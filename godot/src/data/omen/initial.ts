/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { OmenWeights } from "../../omen/types";

export const INITIAL_OMEN_WEIGHTS: OmenWeights = {
  values: {
    embrace: 0.5,
    resist: 0.4,
    mixed: 0.1,
  },
  decay: 0.98,
  floors: {
    embrace: 0.05,
    resist: 0.05,
    mixed: 0,
  },
  ceilings: {
    embrace: 0.95,
    resist: 0.95,
    mixed: 0.5,
  },
  pity: {
    resist: { misses: 3, floorBoost: 0.15 },
    embrace: { misses: 3, floorBoost: 0.15 },
  },
  anchors: [],
  nudges: [],
  multipliers: {
    mask: {},
    site: {},
  },
  missCounters: {
    embrace: 0,
    resist: 0,
    mixed: 0,
  },
};