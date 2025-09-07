import {
  EncounterSchema,
  EncounterSlot,
  Npc,
  NpcId,
  RegionState,
  RunState,
  StructuredEncounter,
} from "../types";
import { rngFromSeed } from "../seededRng";
import { NpcIndex } from "../NpcIndex";
import { Rulebook } from "../rules/Rulebook";

function fitsSlot(npc: Npc, slot: EncounterSlot, roles: Record<string, NpcId | string>, npcIndex: NpcIndex): boolean {
  if (slot.requires.roleTag && !npc.roleTags.includes(slot.requires.roleTag)) return false;
  if (slot.requires.minNotoriety != null && npc.notoriety < slot.requires.minNotoriety) return false;
  if (slot.requires.maxNotoriety != null && npc.notoriety > slot.requires.maxNotoriety) return false;
  if (slot.requires.sameFactionAs) {
    const refId = roles[slot.requires.sameFactionAs];
    if (typeof refId === "string") {
      const refNpc = npcIndex.byId.get(refId as NpcId);
      // Factions must match. If either is undefined, it's a mismatch unless both are.
      if (!refNpc || refNpc.faction !== npc.faction) {
        return false;
      }
    }
  }
  return true;
}

export class EncounterSuggester {
  constructor(
    private schemas: EncounterSchema[],
    private npcIndex: NpcIndex,
    private rulebook: Rulebook
  ) {}

  suggest(run: RunState, region: RegionState): StructuredEncounter | undefined {
    const rnd = rngFromSeed(`${run.seed}:${run.day}:${region.id}`);

    // 1) score schemas
    const scoredSchemas = this.schemas.map((s) => this.rulebook.scoreSchema(s, run, region));
    const picked = this.rulebook.pickWeighted(scoredSchemas, rnd);
    if (!picked) return undefined;
    const schema = picked.item;

    // 2) bind slots
    const roles: Record<string, NpcId | string> = {};
    const usedNpcIds = new Set<NpcId>();

    for (const slot of schema.slots) {
      const pool = this.candidatePool(slot, run, region, roles)
        .filter(npc => !usedNpcIds.has(npc.id)); // Ensure unique NPCs per encounter

      if (pool.length === 0) return undefined; // Cannot fill slot

      const scored = pool.map((npc) => ({
        item: npc,
        score: 1 + this.rulebook.scoreNpc(npc, { run, region }),
        reason: [],
      }));
      const choice = this.rulebook.pickWeighted(scored, rnd);
      if (!choice) return undefined; // Failed to pick from pool
      
      roles[slot.key] = choice.item.id;
      usedNpcIds.add(choice.item.id);
    }

    // 3) finalize
    return {
      id: `enc_${cryptoRandomLike(rnd)}`,
      schemaId: schema.id,
      region: region.id,
      roles,
      stakes: schema.stakes,
      topics: schema.topics,
      rand: rnd(),
    };
  }

  private candidatePool(slot: EncounterSlot, run: RunState, region: RegionState, roles: Record<string, NpcId | string>): Npc[] {
    // start with region NPCs
    let list = this.npcIndex.inRegion(region.id).filter((n) => fitsSlot(n, slot, roles, this.npcIndex));
    // light filter by disposition to player via marks if you encode that elsewhere
    if (slot.requires.dispositionToPlayer && slot.requires.dispositionToPlayer !== "any") {
      // placeholder: you can wire a real disposition function here
      list = list.filter(() => true);
    }
    return list;
  }
}

// simple id from RNG for stability without crypto
function cryptoRandomLike(rnd: () => number) {
  return Math.floor(rnd() * 1e9).toString(36);
}
