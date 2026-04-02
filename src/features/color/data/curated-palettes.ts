export type PaletteTheme = 'pastel' | 'vintage' | 'retro' | 'neon' | 'earth' | 'warm' | 'cold' | 'summer' | 'winter' | 'professional' | 'nature' | 'modern'

export type CuratedPalette = {
  id: string
  name: string
  theme: PaletteTheme
  colors: string[] // Pantone codes
}

export const CURATED_PALETTES: CuratedPalette[] = [
  // Pastel
  { id: 'p1', name: 'Spring Blush', theme: 'pastel', colors: ['196C', '2043C', '263C', '7444C'] },
  { id: 'p2', name: 'Cotton Candy', theme: 'pastel', colors: ['182C', '2365C', '658C', '573C'] },
  { id: 'p3', name: 'Soft Dawn', theme: 'pastel', colors: ['7401C', '155C', '196C', '565C'] },
  { id: 'p4', name: 'Lavender Dream', theme: 'pastel', colors: ['263C', '250C', '196C', '649C'] },
  { id: 'p5', name: 'Mint Fresh', theme: 'pastel', colors: ['573C', '337C', '196C', '656C'] },

  // Vintage
  { id: 'v1', name: 'Old Cinema', theme: 'vintage', colors: ['174C', '4625C', '7527C', 'WARMGRAY5C'] },
  { id: 'v2', name: 'Antique Gold', theme: 'vintage', colors: ['132C', '7505C', '7527C', '403C'] },
  { id: 'v3', name: 'Dusty Rose', theme: 'vintage', colors: ['693C', '500C', '7527C', '402C'] },
  { id: 'v4', name: 'Faded Library', theme: 'vintage', colors: ['7519C', '4625C', '614C', '7534C'] },

  // Warm
  { id: 'w1', name: 'Sunset', theme: 'warm', colors: ['485C', '144C', '116C', '7408C'] },
  { id: 'w2', name: 'Autumn Leaves', theme: 'warm', colors: ['174C', '144C', '7408C', '7505C'] },
  { id: 'w3', name: 'Desert Sand', theme: 'warm', colors: ['7506C', '7508C', '7510C', '7519C'] },
  { id: 'w4', name: 'Spice Market', theme: 'warm', colors: ['180C', '1525C', '7413C', '4625C'] },
  { id: 'w5', name: 'Terracotta', theme: 'warm', colors: ['7524C', '7516C', '7505C', '7527C'] },

  // Cold
  { id: 'c1', name: 'Arctic', theme: 'cold', colors: ['290C', '2905C', 'PROCESSBLUEC', '2955C'] },
  { id: 'c2', name: 'Frozen Lake', theme: 'cold', colors: ['544C', '542C', '2945C', '289C'] },
  { id: 'c3', name: 'Winter Sky', theme: 'cold', colors: ['277C', '278C', '293C', '2758C'] },
  { id: 'c4', name: 'Ice Crystal', theme: 'cold', colors: ['649C', '650C', '651C', '653C'] },

  // Earth
  { id: 'e1', name: 'Forest Floor', theme: 'earth', colors: ['350C', '7505C', '4625C', '7519C'] },
  { id: 'e2', name: 'Mountain Trail', theme: 'earth', colors: ['7534C', '7527C', '403C', '405C'] },
  { id: 'e3', name: 'Clay Garden', theme: 'earth', colors: ['7516C', '7519C', '7505C', '7534C'] },
  { id: 'e4', name: 'Olive Grove', theme: 'earth', colors: ['378C', '7505C', '7527C', '614C'] },

  // Nature
  { id: 'n1', name: 'Ocean Breeze', theme: 'nature', colors: ['319C', '326C', '3262C', '2955C'] },
  { id: 'n2', name: 'Spring Garden', theme: 'nature', colors: ['347C', '361C', '375C', '116C'] },
  { id: 'n3', name: 'Tropical', theme: 'nature', colors: ['347C', '326C', '116C', '485C'] },
  { id: 'n4', name: 'Cherry Blossom', theme: 'nature', colors: ['182C', '196C', '507C', '573C'] },

  // Professional
  { id: 'pr1', name: 'Corporate Blue', theme: 'professional', colors: ['286C', '300C', 'COOLGRAY5C', 'BLACKC'] },
  { id: 'pr2', name: 'Executive', theme: 'professional', colors: ['289C', '431C', '7527C', 'BLACKC'] },
  { id: 'pr3', name: 'Tech Minimal', theme: 'professional', colors: ['2935C', 'COOLGRAY3C', 'COOLGRAY1C', 'BLACKC'] },
  { id: 'pr4', name: 'Legal', theme: 'professional', colors: ['289C', '7519C', '7527C', '431C'] },

  // Modern
  { id: 'm1', name: 'Neon Pop', theme: 'modern', colors: ['806C', '802C', '803C', '805C'] },
  { id: 'm2', name: 'Electric', theme: 'modern', colors: ['2728C', '2685C', '226C', '485C'] },
  { id: 'm3', name: 'Gradient UI', theme: 'modern', colors: ['2665C', '2587C', '806C', '116C'] },
  { id: 'm4', name: 'Startup', theme: 'modern', colors: ['2935C', '347C', '116C', '485C'] },

  // Retro
  { id: 'r1', name: '70s Disco', theme: 'retro', colors: ['151C', '485C', '2685C', '347C'] },
  { id: 'r2', name: 'Groovy', theme: 'retro', colors: ['144C', '186C', '2607C', '361C'] },
  { id: 'r3', name: 'Vintage Pop', theme: 'retro', colors: ['186C', '116C', '300C', '355C'] },

  // Summer
  { id: 's1', name: 'Beach Day', theme: 'summer', colors: ['116C', '151C', '326C', '300C'] },
  { id: 's2', name: 'Tropical Fruit', theme: 'summer', colors: ['116C', '151C', '485C', '347C'] },
  { id: 's3', name: 'Poolside', theme: 'summer', colors: ['300C', '319C', '116C', '485C'] },

  // Winter
  { id: 'wi1', name: 'Snowfall', theme: 'winter', colors: ['649C', 'COOLGRAY1C', '290C', '2955C'] },
  { id: 'wi2', name: 'Holiday', theme: 'winter', colors: ['186C', '347C', '7527C', 'BLACKC'] },
  { id: 'wi3', name: 'Frosty Night', theme: 'winter', colors: ['289C', '2758C', '649C', '7527C'] },

  // Neon
  { id: 'ne1', name: 'Cyber', theme: 'neon', colors: ['802C', '806C', '803C', 'BLACKC'] },
  { id: 'ne2', name: 'Glow', theme: 'neon', colors: ['805C', '806C', '802C', '803C'] },
]

export const PALETTE_THEMES: { key: PaletteTheme | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pastel', label: 'Pastel' },
  { key: 'vintage', label: 'Vintage' },
  { key: 'warm', label: 'Warm' },
  { key: 'cold', label: 'Cold' },
  { key: 'earth', label: 'Earth' },
  { key: 'nature', label: 'Nature' },
  { key: 'professional', label: 'Professional' },
  { key: 'modern', label: 'Modern' },
  { key: 'retro', label: 'Retro' },
  { key: 'summer', label: 'Summer' },
  { key: 'winter', label: 'Winter' },
  { key: 'neon', label: 'Neon' },
]
