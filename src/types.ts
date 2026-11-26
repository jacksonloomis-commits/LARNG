export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythical' | 'Divine' | 'Celestial' | 'Transcendent' | 'Eternal'
export interface Aura {
  id: string
  name: string
  rarity: Rarity
  odds: number
  theme: string
  symbol: string
  description: string
}
export interface SaveData {
  version: number
  coins: number
  gems: number
  essence: number
  totalRolls: number
  inventory: Record<string, number>
  discovered: string[]
  equipped: string | null
  luckLevel: number
  speedLevel: number
}