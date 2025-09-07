/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Lexeme, LexemeTier } from '../types/lexeme';

export const LEXEMES_DATA: Lexeme[] = [
  {
    "id": "ferocity",
    "tier": LexemeTier.Basic,
    "gloss": "Ferocity",
    "domains": ["Aggression"],
    "tags": ["force", "heat"],
    "effects": {
      "maskThemeDelta": { "Aggression": 1 },
      "journalEntryKey": "journal.firstMask.ferocity"
    }
  },
  {
    "id": "guile",
    "tier": LexemeTier.Basic,
    "gloss": "Guile",
    "domains": ["Cunning"],
    "tags": ["trick", "shadow"],
    "effects": {
      "maskThemeDelta": { "Cunning": 1 },
      "journalEntryKey": "journal.firstMask.guile"
    }
  },
  {
    "id": "insight",
    "tier": LexemeTier.Basic,
    "gloss": "Insight",
    "domains": ["Wisdom"],
    "tags": ["clarity", "stillness"],
    "effects": {
      "maskThemeDelta": { "Wisdom": 1 },
      "journalEntryKey": "journal.firstMask.insight"
    }
  },
  {
    "id": "endurance",
    "tier": LexemeTier.Basic,
    "gloss": "Endurance",
    "domains": ["Aggression", "Wisdom"],
    "tags": ["stone", "patience"],
    "effects": {
      "maskThemeDelta": { "Aggression": 0.5, "Wisdom": 0.5 }
    }
  },
  {
    "id": "deception",
    "tier": LexemeTier.Basic,
    "gloss": "Deception",
    "domains": ["Cunning", "Wisdom"],
    "tags": ["illusion", "misdirection"],
    "effects": {
      "maskThemeDelta": { "Cunning": 0.5, "Wisdom": 0.5 }
    }
  },
  {
    "id": "instinct",
    "tier": LexemeTier.Basic,
    "gloss": "Instinct",
    "domains": ["Aggression", "Cunning"],
    "tags": ["beast", "reflex"],
    "effects": {
      "maskThemeDelta": { "Aggression": 0.5, "Cunning": 0.5 }
    }
  },
  {
    "id": "dominion",
    "tier": LexemeTier.Prime,
    "gloss": "Dominion",
    "domains": ["Hybrid"],
    "tags": ["authority", "oath"],
    "effects": {
      "maskThemeDelta": { "Aggression": 1, "Wisdom": 1 },
      "startingMarks": ["oathbound"]
    }
  },
  {
    "id": "revelation",
    "tier": LexemeTier.Prime,
    "gloss": "Revelation",
    "domains": ["Hybrid"],
    "tags": ["truth", "unveiling"],
    "effects": {
      "maskThemeDelta": { "Wisdom": 1, "Cunning": 1 },
      "startingMarks": ["truth-seer"]
    }
  }
];