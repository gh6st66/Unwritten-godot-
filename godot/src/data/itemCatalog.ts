/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import catalogJson from "./items.ts";

export type ItemRule = {
  id: string;
  name: string;
  nouns: string[];
  tags: string[];
  stackable: boolean;
  maxStack: number;
  keyItem: boolean;
};

const rulesById = new Map<string, ItemRule>(
  catalogJson.items.map(it => [
    it.id,
    { 
      id: it.id,
      name: it.name,
      nouns: it.nouns ?? [],
      stackable: !!it.stackable, 
      maxStack: it.maxStack ?? 1, 
      keyItem: !!it.keyItem, 
      tags: it.tags ?? [] 
    }
  ])
);

// Manually add new items since we can't modify the JSON file directly.
rulesById.set('bone_flute', { id: 'bone_flute', name: 'bone flute', nouns: ['bone flute', 'flute'], tags: ['instrument'], stackable: false, maxStack: 1, keyItem: false });
rulesById.set('mossy_idol', { id: 'mossy_idol', name: 'mossy idol', nouns: ['moss-covered idol', 'idol', 'statue'], tags: ['artifact'], stackable: false, maxStack: 1, keyItem: true });
rulesById.set('scattered_coins', { id: 'scattered_coins', name: 'scattered coins', nouns: ['coins', 'scattered coins', 'coin'], tags: ['currency'], stackable: true, maxStack: 1, keyItem: false });
rulesById.set('torn_banner', { id: 'torn_banner', name: 'torn banner', nouns: ['torn banner', 'banner', 'flag'], tags: ['cloth'], stackable: false, maxStack: 1, keyItem: false });


export function getItemRule(itemId: string): ItemRule {
  const r = rulesById.get(itemId);
  if (!r) throw new Error(`Unknown item: ${itemId}`);
  return r;
}