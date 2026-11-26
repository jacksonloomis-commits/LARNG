import { STARTER_SAVE } from './data'
import type { SaveData } from './types'

const KEY = 'larng-save-v1'

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(STARTER_SAVE)
    const parsed = JSON.parse(raw) as Partial<SaveData>
    if (parsed.version !== 1 || typeof parsed.inventory !== 'object' || !parsed.inventory) return structuredClone(STARTER_SAVE)
    return { ...structuredClone(STARTER_SAVE), ...parsed }
  } catch {
    return structuredClone(STARTER_SAVE)
  }
}

export function saveGame(save: SaveData): void {
  try { localStorage.setItem(KEY, JSON.stringify(save)) } catch (error) { console.error('Could not save LARNG progress', error) }
}
