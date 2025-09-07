/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Player, SceneObject } from '../../game/types';
import { getItemRule } from '../../data/itemCatalog';
import type { Intent, Lexicon, ParseResult, ResolveResult, SceneIndex, SlotName, FailReason } from './types';
import { THESAURUS } from '../../data/parser/content';

/** Maps a synonym to its root action ID. Returns null if not found. */
function findRoot(verb: string | undefined, thesaurus: Record<string, string>, lexicon: Lexicon): string | null {
  if (!verb) return null;
  const lowerVerb = verb.toLowerCase();
  
  // Direct match in thesaurus
  if (thesaurus[lowerVerb]) {
    return thesaurus[lowerVerb];
  }
  
  // Check if it's a value in the directions map
  for (const dir_canon in lexicon.directions) {
      if (lexicon.directions[dir_canon].includes(lowerVerb)) return 'MOVE';
  }

  return null;
}


/**
 * High-level resolver. Takes a parsed result and context, returns a final action or failure.
 */
export function resolve(
  p: ParseResult,
  scene: SceneIndex,
  intents: Intent[],
  lexicon: Lexicon,
  player: Player
): ResolveResult {
  // SPECIAL CASE: Handle single-word commands that were parsed as 'inspect <word>'
  // This can happen if the word is a verb (e.g., "leave", "help"). We check if the
  // supposed object is actually a known verb.
  if (p.verb === 'inspect' && p.slots.object && Object.keys(p.slots).length === 1) {
    const potentialNoun = p.slots.object;
    const potentialRoot = findRoot(potentialNoun, THESAURUS, lexicon);
    
    if (potentialRoot) {
      // The word is a verb. Let's see if it can be a zero-argument command.
      const verbIntents = intents.filter(i => i.root === potentialRoot);
      const zeroArgIntent = verbIntents.find(i => i.slots.length === 0);
      
      if (zeroArgIntent) {
         // It's a valid zero-argument command. Re-parse and proceed.
         p = { raw: p.raw, verb: potentialNoun, slots: {} };
      } else if (verbIntents.length > 0) {
         // It's a verb that needs arguments (e.g., "drop needs an object").
         return fail("missing_slots_or_reqs", `What do you want to ${potentialNoun}?`, verbIntents[0].hints);
      }
    }
  }
  
  // 1. Map the parsed verb to its root action ID.
  const rootId = findRoot(p.verb, THESAURUS, lexicon);
  if (!rootId) {
    return fail("unknown_verb", `I don't know how to '${p.verb}'.`, suggestVerbs(scene, intents));
  }

  // 2. Find all intents that could match the root action.
  const candidateIntents = intents.filter(i => i.root === rootId);
  if (candidateIntents.length === 0) {
    return fail("unknown_intent", `You can't do that here.`, suggestVerbs(scene, intents));
  }

  // 3. Bind objects and other slots from the scene context.
  let bound = bindSlots(p, scene, lexicon, player, rootId);
  
  // If binding failed because an object wasn't found, check if a slotless interpretation is possible.
  if (!bound.ok && bound.reason === 'unknown_object') {
    const hasSlotlessCandidate = candidateIntents.some(i => i.slots.length === 0);
    if (hasSlotlessCandidate) {
      // The command might be a slotless verb with a junk object (e.g., "shout hello").
      // We can ignore the object binding failure and proceed with empty bindings.
      bound = { ok: true, bindings: {} };
    }
  }

  if (!bound.ok) {
    // Handle other, non-recoverable binding failures like ambiguity.
    return fail(bound.reason!, bound.message!, bound.suggested);
  }
  
  // 4. Find the best intent that matches the available slots and requirements.
  const matchedIntents = candidateIntents.filter(i => {
    // An intent matches if all of its required slots are present in the bindings.
    const hasAllSlots = i.slots.every(s => bound.bindings[s] !== undefined);
    const meetsReqs = checkRequirements(i, player, scene);
    
    // Special check for no-slot intents. If we have bindings, it's not a match.
    if (i.slots.length === 0 && Object.keys(bound.bindings).length > 0) return false;
    
    return hasAllSlots && meetsReqs;
  });

  if (matchedIntents.length === 0) {
     // Check for requirement failures before slot failures.
    const unmetIntent = candidateIntents.find(i => i.slots.every(s => p.slots[s] !== undefined));
    if (unmetIntent && unmetIntent.requirements) {
        return fail(`missing_requirement:${Object.keys(unmetIntent.requirements)[0]}`, "You can't do that right now.", unmetIntent.hints?.slice(0, 3));
    }
    return fail("missing_slots_or_reqs", "That doesn't make sense.", candidateIntents[0]?.hints?.slice(0, 3) ?? []);
  }
  
  // If multiple intents match, prefer the one with more matching slots (more specific).
  const intent = matchedIntents.sort((a, b) => b.slots.length - a.slots.length)[0];

  return {
    ok: true,
    intent_id: intent.id,
    intentType: intent.intentType,
    bindings: bound.bindings,
  };
}

// --- Helper Functions ---

function fail(reason: FailReason, message: string, suggested: string[] = []): ResolveResult {
  return { ok: false, reason, message, suggested };
}

function suggestVerbs(scene: SceneIndex, intents: Intent[]): string[] {
  // A simple suggestion engine for now.
  const suggestions: string[] = [];
  if (scene.objects.length > 0) {
    suggestions.push(`inspect ${scene.objects[0].name}`);
  }
  if (intents.find(i => i.id === 'MOVE')) {
    const firstExit = Object.keys(scene.exits)[0];
    if (firstExit) suggestions.push(`go ${firstExit}`);
  }
  return suggestions.slice(0, 3);
}

