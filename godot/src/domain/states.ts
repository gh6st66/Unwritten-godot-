/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ChronicleEvent } from './events';

export type ProvenanceHop = {
  ownerId: string;
  ts: number;
  reason: 'forged' | 'trade' | 'reward' | 'seizure';
  runId: string;
};

export type FigureState = {
  figureId: string;
  name: string;
  firstSeenTs?: number;
  lastSeenTs?: number;
  marks?: any[];
};

export type MaskState = {
  maskId: string;
  name: string;
  description: string;
  provenance: ProvenanceHop[];
};

export type RunState = {
  runId: string;
  seed: string;
  startTs: number;
  endTs?: number;
  outcome?: string;
};

export interface ChronicleData {
  runs: Record<string, RunState>;
  masks: Record<string, MaskState>;
  figures: Record<string, FigureState>;
  events: ChronicleEvent[]; // for timeline view
}
