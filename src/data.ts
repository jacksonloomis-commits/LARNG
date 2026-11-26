import type { Aura, Rarity } from './types'

export const RARITIES: { name: Rarity; color: string; weight: number }[] = [
  { name: 'Common', color: '#9aa4b2', weight: 1 },
  { name: 'Uncommon', color: '#55d69e', weight: 10 },
  { name: 'Rare', color: '#56a9ff', weight: 50 },
  { name: 'Epic', color: '#b17aff', weight: 250 },
  { name: 'Legendary', color: '#ffbf5e', weight: 1_000 },
  { name: 'Mythical', color: '#ff6eaa', weight: 5_000 },
  { name: 'Divine', color: '#fff0a6', weight: 25_000 },
  { name: 'Celestial', color: '#7deaff', weight: 100_000 },
  { name: 'Transcendent', color: '#e6b4ff', weight: 1_000_000 },
  { name: 'Eternal', color: '#ffffff', weight: 10_000_000 },
]

const make = (id: string, name: string, rarity: Rarity, odds: number, theme: string, symbol: string, description: string): Aura =>
  ({ id, name, rarity, odds, theme, symbol, description })

export const AURAS: Aura[] = [
  make('dust', 'Stardust', 'Common', 2, 'dust', '✦', 'A little fragment of a forgotten star.'),
  make('moonlit', 'Moonlit', 'Common', 2, 'moon', '☾', 'Quiet light from the edge of night.'),
  make('ember', 'Ember', 'Common', 2, 'ember', '♨', 'The last warmth of a dying flame.'),
  make('tide', 'Tide', 'Common', 2, 'tide', '≈', 'A soft current drifting through the cosmos.'),
  make('moss', 'Verdant', 'Common', 2, 'moss', '❋', 'Life finds a way, even between stars.'),
  make('haze', 'Haze', 'Common', 2, 'haze', '◌', 'A wisp of color in the quiet dark.'),
  make('frost', 'Frost', 'Uncommon', 10, 'frost', '❄', 'A crystalline chill from a distant moon.'),
  make('bloom', 'Bloom', 'Uncommon', 10, 'bloom', '✿', 'A tiny universe coming into flower.'),
  make('static', 'Static', 'Uncommon', 10, 'static', '⌁', 'Electric energy with nowhere to go.'),
  make('aurora', 'Aurora', 'Uncommon', 10, 'aurora', '⌇', 'Colorful ribbons dance across the sky.'),
  make('echo', 'Echo', 'Uncommon', 10, 'echo', '◎', 'The memory of a sound that never was.'),
  make('sapphire', 'Sapphire', 'Rare', 50, 'sapphire', '◆', 'Deep blue brilliance under pressure.'),
  make('crimson', 'Crimson', 'Rare', 50, 'crimson', '♦', 'A fierce pulse of living energy.'),
  make('nebula', 'Nebula', 'Rare', 50, 'nebula', '✺', 'A nursery of stars, captured in miniature.'),
  make('phantom', 'Phantom', 'Rare', 50, 'phantom', '◈', 'Something stirs just beyond perception.'),
  make('prism', 'Prism', 'Epic', 250, 'prism', '⬡', 'Light split into impossible colors.'),
  make('gravity', 'Gravity', 'Epic', 250, 'gravity', '◉', 'An invisible force bending everything nearby.'),
  make('rift', 'Rift', 'Epic', 250, 'rift', '⫷', 'A fracture in the fabric of reality.'),
  make('solstice', 'Solstice', 'Epic', 250, 'solstice', '☼', 'The longest day in a world without time.'),
  make('phoenix', 'Phoenix', 'Legendary', 1_000, 'phoenix', '♜', 'Born again from the beautiful ruin.'),
  make('singularity', 'Singularity', 'Legendary', 1_000, 'singularity', '⦿', 'A point where the rules stop working.'),
  make('bloodmoon', 'Blood Moon', 'Legendary', 1_000, 'bloodmoon', '●', 'An omen glowing red above the void.'),
  make('seraph', 'Seraph', 'Mythical', 5_000, 'seraph', '✧', 'Wings of impossible, ancient light.'),
  make('abyss', 'The Abyss', 'Mythical', 5_000, 'abyss', '◍', 'The deep looks back into you.'),
  make('worldtree', 'World Tree', 'Divine', 25_000, 'worldtree', '♧', 'Every world branches from this one.'),
  make('eclipse', 'Total Eclipse', 'Divine', 25_000, 'eclipse', '◐', 'Light and shadow become indistinguishable.'),
  make('astral', 'Astral Monarch', 'Celestial', 100_000, 'astral', '♛', 'A crown forged from constellations.'),
  make('supernova', 'Supernova', 'Celestial', 100_000, 'supernova', '✹', 'The spectacular end that begins everything.'),
  make('origin', 'Origin', 'Transcendent', 1_000_000, 'origin', '∞', 'Before time, before space, there was this.'),
  make('eternity', 'Eternity', 'Eternal', 10_000_000, 'eternity', '✴', 'The final light at the end of all things.'),
]

export const STARTER_SAVE = {
  version: 1, coins: 100, gems: 5, essence: 0, totalRolls: 0,
  inventory: {} as Record<string, number>, discovered: [] as string[], equipped: null as string | null,
  luckLevel: 0, speedLevel: 0,
}
