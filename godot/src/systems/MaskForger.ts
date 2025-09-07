/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from "@google/genai";
import { Mask, Origin, Lexeme, MaskSpec, Mark, ThemeOfFate, TesterMask } from "../game/types";

export class MaskForger {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  }

  public async forgeFirstMask(lexeme: Lexeme, origin: Origin): Promise<Mask> {
    const textPrompt = this._buildFirstMaskTextPrompt(lexeme, origin);
    const textResponseSchema = {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "An evocative, mythic name for the mask (e.g., 'The Liar's Recoil', 'Oath of Embers')." },
        description: { type: Type.STRING, description: "A one-sentence, poetic description of the mask's appearance and essence." },
        grantedMarks: {
          type: Type.ARRAY,
          description: "An array of 1-2 Marks granted by the mask.",
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "A snake_case id for the mark." },
              label: { type: Type.STRING, description: "The human-readable name of the mark." },
              value: { type: Type.INTEGER, description: "The initial value of the mark, usually 1." },
            },
            required: ['id', 'label', 'value'],
          }
        }
      },
      required: ['name', 'description', 'grantedMarks'],
    };

    try {
      // Generate text details first
      const textResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: textPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: textResponseSchema,
        }
      });

      const textDetails = JSON.parse(textResponse.text.trim());
      const imagePrompt = this._buildFirstMaskImagePrompt(textDetails.name, textDetails.description);

      // Then generate the image
      const imageResponse = await this.ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        }
      });
      const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

      return {
        id: crypto.randomUUID(),
        ...textDetails,
        imageUrl,
        themeOfFate: lexeme.effects.maskThemeDelta || {},
      };
    } catch (e) {
      console.error("Gemini API call to forge first mask failed:", e);
      return {
        id: crypto.randomUUID(),
        name: `Mask of ${lexeme.gloss}`,
        description: `A mask born of ${origin.title}, marked by the word '${lexeme.gloss}'. Its features are indistinct, lost in the ether of a failed creation.`,
        imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        grantedMarks: [],
        themeOfFate: lexeme.effects.maskThemeDelta || {},
      };
    }
  }

  public async forgeFromSpec(spec: MaskSpec, generateImage: boolean = false): Promise<TesterMask> {
    const textPrompt = this._buildTextPrompt(spec);
    const imagePrompt = this._buildImagePrompt(spec);

    const textResponseSchema = {
       type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "An evocative, mythic name for the mask (e.g., 'The Liar's Recoil', 'Oath of Embers')." },
          description: { type: Type.STRING, description: "A one-sentence, poetic description of the mask's appearance and essence." },
          grantedMarks: {
            type: Type.ARRAY,
            description: "An array of 1-2 Marks granted by the mask.",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "A snake_case id for the mark." },
                label: { type: Type.STRING, description: "The human-readable name of the mark." },
                value: { type: Type.INTEGER, description: "The initial value of the mark, usually 1." },
              },
              required: ['id', 'label', 'value'],
            }
          }
        },
        required: ['name', 'description', 'grantedMarks'],
    };

    try {
      const textResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: textPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: textResponseSchema
        }
      });

      const textResult = JSON.parse(textResponse.text.trim());
      let imageUrl: string | undefined;

      if (generateImage) {
        const imageResponse = await this.ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: imagePrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });
        const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
        imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      }

      return {
        ...textResult,
        themeOfFate: this._fateFromWord(spec),
        spec,
        textPrompt,
        imagePrompt,
        imageUrl,
      };
    } catch (e: any) {
       const error = e instanceof Error ? e.message : "An unknown error occurred during generation.";
       return {
         name: this._titleFrom(spec),
         description: this._fallbackDescription(spec),
         grantedMarks: this._defaultMarks(spec),
         themeOfFate: this._fateFromWord(spec),
         imagePrompt,
         textPrompt,
         spec,
         error,
       };
    }
  }

  private _buildFirstMaskTextPrompt(lexeme: Lexeme, origin: Origin): string {
    return `
      You are a myth-maker for a dark fantasy game. Create the details for the player's very first mask.
      It is forged from a core concept ("${lexeme.gloss}") and born from a specific starting scenario ("${origin.title}").
      
      Theme: ${origin.description}
      Word of Power: ${lexeme.gloss} (${lexeme.tags.join(', ')})
      
      Generate a JSON object with:
      - "name": A mythic, evocative name for the mask.
      - "description": A single, poetic sentence describing its appearance and essence.
      - "grantedMarks": An array of 1 or 2 thematic "Marks" (character traits). Each mark has an "id" (snake_case), a "label" (Title Case), and a "value" (integer, usually 1).
    `;
  }

  private _buildFirstMaskImagePrompt(name: string, description: string): string {
    return `
      A single ceremonial mask, portrait, black background. Dark fantasy oil painting.
      Name: "${name}".
      Appearance: "${description}".
      Cinematic lighting, intricate detail, atmospheric, powerful, mythic.
      Negative prompt: non-diegetic text, signatures, captions, floating letters, watermarks.
    `;
  }

  private _buildTextPrompt(spec: MaskSpec): string {
    const omen = `A mask forged under the sign of ${spec.word}, where ${spec.forge.toLowerCase()}.`;
    const twist = `The ${spec.intent.toLowerCase()} strike leaves its trace upon the brow.`;
    return `Omen: ${omen} ${twist}\nForge: ${spec.forge}\nInscribed Word: ${spec.word}\nMaterial: ${spec.material}\nMotif: ${spec.motif}\nCondition: ${spec.condition}\nAura: ${spec.aura}`;
  }

  private _buildImagePrompt(spec: MaskSpec): string {
    return [
      `A single ceremonial mask, portrait, black background. Dark fantasy oil painting.`,
      `Forge context: ${spec.forge}.`,
      `Material: ${spec.material}.`,
      `Motif: ${spec.motif}.`,
      `Condition: ${spec.condition}.`,
      `Aura: ${spec.aura}.`,
      `Presentation: ${spec.presentation}.`,
      `Cinematic lighting, intricate detail, atmospheric.`,
      `Rule: Any writing, such as runes or sigils, must appear as diegetic inscriptions carved into or painted onto the mask itself.`,
      `Negative prompt: non-diegetic text, signatures, captions, floating letters, watermarks.`
    ].join(" ");
  }

  private _titleFrom(spec: MaskSpec): string {
    const forgeNoun = spec.forge.split(/[–—-]/)[0].trim().split(/\s+/).slice(-2).join(" ");
    const wordCore = spec.word.replace(/\(.*?\)/g, "").trim();
    return `${wordCore} of ${forgeNoun}`.replace(/\s+/g, " ").trim();
  }

  private _defaultMarks(spec: MaskSpec): Mark[] {
    const byIntent: Record<MaskSpec["intent"], Mark> = {
      Aggression: { id: "iron-will-scar", label: "Iron Will", value: 1 },
      Wisdom: { id: "echo-sight", label: "Echo Sight", value: 1 },
      Cunning: { id: "shadow-steps", label: "Shadow Steps", value: 1 },
    };
    const wordSlug = spec.word.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return [
      byIntent[spec.intent],
      { id: `${wordSlug}-resonance`, label: "Resonance", value: 1 },
    ];
  }

  private _fateFromWord(spec: MaskSpec): ThemeOfFate {
    const id = spec.word.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return { id: `fate-${id}`, label: `Theme: ${spec.word}` };
  }

  private _fallbackDescription(spec: MaskSpec): string {
    return `Forged at ${spec.forge}, this ${spec.material} mask bears ${spec.motif}. ${spec.condition} marks its making, while ${spec.aura} hints at the word of ${spec.word}.`;
  }
}
