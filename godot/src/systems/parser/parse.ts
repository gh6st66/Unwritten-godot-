/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { PATTERNS } from './patterns';
import type { ParseResult, SlotName } from './types';

/**
 * Parses a normalized string against a series of patterns.
 * @param normalized The input string, pre-processed by normalize().
 * @returns A ParseResult containing the matched verb, slots, and original string.
 */
export function parse(normalized: string): ParseResult {
  for (const pattern of PATTERNS) {
    const match = pattern.re.exec(normalized);
    if (match?.groups) {
      const slots: Partial<Record<SlotName, string>> = {};
      
      // The verb is either explicitly captured in a 'verb' group,
      // or it's implied by the pattern's intent_hint.
      const verb = match.groups.verb || pattern.intent_hint;

      for (const slotName of pattern.slots) {
        if (match.groups[slotName]) {
          slots[slotName] = match.groups[slotName].trim();
        }
      }

      return {
        verb: verb,
        slots,
        raw: normalized,
      };
    }
  }

  // Fallback if no patterns match (should be rare with the final catch-all pattern)
  return {
    raw: normalized,
    slots: {},
  };
}
