/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// core types from spec
export type SlotName = "object" | "target" | "tool" | "container" | "direction" | "topic" | "lexeme" | "quantity";

export type IntentType = 'PHYSICAL' | 'SOCIAL' | 'INTERNAL';

export type FailReason =
  | "unknown_intent"
  | "unknown_verb"
  | "unknown_object"
  | "ambiguous_object"
  | "missing_slots_or_reqs"
  | "bad_direction"
  | `missing_requirement:${string}`
  | "out_of_scope"
  | "cooldown"
  | "blocked_by_state"
  | "empty_input";

export interface Intent {
  id: string;
  root: string;
  intentType: IntentType;
  verbs?: string[]; // canonical + synonyms
  slots: SlotName[];
  requirements?: {
    location_tag?: string[];
    resources?: Record<string, number>;
    flags_any?: string[];
    flags_all?: string[];
  };
  effects: Effect[];
  hints?: string[]; // example commands
  trait_vector?: Partial<Record<"AGG" | "WIS" | "CUN", number>>;
}

export type Effect =
  | { type: "message"; key?: string; text?: string }
  | { type: "move" }
  | { type: "advance_time"; minutes: number }
  | { type: "state"; path: string; op: "set" | "inc" | "dec"; value: any }
  | { type: "create"; item: string; into?: "inventory" | "scene"; mods?: string[] }
  | { type: "destroy"; id: string }
  | { type: "emit_echo"; magnitude: number };

export interface SceneObject {
  id: string; // e.g. "mask_blank#1"
  name: string; // e.g. "blank mask"
  aliases: string[];
  tags: string[];
  salience: number; // 0..1
  inspect?: string;
  state?: Record<string, any>;
}

export interface SceneIndex {
  scene_id: string;
  description: string;
  tags?: string[];
  objects: SceneObject[];
  exits: Record<string, string>; // direction -> scene_id
}

export interface Lexicon {
  verbs: Record<string, string[]>; // canonical -> synonyms
  nouns: Record<string, string[]>; // canonical -> aliases
  directions: Record<string, string[]>; // "n"->["north","n"], etc.
}

export interface ParseResult {
  verb?: string;
  slots: Partial<Record<SlotName, string>>;
  raw: string;
}

export interface ResolveResult {
  ok: boolean;
  intent_id?: string;
  intentType?: IntentType;
  bindings?: Record<string, string>;
  reason?: FailReason;
  message?: string; // player-facing
  suggested?: string[]; // commands
}
