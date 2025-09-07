import { ArchetypeDef } from "../core/types";

export const ARCHETYPES_DATA: ArchetypeDef[] = [
  {
    id: "guardian",
    name: "Guardian",
    description: "A protector of the old ways, bound by oath and duty.",
    bonuses: [
      { description: "Begins with the 'Oathbound' Mark." },
    ],
  },
  {
    id: "trickster",
    name: "Trickster",
    description: "A weaver of chaos and secrets, who walks the line between truth and deception.",
    bonuses: [
      { description: "Begins with a higher Cunning resource pool." },
    ],
  },
  {
    id: "scholar",
    name: "Scholar",
    description: "A seeker of forgotten lore and hidden truths, driven by an insatiable curiosity.",
    bonuses: [
      { description: "Begins with a higher Wisdom resource pool." },
    ],
  },
];