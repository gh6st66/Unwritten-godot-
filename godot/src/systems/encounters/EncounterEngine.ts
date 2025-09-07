import { EncounterSchema, Npc, RunState, StructuredEncounter, RuleSpec } from "./types";
import { NpcIndex } from "./NpcIndex";
import { Rulebook } from "./rules/Rulebook";
import { EncounterSuggester } from "./generators/EncounterSuggester";
import { REGION_PORT } from "../../data/regions";

export interface EncounterEngineDeps {
  schemas: EncounterSchema[];
  rules: RuleSpec[];
  npcs: Npc[];
}

export class EncounterEngine {
  private npcIndex: NpcIndex;
  private suggester: EncounterSuggester;

  constructor(deps: EncounterEngineDeps, npcIndex?: NpcIndex) {
    this.npcIndex = npcIndex || new NpcIndex(deps.npcs);
    const rulebook = new Rulebook(deps.rules);
    this.suggester = new EncounterSuggester(deps.schemas, this.npcIndex, rulebook);
  }

  suggest(run: RunState, region: Parameters<EncounterSuggester["suggest"]>[1]): StructuredEncounter | undefined {
    return this.suggester.suggest(run, region);
  }
}

// Minimal default rules. Expand in data files as needed.
export function defaultRules(): RuleSpec[] {
  return [
    {
      id: "rule_tension_topics",
      where: "schema",
      appliesTo: "region",
      ops: [{ op: "topicMatchesTension", weight: 8 }],
    },
    {
      id: "rule_player_notoriety_mid",
      where: "schema",
      appliesTo: "player",
      ops: [{ op: "notorietyBand", min: 20, max: 70, weight: 4, target: "player" }],
    },
    {
      id: "rule_scarcity_coin",
      where: "schema",
      appliesTo: "region",
      ops: [{ op: "scarcity", key: "grain", min: 50, weight: 6 }],
    },
    {
      id: "rule_npc_notoriety_scaler",
      where: "candidate",
      appliesTo: "npc",
      ops: [{ op: "notorietyBand", min: 10, max: 90, weight: 1, target: "npc" }],
    },
  ];
}

// Example quick-wire usage:
export function demoSuggestion(run: RunState, schemas: EncounterSchema[], npcs: Npc[]) {
  const engine = new EncounterEngine({ schemas, rules: defaultRules(), npcs });
  return engine.suggest(run, REGION_PORT as any);
}
