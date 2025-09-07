/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GameEvent, GameState, Resources, Mark, Omen, Origin, ResourceId, Lexeme, SceneObject, Player } from "./types";
import { LEXEMES_DATA } from "../data/lexemes";
import { LexemeTier } from "../types/lexeme";
import { INTENTS, LEXICON, SCENES } from '../data/parser/content';
import { ParserEngine } from '../systems/parser/engine';
import { createInventory } from '../systems/inventory';
import { getEvents, getChronicleData } from '../systems/chronicle';
import { getMarkDef } from "../systems/Marks";
import { OMENS_DATA } from "../data/claims";
import { handleIntent, applyDelta, selectVariant, selectAtmosphere } from "../accord/accord";
import { IntentCtx } from "../accord/types";
import { INITIAL_ACCORD, INITIAL_FACTIONS, INITIAL_NPCS } from "../data/accord/state";
import { INITIAL_OMEN_WEIGHTS } from "../data/omen/initial";
import { updateOmenWeights } from "../omen/omen";
import { recordEvent } from '../systems/chronicle';
import { generateSummary } from '../chronicle/summary';
import { calculateBias } from '../chronicle/bias';

const STORAGE_KEY = "unwritten:v1";

const parser = new ParserEngine(INTENTS, LEXICON);

export const INITIAL: GameState = {
  phase: "TITLE",
  runId: "none",
  activeOmen: null,
  activeOrigin: null,
  firstMaskLexeme: null,
  day: 1,
  world: {
    world: null,
    civs: [],
  },
  worldFacts: [],
  player: {
    id: "p1",
    name: "The Unwritten",
    maskTag: 'HERALD',
    resources: { [ResourceId.TIME]: 6, [ResourceId.CLARITY]: 3, [ResourceId.CURRENCY]: 0 },
    marks: [],
    mask: null,
    unlockedLexemes: LEXEMES_DATA.filter(l => l.tier === LexemeTier.Basic).map(l => l.id),
    flags: new Set<string>(),
    inventory: createInventory(),
  },
  npcs: INITIAL_NPCS,
  factions: INITIAL_FACTIONS,
  accord: INITIAL_ACCORD,
  omenWeights: INITIAL_OMEN_WEIGHTS,
  screen: { kind: "TITLE" },
  currentSceneId: null,
  rumors: [],
  lastEchoTimestamp: 0,
};


