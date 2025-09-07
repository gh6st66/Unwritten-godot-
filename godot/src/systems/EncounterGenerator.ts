import { GoogleGenAI, Type } from "@google/genai";
import { GameState, Encounter, SpeakerContext, Affiliation, ResourceId, ActionOutcome, Effect, Mark } from "../game/types";
import { EncounterEngine, defaultRules } from "./encounters/EncounterEngine";
import { ENCOUNTER_SCHEMAS } from "../data/encounterSchemas";
import { NpcIndex } from "./encounters/NpcIndex";
import { 
    RunState as EncounterRunState, 
    RegionState as EncounterRegionState, 
    StructuredEncounter, 
    NpcId,
    Npc as EncounterNpc,
    RegionId,
    FactionId,
    RoleTag,
    RegionTensionEdge
} from "./encounters/types";
import { resolveLexeme } from "./lexicon/resolveLexeme";
import { NPC as CivNPC } from "../civ/types";
import { Region as WorldRegion, World } from "../world/types";

const factionToAffiliationMap: Record<string, Affiliation> = {};
const validRoleTags: Set<string> = new Set(["merchant", "captain", "witch", "thief", "lord", "artisan", "guard", "outsider", "commoner"]);

function convertCivNpcToEncounterNpc(civNpc: CivNPC): EncounterNpc {
    const affiliations: Affiliation[] = [];
    if (civNpc.factionId && factionToAffiliationMap[civNpc.factionId]) {
        affiliations.push(factionToAffiliationMap[civNpc.factionId]);
    }
    if (!affiliations.length) {
        if (civNpc.role === 'merchant' || civNpc.role === 'artisan') affiliations.push('guild');
        if (civNpc.role === 'guard') affiliations.push('military');
    }
    if (!affiliations.includes("urban")) affiliations.push('urban');

    const roleTags: RoleTag[] = validRoleTags.has(civNpc.role) ? [civNpc.role as RoleTag] : ['commoner'];

    return {
        id: civNpc.id as NpcId,
        name: civNpc.name,
        appearance: [],
        region: civNpc.regionId as RegionId,
        faction: civNpc.factionId as FactionId | undefined,
        affiliations,
        roleTags,
        marks: civNpc.marks.map(m => m.id),
        notoriety: 20 + Math.floor(Math.random() * 60),
        ties: [],
    };
}

function convertWorldRegionToEncounterRegionState(world: World, worldRegion: WorldRegion, civs: GameState['world']['civs']): EncounterRegionState {
    const regionNpcs = civs.flatMap(c => c.npcs).filter(n => n.regionId === worldRegion.id);
    const factionIdsInRegion = new Set(regionNpcs.map(n => n.factionId).filter(Boolean));
    const allFactions = civs.flatMap(c => c.factions.map(f => ({...f, civId: c.id})));
    const factions = allFactions.filter(f => factionIdsInRegion.has(f.id));
    const tensionEdges: RegionTensionEdge[] = [];
    if (factions.length > 1) {
        for (let i = 0; i < factions.length; i++) {
            for (let j = i + 1; j < factions.length; j++) {
                const facA = factions[i]; const facB = factions[j];
                let weight = (facA.civId !== facB.civId) ? 50 : 10;
                if (facA.agenda === 'expansion' && facB.agenda !== 'expansion') weight += 20;
                tensionEdges.push({ a: facA.id as FactionId, b: facB.id as FactionId, weight, topics: ["territory", "influence", facA.agenda, facB.agenda] });
            }
        }
    }
    const biome = world.grid[worldRegion.cells[0]]?.biome;
    return {
        id: worldRegion.id as RegionId,
        name: worldRegion.name,
        factions: factions.map(f => f.id as FactionId),
        tensionEdges,
        scarcity: { coin: worldRegion.identity.wealth * 80, grain: biome === 'desert' ? 80 : 20, timber: biome === 'forest' ? 10 : 60 },
        entropy: worldRegion.identity.law < 0 ? 70 : 30,
    };
}

