/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Recipe {
  id: string; // id of the product
  ingredients: [string, string]; // item ids
  product: string; // item id
  message: string; // success message
}

export const RECIPES: Recipe[] = [
  {
    id: 'clay',
    ingredients: ['ash', 'waterskin'],
    product: 'clay',
    message: 'You mix the ash with a little water from your waterskin, forming a lump of workable clay.'
  }
];