import { Affiliation, RegionCode } from "../../game/types";

export type LexemeKey = "fateRecord";  // canonical key for “the Journal”
export interface LexemeVariant {
  term: string;             // "Ledger", "Book of Deeds", etc.
  tags?: string[];          // ["formal","mythic","bureaucratic"]
  notes?: string;           // authoring notes
}

export interface LexemeRule {
  match: {
    affiliationsAny?: Affiliation[];
    regionAny?: RegionCode[];
    localeStartsWith?: string[]; // e.g. ["en-GB"]
    roleRegex?: string;          // e.g. ".*Inquisitor.*"
  };
  variant: LexemeVariant;
  weight?: number;           // tie-break within same priority
}

export interface LexemeEntry {
  key: LexemeKey;
  defaults: Record<string, LexemeVariant>; // by locale root: {"en":{term:"Record"}}
  rules: LexemeRule[];       // ordered strongest→weakest
}
