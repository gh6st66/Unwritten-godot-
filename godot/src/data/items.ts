/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
// This file was converted from JSON to a TS module to resolve browser import issues.
const catalog = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ItemCatalog",
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name"],
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "nouns": { "type": "array", "items": { "type": "string" } },
          "tags": { "type": "array", "items": { "type": "string" } },
          "stackable": { "type": "boolean", "default": false },
          "maxStack": { "type": "integer", "default": 1 },
          "keyItem": { "type": "boolean", "default": false }
        }
      }
    }
  },
  "required": ["items"],
  "items": [
    {
      "id": "crucible",
      "name": "crucible",
      "nouns": ["crucible", "bowl", "pot"],
      "tags": ["tool", "container"],
      "stackable": false,
      "maxStack": 1,
      "keyItem": true
    },
    {
      "id": "mask_blank",
      "name": "blank mask",
      "nouns": ["mask", "blank mask", "shell"],
      "tags": ["mask", "forgeable"],
      "stackable": false,
      "maxStack": 1,
      "keyItem": true
    },
    {
      "id": "key_forge",
      "name": "Forge Key",
      "nouns": ["key", "forge key", "iron key"],
      "tags": ["key", "metal"],
      "stackable": false,
      "maxStack": 1,
      "keyItem": true
    },
    {
      "id": "ash",
      "name": "ash",
      "nouns": ["ash", "grey ash", "fine ash"],
      "tags": ["powder", "crafting"],
      "stackable": true,
      "maxStack": 5,
      "keyItem": false
    },
    {
      "id": "clay",
      "name": "clay",
      "nouns": ["clay", "lump of clay", "workable clay"],
      "tags": ["crafting"],
      "stackable": false,
      "maxStack": 1,
      "keyItem": false
    },
    {
      "id": "waterskin",
      "name": "waterskin",
      "nouns": ["waterskin", "canteen", "flask"],
      "tags": ["container", "water"],
      "stackable": false,
      "maxStack": 1,
      "keyItem": false
    },
    {
      "id": "apple",
      "name": "apple",
      "nouns": ["apple", "red apple"],
      "tags": ["food", "edible"],
      "stackable": true,
      "maxStack": 5,
      "keyItem": false
    }
  ]
};

export default catalog;