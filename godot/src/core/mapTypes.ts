/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// This file is a stub for the map system.
// In the narrative redesign, the map is a more abstract graph of nodes
// rather than a detailed grid. These types are placeholders from a
// previous design iteration.

export interface MapNode {
    id: string;
    type: 'encounter' | 'rest_site' | 'narrative_event';
    encounterId?: string; // Links to a specific encounter definition
    connections: string[]; // IDs of connected nodes
    position: { x: number; y: number }; // For visual representation
}

export interface GameMap {
    nodes: Record<string, MapNode>;
    startNodeId: string;
}