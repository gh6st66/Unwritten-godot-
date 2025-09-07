/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface SiteDef {
  id: string;
  name: string;
  tags: string[];
  biome?: string;
  factions?: string[];
  risk?: { tier: number };
  rarity?: "common" | "uncommon" | "rare" | "mythic";
  verbs_supported?: string[];
  hooks?: string[];
  state?: { type: string; data: any };
  echo_triggers?: string[];
}

export interface RelicDef {
  id: string;
  name: string;
  rarity: "common" | "uncommon" | "rare" | "mythic";
  tags: string[];
  affordances: string[];
  effects?: { stat: string; delta: number; scope: string }[];
  echo_triggers: string[];
}

export interface RiteDef {
  id: string;
  name: string;
  domain: string;
  costs: { time: number; clarity: number; offering?: string };
  requirements: string[];
  effects: string[];
  verbs_supported: string[];
  echo_triggers: string[];
}

export interface HazardDef {
  id: string;
  name: string;
  biomes: string[];
  risk: { tier: number };
  avoid_by: string[];
  consequence: string[];
  echo_triggers: string[];
}
