import { describe, it, expect } from 'vitest'
import {
  hexToRgb,
  getRelativeLuminance,
  getContrastTextColor,
  FALLBACK_COLOR,
} from '@/features/color/lib/color-utils'

describe('hexToRgb', () => {
  it('should parse red', () => {
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('should parse green', () => {
    expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 })
  })

  it('should parse blue', () => {
    expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 })
  })

  it('should parse white', () => {
    expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('should handle hex without #', () => {
    expect(hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 })
  })
})

describe('getRelativeLuminance', () => {
  it('should return ~1.0 for white', () => {
    expect(getRelativeLuminance('#FFFFFF')).toBeCloseTo(1.0, 1)
  })

  it('should return 0 for black', () => {
    expect(getRelativeLuminance('#000000')).toBe(0)
  })

  it('should return mid value for gray', () => {
    const lum = getRelativeLuminance('#808080')
    expect(lum).toBeGreaterThan(0.1)
    expect(lum).toBeLessThan(0.5)
  })
})

describe('getContrastTextColor', () => {
  it('should return white for dark colors', () => {
    expect(getContrastTextColor('#000000')).toBe('#FFFFFF')
    expect(getContrastTextColor('#DA291C')).toBe('#FFFFFF') // Pantone 485C red
    expect(getContrastTextColor('#003DA5')).toBe('#FFFFFF') // dark blue
  })

  it('should return black for light colors', () => {
    expect(getContrastTextColor('#FFFFFF')).toBe('#000000')
    expect(getContrastTextColor('#FFFF00')).toBe('#000000') // yellow
    expect(getContrastTextColor('#FED100')).toBe('#000000') // Pantone yellow
  })
})

describe('FALLBACK_COLOR', () => {
  it('should have grey hex', () => {
    expect(FALLBACK_COLOR.hex).toBe('#808080')
  })

  it('should have "Unknown Color" name', () => {
    expect(FALLBACK_COLOR.name).toBe('Unknown Color')
  })
})
