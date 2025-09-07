# Unwritten - Systems Design (Dwarf Fortress Inspired)

This document outlines the core systems for Unwritten, reframing inspirations from deep simulation games like Dwarf Fortress into mechanics suitable for a narrative roguelike context.

---

### 1. World Generation & Seeds
**Goal:** Stable geography per worldSeed, slow socio-political drift per run.

- **Terrain & Biomes:** Stable geography per seed. Each biome feeds narrative tone (forest = whispers, desert = omens of thirst).
- **Geology & Minerals:** Materials used in mask forging gain regional rarity. Obsidian from volcano regions vs salt-crystal masks from deserts.
- **Historical Simulation:** Pre-run “echo simulation” creates ruins, dynasties, myths. Player enters an already-storied page, not a blank slate.

**Takeaway:** Geography is static, but cultural, mythic, and ruin layers drift between runs.

---

### 2. Civilizations, Factions, Cultures
**Goal:** DF-like civs that drift between runs; react to player Echoes.

- **Cultural Values:** Each faction/region has sliders (piety, law, wealth, honor). They change slowly across runs, but player actions push them.
- **Language:** Regional dialect system. Unlocking “Learned Words” ties into this; mask inscriptions vary per culture.
- **Religion & Deities:** Instead of gods, abstract Narrative Claims impose decrees on regions (e.g., “All truths must be hidden”).
- **Diplomacy:** Player’s Marks affect how factions perceive them (Pilgrim welcomed vs Oathbreaker hunted).

**Takeaway:** Civs matter narratively, not in micromanagement. They are containers of memory and reaction.

---

### 3. Procedural Histories = Echoes
**Goal:** Every notable player action becomes a world fact drawn into future runs.

- **Echo Bus:** A system to emit an `Echo` for significant player actions (betrayal, sacrifice, forging a legendary mask).
- **Realization:** In future runs, the system "realizes" echoes by spawning content: a vengeful NPC, a modified ruin, a new faction law, or a unique encounter.

**Takeaway:** The player's actions permanently scar or bless the world, creating a unique history over time.

---

### 4. Emergence via Omens & Whispers
**Goal:** Light-touch systemic colliders to create DF-style surprises with control.

- **Omen:** A deterministic world-state precursor. If certain conditions are met (e.g., two regions are lawless and pious), a world tag like `witch_hunts` is activated.
- **Whisper:** A stochastic nudge. A high-value trade route might increase the chance of `contraband` related events.
- **Generators:** Encounter and other content generators read these tags and knobs to vary their output without hard scripting.

**Takeaway:** The world creates its own thematic pressures, leading to emergent narrative events.

---

### 5. Persistence of Failure → Ruins
**Goal:** “Losing is fun.” A fallen run leaves artifacts in geography and history.

- **Creation:** On run collapse, a `Ruin` can be generated at the player's final location, linked to the cause of failure.
- **Legacy:** Ruins contain inscriptions, lore, and potentially the mask of the fallen player, which can be discovered in future runs.

**Takeaway:** Failure is a world-building event, not just a game over screen.

---

### 6. Procedural Language: Dialects & Learned Words
**Goal:** DF-like naming and flavor that ties into mechanics.

- **Dialects:** Regional and cultural names are composed from procedural dialect rules.
- **Learned Words:** Mask forging requires the use of "Learned Word" tokens, which are unlocked through gameplay, replacing free-text input with a more thematic system.

**Takeaway:** Language is both a narrative flavor and a mechanical key.

---

### 7. Artifacts & Provenance: Masks
**Goal:** Every mask is an artifact with a history.

- **Provenance:** Masks log their history: who forged them, who wore them, and what deeds (Echoes) they were involved in.
- **Marketplace:** Traded masks retain their history, allowing legendary items to circulate through the world.

**Takeaway:** Masks are living artifacts, not just stat sticks.

---

### 8. Dynamic Encounters
**Goal:** Encounters read world facts, omens, whispers, echoes, and ruins.

- **Context-Aware:** The encounter engine filters and scores potential scenarios based on the current state of the world, including faction stances, regional omens, and active Echoes.
- **Returning Threads:** An Echo from a past run can be explicitly pulled in as a returning narrative thread.

**Takeaway:** Encounters are a direct reflection of the current state of the procedurally generated world.

---

### 9. Time & Pacing Integration
**Goal:** Real-time constrained actions per day.

- **Daily Quota:** Players have a limited number of significant actions they can take per real-world day, preventing burnout and encouraging deliberate choices.
- **Systemic Tie-in:** Encounter resolution and travel must check against this quota.

**Takeaway:** Time is a precious meta-resource that paces the game.

---

### 10. Data Flow Summary

1.  A static **World** is generated from a seed.
2.  **Civilizations** and **Factions** live within it, drifting slowly between runs.
3.  **Omens & Whispers** emerge from the world state, creating narrative pressure.
4.  The Player acts, emitting **Echoes**.
5.  An Echo may create a **Ruin** or modify a Civilization's history.
6.  **Masks** record provenance and are tied to Echoes.
7.  In the next run, the system **realizes** past Echoes, pulling them into the world as new content.

This creates a virtuous loop where player actions continuously shape a persistent, evolving world.