/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChronicleEvent } from '../domain/events';
import { RunState } from '../domain/states';

/**
 * Generates a human-readable summary of a single run's most important events.
 * This is used for the end-of-run screen and the in-game chronicle view.
 */
export function generateSummary(run: RunState, allEvents: ChronicleEvent[]): string[] {
  const runEvents = allEvents.filter(e => e.runId === run.runId);
  const summary: string[] = [];

  const accordEvents = runEvents.filter(
    (e): e is Extract<ChronicleEvent, { type: 'ACCORD_DELTA_APPLIED' }> => e.type === 'ACCORD_DELTA_APPLIED'
  );
  if (accordEvents.length > 0) {
    const oathsSworn = accordEvents.filter(e => e.intentId === 'OATH_SWEAR').length;
    if (oathsSworn > 0) {
      summary.push(`- Swore ${oathsSworn} new oath(s).`);
    }
    const betrayals = accordEvents.filter(e => e.intentId === 'BETRAY_ACT').length;
    if (betrayals > 0) {
        summary.push(`- Betrayed trust ${betrayals} time(s).`);
    }
  }

  const maskForged = runEvents.find(
    (e): e is Extract<ChronicleEvent, { type: 'MASK_FORGED' }> => e.type === 'MASK_FORGED'
  );
  if (maskForged) {
    summary.push(`- Forged the mask known as "${maskForged.name}".`);
  }
  
  if (summary.length === 0) {
      summary.push("The Unwritten's path left few ripples this time.");
  }

  return summary.slice(0, 4); // Keep summary concise
}
