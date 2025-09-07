import { RegionState } from "../systems/encounters/types";

export const REGION_PORT: Omit<RegionState, 'factions' | 'tensionEdges'> & {factions: string[], tensionEdges: any[]} = {
  id: "region_port",
  name: "Harbor Quarter",
  factions: ["faction_guild", "faction_watch", "faction_smugglers"],
  entropy: 42,
  scarcity: { coin: 30, grain: 65, timber: 20 },
  tensionEdges: [
    { a: "faction_guild", b: "faction_smugglers", weight: 70, topics: ["smuggling", "tariffs"] },
    { a: "faction_watch", b: "faction_smugglers", weight: 55, topics: ["contraband"] },
    { a: "faction_guild", b: "faction_watch", weight: 15, topics: ["permits"] },
  ],
};