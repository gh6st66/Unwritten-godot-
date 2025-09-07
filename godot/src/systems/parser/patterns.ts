/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import type { SlotName } from './types';

export const PATTERNS: Array<{ re: RegExp; intent_hint: string; slots: SlotName[] }> = [
  // Patterns are ordered from most specific to most general.
  { re: /^use\s+(?<tool>.+?)\s+on\s+(?<object>.+)$/i, intent_hint: "use_on", slots: ["tool", "object"] },
  { re: /^(?<verb>give|offer|hand over)\s+(?<tool>.+?)\s+to\s+(?<object>.+)$/i, intent_hint: "give", slots: ["tool", "object"] },
  { re: /^(?<verb>\w+)\s+(?<object>.+?)\s+with\s+(?<tool>.+)$/i, intent_hint: "generic", slots: ["object", "tool"] },
  
  // Specific verbs before generic
  { re: /^(?<verb>look|examine|inspect|check)\s+(at\s+)?(?<object>.+)$/i, intent_hint: "inspect", slots: ["object"] },
  { re: /^(?<verb>go|move|walk|run|enter|climb)\s+(?<direction>.+)$/i, intent_hint: "move", slots: ["direction"] },
  { re: /^ask\s+(?<object>.+?)\s+about\s+(?<topic>.+)$/i, intent_hint: "ask_about", slots: ["object", "topic"] },
  { re: /^(whisper|invoke|chant|intone)\s+(?<lexeme>\w+)(\s+(at|to)\s+(?<object>.+))?$/i, intent_hint: "invoke_lexeme", slots: ["lexeme", "object"] },
  
  // Generic verb + object
  { re: /^(?<verb>\w+)\s+(?<object>.+)$/i, intent_hint: "generic", slots: ["object"] },
  
  // Single-word directions
  { re: /^(?<direction>north|south|east|west|n|s|e|w|in|out|inside|outside|enter|exit)$/i, intent_hint: "move", slots: ["direction"] },

  // Single word, assume it's an object to be inspected
  { re: /^(?<object>.+)$/i, intent_hint: "inspect", slots: ["object"] },
];
