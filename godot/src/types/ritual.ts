/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface RitualTextVariant {
  lines: [string, string, string]; // three short lines for cadence
}

export interface MaskRitualTemplate {
  id: "first_mask_breath_word";
  preChoice: RitualTextVariant[]; // rotate variants
  postChoice: RitualTextVariant[]; // rotate variants
  cues?: {
    inhale?: string;
    exhale?: string;
    crawl?: string;
  };
}