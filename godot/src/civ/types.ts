/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { DialectId } from '../systems/dialect/types';
import { Mark, MaskStyle } from '../game/types';

export type CivId = string;
export type FactionId = string;
export type NpcId = string;
export type EchoId = string;

export interface CivEvent {
  year: number;
  type: 'treaty' | 'rebellion' | 'canonize' | 'exile';
  notes: string;
  echoRef?: EchoId;
}

export interface Civilization {
  id: CivId;
  name: string;
  regionHome: string;
  values: { honor: number; pragmatism: number; mysticism: number; };
  population: number;
  dialectId: DialectId;
  factions: Faction[];
  npcs: NPC[];
  ledger: CivEvent[];
}

export interface Faction {
  id: FactionId;
  civId: CivId;
  name: string;
  agenda: 'expansion' | 'trade' | 'ascetic' | 'heresy' | 'seafaring';
  stance: Record<FactionId, -1 | 0 | 1>;
  power: number;
  worldFactionId?: string; // Link to a high-level world faction
}

export type Disposition = "friendly" | "neutral" | "hostile" | "scheming";

export interface NPC {
  id: NpcId;
  name: string;
  age: number;
  role: string;
  civId: CivId;
  factionId?: FactionId;
  regionId: string;
  disposition: Disposition;
  marks: Mark[];
  maskStyle: MaskStyle;
}
