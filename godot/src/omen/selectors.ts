/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GameState } from '../game/types';
import { OmenBand, OmenTag } from './types';

export function toBand(p: number): OmenBand {
  if (p < 0.25) return "unlikely";
  if (p < 0.50) return "possible";
  if (p < 0.75) return "favored";
  return "very likely";
}

export function selectOmenBands(state: GameState): Record<OmenTag, OmenBand> {
  const values = state.omenWeights.values;
  return {
    embrace: toBand(values.embrace),
    resist: toBand(values.resist),
    mixed: toBand(values.mixed),
  };
}

export function selectOmenTooltip(state: GameState, tag: OmenTag): string {
    const lines: string[] = [];
    const weights = state.omenWeights;

    const percent = Math.round(weights.values[tag] * 100);
    lines.push(`The path to '${tag}' is currently ${toBand(weights.values[tag])} (${percent}%).`);

    const activeAnchor = weights.anchors.find(a => a.tag === tag);
    if (activeAnchor) {
        lines.push(`ANCHORED: Guaranteed at least ${Math.round(activeAnchor.min * 100)}% for ${activeAnchor.beatsLeft} more Beats.`);
    }

    const activeNudges = weights.nudges.filter(n => n.tag === tag);
    if (activeNudges.length > 0) {
        lines.push(`NUDGED: Inclination is increased by external forces.`);
    }

    if (weights.floors[tag] > 0.05) { // Assuming 0.05 is the base floor
        lines.push(`FAVORED: A vow or persistent effect has raised its minimum chance.`);
    }

    return lines.join('\n');
}
