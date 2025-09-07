import { EncounterSchema } from "../systems/encounters/types";

export const ENCOUNTER_SCHEMAS: EncounterSchema[] = [
  {
    id: "encschema_quiet_shake",
    name: "Dockside Shake",
    weight: 5,
    topics: ["smuggling", "tariffs"],
    stakes: ["coin", "mark_risk", "echo_seed"],
    slots: [
      { key: "instigator", requires: { roleTag: "thief" as any, minNotoriety: 15 } },
      { key: "target", requires: { roleTag: "merchant" } },
      { key: "witness", requires: { roleTag: "artisan" } },
      { key: "authority", requires: { roleTag: "guard" } },
      { key: "terrain", requires: {} }, // string like "warehouse alley"; fill later or via LLM
    ],
  },
  {
    id: "encschema_watch_tax",
    name: "Inspection Line",
    weight: 4,
    topics: ["permits", "tariffs"],
    stakes: ["time", "mark_gain"],
    slots: [
      { key: "instigator", requires: { roleTag: "guard" } },
      { key: "target", requires: { roleTag: "merchant" } },
      { key: "witness", requires: { roleTag: "outsider" } },
      { key: "terrain", requires: {} },
    ],
  },
];