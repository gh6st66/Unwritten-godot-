/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const INTENT_WEIGHTS: Record<string, {trust?: number, fear?: number, accord?: number, loyalty?: number}> = {
  "OATH_SWEAR": {"trust":+8,"accord":+3},
  "OATH_RENOUNCE":{"trust":-10,"accord":-5},
  "ALLY_DECLARE":{"trust":+5,"loyalty":+6,"accord":+2},
  "BETRAY_ACT":{"trust":-15,"fear":+6,"accord":-8},
  "REVEAL_SECRET":{"trust":+6,"accord":+1},
  "WITHHOLD":{"trust":-2,"fear":+1}
};

export const SCOPE_FACTORS: Record<string, number> = {
    "local":1,
    "regional":3
};