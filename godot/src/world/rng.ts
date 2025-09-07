/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Small, deterministic PRNG so the same run seed yields same encounters.
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Rng {
  next: () => number; // 0..1
  int: (max: number) => number; // 0..max-1
  float: (min: number, max: number) => number;
  pick: <T>(arr: T[]) => T;
  shuffle: <T>(arr: T[]) => T[];
}

export function makeRNG(seed: string): Rng {
  const seedFn = xmur3(seed);
  const rand = mulberry32(seedFn());

  const int = (max: number) => Math.floor(rand() * max);
  const float = (min: number, max: number) => min + rand() * (max - min);
  const pick = <T>(arr: T[]): T => arr[int(arr.length)];
  const shuffle = <T>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  return { next: rand, int, float, pick, shuffle };
}
