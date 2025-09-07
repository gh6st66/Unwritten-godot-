/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Biome {
  id: 'tundra' | 'steppe' | 'forest' | 'desert' | 'wetland' | 'alpine' | 'coast';
  name: string;
  tags: string[]; // e.g., ['cold', 'sparse_trees']
  allowedSiteTags: string[]; // Site tags that can appear here
}

export const BIOMES: Biome[] = [
  { id: 'tundra', name: 'Tundra', tags: ['cold', 'frozen'], allowedSiteTags: ['ruin', 'camp', 'shrine'] },
  { id: 'steppe', name: 'Steppe', tags: ['dry', 'plains'], allowedSiteTags: ['ruin', 'camp', 'outpost'] },
  { id: 'forest', name: 'Forest', tags: ['wooded', 'temperate'], allowedSiteTags: ['ruin', 'camp', 'shrine', 'grove'] },
  { id: 'desert', name: 'Desert', tags: ['hot', 'arid'], allowedSiteTags: ['ruin', 'outpost', 'oasis'] },
  { id: 'wetland', name: 'Wetland', tags: ['wet', 'swamp'], allowedSiteTags: ['ruin', 'shrine', 'village'] },
  { id: 'alpine', name: 'Alpine', tags: ['cold', 'mountain'], allowedSiteTags: ['ruin', 'outpost', 'shrine'] },
  { id: 'coast', name: 'Coast', tags: ['wet', 'ocean'], allowedSiteTags: ['ruin', 'village', 'outpost'] },
];