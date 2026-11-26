import { AURAS } from './data'
import type { Aura, Rarity } from './types'

const rarityOrder: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical', 'Divine', 'Celestial', 'Transcendent', 'Eternal']

// Each aura starts with inverse-odds weight. Luck applies a rarity-sensitive multiplier
// so higher tiers benefit more, while a soft cap prevents unbounded scaling.
export function rollAura(luckLevel: number, random = Math.random): Aura {
  const luck = Math.min(Math.max(luckLevel, 0), 100)
  const luckFactor = 1 + luck * 0.035
  const weighted = AURAS.map(aura => {
    const tier = rarityOrder.indexOf(aura.rarity)
    const luckBoost = Math.pow(luckFactor, tier * 0.72)
    return { aura, weight: (1 / aura.odds) * luckBoost }
  })
  const total = weighted.reduce((sum, item) => sum + item.weight, 0)
  let pick = random() * total
  for (const item of weighted) {
    pick -= item.weight
    if (pick <= 0) return item.aura
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
