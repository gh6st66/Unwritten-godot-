import { Npc, NpcId, RegionId, RoleTag } from "./types";

export class NpcIndex {
  byId = new Map<NpcId, Npc>();
  byRegion = new Map<RegionId, NpcId[]>();
  byRole = new Map<RoleTag, NpcId[]>();

  constructor(npcs: Npc[]) {
    for (const n of npcs) {
      this.byId.set(n.id, n);
      if (!this.byRegion.has(n.region)) this.byRegion.set(n.region, []);
      this.byRegion.get(n.region)!.push(n.id);
      for (const tag of n.roleTags) {
        if (!this.byRole.has(tag)) this.byRole.set(tag, []);
        this.byRole.get(tag)!.push(n.id);
      }
    }
  }

  inRegion(region: RegionId) {
    return (this.byRegion.get(region) ?? []).map((id) => this.byId.get(id)!);
  }

  withRole(tag: RoleTag, region?: RegionId) {
    const ids = this.byRole.get(tag) ?? [];
    const list = ids.map((id) => this.byId.get(id)!);
    return region ? list.filter((n) => n.region === region) : list;
  }
}