/** Finds all matching scene objects for a given noun phrase. */
function findObjectsInScene(name: string | undefined, scene: SceneIndex): SceneObject[] {
  if (!name) return [];
  const candidates = scene.objects.filter(o => 
    o.name === name || o.aliases.includes(name) || o.id.startsWith(name)
  );
  if (candidates.length === 0) return [];
  // Sort by salience to break ties if we decide to pick one later.
  return candidates.sort((a, b) => b.salience - a.salience);
}

/** Binds slot fillers from the parse result to concrete entity IDs from the scene. */
function bindSlots(
    p: ParseResult, 
    scene: SceneIndex, 
    lexicon: Lexicon, 
    player: Player,
    rootId: string
): { ok: boolean, bindings: Record<string, string>, reason?: FailReason, message?: string, suggested?: string[] } {
  const bindings: Record<string, string> = {};
  let hadObjectFailure = false;

  const isDropIntent = rootId === 'DROP';
  const isCombineIntent = rootId === 'COMBINE';

  if (isDropIntent && p.slots.object) {
    const nounToDrop = p.slots.object;
    const inventoryItems = player.inventory.slots.map(slot => {
        const rule = getItemRule(slot.itemId);
        return { ...rule, itemId: slot.itemId };
    });

    const matches = inventoryItems.filter(item => 
        item.name.toLowerCase() === nounToDrop || (item.nouns ?? []).includes(nounToDrop)
    );

    if (matches.length === 0) {
        return { ok: false, bindings, reason: 'unknown_object', message: `You are not carrying a '${nounToDrop}'.` };
    }
    if (matches.length > 1) {
        return { ok: false, bindings, reason: 'ambiguous_object', message: `Which '${nounToDrop}' do you want to drop?` };
    }
    
    bindings['object'] = matches[0].itemId;
    return { ok: true, bindings };
  }

  if (isCombineIntent) {
    // For combine, we assume ingredients are in inventory.
    for (const slotName in p.slots) {
      const noun = p.slots[slotName as SlotName];
      if (!noun) continue;
      
      const itemInInventory = player.inventory.slots.find(s => {
          const rule = getItemRule(s.itemId);
          return rule.name.toLowerCase() === noun || (rule.nouns ?? []).includes(noun);
      });

      if (itemInInventory) {
          bindings[slotName] = itemInInventory.itemId;
      } else {
          return { ok: false, bindings, reason: 'unknown_object', message: `You don't have any '${noun}'.` };
      }
    }
    return { ok: true, bindings };
  }

  for (const slotName in p.slots) {
    const value = p.slots[slotName as SlotName];
    if (!value) continue;

    if (slotName === 'object' || slotName === 'target' || slotName === 'tool') {
      const objects = findObjectsInScene(value, scene);
      if (objects.length === 0) {
        hadObjectFailure = true;
        // Don't fail immediately, another interpretation might work.
        // For example, "take north path". "north path" isn't an object, but it could be a direction.
        continue;
      }
      if (objects.length > 1) {
        const suggested = objects.map(o => `inspect ${o.name}`);
        return { ok: false, bindings, reason: 'ambiguous_object', message: `Which '${value}' do you mean?`, suggested };
      }
      bindings[slotName] = objects[0].id;
    } else if (slotName === 'direction') {
      const dirCanonicals = Object.keys(lexicon.directions).filter(canon => lexicon.directions[canon].includes(value));
      const canonicalDir = dirCanonicals[0] || value;

      if (canonicalDir && scene.exits[canonicalDir]) {
        bindings.direction = canonicalDir;
      } else if (scene.exits[value]) { // Also check non-canonical, e.g. 'enter' -> 'in'
        bindings.direction = value;
      } else {
         const exitKey = Object.keys(scene.exits).find(k => lexicon.directions[k]?.includes(value));
         if (exitKey) {
            bindings.direction = exitKey;
         } else {
            // It could be something like "north path". Check if a part of it is a direction.
            const words = value.split(' ');
            const dirWord = words.find(w => Object.values(lexicon.directions).flat().includes(w));
            const canonicalDirFromPhrase = dirWord ? Object.keys(lexicon.directions).find(c => lexicon.directions[c].includes(dirWord!)) : null;
            if (canonicalDirFromPhrase && scene.exits[canonicalDirFromPhrase]) {
              bindings.direction = canonicalDirFromPhrase;
            }
         }
      }
    } else {
      // For other slots like 'topic' or 'lexeme', we just pass the raw value for now.
      bindings[slotName] = value;
    }
  }

  if (hadObjectFailure && Object.keys(bindings).length === 0 && (p.slots.object || p.slots.tool)) {
     return { ok: false, bindings, reason: 'unknown_object', message: `You don't see any '${p.slots.object || p.slots.tool}' here.` };
  }

  return { ok: true, bindings };
}

/** Checks if the player meets the requirements for an intent. */
function checkRequirements(intent: Intent, player: Player, scene: SceneIndex): boolean {
  if (!intent.requirements) return true;
  const { flags_all, flags_any, resources, location_tag } = intent.requirements;
  
  if (flags_all && !flags_all.every(f => player.flags.has(f))) return false;
  if (flags_any && !flags_any.some(f => player.flags.has(f))) return false;
  
  if (location_tag && !(scene.tags ?? []).some(t => location_tag.includes(t))) return false;

  if (resources) {
    for (const res in resources) {
      if ((player.resources[res as keyof typeof player.resources] || 0) < resources[res]) {
        return false;
      }
    }
  }

  return true;
}
