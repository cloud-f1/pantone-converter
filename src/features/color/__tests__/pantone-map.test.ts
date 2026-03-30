import { describe, it, expect } from 'vitest'
import { PANTONE_MAP, getPantoneColor } from '@/features/color/data/pantone-map'

describe('PANTONE_MAP', () => {
  it('should have at least 100 entries', () => {
    expect(Object.keys(PANTONE_MAP).length).toBeGreaterThanOrEqual(100)
  })

  it('should have valid hex format for all entries', () => {
    for (const [key, entry] of Object.entries(PANTONE_MAP)) {
      expect(entry.hex, `${key} hex`).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })

  it('should have non-empty name for all entries', () => {
    for (const [key, entry] of Object.entries(PANTONE_MAP)) {
      expect(entry.name, `${key} name`).toBeTruthy()
    }
  })

  it('should have uppercase keys without spaces', () => {
    for (const key of Object.keys(PANTONE_MAP)) {
      expect(key).toBe(key.toUpperCase())
      expect(key).not.toContain(' ')
    }
  })
})

describe('getPantoneColor', () => {
  it('should find exact match', () => {
    const result = getPantoneColor('485C')
    expect(result).toBeDefined()
    expect(result?.hex).toMatch(/^#/)
  })

  it('should find case-insensitive match', () => {
    const result = getPantoneColor('485c')
    expect(result).toBeDefined()
  })

  it('should find match with spaces stripped', () => {
    const result = getPantoneColor('485 C')
    expect(result).toBeDefined()
  })

  it('should find match with hyphens stripped', () => {
    const result = getPantoneColor('485-C')
    expect(result).toBeDefined()
  })

  it('should return undefined for unknown code', () => {
    expect(getPantoneColor('ZZZZZ')).toBeUndefined()
  })
})
