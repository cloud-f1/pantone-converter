import { describe, it, expect } from 'vitest'
import { getPantoneColor } from '@/features/color/data/pantone-map'
import { getContrastTextColor, FALLBACK_COLOR } from '@/features/color/lib/color-utils'

describe('OG route color logic', () => {
  it('should resolve known pantone code', () => {
    const color = getPantoneColor('485C')
    expect(color).toBeDefined()
    expect(color!.hex).toMatch(/^#[0-9A-Fa-f]{6}$/)
    expect(getContrastTextColor(color!.hex)).toMatch(/^#(FFFFFF|000000)$/)
  })

  it('should fallback for unknown code', () => {
    const color = getPantoneColor('NONEXISTENT')
    expect(color).toBeUndefined()
    // Route would use FALLBACK_COLOR
    expect(FALLBACK_COLOR.hex).toBe('#808080')
    expect(FALLBACK_COLOR.name).toBe('Unknown Color')
  })

  it('should handle empty/null pantone param', () => {
    const color = getPantoneColor('')
    expect(color).toBeUndefined()
  })
})