export function reduce(state: GameState, ev: GameEvent): GameState {
  switch (ev.type) {
    case "OPEN_TESTER": {
      if (state.phase !== "TITLE") return state;
      return { ...state, phase: "GENERATION_TESTER", screen: { kind: "GENERATION_TESTER" } };
    }
    case "CLOSE_TESTER": {
      if (state.phase !== "GENERATION_TESTER") return state;
      return INITIAL;
    }
    case "REQUEST_NEW_RUN": {
      const chronicleEvents = getEvents();
      const biases = calculateBias(chronicleEvents);
      // Apply biases to a fresh state
      let biasedInitial = structuredClone(INITIAL);
      for (const [key, delta] of Object.entries(biases.factionStanceDeltas)) {
          const [factionId, maskTag] = key.split(':');
          if (biasedInitial.factions[factionId] && biasedInitial.factions[factionId].stance[maskTag] !== undefined) {
              biasedInitial.factions[factionId].stance[maskTag] += delta as number;
          }
      }
      return {
        ...biasedInitial,
        phase: "LOADING",
        screen: { kind: "LOADING", message: "Reading the threads of fate...", context: "ORIGIN_GEN" },
      };
    }
    case "ORIGINS_GENERATED": {
      return {
        ...state,
        phase: "ORIGIN_SELECTION",
        screen: { kind: "ORIGIN_SELECTION", origins: ev.origins },
      };
    }
    case "START_RUN": {
      const initialPlayer: Player = {
        ...structuredClone(INITIAL.player),
        maskTag: Math.random() > 0.5 ? 'HERALD' : 'TRICKSTER' // Randomize starting mask persona
      };
      
      if (ev.origin.resourceModifier) {
        for (const key in ev.origin.resourceModifier) {
          const resourceId = key as ResourceId;
          const delta = ev.origin.resourceModifier[resourceId] ?? 0;
          initialPlayer.resources[resourceId] = (initialPlayer.resources[resourceId] ?? 0) + delta;
        }
      }
    
      if (ev.origin.initialPlayerMarkId) {
        const markDef = getMarkDef(ev.origin.initialPlayerMarkId);
        const newMark: Mark = { id: markDef.id, label: markDef.name, value: 1 };
        initialPlayer.marks = mergeMarks(initialPlayer.marks, [newMark]);
      }
    
      return {
        ...INITIAL,
        player: initialPlayer,
        phase: "LOADING",
        runId: crypto.randomUUID(),
        activeOrigin: ev.origin,
        screen: { kind: "LOADING", message: "The world takes shape...", context: "WORLD_GEN" },
      };
    }
    case "WORLD_GENERATED": {
      if (!state.activeOrigin) return state;
      return {
        ...state,
        phase: "FIRST_MASK_FORGE",
        world: { world: ev.world, civs: ev.civs },
        worldFacts: ev.worldFacts,
        screen: { kind: "FIRST_MASK_FORGE" },
      }
    }
    case "COMMIT_FIRST_MASK": {
      if (state.phase !== 'FIRST_MASK_FORGE') return state;
      return {
        ...state,
        phase: "LOADING",
        firstMaskLexeme: ev.lexeme,
        screen: { kind: "LOADING", message: "The mask takes form in the ether...", context: "MASK" }
      };
    }
    case "MASK_FORGED": {
      const lexeme = state.firstMaskLexeme;
      let newMarks = state.player.marks;
      if (lexeme?.effects.startingMarks) {
        const startingMarks: Mark[] = lexeme.effects.startingMarks.map(id => ({ id, label: id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), value: 1 }));
        newMarks = mergeMarks(newMarks, startingMarks);
      }
      return {
        ...state,
        phase: "MASK_REVEAL",
        player: {
          ...state.player,
          mask: ev.mask,
          marks: mergeMarks(newMarks, ev.mask.grantedMarks),
        },
        screen: { kind: "MASK_REVEAL", mask: ev.mask }
      };
    }
    case "CONTINUE_AFTER_REVEAL": {
        if (state.phase !== "MASK_REVEAL") return state;
        return {
            ...state,
            phase: "OMEN",
            screen: { kind: "OMEN", omen: seedOmen(state.runId, state.activeOrigin) }
        };
    }
    case "ACCEPT_OMEN": {
      const startingMark: Mark = ev.approach === 'embrace'
        ? { id: 'fate-embraced', label: 'Fate-Embraced', value: 1 }
        : { id: 'fate-defiant', label: 'Fate-Defiant', value: 1 };

      const newOmenWeights = updateOmenWeights(state.omenWeights, { type: 'CHOICE', tag: ev.approach });
      recordEvent({type: 'OMEN_WEIGHTS_UPDATED', runId: state.runId, reason: 'accept_omen', newWeights: newOmenWeights.values });

      return {
        ...state,
        phase: "LOADING",
        activeOmen: ev.omen,
        omenWeights: newOmenWeights,
        player: {
          ...state.player,
          marks: mergeMarks(state.player.marks, [startingMark]),
        },
        screen: { kind: "LOADING", message: "The ink of fate dries...", context: "SCENE" }
      };
    }
    case "LOAD_SCENE": {
      const sceneData = SCENES[ev.sceneId];
      if (!sceneData) {
        console.error(`Scene not found: ${ev.sceneId}`);
        return {
          ...state,
          phase: "COLLAPSE",
          screen: { kind: "COLLAPSE", reason: `The world faded. (Scene ${ev.sceneId} not found)`, summaryLog: [] }
        };
      }
      
      const newObjects = structuredClone(sceneData.objects);
      const sceneDescription = sceneData.description;
      const newFlags = new Set(state.player.flags);
      
      const narrativeLog = [sceneDescription, ...selectAtmosphere(ev.sceneId, state)];
      
      return {
        ...state,
        phase: "SCENE",
        currentSceneId: ev.sceneId,
        player: { ...state.player, flags: newFlags },
        screen: {
          kind: "SCENE",
          sceneId: ev.sceneId,
          description: sceneDescription,
          objects: newObjects,
          narrativeLog: narrativeLog,
          suggestedCommands: [],
        }
      };
    }
    case "ATTEMPT_ACTION": {
      if (state.phase !== 'SCENE' || !state.currentSceneId || state.screen.kind !== 'SCENE') return state;
      
      const sceneData = SCENES[state.currentSceneId];
      const result = parser.resolve(ev.rawCommand, sceneData, state.player);
      const currentScreen = state.screen;

      if (!result.ok || !result.intent_id) {
        return { ...state, screen: { ...currentScreen, narrativeLog: [...currentScreen.narrativeLog, `> ${ev.rawCommand}`, result.message ?? "Nothing happens."], suggestedCommands: result.suggested ?? [] } };
      }
      
      // Handle special informational intents before the Accord system
      if (result.intent_id === 'CONSULT_SYSTEM') {
        const objectId = result.bindings?.object;
        let newLogEntries: string[] = [];

        switch (objectId) {
          case 'rumors': {
            const recentRumors = state.rumors.slice(-3).map(r => `- "${r.text}"`);
            newLogEntries = recentRumors.length > 0
              ? ["You recall recent whispers...", ...recentRumors]
              : ["You listen for rumors, but hear nothing of note."];
            break;
          }
          case 'accord': {
            const { stability, thresholds } = state.accord;
            let accordText = "The World Accord is stable.";
            if (stability > thresholds.unity) accordText = "The Accord feels strong, a sense of unity is palpable.";
            else if (stability < thresholds.fracture) accordText = "The Accord is frayed, on the verge of fracturing.";
            else if (stability > thresholds.unity * 0.7) accordText = "A sense of purpose seems to lighten the air.";
            else if (stability < thresholds.fracture * 0.7) accordText = "The air feels heavy with unspoken tension.";
            newLogEntries = [accordText];
            break;
          }
          case 'beat': {
             const beatText = state.accord.scheduledBeats.length > 0 
                ? "The world feels taut, as if something is about to break."
                : "The threads of fate are calm for now.";
            newLogEntries = [beatText];
            break;
          }
          case 'chronicle': {
            const chronicleData = getChronicleData();
            const lastRun = Object.values(chronicleData.runs).filter(r => r.endTs).sort((a, b) => b.startTs - a.startTs)[0];
            const summary = lastRun ? generateSummary(lastRun, chronicleData.events) : ["No previous run has been recorded."];
            const bias = calculateBias(chronicleData.events);
            const biasLines = Object.entries(bias.factionStanceDeltas).map(([key, value]) => {
              const [faction, mask] = key.split(':');
              const effect = (value as number) > 0 ? "favorable" : "unfavorable";
              return `The world's stance towards the ${mask} is currently ${effect} regarding the ${faction}.`;
            });

            newLogEntries.push("--- From the Chronicle ---", ...summary);
            if(biasLines.length > 0) newLogEntries.push(...biasLines);
            else newLogEntries.push("The world feels no strong echoes from your past.");
            break;
          }
          default:
            newLogEntries = ["You ponder, but find no answers."];
        }
        
        return {
          ...state,
          screen: {
            ...currentScreen,
            narrativeLog: [...currentScreen.narrativeLog, `> ${ev.rawCommand}`, ...newLogEntries]
          }
        };
      }

      const intentCtx: IntentCtx = {
          intentId: result.intent_id!,
          actorId: state.player.id,
          mask: state.player.maskTag,
          sceneId: state.currentSceneId,
          bindings: result.bindings ?? {}
      };
    
      const delta = handleIntent(intentCtx, state);
      let nextState = applyDelta(state, delta);
      
      if (delta.echoes) {
        for(const echo of delta.echoes) {
            recordEvent({ type: echo.event as any, runId: state.runId, ...echo.payload });
        }
      }

      recordEvent({type: 'ACCORD_DELTA_APPLIED', runId: state.runId, sceneId: state.currentSceneId, intentId: intentCtx.intentId, delta });
      
      const nextCurrentScreen = nextState.screen.kind === 'SCENE' ? nextState.screen : null;
      if (nextCurrentScreen) {
        const line = selectVariant(delta.lineId ?? 'ACTION_DEFAULT', nextState);
        return { ...nextState, screen: { ...nextCurrentScreen, narrativeLog: [...nextCurrentScreen.narrativeLog, `> ${ev.rawCommand}`, line] } };
      }

      return nextState;
    }
    case "GENERATION_FAILED": {
        return { ...state, phase: "COLLAPSE", screen: { kind: "COLLAPSE", reason: `The world unravelled. (${ev.error})`, summaryLog: [] } };
    }
    case "END_RUN": {
        const chronicleEvents = getEvents();
        const lastRun = Object.values(getChronicleData().runs).find(r => r.runId === state.runId);
        const summaryLog = lastRun ? generateSummary(lastRun, chronicleEvents) : ['The Unwritten\'s path ends... for now.'];
        recordEvent({ type: 'RUN_ENDED', runId: state.runId, outcome: ev.reason });
        return { ...state, phase: "COLLAPSE", screen: { kind: "COLLAPSE", reason: ev.reason, summaryLog } };
    }
     case "RETURN_TO_TITLE": {
      return { ...INITIAL, phase: "TITLE", screen: { kind: "TITLE" } };
    }
    case "LOAD_STATE": {
      const snapshot = ev.snapshot;
      const flags = Array.isArray(snapshot.player.flags) ? new Set(snapshot.player.flags as string[]) : new Set<string>();
      return { ...snapshot, player: { ...snapshot.player, flags } };
    }
    case "RESET_GAME": {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('unwritten:chronicle:events');
      return INITIAL;
    }
    default: {
      const _exhaustiveCheck: never = ev;
      return state;
    }
  }
}

function seedOmen(runId: string, origin: Origin | null): Omen {
  let pool = [...OMENS_DATA];
  if (origin?.omenBias && origin.omenBias.length > 0) {
    const biasedPool = OMENS_DATA.filter(c => origin.omenBias!.includes(c.id));
    if (biasedPool.length > 0) pool = biasedPool;
  }
  const idx = Math.abs(hash(runId)) % pool.length;
  return pool[idx];
}

export function mergeMarks(current: Mark[], gains: Mark[]) {
  const map = new Map(current.map(m => [m.id, m]));
  for (const g of gains) {
    const prev = map.get(g.id);
    if (prev) map.set(g.id, { ...prev, value: Math.max(-3, Math.min(3, prev.value + g.value)) });
    else map.set(g.id, g);
  }
  return Array.from(map.values());
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h | 0;
}
