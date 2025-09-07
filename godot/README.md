# Unwritten

A narrative roguelike where your words shape a living history.

This is a rich, text-based adventure that combines the deep simulation of classic roguelikes with modern AI-powered procedural generation and a persistent, evolving world.

## Core Features

-   **Natural Language Parser:** Interact with the world by typing what you want to do. The game understands a rich vocabulary of verbs, nouns, and synonyms, allowing for emergent, intuitive gameplay.
-   **AI-Powered Artifacts:** Wield the power of Google's Gemini API to forge unique, one-of-a-kind masks. Each mask has a procedurally generated name, description, visual appearance, and set of game-changing Marks.
-   **Procedural Worlds:** Every run begins with the birth of a new world, complete with a unique history, distinct civilizations, political tensions, and myths. No two journeys are the same.
-   **Persistent Legacy (The Chronicle):** Your actions have permanent consequences. Key events from each run—from forging a legendary mask to the ultimate fate of your character—are recorded in The Chronicle, influencing all future playthroughs.
-   **Reactive Narrative Engine:** A sophisticated "Beat System" acts as an AI story director, triggering dynamic, context-aware encounters based on the current state of the world and your actions.

## Getting Started

This project requires Node.js and a pre-configured environment with access to a Google Gemini API key.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/unwritten.git
    cd unwritten
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    The application assumes the `API_KEY` environment variable is available in the execution context.
    ```bash
    npm run dev
    ```
    The application will be available at the local port provided by Vite (usually `http://localhost:5173`).

## Development Scripts

-   `npm run dev`: Starts the Vite development server.
-   `npm run test`: Runs the Vitest test suite.
-   `npm run test:parser`: Runs a standalone validation script for the text parser.
-   `npm run lint:content`: Validates all hand-authored content files against their schemas.

## Project Structure

-   `/src/game`: The core game loop, including the state machine (`stateMachine.ts`), main engine hook (`engine.ts`), and core type definitions (`types.ts`).
-   `/src/systems`: Houses the major game logic systems (Parser, Chronicle, MaskForger, Inventory).
-   `/src/accord`: The "Shattered Accord" system for NPC recognition and micro-reactivity.
-   `/src/beat`: The reactive narrative "Beat System" or "AI Director".
-   `/src/world` & `/src/civ`: The procedural generation logic for the world map, regions, and civilizations.
-   `/src/components`: Contains all React UI components, which are responsible for rendering the game state.
-   `/src/content`: Hand-authored data for the game, such as sites, relics, rites, and hazards.
-   `/src/data`: Core system data, including the parser's lexicon, beat definitions, and scene data.

## Key Technologies

-   **Framework:** React
-   **Language:** TypeScript
-   **Build Tool:** Vite
-   **AI:** Google Gemini API (`@google/genai`)
-   **Testing:** Vitest