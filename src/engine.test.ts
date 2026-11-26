import { describe, expect, it } from 'vitest'
import { AURAS } from './data'
import { essenceValue, formatOdds, rollAura } from './engine'

describe('Aura RNG engine', () => {
  it('always returns a configured aura', () => {
    for (let i = 0; i < 500; i++) expect(AURAS.some(aura => aura.id === rollAura(0).id)).toBe(true)
  })

  it('is deterministic with a supplied random source', () => {
    const first = rollAura(0, () => 0)
    const second = rollAura(0, () => 0)
    expect(first.id).toBe(second.id)
  })

  it('keeps luck input within supported bounds', () => {
    expect(AURAS.some(aura => aura.id === rollAura(-100).id)).toBe(true)
    expect(AURAS.some(aura => aura.id === rollAura(10_000).id)).toBe(true)
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
