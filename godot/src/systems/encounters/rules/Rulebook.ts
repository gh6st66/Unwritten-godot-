import {
  EncounterSchema,
  Npc,
  RegionState,
  RuleOp,
  RuleSpec,
  RunState,
  ScoredCandidate,
} from "../types";

export class Rulebook {
  constructor(public rules: RuleSpec[]) {}

  scoreSchema(schema: EncounterSchema, run: RunState, region: RegionState): ScoredCandidate<EncounterSchema> {
    let score = schema.weight;
    const reasons: string[] = [];
    for (const r of this.rules.filter((x) => x.where === "schema")) {
      for (const op of r.ops) {
        const delta = this.applyOp(op, { schema, run, region });
        if (delta !== 0) { score += delta; reasons.push(`${r.id}:${op.op}+${delta}`); }
      }
    }
    if (schema.minEntropy && run ? run.day : 0) {
      // optional hook if you map day->entropy elsewhere
    }
    return { item: schema, score, reason: reasons };
  }

  scoreNpc(npc: Npc, ctx: { run: RunState; region: RegionState }): number {
    let score = 0;
    for (const r of this.rules.filter((x) => x.where === "candidate")) {
      for (const op of r.ops) score += this.applyOp(op, { npc, ...ctx });
    }
    return score;
  }

  private applyOp(
    op: RuleOp,
    ctx: Partial<{ schema: EncounterSchema; run: RunState; region: RegionState; npc: Npc }>
  ): number {
    switch (op.op) {
      case "markIncludes": {
        const source =
          op.target === "player"
            ? ctx.run?.playerMarks ?? []
            : op.target === "npc"
            ? ctx.npc?.marks ?? []
            : [];
        return source.some((m) => op.anyOf.includes(m)) ? op.weight : 0;
      }
      case "topicMatchesTension": {
        const topics = ctx.schema?.topics ?? [];
        // Simple: +weight if any schema topic is hot in region
        const hot = new Set((ctx.region?.tensionEdges ?? []).flatMap((e) => (e.weight > 0 ? e.topics : [])));
        return topics.some((t) => hot.has(t)) ? op.weight : 0;
      }
      case "notorietyBand": {
        const value = op.target === "player" ? ctx.run?.notoriety ?? 0 : ctx.npc?.notoriety ?? 0;
        return value >= op.min && value <= op.max ? op.weight : 0;
      }
      case "factionEdgeWeight": {
        // When used at schema-level, bias by average positive edge weight in region
        const edges = ctx.region?.tensionEdges ?? [];
        const posEdges = edges.filter(e => e.weight > 0);
        if (posEdges.length === 0) return 0;
        const posAvg = posEdges.map((e) => e.weight).reduce((a, b) => a + b, 0) / posEdges.length;
        if ((op.min == null || posAvg >= op.min) && (op.max == null || posAvg <= op.max)) return op.weight;
        return 0;
      }
      case "scarcity": {
        const val = ctx.region?.scarcity[op.key] ?? 0;
        return val >= op.min ? op.weight : 0;
      }
      default:
        return 0;
    }
  }

  pickWeighted<T>(list: ScoredCandidate<T>[], rnd: () => number): ScoredCandidate<T> | undefined {
    const total = list.reduce((a, x) => a + Math.max(0, x.score), 0);
    if (total <= 0) {
        // Fallback to uniform probability if all scores are <= 0
        if (list.length > 0) return list[Math.floor(rnd() * list.length)];
        return undefined;
    };
    let r = rnd() * total;
    for (const c of list) {
      r -= Math.max(0, c.score);
      if (r <= 0) return c;
    }
    return list[list.length - 1];
  }
}
