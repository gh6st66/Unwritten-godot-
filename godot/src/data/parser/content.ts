/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Intent, Lexicon, SceneIndex as ParserSceneIndex } from '../../systems/parser/types';
import { SceneObject } from '../../game/types';

// The SCENES data uses game-specific fields on SceneObject (like `takeable`),
// so we redefine SceneIndex here to use the richer SceneObject from game/types.
interface SceneIndex extends Omit<ParserSceneIndex, 'objects'> {
    objects: SceneObject[];
}

/**
 * NOTE: The following lexicon structures are based on the "Lexicon Expansion Spec".
 * For simplicity within this environment, they are consolidated into this single file
 * instead of being split into multiple JSON files with a build pipeline.
 */

// A map of semantic root actions. All synonyms will resolve to one of these roots.
export const LEXICON_ROOTS = {
  LOOK: { id: 'LOOK' }, TAKE: { id: 'TAKE' }, MOVE: { id: 'MOVE' }, DROP: { id: 'DROP' },
  USE: { id: 'USE' }, OPEN: { id: 'OPEN' }, CLOSE: { id: 'CLOSE' }, UNLOCK: { id: 'UNLOCK' }, INVENTORY: { id: 'INVENTORY' },
  SEARCH: { id: 'SEARCH' }, COMBINE: { id: 'COMBINE' }, DESTROY: { id: 'DESTROY' }, ASK: { id: 'ASK' },
  TALK: { id: 'TALK' }, SAY: { id: 'SAY' }, EAT: { id: 'EAT' }, LISTEN: { id: 'LISTEN' },
  PUSH: { id: 'PUSH' }, PULL: { id: 'PULL' }, GIVE: { id: 'GIVE' }, ATTACK: { id: 'ATTACK' },
  REST: { id: 'REST' }, PRAY: { id: 'PRAY' }, SWEAR: { id: 'SWEAR' }, RENOUNCE: { id: 'RENOUNCE' },
  ALLY: { id: 'ALLY' }, BETRAY: { id: 'BETRAY' }, REVEAL: { id: 'REVEAL' }, WITHHOLD: { id: 'WITHHOLD' },
  EXIT: { id: 'EXIT' }, CONSULT_SYSTEM: { id: 'CONSULT_SYSTEM' },
};

// Maps a root action ID to a single, canonical verb. Used for normalizing multi-word commands.
export const ROOT_TO_CANONICAL_VERB: Record<string, string> = {
  LOOK: 'look', TAKE: 'take', MOVE: 'go', DROP: 'drop', USE: 'use', OPEN: 'open', CLOSE: 'close',
  UNLOCK: 'unlock', INVENTORY: 'inventory', SEARCH: 'search', COMBINE: 'combine', EXIT: 'leave',
  DESTROY: 'break', ASK: 'ask', TALK: 'talk', SAY: 'tell', EAT: 'eat', LISTEN: 'listen',
  PUSH: 'push', PULL: 'pull', GIVE: 'give', ATTACK: 'attack', REST: 'rest', PRAY: 'pray',
  SWEAR: 'swear', RENOUNCE: 'defy', ALLY: 'ally', BETRAY: 'betray', REVEAL: 'reveal', WITHHOLD: 'hide',
  CONSULT_SYSTEM: 'consult',
};

