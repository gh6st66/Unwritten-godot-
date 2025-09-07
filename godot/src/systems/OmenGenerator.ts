/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from "@google/genai";
import { Origin, ResourceId } from "../game/types";
import { OMENS_DATA } from "../data/claims";
import { LEXEMES_DATA } from "../data/lexemes";
import { LexemeTier } from "../types/lexeme";

const validOmenIds = OMENS_DATA.map(c => c.id);
const validMarkIds = ["indebted", "oathbreaker", "visionary", "outcast"]; // A few examples for Gemini to use.
const basicLexemeIds = LEXEMES_DATA.filter(l => l.tier === LexemeTier.Basic).map(l => l.id);

export class OmenGenerator {
  private ai: GoogleGenAI;

  constructor() {
    // This assumes API_KEY is set in the execution environment.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  }

  public async generateOrigins(count: number = 3): Promise<Origin[]> {
    const prompt = `
      You are a creative writer for a dark fantasy narrative roguelike called "Unwritten".
      Your task is to generate ${count} unique starting scenarios, called "Origins", for a player's run.
      Each Origin must have a unique 'id', a 'title', a 'description', and optional gameplay modifiers.
      
      RULES:
      - The 'title' should be evocative and mysterious (e.g., "A Debt Unpaid", "A Whispered Heresy").
      - The 'description' should be a short, compelling paragraph (2-3 sentences) setting the theme for the run.
      - 'id' should be a short, snake_case string derived from the title.
      - 'tags' should be an array of 3-4 lowercase strings that describe the themes.
      - 'initialPlayerMarkId' is an optional string. If used, it MUST be one of these values: ${JSON.stringify(validMarkIds)}.
      - 'omenBias' is an optional array of strings. If used, its values MUST be chosen from this list: ${JSON.stringify(validOmenIds)}.
      - 'lexemeBias' is an optional array of strings. If used, its values MUST be chosen from this list: ${JSON.stringify(basicLexemeIds)}.
      - Do not invent new mark, omen, or lexeme IDs. Use only the ones provided.
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            origins: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING, description: "A unique snake_case identifier, e.g., 'a_debt_unpaid'." },
                        title: { type: Type.STRING, description: "The evocative title of the origin." },
                        description: { type: Type.STRING, description: "A 2-3 sentence thematic description for the run." },
                        tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        initialPlayerMarkId: { type: Type.STRING, nullable: true },
                        omenBias: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                        lexemeBias: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                    },
                    required: ['id', 'title', 'description']
                }
            }
        },
        required: ['origins']
    };
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
      });

      const jsonStr = response.text.trim();
      const parsed = JSON.parse(jsonStr);

      if (parsed.origins && Array.isArray(parsed.origins)) {
        return parsed.origins.map((origin: any) => ({
          ...origin,
          tags: origin.tags ?? [],
        })).slice(0, count);
      }
      throw new Error("Generated data is not in the expected format.");
    } catch (e) {
      console.error("Failed to generate origins with Gemini API:", e);
      return this.getFallbackOrigins();
    }
  }

  private getFallbackOrigins(): Origin[] {
    return [
      {
        id: "fallback_debt",
        title: "A Debt Unpaid",
        description: "The run begins with a heavy obligation, either material or spiritual.",
        tags: ["economic", "obligation"],
        initialPlayerMarkId: "indebted",
        resourceModifier: { [ResourceId.CURRENCY]: -10 },
        omenBias: ["betray", "forsake"],
        lexemeBias: ["endurance", "guile", "insight"],
      },
      {
        id: "fallback_heresy",
        title: "A Whispered Heresy",
        description: "A forbidden truth has been uncovered, and dogmatic authority is aware.",
        tags: ["secrecy", "rebellion"],
        omenBias: ["reveal_secret", "ignite"],
        lexemeBias: ["insight", "deception", "ferocity"],
      },
       {
        id: "fallback_truce",
        title: "A Fragile Truce",
        description: "Old rivals have agreed to a ceasefire, but tensions simmer beneath the surface.",
        tags: ["political", "intrigue"],
        omenBias: ["betray", "reveal_secret"],
        lexemeBias: ["deception", "guile", "insight"],
      }
    ];
  }
}
