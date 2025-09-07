/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { MaskRitualTemplate } from "../types/ritual";

export const FIRST_MASK_RITUAL_TEMPLATE: MaskRitualTemplate = {
  "id": "first_mask_breath_word",
  "preChoice": [
    {
      "lines": [
        "The mask lies still, waiting.",
        "Your breath gathers on its surface, mist curling into shapes not yet formed.",
        "Only the Word you choose will guide their crawl."
      ]
    }
  ],
  "postChoice": [
    {
      "lines": [
        "You exhale the Word.",
        "The mist convulses, then hardens into crawling glyphs that weave across the mask.",
        "Bound in script, the mask takes its first destiny."
      ]
    }
  ],
  "cues": {
    "inhale": "sfx.inhale_01",
    "exhale": "sfx.exhale_01",
    "crawl": "sfx.crawl_01"
  }
};