// The main thesaurus mapping synonyms (lemmas) to their root action ID.
export const THESAURUS: Record<string, string> = {
  'look': 'LOOK', 'examine': 'LOOK', 'inspect': 'LOOK', 'observe': 'LOOK', 'study': 'LOOK', 'survey': 'LOOK', 'scan': 'LOOK', 'glance': 'LOOK', 'peer': 'LOOK', 'behold': 'LOOK', 'regard': 'LOOK', 'take a look': 'LOOK', 'cast eyes': 'LOOK', 'eye': 'LOOK',
  'take': 'TAKE', 'grab': 'TAKE', 'seize': 'TAKE', 'snatch': 'TAKE', 'pick up': 'TAKE', 'collect': 'TAKE', 'claim': 'TAKE', 'appropriate': 'TAKE', 'lift': 'TAKE', 'pocket': 'TAKE', 'acquire': 'TAKE', 'obtain': 'TAKE',
  'drop': 'DROP', 'discard': 'DROP', 'let go': 'DROP', 'release': 'DROP', 'ditch': 'DROP', 'jettison': 'DROP', 'shed': 'DROP', 'deposit': 'DROP', 'set down': 'DROP', 'throw away': 'DROP', 'cast off': 'DROP',
  'give': 'GIVE', 'offer': 'GIVE', 'hand': 'GIVE', 'present': 'GIVE', 'bestow': 'GIVE', 'grant': 'GIVE', 'deliver': 'GIVE', 'pass': 'GIVE', 'confer': 'GIVE', 'yield': 'GIVE', 'extend': 'GIVE',
  'speak': 'TALK', 'talk': 'TALK', 'address': 'TALK', 'utter': 'TALK', 'confer with': 'TALK', 'parley': 'TALK', 'beseech': 'TALK', 'declare': 'SAY', 'pronounce': 'SAY', 'hail': 'TALK', 'call to': 'TALK', 'converse': 'TALK',
  'ask': 'ASK', 'inquire': 'ASK', 'query': 'ASK', 'question': 'ASK', 'interrogate': 'ASK', 'seek': 'ASK', 'request': 'ASK',
  'tell': 'SAY', 'say to': 'SAY', 'inform': 'SAY', 'apprise': 'SAY', 'relate': 'SAY', 'recount': 'SAY', 'narrate': 'SAY', 'report': 'SAY', 'announce': 'SAY', 'say': 'SAY',
  'listen': 'LISTEN', 'heed': 'LISTEN', 'harken': 'LISTEN', 'attend': 'LISTEN', 'prick ears': 'LISTEN', 'eavesdrop': 'LISTEN', 'auscultate': 'LISTEN', 'take in': 'LISTEN', 'pay attention': 'LISTEN', 'hear out': 'LISTEN', 'listen for': 'LISTEN', 'strain to hear': 'LISTEN', 'keep ear': 'LISTEN', 'hark for': 'LISTEN', 'attend for whispers': 'LISTEN',
  'go': 'MOVE', 'move': 'MOVE', 'walk': 'MOVE', 'proceed': 'MOVE', 'advance': 'MOVE', 'travel': 'MOVE', 'step': 'MOVE', 'stride': 'MOVE', 'press on': 'MOVE', 'venture': 'MOVE', 'head': 'MOVE',
  'enter': 'MOVE', 'go in': 'MOVE', 'step in': 'MOVE', 'cross threshold': 'MOVE', 'pass into': 'MOVE', 'ingress': 'MOVE', 'make entry': 'MOVE', 'set foot in': 'MOVE',
  'leave': 'EXIT', 'depart': 'EXIT', 'withdraw': 'EXIT', 'retreat': 'EXIT', 'go out': 'EXIT', 'step out': 'EXIT', 'egress': 'EXIT', 'take leave': 'EXIT', 'quit': 'EXIT', 'clear out': 'EXIT',
  'open': 'OPEN', 'unseal': 'OPEN', 'unlatch': 'OPEN', 'uncap': 'OPEN', 'uncork': 'OPEN', 'unbar': 'OPEN', 'draw back': 'OPEN', 'crack open': 'OPEN', 'part': 'OPEN',
  'close': 'CLOSE', 'shut': 'CLOSE', 'seal': 'CLOSE', 'latch': 'CLOSE', 'lock': 'CLOSE', 'bar': 'CLOSE', 'fasten': 'CLOSE', 'stop up': 'CLOSE', 'secure': 'CLOSE',
  'push': 'PUSH', 'shove': 'PUSH', 'thrust': 'PUSH', 'press': 'PUSH', 'ram': 'PUSH', 'drive': 'PUSH', 'heave': 'PUSH', 'force': 'PUSH', 'shoulder': 'PUSH',
  'pull': 'PULL', 'yank': 'PULL', 'draw': 'PULL', 'haul': 'PULL', 'tug': 'PULL', 'drag': 'PULL', 'reel': 'PULL', 'tow': 'PULL', 'wrench': 'PULL',
  'use': 'USE', 'apply': 'USE', 'employ': 'USE', 'wield': 'USE', 'utilize': 'USE', 'operate': 'USE', 'handle': 'USE', 'brandish': 'USE', 'put to use': 'USE',
  'peruse': 'LOOK', 'decipher': 'LOOK', 'sound out': 'LOOK', 'recite': 'LOOK', 'interpret': 'LOOK',
  'write': 'SAY', 'script': 'SAY', 'inscribe': 'SAY', 'pen': 'SAY', 'note': 'SAY', 'record': 'SAY', 'etch': 'SAY', 'carve': 'SAY', 'engrave': 'SAY', 'scribe': 'SAY',
  'swear': 'SWEAR', 'vow': 'SWEAR', 'pledge': 'SWEAR', 'oath': 'SWEAR', 'avow': 'SWEAR', 'bind self': 'SWEAR', 'promise': 'SWEAR', 'covenant': 'SWEAR', 'take oath': 'SWEAR',
  'defy': 'RENOUNCE', 'resist': 'RENOUNCE', 'oppose': 'RENOUNCE', 'withstand': 'RENOUNCE', 'spurn': 'RENOUNCE', 'flout': 'RENOUNCE', 'challenge': 'RENOUNCE', 'stand against': 'RENOUNCE', 'renounce': 'RENOUNCE',
  'attack': 'ATTACK', 'strike': 'ATTACK', 'hit': 'ATTACK', 'smite': 'ATTACK', 'hew': 'ATTACK', 'slash': 'ATTACK', 'stab': 'ATTACK', 'assault': 'ATTACK', 'bash': 'ATTACK', 'wallop': 'ATTACK', 'cut down': 'ATTACK', 'lay into': 'ATTACK',
  'rest': 'REST', 'sleep': 'REST', 'doze': 'REST', 'slumber': 'REST', 'recover': 'REST', 'pause': 'REST', 'take a breath': 'REST', 'camp': 'REST', 'bivouac': 'REST',
  'wait': 'REST', 'delay': 'REST', 'hold': 'REST', 'bide': 'REST', 'linger': 'REST', 'stand by': 'REST', 'stay': 'REST', 'abide': 'REST',
  'forge': 'COMBINE', 'hammer': 'COMBINE', 'temper': 'COMBINE', 'shape': 'COMBINE', 'smelt': 'COMBINE', 'weld': 'COMBINE', 'work iron': 'COMBINE', 'beat metal': 'COMBINE',
  'craft': 'COMBINE', 'make': 'COMBINE', 'fashion': 'COMBINE', 'assemble': 'COMBINE', 'fabricate': 'COMBINE', 'brew': 'COMBINE', 'concoct': 'COMBINE', 'put together': 'COMBINE', 'prepare': 'COMBINE', 'combine': 'COMBINE',
  'break': 'DESTROY', 'shatter': 'DESTROY', 'crack': 'DESTROY', 'smash': 'DESTROY', 'splinter': 'DESTROY', 'snap': 'DESTROY', 'ruin': 'DESTROY', 'wreck': 'DESTROY', 'destroy': 'DESTROY',
  'climb': 'MOVE', 'scale': 'MOVE', 'scramble': 'MOVE', 'ascend': 'MOVE', 'mount': 'MOVE', 'shinny': 'MOVE', 'clamber': 'MOVE', 'go up': 'MOVE',
  'hide': 'WITHHOLD', 'conceal': 'WITHHOLD', 'cover': 'WITHHOLD', 'stash': 'WITHHOLD', 'secrete': 'WITHHOLD', 'veil': 'WITHHOLD', 'shroud': 'WITHHOLD', 'take cover': 'WITHHOLD', 'go to ground': 'WITHHOLD',
  'search': 'SEARCH', 'rummage': 'SEARCH', 'scour': 'SEARCH', 'comb': 'SEARCH', 'probe': 'SEARCH', 'inspect for': 'SEARCH', 'look for': 'SEARCH', 'rifle': 'SEARCH', 'turn out': 'SEARCH',
  'pray': 'PRAY', 'entreat': 'PRAY', 'implore': 'PRAY', 'supplicate': 'PRAY', 'invoke': 'PRAY', 'appeal to': 'PRAY', 'call upon': 'PRAY', 'petition': 'PRAY',
  'reveal': 'REVEAL', 'disclose': 'REVEAL', 'unveil': 'REVEAL', 'uncover': 'REVEAL', 'divulge': 'REVEAL', 'make known': 'REVEAL',
  'i': 'INVENTORY', 'inventory': 'INVENTORY', 'pack': 'INVENTORY', 'bag': 'INVENTORY',
  'eat': 'EAT', 'consume': 'EAT', 'devour': 'EAT', 'chew': 'EAT', 'bite': 'EAT', 'gnaw': 'EAT', 'feast': 'EAT', 'dine': 'EAT', 'nibble': 'EAT',
  'drink': 'EAT', 'quaff': 'EAT', 'swig': 'EAT', 'sip': 'EAT', 'imbibe': 'EAT', 'sup': 'EAT', 'gulp': 'EAT', 'tipple': 'EAT',
  'ally': 'ALLY', 'ally with': 'ALLY',
  'betray': 'BETRAY', 'turn on': 'BETRAY',
  // New system-querying verbs
  'consult': 'CONSULT_SYSTEM', 'check': 'CONSULT_SYSTEM', 'review': 'CONSULT_SYSTEM', 'read': 'CONSULT_SYSTEM', 'sense': 'CONSULT_SYSTEM', 'attune': 'CONSULT_SYSTEM',
};


