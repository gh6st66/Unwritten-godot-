import { FactionId, RegionState, RegionTensionEdge } from "../types";

export function edgeKey(a: FactionId, b: FactionId) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function pairTension(region: RegionState, a: FactionId, b: FactionId) {
  const e = region.tensionEdges.find(
    (x) => edgeKey(x.a, x.b) === edgeKey(a, b)
  );
  return e ?? { a, b, weight: 0, topics: [] } as RegionTensionEdge;
}

export function regionHotTopics(region: RegionState, topK = 3): string[] {
  const topicWeights = new Map<string, number>();
  for (const e of region.tensionEdges) {
    for (const t of e.topics) topicWeights.set(t, (topicWeights.get(t) ?? 0) + Math.max(0, e.weight));
  }
  return [...topicWeights.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK)
    .map(([t]) => t);
}
