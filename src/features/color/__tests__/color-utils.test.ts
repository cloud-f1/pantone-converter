import { describe, it, expect } from 'vitest'
import {
  hexToRgb,
  getRelativeLuminance,
  getContrastTextColor,
  FALLBACK_COLOR,
  rgbToLab,
  hexToLab,
  deltaE2000,
  getDeltaECategory,
  rgbToHsl,
  rgbToCmyk,
  getAnalogousColors,
  getComplementaryColor,
  getTriadicColors,
  getMonochromaticColors,
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

describe('rgbToLab', () => {
  it('should convert white to L=100', () => {
    const lab = rgbToLab(255, 255, 255)
    expect(lab.L).toBeCloseTo(100, 0)
    expect(lab.a).toBeCloseTo(0, 0)
    expect(lab.b).toBeCloseTo(0, 0)
  })

  it('should convert black to L=0', () => {
    const lab = rgbToLab(0, 0, 0)
    expect(lab.L).toBeCloseTo(0, 0)
    expect(lab.a).toBeCloseTo(0, 0)
    expect(lab.b).toBeCloseTo(0, 0)
  })

  it('should convert red correctly', () => {
    const lab = rgbToLab(255, 0, 0)
    expect(lab.L).toBeCloseTo(53.2, 0)
    expect(lab.a).toBeGreaterThan(70)
  })
})

describe('deltaE2000', () => {
  it('should return 0 for identical colors', () => {
    const lab = hexToLab('#DA291C')
    expect(deltaE2000(lab, lab)).toBe(0)
  })

  it('should be symmetric', () => {
    const lab1 = hexToLab('#DA291C')
    const lab2 = hexToLab('#003DA5')
    expect(deltaE2000(lab1, lab2)).toBeCloseTo(deltaE2000(lab2, lab1), 10)
  })

  it('should show large difference for red vs blue', () => {
    const lab1 = hexToLab('#DA291C')
    const lab2 = hexToLab('#003DA5')
    expect(deltaE2000(lab1, lab2)).toBeGreaterThan(30)
  })

  it('should show small difference for similar colors', () => {
    const lab1 = hexToLab('#DA291C')
    const lab2 = hexToLab('#D22730')
    expect(deltaE2000(lab1, lab2)).toBeLessThan(6)
  })

  it('should show very large difference for black vs white', () => {
    const lab1 = hexToLab('#000000')
    const lab2 = hexToLab('#FFFFFF')
    expect(deltaE2000(lab1, lab2)).toBeGreaterThan(90)
  })
})

describe('getDeltaECategory', () => {
  it('should categorize imperceptible', () => {
    expect(getDeltaECategory(0.5)).toBe('imperceptible')
  })
  it('should categorize close', () => {
    expect(getDeltaECategory(1.5)).toBe('close')
  })
  it('should categorize noticeable', () => {
    expect(getDeltaECategory(3)).toBe('noticeable')
  })
  it('should categorize different', () => {
    expect(getDeltaECategory(7)).toBe('different')
  })
  it('should categorize very-different', () => {
    expect(getDeltaECategory(50)).toBe('very-different')
  })
})

describe('rgbToHsl', () => {
  it('should convert red', () => {
    const hsl = rgbToHsl(255, 0, 0)
    expect(hsl.h).toBe(0)
    expect(hsl.s).toBe(100)
    expect(hsl.l).toBe(50)
  })
  it('should convert white', () => {
    const hsl = rgbToHsl(255, 255, 255)
    expect(hsl.l).toBe(100)
  })
})

describe('rgbToCmyk', () => {
  it('should convert red', () => {
    const cmyk = rgbToCmyk(255, 0, 0)
    expect(cmyk.c).toBe(0)
    expect(cmyk.m).toBe(100)
    expect(cmyk.y).toBe(100)
    expect(cmyk.k).toBe(0)
  })
  it('should convert black', () => {
    const cmyk = rgbToCmyk(0, 0, 0)
    expect(cmyk.k).toBe(100)
  })
})

describe('color harmonies', () => {
  it('getAnalogousColors returns 4 colors', () => {
    const colors = getAnalogousColors('#DA291C')
    expect(colors).toHaveLength(4)
    colors.forEach(c => expect(c).toMatch(/^#[0-9a-f]{6}$/))
  })
  it('getComplementaryColor returns valid hex', () => {
    expect(getComplementaryColor('#DA291C')).toMatch(/^#[0-9a-f]{6}$/)
  })
  it('getTriadicColors returns 2 colors', () => {
    expect(getTriadicColors('#DA291C')).toHaveLength(2)
  })
  it('getMonochromaticColors returns 8 shades', () => {
    expect(getMonochromaticColors('#DA291C')).toHaveLength(8)
  })
})
