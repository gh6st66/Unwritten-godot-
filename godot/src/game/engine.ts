import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { reduce, INITIAL } from "./stateMachine";
import { GameEvent, GameState } from "./types";
import { MaskForger } from "../systems/MaskForger";
import { generateWorld } from "../world/generateWorld";
import { generateCivs } from "../civ/generateCivs";
import { recordEvent } from "../systems/chronicle";
import { OmenGenerator } from "../systems/OmenGenerator";

const STORAGE_KEY = "unwritten:v1";

type AsyncTask = () => Promise<void>;

export function useEngine() {
  const [state, dispatch] = useReducer(reduce, INITIAL);
  const [canContinue, setCanContinue] = useState(false);
  const [asyncTaskQueue, setAsyncTaskQueue] = useState<AsyncTask[]>([]);
  const [isAsyncTaskRunning, setIsAsyncTaskRunning] = useState(false);

  useEffect(() => {
    // Check for a saved game on initial mount
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            const parsed = JSON.parse(raw) as GameState;
            // A valid save is anything not in an initial or loading state
            if (parsed.phase && parsed.phase !== 'TITLE' && !['LOADING', 'WORLD_GEN'].includes(parsed.phase)) {
                setCanContinue(true);
            }
        } catch (e) {
            console.error("Failed to parse saved game state:", e);
            localStorage.removeItem(STORAGE_KEY);
        }
    }
  }, []);

  const maskForger = useMemo(() => new MaskForger(), []);
  const originGenerator = useMemo(() => new OmenGenerator(), []);

  // Effect to process the async task queue
  useEffect(() => {
    if (!isAsyncTaskRunning && asyncTaskQueue.length > 0) {
      setIsAsyncTaskRunning(true);
      const [nextTask, ...remainingQueue] = asyncTaskQueue;
      setAsyncTaskQueue(remainingQueue);

      nextTask().finally(() => {
        setIsAsyncTaskRunning(false);
      });
    }
  }, [asyncTaskQueue, isAsyncTaskRunning]);


  useEffect(() => {
    // Only save state if we're not on the title screen
    if (state.phase !== 'TITLE') {
      // Don't save LOADING/GEN state in case user closes tab
      if (!["LOADING", "WORLD_GEN"].includes(state.phase)) {
        const replacer = (key: string, value: any) => {
          if (value instanceof Set) {
            return Array.from(value);
          }
          return value;
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state, replacer));
      }
    }
  }, [state]);

  // Chronicle event recording
  useEffect(() => {
    const events = JSON.parse(localStorage.getItem('unwritten:chronicle:events') || '[]');
    
    if (state.phase === "WORLD_GEN" && state.runId !== "none" && state.activeOrigin) {
        const runExists = events.some((e: any) => e.type === 'RUN_STARTED' && e.runId === state.runId);
        if (!runExists) {
            recordEvent({ type: "RUN_STARTED", runId: state.runId, seed: state.activeOrigin.title });
        }
    } else if (state.phase === "COLLAPSE" && state.runId !== "none") {
        const runEnded = events.some((e: any) => e.type === 'RUN_ENDED' && e.runId === state.runId);
        if (!runEnded) {
            const reason = state.screen.kind === 'COLLAPSE' ? state.screen.reason : 'Unknown';
            recordEvent({ type: "RUN_ENDED", runId: state.runId, outcome: reason });
        }
    } else if (state.phase === 'OMEN' && state.player.mask && state.firstMaskLexeme) {
        const maskForged = events.some((e: any) => e.type === 'MASK_FORGED' && e.maskId === state.player.mask!.id);
        if (!maskForged) {
           recordEvent({
               type: 'MASK_FORGED',
               maskId: state.player.mask.id,
               name: state.player.mask.name,
               description: state.player.mask.description,
               forgeId: "dream-forge", // First forge is always the dream forge
               learnedWordId: state.firstMaskLexeme.id,
               runId: state.runId,
               ownerId: state.player.id,
           });
        }
    }
  }, [state.phase, state.runId, state.activeOrigin, state.screen, state.player, state.firstMaskLexeme]);


  useEffect(() => {
    let aborted = false;

    const queueTask = (task: AsyncTask) => {
      if (!aborted) {
        setAsyncTaskQueue(q => [...q, task]);
      }
    };
    
    if (state.phase === "LOADING" && state.screen.kind === 'LOADING') {
        const { context } = state.screen;

        if (context === 'ORIGIN_GEN') {
            queueTask(async () => {
                try {
                    const origins = await originGenerator.generateOrigins(3);
                    if (!aborted) dispatch({ type: "ORIGINS_GENERATED", origins });
                } catch (e) {
                    console.error("Origin generation failed:", e);
                    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
                    if (!aborted) dispatch({ type: "GENERATION_FAILED", error: `Could not read the threads of fate. ${errorMessage}` });
                }
            });
        } else if (context === 'MASK') {
          queueTask(async () => {
            if (!state.firstMaskLexeme || !state.activeOrigin) {
                if (!aborted) dispatch({ type: "GENERATION_FAILED", error: "Internal error: Missing context for mask forging." });
                return;
            }
            try {
              const mask = await maskForger.forgeFirstMask(state.firstMaskLexeme, state.activeOrigin);
              if (!aborted) dispatch({ type: "MASK_FORGED", mask });
            } catch (e) {
              console.error("Mask forging failed:", e);
              const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
              if (!aborted) dispatch({ type: "GENERATION_FAILED", error: `Could not forge the mask. ${errorMessage}` });
            }
          });
        } else if (context === 'SCENE') {
          // This is synchronous, no need to queue.
          const sceneId = state.currentSceneId || 'mountain_forge';
          dispatch({ type: "LOAD_SCENE", sceneId });
        } else if (context === 'WORLD_GEN') {
           if (!state.activeOrigin) {
            dispatch({ type: "GENERATION_FAILED", error: "Internal error: Missing origin for world generation." });
          } else {
            try {
                const { world, worldFacts } = generateWorld({ 
                    worldSeed: state.runId, 
                    historyYears: 50, 
                    variance: 0.1,
                    numFactions: 4,
                });
                const civs = generateCivs(world, 3);
                dispatch({ type: "WORLD_GENERATED", world, civs, worldFacts });
            } catch (e) {
                console.error("World generation failed:", e);
                const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
                dispatch({ type: "GENERATION_FAILED", error: `Could not generate world. ${errorMessage}` });
            }
          }
        }
    }
    
    return () => {
      aborted = true;
    };
  }, [state.phase, state.screen, state.runId, state.activeOmen, state.activeOrigin, state.firstMaskLexeme, maskForger, originGenerator]);

  const send = useCallback((ev: GameEvent) => dispatch(ev), []);

  const loadGame = useCallback(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            const snapshot = JSON.parse(raw) as GameState;
            send({ type: "LOAD_STATE", snapshot });
            setCanContinue(false); // Can't continue again after loading
        } catch(e) {
            console.error("Failed to load game state:", e);
            // If loading fails, reset to a clean state
            send({ type: "RESET_GAME" });
        }
    }
  }, [send]);

  const api = useMemo(() => ({ state, send, canContinue, loadGame }), [state, send, canContinue, loadGame]);
  return api;
}