export const LEXICON: Lexicon = {
  verbs: {}, // DEPRECATED: Verb logic is now handled by the new Thesaurus.
  nouns: {
    "mask_blank": ["blank mask", "shell", "unformed mask"],
    "crucible": ["crucible", "bowl", "pot"],
    "hearth": ["hearth", "forge", "anvil"],
    "old_chest": ["old chest", "chest", "box"],
    "key_forge": ["forge key", "key", "iron key"],
    "waterskin": ["waterskin", "canteen", "flask"],
    "ash": ["ash", "grey ash", "fine ash"],
    "clay": ["clay", "lump of clay", "workable clay"],
    "resonant_crystal": ["resonant crystal", "crystal", "humming crystal"],
    "bone_flute": ["bone flute", "flute"],
    "rope_bridge": ["rope bridge", "bridge", "hanging bridge"],
    "jagged_cairn": ["jagged cairn", "cairn", "stones", "markings"],
    "mossy_idol": ["moss-covered idol", "idol", "statue"],
    "offerings_dish": ["offerings dish", "dish", "bowl"],
    "scattered_coins": ["scattered coins", "coins", "coin"],
    "scorched_tree": ["scorched tree", "tree", "lightning tree"],
    "torn_banner": ["torn banner", "banner", "flag"],
    "glassy_pond": ["glassy pond", "pond", "pool", "water"],
    "stone_bench": ["stone bench", "bench", "riddles"],
    "skeletons": ["skeletons", "bones", "remains"],
    "chest_wooden": ["wooden chest", "chest", "box"],
    "npc_traveler": ["weary traveler", "traveler", "man", "person"],
    "campfire": ["old campfire", "campfire", "fire"],
    "stone_pile": ["pile of stones", "stones", "pile", "rocks"],
    "apple": ["apple", "red apple"],
    // New system nouns
    "rumors": ["rumors", "whispers", "ticker"],
    "accord": ["accord", "balance"],
    "beat": ["beat", "pulse", "fates", "fate"],
    "chronicle": ["chronicle", "echoes", "history", "record"],
  },
  directions: {
    "n": ["north", "n"],
    "e": ["east", "e"],
    "s": ["south", "s"],
    "w": ["west", "w"],
    "in": ["enter", "inside", "in"],
    "out": ["exit", "outside", "out"],
  }
};

