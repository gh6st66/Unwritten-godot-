/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { EngineDelta } from "../accord/types";
import { OmenWeights } from "../omen/types";

// Simplified for frontend simulation

// Payloads for events, without the timestamp.
export type ChronicleEventPayload =
  | { type: "RUN_STARTED"; runId: string; seed: string; }
  | { type: "RUN_ENDED"; runId: string; outcome: string; }
  | { type: "MASK_FORGED"; maskId: string; name: string; description: string; forgeId: string; learnedWordId: string; runId: string; ownerId: string; }
  | { type: "FIGURE_SEEN"; figureId: string; runId: string; context: string; }
  | { type: "FIGURE_UPDATE"; figureId: string; changes: { marks: any[] }; runId: string; }
  | { type: "ITEM_TAKEN"; runId: string; itemId: string; sceneId: string; }
  | { type: "ITEM_DROPPED"; runId: string; itemId: string; sceneId: string; }
  | { type: "OBJECT_UNLOCKED"; runId: string; objectId: string; sceneId: string | null; toolId: string; }
  | { type: "OBJECT_DESTROYED"; runId: string; objectId: string; objectName: string; sceneId: string; }
  // New Systemic Events
  | { type: "ACCORD_DELTA_APPLIED"; runId: string; sceneId: string | null; intentId: string; delta: EngineDelta; }
  | { type: "OMEN_WEIGHTS_UPDATED"; runId: string; reason: string; newWeights: OmenWeights['values']; }
  // Echo Events
  | { type: "BRIDGE_COLLAPSE"; runId: string; sceneId: string; }
  | { type: "SPIRIT_HONORED"; runId: string; sceneId: string; }
  | { type: "IDOL_STOLEN"; runId: string; sceneId: string; }
  // Ripples System
  | { type: "MICRO_REACTION"; runId: string; tag: string; sceneId: string | null; direction?: string; objectId?: string; };

// The full event type, with timestamp.
// Using an intersection with a union distributes the intersection over the members of the union,
// which is a reliable way to add a common property to a discriminated union.
export type ChronicleEvent = ChronicleEventPayload & { ts: number };
