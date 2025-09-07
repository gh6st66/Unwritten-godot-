/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type Boon = {
    id: string;
    name: string;
    description: string;
};

export const BOONS_DATA: Boon[] = [
    {
        id: 'boon_of_the_forge',
        name: 'Boon of the Forge',
        description: 'Begin each run with a piece of workable clay.'
    },
    {
        id: 'boon_of_the_traveler',
        name: 'Boon of the Traveler',
        description: 'Your first move in any scene costs no TIME.'
    },
    {
        id: 'boon_of_the_scholar',
        name: 'Boon of the Scholar',
        description: 'Gain an extra point of CLARITY at the start of each run.'
    }
];