export const INTENTS: Omit<Intent, 'root'>[] = [
  {
    id: "LOOK",
    intentType: "INTERNAL",
    slots: ["object"],
    effects: [{ type: "message" }],
    hints: ["inspect <object>", "look at <object>"]
  },
  {
    id: "MOVE",
    intentType: "PHYSICAL",
    slots: ["direction"],
    effects: [{ type: "move" }],
    hints: ["go north", "enter sanctum"]
  },
  {
    id: "EXIT",
    intentType: "PHYSICAL",
    slots: ["direction"],
    effects: [{ type: "move" }],
    hints: ["leave", "go out"]
  },
  // Accord Intents
  {
    id: "SWEAR",
    intentType: "SOCIAL",
    slots: ["object"],
    effects: [],
    hints: ["swear to the council"]
  },
  {
    id: "RENOUNCE",
    intentType: "SOCIAL",
    slots: ["object"],
    effects: [],
    hints: ["renounce the council"]
  },
  {
    id: "ALLY",
    intentType: "SOCIAL",
    slots: ["object"],
    effects: [],
    hints: ["ally with the rebels"]
  },
  {
    id: "BETRAY",
    intentType: "SOCIAL",
    slots: ["object"],
    effects: [],
    hints: ["betray Elder Anah"]
  },
  {
    id: "REVEAL",
    intentType: "SOCIAL",
    slots: ["object"],
    effects: [],
  },
  {
    id: "WITHHOLD",
    intentType: "SOCIAL",
    slots: ["object"],
    effects: [],
  },
  // Physical/Inventory Intents
  {
    id: "TAKE",
    intentType: "PHYSICAL",
    slots: ["object"],
    effects: [],
    hints: ["take crucible"]
  },
  {
    id: "DROP",
    intentType: "PHYSICAL",
    slots: ["object"],
    effects: [],
    hints: ["drop crucible"]
  },
  {
    id: "INVENTORY",
    intentType: "INTERNAL",
    slots: [],
    effects: [],
    hints: ["inventory"]
  },
  {
    id: "OPEN",
    intentType: "PHYSICAL",
    slots: ["object"],
    effects: [],
    hints: ["open chest", "close chest"]
  },
  {
    id: "CLOSE",
    intentType: "PHYSICAL",
    slots: ["object"],
    effects: [],
    hints: ["close chest"]
  },
  {
    id: "UNLOCK",
    intentType: "PHYSICAL",
    slots: ["object", "tool"],
    effects: [],
    hints: ["unlock chest with key"]
  },
  {
    id: "USE",
    intentType: "PHYSICAL",
    slots: ["tool", "object"],
    effects: [{ type: "message", text: "You use the item." }],
    hints: ["use crucible on hearth"]
  },
  {
    id: "SEARCH",
    intentType: "INTERNAL",
    slots: ["object"],
    effects: [],
    hints: ["search hearth"],
  },
  {
    id: "COMBINE",
    intentType: "INTERNAL",
    slots: ["object", "tool"],
    effects: [],
    hints: ["combine ash with waterskin"],
  },
  {
    id: "DESTROY",
    intentType: "PHYSICAL",
    slots: ["object"],
    effects: [],
    hints: ["break crucible"],
  },
  {
    id: "GIVE",
    intentType: "SOCIAL",
    slots: ["tool", "object"],
    effects: [{ type: "message", text: "There is no one here to give that to." }],
    hints: ["give <item> to <person>"]
  },
  {
    id: "PULL",
    intentType: "PHYSICAL",
    slots: ["object"],
    effects: [{ type: "message", text: "It doesn't move." }],
  },
  {
    id: "REST",
    intentType: "INTERNAL",
    slots: [],
    effects: [{ type: "message", text: "You rest for a moment, gathering your thoughts." }],
    hints: ["rest", "wait"]
  },
  {
    id: "PRAY",
    intentType: "SOCIAL",
    slots: [],
    effects: [{ type: "message", text: "You offer a silent prayer. The air grows still." }],
    hints: ["pray", "chant"]
  },
  // Informational system query
  {
    id: "CONSULT_SYSTEM",
    intentType: "INTERNAL",
    slots: ["object"],
    effects: [{ type: "message" }],
    hints: ["review rumors", "consult accord", "sense beat", "read echoes"],
  },
  // Graceful Failure Intents
  {
    id: "SAY",
    intentType: "SOCIAL",
    slots: [],
    effects: [{ type: "message", text: "Your voice echoes in the silence, but nothing answers." }],
  },
  {
    id: "TALK",
    intentType: "SOCIAL",
    slots: ["object"],
    effects: [{ type: "message", text: "They do not respond." }],
  },
  {
    id: "ASK",
    intentType: "SOCIAL",
    slots: ["object", "topic"],
    effects: [{ type: "message", text: "They do not answer." }],
  },
  {
    id: "EAT",
    intentType: "INTERNAL",
    slots: [],
    effects: [{ type: "message", text: "You have no need for that here." }],
  },
  {
    id: "LISTEN",
    intentType: "INTERNAL",
    slots: [],
    effects: [{ type: "message", text: "You listen intently, but hear only the wind whistling over the rock." }],
  },
  {
    id: "PUSH",
    intentType: "PHYSICAL",
    slots: ["object"],
    effects: [{ type: "message", text: "It doesn't budge." }],
  },
  {
    id: "ATTACK",
    intentType: "PHYSICAL",
    slots: ["object"],
    effects: [{ type: "message", text: "Violence is not the answer here." }],
  },
];

