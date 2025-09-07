/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ItemRule } from '../data/itemCatalog';

export type ItemStack = {
  itemId: string;
  qty: number;
};

export type Inventory = {
  capacity: number; // max unique stacks
  slots: ItemStack[];
};

const DEFAULT_CAPACITY = 10;

export function createInventory(init: Partial<Inventory> = {}): Inventory {
  return {
    capacity: init.capacity ?? DEFAULT_CAPACITY,
    slots: Array.isArray(init.slots) ? init.slots.slice() : []
  };
}

/** Returns total stacks used. */
export function usedSlots(inv: Inventory): number {
  return inv.slots.length;
}

/** Checks if the inventory contains at least one of the given item. */
export function hasItem(inv: Inventory, itemId: string): boolean {
  return inv.slots.some(s => s.itemId === itemId && s.qty > 0);
}

/**
 * Result type for inventory operations.
 */
export type InventoryResult = {
  ok: boolean;
  reason?: "invalid_qty" | "no_space" | "already_have" | "not_found" | "insufficient_qty";
  inv: Inventory;
};

/**
 * Adds a quantity of an item to the inventory, respecting stackability rules.
 */
export function addItem(inv: Inventory, itemId: string, qty: number, itemRule: Pick<ItemRule, 'stackable' | 'maxStack'>): InventoryResult {
  if (qty <= 0) return { ok: false, reason: "invalid_qty", inv };
  const next = structuredClone(inv);

  if (itemRule.stackable) {
    // try to fill existing stack first
    const idx = next.slots.findIndex(s => s.itemId === itemId);
    if (idx >= 0) {
      const s = next.slots[idx];
      const newQty = Math.min(s.qty + qty, itemRule.maxStack);
      s.qty = newQty;
      return { ok: true, inv: next };
    }
    // need a new stack
    if (usedSlots(next) >= next.capacity) {
      return { ok: false, reason: "no_space", inv };
    }
    next.slots.push({ itemId, qty: Math.min(qty, itemRule.maxStack) });
    return { ok: true, inv: next };
  } else {
    // non-stackable occupies one slot per unit; but we cap to 1 for this basic inventory
    if (hasItem(next, itemId)) return { ok: false, reason: "already_have", inv };
    if (usedSlots(next) >= next.capacity) return { ok: false, reason: "no_space", inv };
    next.slots.push({ itemId, qty: 1 });
    return { ok: true, inv: next };
  }
}

/**
 * Removes a quantity of an item from the inventory.
 */
export function removeItem(inv: Inventory, itemId: string, qty: number = 1): InventoryResult {
  const next = structuredClone(inv);
  const idx = next.slots.findIndex(s => s.itemId === itemId);
  if (idx < 0) return { ok: false, reason: "not_found", inv };
  const s = next.slots[idx];
  if (s.qty < qty) return { ok: false, reason: "insufficient_qty", inv };
  s.qty -= qty;
  if (s.qty === 0) next.slots.splice(idx, 1);
  return { ok: true, inv: next };
}

/** Serialize for Chronicle or save files. */
export function serialize(inv: Inventory): string {
  return JSON.stringify(inv);
}

/** Deserialize from Chronicle or save file. */
export function deserialize(s: string | undefined): Inventory {
  if (!s) return createInventory();
  try { 
    const parsed = JSON.parse(s);
    // Basic validation
    if (typeof parsed.capacity === 'number' && Array.isArray(parsed.slots)) {
      return parsed;
    }
    return createInventory();
  } catch { 
    return createInventory(); 
  }
}
