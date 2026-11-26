import { describe, expect, it } from 'vitest'
import { AURAS } from './data'
import { essenceValue, formatOdds, getAuraWeights, rollAura } from './engine'

describe('Aura RNG engine', () => {
  it('returns a normalized probability distribution', () => {
    for (const luck of [0, 1, 25, 100, 10_000]) {
      const weights = getAuraWeights(luck)
      expect(weights).toHaveLength(AURAS.length)
      expect(weights.reduce((sum, item) => sum + item.probability, 0)).toBeCloseTo(1, 12)
      expect(weights.every(item => item.probability > 0)).toBe(true)
    }
  })

  it('always returns a configured aura', () => {
    for (let i = 0; i < 500; i++) expect(AURAS.some(aura => aura.id === rollAura(0).id)).toBe(true)
  })

  it('is deterministic with a supplied random source', () => {
    expect(rollAura(0, () => 0).id).toBe(AURAS[0].id)
    expect(rollAura(0, () => 0.999999).id).toBe(AURAS[AURAS.length - 1].id)
  })

  it('keeps luck input within supported bounds', () => {
    expect(getAuraWeights(-100)).toEqual(getAuraWeights(0))
    expect(getAuraWeights(10_000)).toEqual(getAuraWeights(100))
  })

  it('increases the relative weight of higher rarity tiers with luck', () => {
    const base = getAuraWeights(0)
    const boosted = getAuraWeights(100)
    const baseRatio = base.find(x => x.aura.id === 'eternity')!.probability / base.find(x => x.aura.id === 'dust')!.probability
    const boostedRatio = boosted.find(x => x.aura.id === 'eternity')!.probability / boosted.find(x => x.aura.id === 'dust')!.probability
    expect(boostedRatio).toBeGreaterThan(baseRatio)
  })

  it('formats displayed base odds', () => {
    expect(formatOdds(1_000_000)).toBe('1 in 1,000,000')
  })

  it('returns increasing essence rewards for higher rarities', () => {
    expect(essenceValue('Rare')).toBe(5)
    expect(essenceValue('Legendary')).toBe(40)
    expect(essenceValue('Eternal')).toBeGreaterThan(essenceValue('Celestial'))
  })
})
