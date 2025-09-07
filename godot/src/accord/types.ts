/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// --- Core Types ---
export type ID = string;
export type MaskTag = 'HERALD' | 'TRICKSTER' | string; // Allow for expansion

// --- Deltas ---
export interface RecognitionDelta { npcId: ID; trust?: number; fear?: number; awe?: number }
export interface LoyaltyDelta { subjectId: ID; to: ID; delta: number }
export interface AccordDelta { stability: number; drivers?: {source: ID; delta: number}[] }
export interface BeatSchedule { id: string; when: string; pre?: Record<string, unknown>; payload?: any }
export interface EchoRecord { event: string; tags?: string[]; dAccord?: number; payload?: any }

export interface EngineDelta {
  recognition?: RecognitionDelta[];
  loyalty?: LoyaltyDelta[];
  accord?: AccordDelta;
  beats?: BeatSchedule[];
  echoes?: EchoRecord[];
  lineId?: string; // ID of a text variant block to display
  debug?: Record<string, unknown>;
}

// --- State Shapes ---
export interface NPCState {
    id: ID;
    name: string;
    factions: ID[];
    loyalties: Record<ID, number>; // to->score
    recognition: { trust: number; fear: number; awe: number };
    memory: { key: string; val: number; ttlRuns: number }[];
}

export interface FactionState {
    id: ID;
    name: string;
    ideals: string[];
    cohesion: number;
    stance: Record<MaskTag, number>; // MaskTag -> affinity score
}

export interface AccordState {
    stability: number; // -100 to 100
    vector: 'UNITY' | 'FRACTURE' | 'NEUTRAL';
    drivers: {source: ID; delta: number}[];
    thresholds: { unity: number; fracture: number };
    scheduledBeats: BeatSchedule[];
}

// --- Text Variants ---
export type Condition = string; // e.g., "npc('Elder').recognition.trust > 20"
export interface VariantLine {
    if?: Condition;
    weight?: number;
    text: string;
}
export interface VariantBlock {
    id: string;
    variants: VariantLine[];
}

// --- Intent Context ---
export interface IntentCtx {
    intentId: string;
    actorId: ID;
    mask: MaskTag;
    sceneId: string | null;
    bindings: Record<string, string>;
}