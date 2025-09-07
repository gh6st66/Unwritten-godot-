/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * Normalizes a raw input string for parsing.
 * - Converts to lowercase
 * - Trims whitespace
 * - Strips trailing punctuation
 * - Collapses multiple spaces
 * - Replaces multi-word aliases with their canonical, single-word form (e.g., "blank mask" -> "mask_blank")
 * @param raw The raw user input string.
 * @param aliasMap A map where keys are multi-word aliases and values are their canonical single-word keys.
 * @returns The normalized string.
 */
export function normalize(raw: string, aliasMap: Map<string, string>): string {
  let s = raw.toLowerCase().trim().replace(/[.,!?]$/, '').replace(/\s+/g, " ").trim();
  // Iterate through aliases to replace them. This is a simple but effective approach for a limited set.
  // A more advanced system might use Aho-Corasick or other multi-pattern matching algorithms.
  for (const [alias, canon] of aliasMap.entries()) {
    // Use a regex with word boundaries to avoid replacing parts of words.
    s = s.replace(new RegExp(`\\b${alias}\\b`, "g"), canon);
  }
  return s;
}
