/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type OmenTag = "embrace" | "resist" | "mixed";

export type OmenBand = "unlikely" | "possible" | "favored" | "very likely";

export interface OmenWeights {
  values: Record<OmenTag, number>;         // normalized
  decay: number;                            // 0..1
  floors: Record<OmenTag, number>;
  ceilings: Record<OmenTag, number>;
  pity: Partial<Record<OmenTag, { misses: number; floorBoost: number }>>;
  anchors: Array<{ tag: OmenTag; min: number; beatsLeft: number }>;
  nudges: Array<{ tag: OmenTag; delta: number; beatsLeft: number }>;
  multipliers: {
    mask: Partial<Record<OmenTag, number>>;
    site: Partial<Record<OmenTag, number>>;
  };
  missCounters: Record<OmenTag, number>;    // for pity
}
