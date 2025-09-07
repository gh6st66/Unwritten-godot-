/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { IntentType } from "../../systems/parser/types";

export const parserTestCases: { input: string; expected: { intentId: string; intentType: IntentType } }[] = [
  // Social
  { input: "shout hello?", expected: { intentId: "SAY", intentType: "SOCIAL" } },
  { input: "yell into the dark!", expected: { intentId: "SAY", intentType: "SOCIAL" } },
  { input: "say nothing.", expected: { intentId: "SAY", intentType: "SOCIAL" } },
  // Movement
  { input: "leave room", expected: { intentId: "EXIT", intentType: "PHYSICAL" } },
  { input: "go n", expected: { intentId: "MOVE", intentType: "PHYSICAL" } },
  { input: "north", expected: { intentId: "MOVE", intentType: "PHYSICAL" } },
  { input: "enter sanctum", expected: { intentId: "MOVE", intentType: "PHYSICAL" } },
  // Inspection
  { input: "examine forge", expected: { intentId: "LOOK", intentType: "INTERNAL" } },
  { input: "look at blank mask", expected: { intentId: "LOOK", intentType: "INTERNAL" } },
  { input: "l", expected: { intentId: "LOOK", intentType: "INTERNAL" } }, // This should resolve to inspect in an empty context
  { input: "inspect old chest", expected: { intentId: "LOOK", intentType: "INTERNAL" } },
  // Inventory
  { input: "take crucible", expected: { intentId: "TAKE", intentType: "PHYSICAL" } },
  { input: "pick up the blank mask", expected: { intentId: "TAKE", intentType: "PHYSICAL" } },
  // Note: 'drop' needs context from player inventory, which the test harness doesn't have.
  // We are testing that the intent is correctly identified.
  { input: "drop crucible", expected: { intentId: "DROP", intentType: "PHYSICAL" } },
  { input: "inventory", expected: { intentId: "INVENTORY", intentType: "INTERNAL" } },
  { input: "i", expected: { intentId: "INVENTORY", intentType: "INTERNAL" } },
  // Object Interaction
  { input: "open old chest", expected: { intentId: "OPEN", intentType: "PHYSICAL" } },
  { input: "close chest", expected: { intentId: "CLOSE", intentType: "PHYSICAL" } },
  // Note: 'unlock' test needs items in inventory.
  { input: "unlock old chest with forge key", expected: { intentId: "UNLOCK", intentType: "PHYSICAL" } },
  { input: "search hearth", expected: { intentId: "SEARCH", intentType: "INTERNAL" } },
  { input: "break crucible", expected: { intentId: "DESTROY", intentType: "PHYSICAL" } },
  { input: "rest", expected: { intentId: "REST", intentType: "INTERNAL" } },
];