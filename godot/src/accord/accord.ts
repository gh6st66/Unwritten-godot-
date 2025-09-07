/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GameState } from "../game/types";
import { EngineDelta, IntentCtx, NPCState, Condition, VariantBlock, ID } from "./types";
import { INTENT_WEIGHTS, SCOPE_FACTORS } from "../data/accord/weights";
import { TEXT_VARIANTS } from "../data/text/variants";
import { SCENES } from "../data/parser/content";

/**
 * The main "Intent Handler". Takes a resolved player action and the current state,
 * and calculates the narrative consequences as a declarative EngineDelta.
 */
export function handleIntent(ctx: IntentCtx, state: GameState): EngineDelta {
  const delta: EngineDelta = {};
  const weightDef = INTENT_WEIGHTS[ctx.intentId];

  if (!weightDef) {
    // This intent has no Accord effect.
    return { lineId: 'ACTION_DEFAULT' };
  }

  // Resolve the target NPC from parser bindings. Fallback for now.
  const targetId = ctx.bindings.object as ID || "ELDER_ANAH";
  const targetNpc = state.npcs[targetId];
  if (!targetNpc) {
     return { lineId: 'ACTION_DEFAULT', debug: { error: `NPC target '${targetId}' not found.` } };
  }
  
  const maskAffinity = targetNpc.factions.reduce((acc, factionId) => {
    const faction = state.factions[factionId];
    return acc + (faction?.stance[ctx.mask] ?? 0);
  }, 0);

  // 1. Recognition Delta
  const recognition: { npcId: string, trust?: number, fear?: number } = { npcId: targetId };
  if (weightDef.trust) {
    recognition.trust = weightDef.trust + Math.round(maskAffinity / 2);
  }
  if (weightDef.fear) {
    recognition.fear = weightDef.fear;
  }
  delta.recognition = [recognition];

  // 2. Accord Delta
  if (weightDef.accord) {
    delta.accord = { stability: weightDef.accord };
  }
  
  // 3. Line ID for response text
  delta.lineId = "COUNCIL_GREET"; // hardcoded for demo

  return delta;
}

/**
 * A pure function that applies an EngineDelta to a GameState, producing a new GameState.
 */
export function applyDelta(state: GameState, delta: EngineDelta): GameState {
    let next = { ...state };

    if (delta.recognition) {
        const nextNpcs = { ...next.npcs };
        for (const r of delta.recognition) {
            if (!nextNpcs[r.npcId]) continue;
            const npc = { ...nextNpcs[r.npcId] };
            npc.recognition = { ...npc.recognition };
            if (r.trust) npc.recognition.trust += r.trust;
            if (r.fear) npc.recognition.fear += r.fear;
            if (r.awe) npc.recognition.awe += r.awe;
            nextNpcs[r.npcId] = npc;
        }
        next = { ...next, npcs: nextNpcs };
    }

    if (delta.accord) {
        const nextAccord = { ...next.accord };
        nextAccord.stability = Math.max(-100, Math.min(100, nextAccord.stability + delta.accord.stability));
        next = { ...next, accord: nextAccord };
    }
    
    // loyalty, beats, echoes would be handled here
    
    // --- New Rumor & Echo Feedback Logic ---
    let newRumors = [...(next.rumors || [])];
    const MAX_RUMORS = 5;

    const addRumor = (text: string) => {
        if (newRumors.length > 0 && newRumors[newRumors.length - 1].text === text) return;
        newRumors.push({ text, id: crypto.randomUUID() });
        if (newRumors.length > MAX_RUMORS) {
            newRumors.shift();
        }
    };

    if (delta.accord && delta.accord.stability !== 0) {
        if (delta.accord.stability > 0) addRumor("The Accord strengthens.");
        else addRumor("The Accord frays.");
    }
    if (delta.echoes && delta.echoes.length > 0) {
        addRumor("An echo ripples through time.");
        next.lastEchoTimestamp = Date.now();
    }
    if (delta.beats && delta.beats.length > 0) {
        addRumor("A fated event draws near.");
    }

    next = { ...next, rumors: newRumors };

    return next;
}

/**
 * A tiny, safe DSL interpreter for text variant conditions.
 * It only supports the format: "npc('ID').recognition.key [>|<] value"
 */
export function evaluateCondition(condition: Condition, state: GameState): boolean {
    try {
        const pattern = /npc\('([^']+)'\)\.recognition\.(\w+)\s*([><])\s*(\d+)/;
        const match = condition.match(pattern);

        if (!match) {
            console.warn(`Invalid condition format: "${condition}"`);
            return false;
        }

        const [, npcId, key, operator, valueStr] = match;
        const value = parseInt(valueStr, 10);
        
        const npc = state.npcs[npcId];
        if (!npc) return false;
        
        const recognitionKey = key as keyof NPCState['recognition'];
        if (npc.recognition[recognitionKey] === undefined) return false;
        
        const npcValue = npc.recognition[recognitionKey];

        if (operator === '>') return npcValue > value;
        if (operator === '<') return npcValue < value;

    } catch (e) {
        console.error(`Error evaluating condition: "${condition}"`, e);
    }
    return false;
}

/**
 * Selects the appropriate line of text from a variant block based on game state.
 */
export function selectVariant(blockId: string, state: GameState): string {
  const block = TEXT_VARIANTS[blockId];
  if (!block) return `Error: Missing variant block '${blockId}'`;

  // Find the first variant whose condition passes
  const matchedVariant = block.variants.find(variant => 
    variant.if ? evaluateCondition(variant.if, state) : false
  );

  if (matchedVariant) {
    return matchedVariant.text;
  }

  // Return the default (last, no 'if' condition)
  const defaultVariant = block.variants.find(variant => !variant.if);
  return defaultVariant ? defaultVariant.text : `Error: No default variant for '${blockId}'`;
}

export function selectAtmosphere(sceneId: string, state: GameState): string[] {
    // Stub for atmosphere selection
    const hints: string[] = [];
    if (state.accord.stability < state.accord.thresholds.fracture) {
        hints.push("The air feels heavy with unspoken tension.");
    } else if (state.accord.stability > state.accord.thresholds.unity) {
        hints.push("A sense of shared purpose seems to lighten the air.");
    }
    return hints;
}
