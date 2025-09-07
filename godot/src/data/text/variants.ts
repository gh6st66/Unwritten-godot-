/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { VariantBlock } from '../../accord/types';

export const TEXT_VARIANTS: Record<string, VariantBlock> = {
    "COUNCIL_GREET": {
        id: "COUNCIL_GREET",
        variants: [
            { "if": "npc('ELDER_ANAH').recognition.trust > 20", "text": "Elder Anah rises as you enter." },
            { "if": "npc('ELDER_ANAH').recognition.fear > 15", "text": "Elder Anah averts their eyes as you approach." },
            { "text": "Murmurs ripple through the hall as you approach Elder Anah." }
        ]
    },
    // Fallback response for actions
    "ACTION_DEFAULT": {
        id: "ACTION_DEFAULT",
        variants: [
            { text: "The world holds its breath, unchanged." }
        ]
    }
};