export class EncounterGenerator {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  }

  public async generate(state: GameState): Promise<Encounter> {
    if (!state.world.world) { throw new Error("World data is not available for encounter generation."); }
    const allNpcs = state.world.civs.flatMap(c => c.npcs);
    const playerRegionId = allNpcs.find(n => n.id === state.player.id)?.regionId ?? Object.keys(state.world.world.regions)[0];
    const runState: EncounterRunState = {
      seed: state.runId,
      day: state.day,
      playerMarks: state.player.marks.map(m => m.id),
      region: playerRegionId as RegionId,
      exposedFactions: [],
      notoriety: state.player.marks.reduce((acc, m) => acc + Math.abs(m.value), 0) * 5,
    };
    const currentWorldRegion = state.world.world.regions[playerRegionId];
    if (!currentWorldRegion) {
        console.error("Player is in a region that doesn't exist.");
        return this.getFallbackEncounter();
    }
    const regionState = convertWorldRegionToEncounterRegionState(state.world.world, currentWorldRegion, state.world.civs);
    const encounterNpcs = allNpcs.map(convertCivNpcToEncounterNpc);
    const npcIndex = new NpcIndex(encounterNpcs);
    const engine = new EncounterEngine({ schemas: ENCOUNTER_SCHEMAS, rules: defaultRules(), npcs: encounterNpcs }, npcIndex);
    const structure = engine.suggest(runState, regionState);

    if (!structure) {
        console.warn("No structured encounter could be generated, using fallback.");
        return this.getFallbackEncounter();
    }

    const prompt = this.buildPrompt(structure, state, npcIndex);
    const responseSchema = this.getResponseSchema();

    try {
      const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema,
          }
      });
      const parsed = JSON.parse(response.text.trim()) as Omit<Encounter, 'id'>;
      return {
        ...parsed,
        id: crypto.randomUUID(),
        options: (parsed.options || []).map((o, i) => ({ ...o, id: o.id ?? `gen-opt-${i}` })),
      };
    } catch (e) {
      console.error("Failed to generate encounter from Gemini API:", e);
      return this.getFallbackEncounter();
    }
  }

  private buildPrompt(structure: StructuredEncounter, state: GameState, npcIndex: NpcIndex): string {
    const instigatorNpc = npcIndex.byId.get(structure.roles.instigator as NpcId);
    const speakerContext: SpeakerContext = instigatorNpc ? { locale: 'en-US', region: 'en-US', affiliations: instigatorNpc.affiliations, role: instigatorNpc.roleTags.join(', ') } : { locale: 'en-US', region: 'en-US', affiliations: ['commoner'], role: 'commoner' };
    const fateRecordTerm = resolveLexeme('fateRecord', speakerContext);
    const roles = Object.fromEntries(
      Object.entries(structure.roles).map(([key, id]) => {
        const npc = npcIndex.byId.get(id as NpcId);
        return [key, npc ? { appearance: npc.appearance, roles: npc.roleTags, marks: npc.marks } : { description: id }];
      })
    );
    const currentRegion = state.world.world?.regions[structure.region];
    const promptContext = [
        `System: You generate a single JSON encounter for a text roguelike. The world's events are recorded in what this speaker calls "The ${fateRecordTerm}".`,
        `The current region is ${currentRegion?.name}, a ${currentRegion?.identity.dialectId} speaking area with a temperament that is ${currentRegion?.identity.temperament > 0 ? 'militant' : 'pacifist'} and ${currentRegion?.identity.law > 0 ? 'lawful' : 'lawless'}. The biome is ${currentRegion?.cells.length > 0 ? state.world.world?.grid[currentRegion.cells[0]].biome : 'unknown'}.`,
        "Rules:",
        "- The player is 'The Unwritten' wearing a mask called '" + (state.player.mask?.name ?? 'The First Mask') + "'.",
        "- Introduce characters by weaving their traits (`appearance`, `roles`, `marks`) into the scene's action and description. For example, instead of 'a wary merchant known for being upright,' write 'a merchant, dressed in fine silks, straightens their posture with an air of practiced honesty.' Do not use their real names.",
        "- Use the structure to inspire the encounter's narrative.",
        "- Keep the main `prompt` text brief and evocative (<= 60 words).",
        "- Create 3–4 thoughtful `options` for the player.",
        "- One option must represent inaction or observation (e.g., 'Wait and see'). This option must have a TIME cost.",
        "- Add a very short `internalThoughtHint` (4-8 words) as a brief, personal thought or gut feeling.",
        "## Encounter Structure",
        `Schema: ${structure.schemaId}`,
        `Topics: ${structure.topics.join(", ")}`,
        `Stakes: ${structure.stakes.join(", ")}`,
        `Roles: ${JSON.stringify(roles)}`,
      ].join("\n");
      return promptContext;
  }

  private getResponseSchema() {
      const markSchema = {
          type: Type.OBJECT,
          properties: {
              id: { type: Type.STRING, description: "A snake_case identifier for the mark." },
              label: { type: Type.STRING, description: "The human-readable label for the mark." },
              value: { type: Type.INTEGER, description: "The change in the mark's value (e.g., 1, -1)." }
          },
          required: ['id', 'label', 'value']
      };
      const effectSchema = {
          type: Type.OBJECT,
          properties: {
              resource: { type: Type.STRING, enum: Object.values(ResourceId) },
              delta: { type: Type.INTEGER, description: "The change in the resource amount (negative for cost, positive for gain)." }
          },
          required: ['resource', 'delta']
      };
      const optionSchema = {
          type: Type.OBJECT,
          properties: {
              id: { type: Type.STRING, description: "A unique snake_case identifier for this option." },
              label: { type: Type.STRING, description: "The text displayed to the player for this choice." },
              effects: { type: Type.ARRAY, items: effectSchema },
              grantsMarks: { type: Type.ARRAY, items: markSchema, nullable: true }
          },
          required: ['id', 'label', 'effects']
      };
      return {
          type: Type.OBJECT,
          properties: {
              prompt: { type: Type.STRING, description: "The main descriptive text of the encounter." },
              internalThoughtHint: { type: Type.STRING, description: "A brief, personal thought from the player's perspective." },
              options: { type: Type.ARRAY, items: optionSchema }
          },
          required: ['prompt', 'internalThoughtHint', 'options']
      };
  }

  private getFallbackEncounter(): Encounter {
    return {
        id: crypto.randomUUID(),
        prompt: "A hush falls. Someone speaks your title like a curse.",
        internalThoughtHint: "(Pick a direction. Commit.)",
        options: [
          { 
            id: "defy", 
            label: "Defy the room", 
            effects: [{ resource: ResourceId.TIME, delta: -1 }, { resource: ResourceId.CLARITY, delta: 1 }] 
          },
          { 
            id: "yield", 
            label: "Yield and listen", 
            effects: [{ resource: ResourceId.TIME, delta: -1 }] 
          }
        ]
    };
  }
}
