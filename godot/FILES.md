# Application File System

This document provides an overview of the file structure for the "Unwritten" application, detailing the purpose of each file and directory in the current narrative-first architecture.

## Root Directory

-   **`content/`**: Contains all data-driven, hand-authored game content like sites, relics, rites, hazards, and name banks.
-   **`schemas/`**: Contains Zod schema definitions used to validate the structure of all files in the `content/` directory.
-   **`scripts/`**: Holds developer utility scripts, such as the content linter (`lintContent.ts`).
-   **`src/`**: All application source code.
-   **`DEV_NOTES.md`**: Granular, task-focused development notes and history.
-   **`FILES.md`**: This file.
-   **`GDD.md`**: The high-level Game Design Document.
-   **`ROADMAP.md`**: The high-level project roadmap.
-   **`index.html`**: The main entry point for the web application.
-   **`package.json`**: Defines project scripts and dependencies.

---

## `src/` Directory

### `src/accord/`

The "Shattered Accord" system for micro-reactivity.

-   **`accord.ts`**: The core engine that processes player intents and calculates narrative consequences (`EngineDelta`).
-   **`types.ts`**: Defines the shapes for state (NPCs, Factions), declarative deltas, and text variants.

### `src/beat/`

The reactive narrative or "AI Director" system.

-   **`scheduler.ts`**: The top-level orchestrator that runs after each player action.
-   **`registry.ts`**, **`score.ts`**, **`compose.ts`**, **`factory.ts`**: The pipeline for selecting a relevant story "Beat" and generating a full encounter from it.
-   **`types.ts`**: Defines the `Beat` and `EncounterSpec` data structures.

### `src/chronicle/`

The persistence system for tracking events across runs.

-   **`bias.ts`**, **`summary.ts`**, **`index.ts`**: Utilities for calculating cross-run biases, generating end-of-run summaries, and indexing events for fast lookups.

### `src/civ/` & `src/world/`

The procedural generation engine.

-   **`world/generateWorld.ts`**: Creates the world graph, regions, and high-level factions.
-   **`civ/generateCivs.ts`**: Populates the generated world with civilizations and NPCs.
-   **`*/types.ts`**: Defines the core data structures for the world and its inhabitants.

### `src/components/`

All React UI components.

-   **`App.tsx`**: The top-level component, manages views and the `useEngine` hook.
-   **`ScreenRenderer.tsx`**: Renders the primary UI for the current game phase.
-   **`WorldPanel.tsx`**, **`RumorQueue.tsx`**, **`InGameChronicle.tsx`**: Key UI panels for displaying world state, parser suggestions, and run history.

### `src/content/`

Hand-authored, data-driven content definitions.

-   **`sites.ts`**, **`relics.ts`**, **`rites.ts`**, **`hazards.ts`**: The definitions for the first major content pack.
-   **`biomes.ts`**: Definitions for world biomes.
-   **`names/`**: Naming components for procedural generation.

### `src/data/`

Core data that powers the game's systems.

-   **`parser/content.ts`**: The master file for the parser's lexicon, intents, and all static scene data.
-   **`beats.ts`**: The registry of all available narrative beats for the Beat System.
-   **`accord/`**: Data for the Accord system, including initial state and intent weights.
-   **`text/`**: The library of all variant text blocks for narrative responses.

### `src/game/`

The core game loop and state management.

-   **`engine.ts`**: The `useEngine` React hook that orchestrates the game.
-   **`stateMachine.ts`**: The pure reducer function defining all valid state transitions.
-   **`types.ts`**: Central type definitions for the game state.

### `src/systems/`

Major game logic systems and services.

-   **`parser/`**: The complete natural language parser engine.
-   **`chronicle.ts`**: Service for recording events to `localStorage`.
-   **`MaskForger.ts`**: Service for generating masks using the Gemini API.
-   **`OmenGenerator.ts`**: Service for generating run origins using the Gemini API.
-   **`inventory.ts`**: Logic for managing the player's inventory.