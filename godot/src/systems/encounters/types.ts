import { Affiliation } from "../../game/types";

export type Seed = string;

export type Id<T extends string> = `${T}_${string}`;

export type RegionId = Id<"region">;
export type FactionId = Id<"faction">;
export type NpcId = Id<"npc">;

export type Disposition = "ally" | "neutral" | "hostile";
export type RoleTag = "merchant" | "captain" | "witch" | "thief" | "lord" | "artisan" | "guard" | "outsider" | "commoner";

export interface Npc {
  id: NpcId;
  name: string;
  appearance: string[]; // e.g., ["scarred", "well-dressed"]
  region: RegionId;
  faction?: FactionId;
  affiliations: Affiliation[];
  roleTags: RoleTag[];
  marks: string[];        // reputation tags in your game
  notoriety: number;      // 0..100
  ties: { npc: NpcId; weight: number }[]; // social graph
}

export interface RegionTensionEdge {
  a: FactionId;
  b: FactionId;
  weight: number; // negative = cooperation, positive = conflict
  topics: string[]; // "taxes", "smuggling", "heresy"
}

export interface RegionState {
  id: RegionId;
  name: string;
  factions: FactionId[];
  tensionEdges: RegionTensionEdge[];
  scarcity: Record<string, number>; // resource => 0..100
  entropy: number; // 0..100 pressure
}

export interface RunState {
  seed: Seed;
  day: number;
  playerMarks: string[];
  region: RegionId;
  exposedFactions: FactionId[];    // discovered so far
  notoriety: number;               // player notoriety in region
}

export interface EncounterSlot { // structural roles an encounter needs
  key: "instigator" | "target" | "witness" | "authority" | "terrain";
  requires: Partial<{
    roleTag: RoleTag;
    sameFactionAs?: "instigator" | "target";
    dispositionToPlayer: Disposition | "any";
    minNotoriety: number;
    maxNotoriety: number;
  }>;
}

export interface EncounterSchema {
  id: Id<"encschema">;
  name: string;
  weight: number; // base prior
  slots: EncounterSlot[];
  stakes: ("coin" | "time" | "mark_gain" | "mark_risk" | "echo_seed")[];
  topics: string[]; // theming, intersects with tension topics
  minEntropy?: number;
  maxEntropy?: number;
}

export interface ScoredCandidate<T> {
  item: T;
  score: number;
  reason: string[];
}

export interface StructuredEncounter {
  id: Id<"enc">;
  schemaId: EncounterSchema["id"];
  region: RegionId;
  roles: Record<EncounterSlot["key"], NpcId | string>;
  stakes: EncounterSchema["stakes"];
  topics: string[];
  rand: number; // for stable client-side animation variance
}

export type RuleOp =
  | { op: "markIncludes"; anyOf: string[]; weight: number; target: "player" | "npc" | "pair" }
  | { op: "topicMatchesTension"; weight: number }
  | { op: "notorietyBand"; min: number; max: number; weight: number; target: "player" | "npc" }
  | { op: "factionEdgeWeight"; min?: number; max?: number; weight: number }
  | { op: "scarcity"; key: string; min: number; weight: number };

export interface RuleSpec {
  id: Id<"rule">;
  where: "schema" | "slot" | "candidate";
  appliesTo: "player" | "region" | "npc" | "pair";
  ops: RuleOp[];
}
