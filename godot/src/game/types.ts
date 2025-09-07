/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { World } from "../world/types";
import { Civilization } from "../civ/types";
import { Lexeme } from "../types/lexeme";
import { SceneObject as ParserSceneObject, Effect as ParserEffect } from '../systems/parser/types';
import { Inventory } from '../systems/inventory';
import { AccordState, FactionState, ID, MaskTag, NPCState } from "../accord/types";
import { OmenWeights } from '../omen/types';

export type { Lexeme, ParserEffect, Inventory };

export type SceneObject = ParserSceneObject & {
  takeable?: boolean;
  itemId?: string;
};


export type Phase =
  | "TITLE"
  | "ORIGIN_SELECTION"
  | "WORLD_GEN"
  | "FIRST_MASK_FORGE"
  | "MASK_REVEAL"
  | "OMEN"
  | "LOADING"
  | "SCENE"
  | "COLLAPSE"
  | "GENERATION_TESTER";

export enum ResourceId {
  TIME = "TIME",
  CLARITY = "CLARITY",
  CURRENCY = "COIN",
}

export type Resources = Record<ResourceId, number>;

export type Origin = {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  initialPlayerMarkId?: string;
  resourceModifier?: Partial<Resources>;
  omenBias?: string[]; // Array of Omen IDs
  lexemeBias?: string[]; // Array of Lexeme IDs
};

export type Omen = {
  id: string;
  text: string;
  severity: 1 | 2 | 3;
  embrace: {
    label: string;
    description: string;
  };
  resist: {
    label: string;
    description: string;
  };
};

export type Effect = {
  resource: ResourceId;
  delta: number;
};

export type ActionOutcome = {
  id: string;
  label: string;
  effects: Effect[];
  grantsMarks?: Mark[];
};

export type Encounter = {
  id: string;
  prompt: string;
  internalThoughtHint?: string;
  options: ActionOutcome[];
};

export type Mark = {
  id: string;
  label: string;
  value: number;
};

export type MaskStyle = { strokes: number; symmetry: number; paletteKey: string; };

export type Mask = {
  id:string;
  name: string;
  description: string;
  imageUrl: string;
  grantedMarks: Mark[];
  themeOfFate: Record<string, number>;
};

export type Player = {
  id: ID;
  name: string;
  maskTag: MaskTag;
  resources: Resources;
  marks: Mark[];
  mask: Mask | null;
  unlockedLexemes: string[]; // Lexeme IDs
  flags: Set<string>;
  inventory: Inventory;
};

export type WorldData = {
  world: World | null;
  civs: Civilization[];
};

export type GameScreen =
  | { kind: "TITLE" }
  | { kind: "ORIGIN_SELECTION"; origins: Origin[] }
  | { kind: "FIRST_MASK_FORGE" }
  | { kind: "MASK_REVEAL"; mask: Mask }
  | { kind: "OMEN"; omen: Omen }
  | { kind: "LOADING"; message: string; context: 'ENCOUNTER' | 'MASK' | 'WORLD_GEN' | 'SCENE' | 'ORIGIN_GEN' }
  | { kind: "SCENE"; sceneId: string; description: string; objects: SceneObject[]; narrativeLog: string[]; suggestedCommands: string[]; isHallucinating?: boolean; }
  | { kind: "RESOLVE"; summary: string }
  | { kind: "COLLAPSE"; reason: string; summaryLog: string[] }
  | { kind: "GENERATION_TESTER" };

export type GameEvent =
  | { type: "REQUEST_NEW_RUN" }
  | { type: "ORIGINS_GENERATED"; origins: Origin[] }
  | { type: "START_RUN"; origin: Origin }
  | { type: "WORLD_GENERATED"; world: World; civs: Civilization[]; worldFacts: string[] }
  | { type: "COMMIT_FIRST_MASK"; lexeme: Lexeme }
  | { type: "MASK_FORGED"; mask: Mask }
  | { type: "CONTINUE_AFTER_REVEAL" }
  | { type: "ACCEPT_OMEN"; omen: Omen; approach: 'embrace' | 'resist' }
  | { type: "LOAD_SCENE", sceneId: string }
  | { type: "ATTEMPT_ACTION", rawCommand: string }
  | { type: "GENERATION_FAILED"; error: string }
  | { type: "END_RUN"; reason: string }
  | { type: "LOAD_STATE"; snapshot: GameState }
  | { type: "RESET_GAME" }
  | { type: "RETURN_TO_TITLE" }
  | { type: "OPEN_TESTER" }
  | { type: "CLOSE_TESTER" };

export type GameState = {
  phase: Phase;
  player: Player;
  world: WorldData;
  screen: GameScreen;
  runId: string;
  activeOmen: Omen | null;
  activeOrigin: Origin | null;
  firstMaskLexeme: Lexeme | null;
  day: number;
  currentSceneId: string | null;
  worldFacts: string[];
  // Accord System State
  npcs: Record<ID, NPCState>;
  factions: Record<ID, FactionState>;
  accord: AccordState;
  // Omen System State
  omenWeights: OmenWeights;
  // UI/UX State
  rumors: { text: string; id: string }[];
  lastEchoTimestamp: number;
};

// Lexicon System Types
export type RegionCode = "en-US" | "en-GB" | "en-CA" | "en-AU" | "ga-IE" | "fr-FR" | "es-ES" | "es-419" | "custom";
export type Affiliation =
  | "inquisition" | "clergy" | "bureaucracy" | "academy" | "guild" | "military" | "rural" | "urban" | "commoner" | "outlaw";

export interface SpeakerContext {
  locale: string;
  region: RegionCode;
  affiliations: Affiliation[];
  role?: string;
}

// Generation Tester Types
export type MaskSpec = {
  material: string;
  forge: string;
  intent: "Aggression" | "Wisdom" | "Cunning";
  word: string;
  condition: string;
  motif: string;
  aura: string;
  presentation: string;
};

export type ThemeOfFate = {
  id: string;
  label: string;
};

export type TesterMask = {
  name: string;
  description: string;
  grantedMarks: Mark[];
  themeOfFate?: ThemeOfFate;
  imagePrompt: string;
  textPrompt: string;
  spec: MaskSpec;
  imageUrl?: string;
  error?: string;
};
