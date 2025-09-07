/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// --- Core Types ---
export interface RegionCulture {
    id: string;
    motifs: string[];
    taboos: string[];
    palette: string[];
    materialPriorities: Record<string, number>;
}

export interface MaskBlueprint {
    id: string;
    title: string;
    vows: string[];
    symbols: string[];
    materials: string[];
}

export interface MaskSeed {
    regionId: string;
    cultureId: string;
    promptHints: string[];
}

export interface MaskDescription {
    title: string;
    summary: string;
    appearance: string;
    craftNotes: string;
    ritualUse?: string;
    legalNote?: string;
    tags: string[];
}

// --- Stubs for Modal ---
// These are kept to satisfy the existing MaskCultureModal component,
// but their underlying types are now concrete.
export type MaskForgeResult = {
    description: MaskDescription;
    imageUrl: string;
};
