/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type GlossaryEntry = {
  id: string;
  term: string;
  definition: string;
  updatedAt: string;
};

export type GlossaryCategory = {
  id: string;
  name: string;
  entries: GlossaryEntry[];
};

export const glossaryData: GlossaryCategory[] = [
  {
    "id": "resources-economy",
    "name": "Resources & Economy",
    "entries": [
      {
        "id": "resource-pools",
        "term": "Resource Pools",
        "definition": "The game’s core currencies: Aggression, Wisdom, Cunning, and hybrids. They are spent to perform actions across all event types. There are no separate bars for combat, narrative, or social scenes.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "resource-interdependence",
        "term": "Resource Interdependence",
        "definition": "All event types share the same resource pools. Spending a resource in one encounter reduces its availability everywhere else, forcing players to weigh tactical versus narrative priorities.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "hybrid-resources",
        "term": "Hybrid Resources",
        "definition": "Costs that require a combination of two resources, such as Aggression + Wisdom. These narrow play options and force specialization or balance.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "real-time-economy",
        "term": "Real-Time Economy",
        "definition": "Resources and opportunities refresh on real-world time rather than in-game turns. This paces play and prevents grind abuse.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "daily-cycle",
        "term": "Daily Cycle",
        "definition": "The pacing unit of the real-time economy. Certain opportunities and events refresh once per real-world day.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "entropy-clock",
        "term": "Entropy Clock",
        "definition": "A hidden countdown tied to inaction or excess. As entropy rises, Collapse accelerates.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "seasonal-shifts",
        "term": "Seasonal Shifts",
        "definition": "Periodic changes in the world tied to real-world weeks or months, altering available masks, tensions, and factions.",
        "updatedAt": "2025-08-21T00:00:00Z"
      }
    ]
  },
  {
    "id": "identity-persistence",
    "name": "Identity & Persistence",
    "entries": [
      {
        "id": "unwritten",
        "term": "The Unwritten",
        "definition": "The player character; a being whose fate is not yet fixed, capable of wearing masks to assume identities and alter the world's history through their actions and inevitable Collapse.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "mask",
        "term": "Mask",
        "definition": "Unique artifacts tied to identity. Masks grant traits, modify encounters, and can carry forward across runs through provenance or legacy. They are the most valuable items in the world.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "persona-mask",
        "term": "Persona Mask",
        "definition": "A mask archetype tied directly to behavioral tendencies (e.g., Trickster, Guardian). Shapes dispositions and social dynamics.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "provenance",
        "term": "Provenance",
        "definition": "The ownership history of a unique item. Provenance is tracked permanently, giving masks a sense of mythic weight as they pass through many hands.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "mask-exchange",
        "term": "Mask Exchange",
        "definition": "A player-driven marketplace where masks can be listed, bought, and sold. Tracks provenance, ensures no duplication exploits, and integrates into the game economy.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "mark",
        "term": "Mark",
        "definition": "Persistent reputation tags earned through choices. Marks influence NPC reactions, alter event pools, and carry into future runs.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "dispositions",
        "term": "Dispositions",
        "definition": "Sliding personality traits such as aggression, cunning, or wisdom. They influence narrative tone and occasionally unlock special outcomes.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "echo",
        "term": "Echo",
        "definition": "Persistent world changes recorded at the end of a run. Echoes can return in future runs as new encounters, altered locations, or vengeful NPCs.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "legacy",
        "term": "Legacy",
        "definition": "The record of past actions across runs. Determines which Echoes and world changes are available to manifest in subsequent games.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "reputation-ledger",
        "term": "Reputation Ledger",
        "definition": "The invisible accounting of all choices affecting NPCs and factions. Marks are its most visible entries.",
        "updatedAt": "2025-08-21T00:00:00Z"
      }
    ]
  },
  {
    "id": "narrative-fate",
    "name": "Narrative & Fate Systems",
    "entries": [
      {
        "id": "claim",
        "term": "Claim",
        "definition": "A fate assertion imposed on the player at the start of a run. Claims can be resisted or enacted, but the world will pressure the player to fulfill them.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "fate-record",
        "term": "Fate Record (The Journal)",
        "definition": "A meta-system that issues Claims, tracks whether they were fulfilled or resisted, and applies narrative gravity to upcoming events. Its name varies depending on the speaker's culture and affiliation, and may be referred to as the 'Ledger of Transgressions', 'Book of Deeds', or simply 'The Record'.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "narrative-gravity",
        "term": "Narrative Gravity",
        "definition": "A subtle pressure exerted by the Journal to steer events toward fulfilling current Claims, unless the player spends resources to resist.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "intent-system",
        "term": "Intent System",
        "definition": "A choice framework where actions are declared as intents, resolved by spending resources, and adjudicated by the rules engine.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "recognition",
        "term": "Recognition",
        "definition": "The world’s instinctive awareness of the Unwritten. NPCs identify the role on sight, influencing social dynamics, fear, and opportunity.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "omen",
        "term": "Omen",
        "definition": "A forecasted event seeded by world tensions or Marks. Omens foreshadow likely encounters that players may prepare for or subvert.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "whisper",
        "term": "Whisper",
        "definition": "Lightweight hints or rumors delivered to the player, often tied to Omens. Provide foreshadowing without certainty.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "fate-pressure",
        "term": "Fate Pressure",
        "definition": "Soft narrative force from the Journal that nudges toward archetypal outcomes even beyond explicit Claims.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "fork-event",
        "term": "Fork Event",
        "definition": "A branching decision point that closes off other possibilities until a new run resets them.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "thread",
        "term": "Thread",
        "definition": "A narrative throughline that can persist across runs, linking events, NPCs, or items into an ongoing subplot.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "inquisitor",
        "term": "Inquisitor",
        "definition": "A narrative enforcer who appears when Claims are resisted too strongly, escalating narrative gravity and consequences.",
        "updatedAt": "2025-08-21T00:00:00Z"
      }
    ]
  },
  {
    "id": "run-structure",
    "name": "Run Structure",
    "entries": [
      {
        "id": "run",
        "term": "Run",
        "definition": "One life of the Unwritten. Begins with a Claim, continues through encounters, and ends at Collapse. May leave Echoes behind.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "collapse",
        "term": "Collapse",
        "definition": "The inevitable end of a run. Finalizes consequences and writes eligible Echoes to the legacy pool.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "collapse-record",
        "term": "Collapse Record",
        "definition": "The written summary of a run at Collapse. May generate rumors, Echoes, or influence the Mask Exchange economy.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "intro-gate",
        "term": "Intro Gate",
        "definition": "A transitional sequence shown once at the start of a run, orienting the player before their first choice.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "opening-decree",
        "term": "Opening Decree",
        "definition": "The default Intro Gate variant where the Journal presents the first Claim and sets the run’s narrative tone.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "new-run-seed",
        "term": "New Run Seed",
        "definition": "The deterministic seed that initializes a run. Governs randomization for encounters, NPCs, and regional tensions.",
        "updatedAt": "2025-08-21T00:00:00Z"
      }
    ]
  },
  {
    "id": "world-meta",
    "name": "World & Meta Systems",
    "entries": [
      {
        "id": "region-seed",
        "term": "Region Seed",
        "definition": "A generational seed that shapes how a region evolves across runs, influencing its cities, factions, and mask styles.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "faction",
        "term": "Faction",
        "definition": "A persistent organization with distinct values, resources, and territories. Factions respond dynamically to the player’s reputation, marks, and Echoes.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "tension",
        "term": "Tension",
        "definition": "A background meter for regions or factions representing instability. High Tension increases the likelihood of Omens and escalated encounters.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "world-memory",
        "term": "World Memory",
        "definition": "A hidden layer storing what the world remembers from past runs, even beyond Echoes, subtly biasing future events.",
        "updatedAt": "2025-08-21T00:00:00Z"
      }
    ]
  },
  {
    "id": "market-items",
    "name": "Market & Items",
    "entries": [
      {
        "id": "curio",
        "term": "Curio",
        "definition": "Lesser artifacts, distinct from masks, that provide minor persistent traits or single-use effects. Often traded or consumed in events.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "relic-provenance",
        "term": "Relic Provenance",
        "definition": "The ownership history of powerful non-mask relics. Ensures artifacts gain mythic identity similar to masks.",
        "updatedAt": "2025-08-21T00:00:00Z"
      },
      {
        "id": "market-rumor",
        "term": "Market Rumor",
        "definition": "A whisper system tied to the Mask Exchange. Rumors influence speculation, inflating or depressing item values.",
        "updatedAt": "2025-08-21T00:00:00Z"
      }
    ]
  },
  {
    "id": "ui",
    "name": "User Interface",
    "entries": [
      {
        "id": "narrative-view",
        "term": "Narrative View",
        "definition": "The UI element that displays textual story descriptions, feedback, and the results of player actions.",
        "updatedAt": "2025-08-21T00:00:00Z"
      }
    ]
  }
];