export const SCENES: Record<string, SceneIndex> = {
  "mountain_forge": {
    "scene_id": "mountain_forge",
    "description": "You stand in a forge carved into the heart of a mountain. A great hearth, cold and silent, dominates the far wall. Before it rests a heavy anvil. A simple crucible and a blank, unformed mask sit on a stone workbench. An old wooden chest is pushed against the wall.",
    "tags": ["forge_site"],
    "objects": [
      { "id": "mask_blank#1", "name": "blank mask", "aliases": ["shell", "unformed mask"], "tags": ["mask", "forgeable"], "salience": 0.9, "inspect": "It is a smooth, featureless shell of bone-white material, cool to the touch. It waits for a word, a will, an identity.", "takeable": true, "itemId": "mask_blank" },
      { "id": "crucible#1", "name": "crucible", "aliases": ["bowl", "pot"], "tags": ["tool", "container"], "salience": 0.8, "inspect": "A heavy clay bowl, stained with the residue of forgotten rituals.", "takeable": true, "itemId": "crucible" },
      { "id": "hearth#1", "name": "hearth", "aliases": ["forge", "anvil"], "tags": ["forge_site", "heat"], "salience": 0.6, "inspect": "The stone hearth is large enough to swallow a person whole. The embers within are dead and grey. You might find something if you search it.", "state": { "searchable": true, "searched": false, "searchYields": "ash" } },
      { "id":"old_chest#1", "name":"old chest", "aliases":["chest", "box"], "tags":["container", "openable"], "salience":0.7, "state": {"locked": true, "open": false}, "inspect": "A sturdy wooden chest, bound with iron. It seems to be locked."}
    ],
    "exits": { "n": "ridge_path", "in": "sanctum", "out": "ridge_path" }
  },
  "ridge_path": {
    "scene_id": "ridge_path",
    "description": "A narrow trail clings to the side of the mountain. A chest sits half-buried, an old campfire nearby, and a weary traveler leans on a staff. The forge entrance is to the south. A dark cavern opens to the east.",
    "objects": [
      { "id": "chest_wooden#1", "name": "wooden chest", "aliases": ["chest", "box"], "tags": ["container", "openable"], "salience": 0.8, "inspect": "A small wooden chest, half-buried in the dirt. It looks weathered but sturdy. It is not locked.", "state": { "locked": false, "open": false, "searchable": true, "searched": false, "searchYields": "apple" } },
      { "id": "npc_traveler#1", "name": "weary traveler", "aliases": ["traveler", "man", "person"], "tags": ["npc", "human"], "salience": 0.9, "inspect": "A traveler in dusty clothes, leaning heavily on a staff. They look exhausted and thirsty, but watch you with wary eyes.", "state": { "health": 10, "friendly": true, "given_apple": false } },
      { "id": "campfire#1", "name": "old campfire", "aliases": ["campfire", "fire"], "tags": ["searchable"], "salience": 0.7, "inspect": "The remains of a small campfire. The ashes are cold.", "state": { "searchable": true, "searched": false, "searchYields": "ash" } },
      { "id": "stone_pile#1", "name": "pile of stones", "aliases": ["stones", "pile", "rocks"], "tags": ["movable"], "salience": 0.6, "inspect": "A pile of loose stones. It looks like it could be pushed over.", "state": { "moved": false } }
    ],
    "exits": { "s": "mountain_forge", "e": "singing_hollow" }
  },
  "sanctum": {
    "scene_id": "sanctum",
    "description": "A small, quiet room behind the forge. The air is still and thick with the smell of old paper and incense. A single door leads out.",
    "objects": [],
    "exits": { "out": "mountain_forge" }
  },
  "singing_hollow": {
    "scene_id": "singing_hollow",
    "description": "You are in a cavern where the walls hum faintly, a living chorus stirred by every step. A large, resonant crystal pulses with a soft light in the center. A bone flute rests on a stone pedestal. Exits lead west, east, and south.",
    "tags": ["cavern"],
    "objects": [
        { "id": "resonant_crystal#1", "name": "resonant crystal", "aliases": ["crystal", "humming crystal"], "tags": ["crystal", "breakable"], "salience": 0.9, "inspect": "The crystal hums with a low, vibrational frequency. It feels ancient and powerful. Striking it seems like a bad idea." },
        { "id": "bone_flute#1", "name": "bone flute", "aliases": ["flute"], "tags": ["instrument"], "salience": 0.7, "inspect": "A flute carved from a single, long bone. It is smooth and cool to the touch.", "takeable": true, "itemId": "bone_flute" }
    ],
    "exits": { "w": "ridge_path", "e": "shifting_ravine", "s": "forgotten_shrine" }
  },
  "shifting_ravine": {
      "scene_id": "shifting_ravine",
      "description": "You stand at the edge of a cracked gorge. Stones grind underfoot as if the land itself moves. A fragile-looking rope bridge spans the chasm to the north. A jagged cairn of stones stands near the western entrance.",
      "tags": ["outdoors", "chasm"],
      "objects": [
          { "id": "rope_bridge#1", "name": "rope bridge", "aliases": ["bridge", "hanging bridge"], "tags": ["structure"], "salience": 0.8, "inspect": "A swaying bridge of rope and wood planks. It looks old and treacherous. Crossing it to the north will be a risk." },
          { "id": "jagged_cairn#1", "name": "jagged cairn", "aliases": ["cairn", "stones", "markings"], "tags": ["structure", "writing"], "salience": 0.6, "inspect": "A pile of sharp stones, carefully balanced. Faint markings are scratched into their surface, whispering of resilience and stone." }
      ],
      "exits": { "w": "singing_hollow", "n": "stormbreak_plateau" }
  },
  "forgotten_shrine": {
      "scene_id": "forgotten_shrine",
      "description": "An overgrown altar sits in a quiet grove, with thick vines choking ancient carvings. A moss-covered idol is half-buried in the greenery. Before it, an offerings dish holds a few scattered coins. Paths lead north and east.",
      "tags": ["sacred", "ruin"],
      "objects": [
          { "id": "mossy_idol#1", "name": "mossy idol", "aliases": ["moss-covered idol", "idol", "statue"], "tags": ["artifact", "sacred"], "salience": 0.9, "inspect": "An old stone idol of a forgotten deity. Its features are worn smooth by time and covered in a thick blanket of moss.", "takeable": true, "itemId": "mossy_idol" },
          { "id": "offerings_dish#1", "name": "offerings dish", "aliases": ["dish", "bowl"], "tags": ["container"], "salience": 0.7, "inspect": "A stone dish containing a few old, scattered coins.", "state": { "searchable": true, "searched": false, "searchYields": "scattered_coins" } }
      ],
      "exits": { "n": "singing_hollow", "e": "moonlit_garden" }
  },
  "stormbreak_plateau": {
      "scene_id": "stormbreak_plateau",
      "description": "Winds howl across a high, exposed plateau where storm clouds gather unnaturally. Lightning arcs between the peaks. The blackened, lightning-scorched trunk of a great tree stands defiantly in the center. A torn banner flutters from a broken spear plunged into the rock. Paths lead south and east.",
      "tags": ["outdoors", "mountain", "dangerous"],
      "objects": [
          { "id": "scorched_tree#1", "name": "scorched tree", "aliases": ["tree", "lightning tree"], "tags": ["shelter", "dangerous"], "salience": 0.8, "inspect": "This ancient tree has been struck by lightning countless times. Its wood is black as charcoal, but it still stands. Sheltering beneath it during this storm would be a terrible risk." },
          { "id": "torn_banner#1", "name": "torn banner", "aliases": ["banner", "flag"], "tags": ["cloth"], "salience": 0.7, "inspect": "A tattered banner bearing the faded crest of a forgotten house.", "takeable": true, "itemId": "torn_banner" }
      ],
      "exits": { "s": "shifting_ravine", "e": "moonlit_garden" }
  },
  "moonlit_garden": {
      "scene_id": "moonlit_garden",
      "description": "You enter a pale garden where strange flowers glow with a faint, silvery light. In the center, a glassy pond reflects unfamiliar constellations. A stone bench is inscribed with faint, winding text. Paths lead west and south.",
      "tags": ["garden", "mystical"],
      "objects": [
          { "id": "glassy_pond#1", "name": "glassy pond", "aliases": ["pond", "pool", "water"], "tags": ["water", "drinkable"], "salience": 0.9, "inspect": "The water of the pond is unnaturally still and clear, like black glass. It reflects stars you do not recognize. The water seems to hum with a strange energy." },
          { "id": "stone_bench#1", "name": "stone bench", "aliases": ["bench", "riddles", "text"], "tags": ["writing"], "salience": 0.7, "inspect": "The bench is carved with a spiraling riddle. Reading it might reveal something, but it could also tax your mind." }
      ],
      "exits": { "w": "stormbreak_plateau", "s": "forgotten_shrine" }
  }
};