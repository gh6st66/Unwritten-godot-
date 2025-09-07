import { Npc } from "../systems/encounters/types";

export const NPCS_SAMPLE: Npc[] = [
  { id: "npc_mara", name: "Mara Silvers", appearance: ["wary-eyed", "silk-clad"], region: "region_port", faction: "faction_guild", affiliations: ["guild", "urban"], roleTags: ["merchant"], marks: ["upright"], notoriety: 30, ties: [] },
  { id: "npc_brent", name: "Brent Latcher", appearance: ["quick-eyed", "patchwork-cloak"], region: "region_port", faction: "faction_smugglers", affiliations: ["outlaw", "urban"], roleTags: ["thief"], marks: ["smuggler"], notoriety: 55, ties: [] },
  { id: "npc_sergeant", name: "Sergeant Ives", appearance: ["stern-faced", "armored"], region: "region_port", faction: "faction_watch", affiliations: ["military", "bureaucracy"], roleTags: ["guard", "captain"], marks: ["unyielding"], notoriety: 60, ties: [] },
  { id: "npc_hana", name: "Hana Weaver", appearance: ["ink-stained-fingers"], region: "region_port", faction: "faction_guild", affiliations: ["guild", "commoner"], roleTags: ["artisan"], marks: ["observant"], notoriety: 20, ties: [] },
  { id: "npc_stranger", name: "The Stranger", appearance: ["hooded", "weather-beaten"], region: "region_port", affiliations: ["rural", "commoner"], roleTags: ["outsider"], marks: ["rumored"], notoriety: 10, ties: [] },
];