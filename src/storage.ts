import { AURAS, STARTER_SAVE } from './data'
import type { SaveData } from './types'

const KEY = 'larng-save-v1'
const knownAuraIds = new Set(AURAS.map(aura => aura.id))

function freshSave(): SaveData {
  return structuredClone(STARTER_SAVE)
}

function nonNegativeInt(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : fallback
}

function normalizeSave(value: Partial<SaveData>): SaveData {
  const inventory: Record<string, number> = {}
  if (value.inventory && typeof value.inventory === 'object' && !Array.isArray(value.inventory)) {
    for (const [id, count] of Object.entries(value.inventory)) {
      const quantity = nonNegativeInt(count, 0)
      if (knownAuraIds.has(id) && quantity > 0) inventory[id] = quantity
    }
  }
  const discovered = Array.isArray(value.discovered)
    ? [...new Set(value.discovered.filter((id): id is string => typeof id === 'string' && knownAuraIds.has(id)))]
    : []
  // Inventory is authoritative for ownership; repair older/inconsistent saves safely.
  for (const id of Object.keys(inventory)) if (!discovered.includes(id)) discovered.push(id)
  const equipped = typeof value.equipped === 'string' && inventory[value.equipped] ? value.equipped : null
  return {
    version: 1,
    coins: nonNegativeInt(value.coins, STARTER_SAVE.coins),
    gems: nonNegativeInt(value.gems, STARTER_SAVE.gems),
    essence: nonNegativeInt(value.essence, STARTER_SAVE.essence),
    totalRolls: nonNegativeInt(value.totalRolls, 0),
    inventory,
    discovered,
    equipped,
    luckLevel: Math.min(nonNegativeInt(value.luckLevel, 0), 100),
    speedLevel: Math.min(nonNegativeInt(value.speedLevel, 0), 25),
  }
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return freshSave()
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return freshSave()
    const data = parsed as Partial<SaveData>
    if (data.version !== 1) return freshSave()
    return normalizeSave(data)
  } catch {
    // A corrupt or inaccessible save should never prevent the game from starting.
    return freshSave()
  }
}

export function saveGame(save: SaveData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(normalizeSave(save)))
  } catch (error) {
    console.error('Could not save LARNG progress', error)
  }
}
