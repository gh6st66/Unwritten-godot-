/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export enum LexemeTier {
  Basic = "basic",
  Prime = "prime",
}

export type LexemeId = string; // stable snake_case id, e.g., "ferocity"

export interface Lexeme {
  id: LexemeId;
  tier: LexemeTier;
  gloss: string; // short human label, e.g., "Ferocity"
  domains: Array<"Aggression" | "Wisdom" | "Cunning" | "Hybrid">;
  tags: string[]; // for filtering, UI grouping
  effects: {
    maskThemeDelta?: Record<string, number>; // e.g., { "Aggression": +1 }
    startingMarks?: string[]; // ids into a future Marks catalog
    journalEntryKey?: string; // i18n key template
  };
}