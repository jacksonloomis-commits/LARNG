import { AURAS } from './data'
import type { Aura, Rarity } from './types'

const rarityOrder: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical', 'Divine', 'Celestial', 'Transcendent', 'Eternal']

// Luck gently shifts probability toward higher tiers without making the rarest tiers linear or guaranteed.
export function rollAura(luckLevel: number, random = Math.random): Aura {
  const luck = Math.min(Math.max(luckLevel, 0), 100)
  const tierWeights = rarityOrder.map((_, index) => Math.pow(1.0 + luck * 0.035, index * 0.72))
  const total = tierWeights.reduce((sum, weight) => sum + weight, 0)
  let pick = random() * total
  let selected = 0
  for (let i = 0; i < tierWeights.length; i++) {
    pick -= tierWeights[i]
    if (pick <= 0) { selected = i; break }
  }
  const tier = rarityOrder[selected]
  const pool = AURAS.filter(aura => aura.rarity === tier)
  return pool[Math.floor(random() * pool.length)] ?? AURAS[0]
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
