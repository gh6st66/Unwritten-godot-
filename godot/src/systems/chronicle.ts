/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChronicleEvent, ChronicleEventPayload } from '../domain/events';
import { ChronicleData, FigureState, MaskState, ProvenanceHop, RunState } from '../domain/states';

const CHRONICLE_KEY = 'unwritten:chronicle:events';

export function getEvents(): ChronicleEvent[] {
  try {
    const raw = localStorage.getItem(CHRONICLE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Ensure the loaded data is an array to prevent iteration errors
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load or parse chronicle events:", e);
    // If parsing fails, quarantine the bad data and return an empty array
    const corruptedData = localStorage.getItem(CHRONICLE_KEY);
    if (corruptedData) {
      localStorage.setItem(`${CHRONICLE_KEY}:corrupted:${Date.now()}`, corruptedData);
      localStorage.removeItem(CHRONICLE_KEY);
    }
    return [];
  }
}

export function recordEvent(
  event: ChronicleEventPayload
) {
  const events = getEvents();
  const fullEvent: ChronicleEvent = { ...event, ts: Date.now() };
  events.push(fullEvent);
  localStorage.setItem(CHRONICLE_KEY, JSON.stringify(events));
}

export function getChronicleData(): ChronicleData {
  const events = getEvents();
  
  const runs: Record<string, RunState> = {};
  const masks: Record<string, MaskState> = {};
  const figures: Record<string, FigureState> = {};

  for (const event of events) {
    switch (event.type) {
      case 'RUN_STARTED':
        runs[event.runId] = {
          runId: event.runId,
          seed: event.seed,
          startTs: event.ts,
        };
        break;
      case 'RUN_ENDED':
        if (runs[event.runId]) {
          runs[event.runId].endTs = event.ts;
          runs[event.runId].outcome = event.outcome;
        }
        break;
      case 'MASK_FORGED':
        const provenance: ProvenanceHop = {
          ownerId: event.ownerId,
          ts: event.ts,
          reason: 'forged',
          runId: event.runId,
        };
        masks[event.maskId] = {
          maskId: event.maskId,
          name: event.name,
          description: event.description,
          provenance: [provenance],
        };
        break;
    }
  }

  return { runs, masks, figures, events };
}
