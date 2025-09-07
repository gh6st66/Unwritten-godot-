/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * Represents the calculated changes to be applied to a new run,
 * based on the history of events in the Chronicle.
 */
export type BiasDeltas = {
    /** "FACTION_ID:MASK_TAG" -> stance change delta */
    factionStanceDeltas: Record<string, number>;
};