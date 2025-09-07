export type JournalClaim = {
  id: string;
  text: string;
  severity: 1 | 2 | 3;
};

// Stub for MaskCultureModal
export type RunState = any;

export type ArchetypeDef = {
  id: string;
  name: string;
  description: string;
  bonuses: { description: string; }[];
};