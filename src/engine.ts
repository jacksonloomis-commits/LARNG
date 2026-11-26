import { AURAS } from './data'
import type { Aura, Rarity } from './types'

const rarityOrder: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical', 'Divine', 'Celestial', 'Transcendent', 'Eternal']
const MAX_LUCK_LEVEL = 100

function secureRandom(): number {
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.getRandomValues === 'function') {
    const value = new Uint32Array(1)
    globalThis.crypto.getRandomValues(value)
    return value[0] / 0x1_0000_0000
  }
  return Math.random()
}

/** Returns the normalized probability assigned to each aura at a given luck level. */
export function getAuraWeights(luckLevel = 0): { aura: Aura; weight: number; probability: number }[] {
  const luck = Math.min(Math.max(Number.isFinite(luckLevel) ? luckLevel : 0, 0), MAX_LUCK_LEVEL)
  const luckFactor = 1 + luck * 0.035
  const weighted = AURAS.map(aura => {
    const tier = Math.max(0, rarityOrder.indexOf(aura.rarity))
    // Higher rarities gain more from luck, but the finite cap prevents runaway scaling.
    const luckBoost = Math.pow(luckFactor, tier * 0.72)
    return { aura, weight: (1 / aura.odds) * luckBoost }
  })
  const total = weighted.reduce((sum, item) => sum + item.weight, 0)
  return weighted.map(item => ({ ...item, probability: item.weight / total }))
}

/** One independent roll. Inject a deterministic random source in tests. */
export function rollAura(luckLevel: number, random: () => number = secureRandom): Aura {
  const weighted = getAuraWeights(luckLevel)
  const sample = random()
  const pick = Number.isFinite(sample) ? Math.min(Math.max(sample, 0), 1 - Number.EPSILON) : secureRandom()
  let cursor = pick
  for (const item of weighted) {
    cursor -= item.probability
    if (cursor < 0) return item.aura
  }
  return weighted[weighted.length - 1].aura
}

export function formatOdds(odds: number): string {
  return '1 in ' + odds.toLocaleString('en-US')
}

export function essenceValue(rarity: Rarity): number {
  const values: Record<Rarity, number> = {
    Common: 1, Uncommon: 2, Rare: 5, Epic: 15, Legendary: 40,
    Mythical: 100, Divine: 300, Celestial: 1_000, Transcendent: 5_000, Eternal: 20_000,
  }
  return values[rarity]
}
