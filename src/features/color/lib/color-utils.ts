import type { PantoneEntry } from '../data/pantone-map'

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { r: 0, g: 0, b: 0 }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  )
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

export function getContrastTextColor(hex: string): '#FFFFFF' | '#000000' {
  return getRelativeLuminance(hex) < 0.179 ? '#FFFFFF' : '#000000'
}

export const FALLBACK_COLOR: PantoneEntry = {
  hex: '#808080',
  name: 'Unknown Color',
  family: 'neutral',
}

// --- Color Science: Lab & Delta E ---

export type Lab = { L: number; a: number; b: number }

export function rgbToLab(r: number, g: number, b: number): Lab {
  // sRGB to linear RGB
  let rr = r / 255
  let gg = g / 255
  let bb = b / 255
  rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92
  gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92
  bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92

  // Linear RGB to XYZ (D65)
  let x = (rr * 0.4124564 + gg * 0.3575761 + bb * 0.1804375) / 0.95047
  let y = (rr * 0.2126729 + gg * 0.7151522 + bb * 0.0721750) / 1.00000
  let z = (rr * 0.0193339 + gg * 0.1191920 + bb * 0.9503041) / 1.08883

  // XYZ to Lab
  const epsilon = 0.008856
  const kappa = 903.3
  x = x > epsilon ? Math.cbrt(x) : (kappa * x + 16) / 116
  y = y > epsilon ? Math.cbrt(y) : (kappa * y + 16) / 116
  z = z > epsilon ? Math.cbrt(z) : (kappa * z + 16) / 116

  return {
    L: 116 * y - 16,
    a: 500 * (x - y),
    b: 200 * (y - z),
  }
}

export function hexToLab(hex: string): Lab {
  const { r, g, b } = hexToRgb(hex)
  return rgbToLab(r, g, b)
}

export function deltaE2000(lab1: Lab, lab2: Lab): number {
  const { L: L1, a: a1, b: b1 } = lab1
  const { L: L2, a: a2, b: b2 } = lab2

  const kL = 1, kC = 1, kH = 1

  const C1 = Math.sqrt(a1 * a1 + b1 * b1)
  const C2 = Math.sqrt(a2 * a2 + b2 * b2)
  const Cab = (C1 + C2) / 2

  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cab, 7) / (Math.pow(Cab, 7) + Math.pow(25, 7))))
  const a1p = a1 * (1 + G)
  const a2p = a2 * (1 + G)

  const C1p = Math.sqrt(a1p * a1p + b1 * b1)
  const C2p = Math.sqrt(a2p * a2p + b2 * b2)

  let h1p = Math.atan2(b1, a1p) * (180 / Math.PI)
  if (h1p < 0) h1p += 360
  let h2p = Math.atan2(b2, a2p) * (180 / Math.PI)
  if (h2p < 0) h2p += 360

  const dLp = L2 - L1
  const dCp = C2p - C1p

  let dhp: number
  if (C1p * C2p === 0) {
    dhp = 0
  } else if (Math.abs(h2p - h1p) <= 180) {
    dhp = h2p - h1p
  } else if (h2p - h1p > 180) {
    dhp = h2p - h1p - 360
  } else {
    dhp = h2p - h1p + 360
  }

  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * Math.PI) / 360)

  const Lbp = (L1 + L2) / 2
  const Cbp = (C1p + C2p) / 2

  let hbp: number
  if (C1p * C2p === 0) {
    hbp = h1p + h2p
  } else if (Math.abs(h1p - h2p) <= 180) {
    hbp = (h1p + h2p) / 2
  } else if (h1p + h2p < 360) {
    hbp = (h1p + h2p + 360) / 2
  } else {
    hbp = (h1p + h2p - 360) / 2
  }

  const T = 1
    - 0.17 * Math.cos(((hbp - 30) * Math.PI) / 180)
    + 0.24 * Math.cos(((2 * hbp) * Math.PI) / 180)
    + 0.32 * Math.cos(((3 * hbp + 6) * Math.PI) / 180)
    - 0.20 * Math.cos(((4 * hbp - 63) * Math.PI) / 180)

  const SL = 1 + (0.015 * Math.pow(Lbp - 50, 2)) / Math.sqrt(20 + Math.pow(Lbp - 50, 2))
  const SC = 1 + 0.045 * Cbp
  const SH = 1 + 0.015 * Cbp * T

  const RT_exp = -2 * Math.sqrt(Math.pow(Cbp, 7) / (Math.pow(Cbp, 7) + Math.pow(25, 7)))
  const d_theta = 30 * Math.exp(-Math.pow((hbp - 275) / 25, 2))
  const RC = RT_exp * Math.sin((2 * d_theta * Math.PI) / 180)

  return Math.sqrt(
    Math.pow(dLp / (kL * SL), 2) +
    Math.pow(dCp / (kC * SC), 2) +
    Math.pow(dHp / (kH * SH), 2) +
    RC * (dCp / (kC * SC)) * (dHp / (kH * SH))
  )
}

export type DeltaECategory = 'imperceptible' | 'close' | 'noticeable' | 'different' | 'very-different'

export function getDeltaECategory(deltaE: number): DeltaECategory {
  if (deltaE < 1) return 'imperceptible'
  if (deltaE < 2) return 'close'
  if (deltaE < 5) return 'noticeable'
  if (deltaE < 10) return 'different'
  return 'very-different'
}

// --- HSL, HSV, CMYK conversions ---

export type HSL = { h: number; s: number; l: number }
export type HSV = { h: number; s: number; v: number }
export type CMYK = { c: number; m: number; y: number; k: number }

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hexToHsl(hex: string): HSL {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHsl(r, g, b)
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const d = max - min
  const v = max
  const s = max === 0 ? 0 : d / max
  let h = 0
  if (max !== min) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) }
}

export function hexToHsv(hex: string): HSV {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHsv(r, g, b)
}

export function rgbToCmyk(r: number, g: number, b: number): CMYK {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 }
  const rr = r / 255, gg = g / 255, bb = b / 255
  const k = 1 - Math.max(rr, gg, bb)
  const c = (1 - rr - k) / (1 - k)
  const m = (1 - gg - k) / (1 - k)
  const y = (1 - bb - k) / (1 - k)
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  }
}

export function hexToCmyk(hex: string): CMYK {
  const { r, g, b } = hexToRgb(hex)
  return rgbToCmyk(r, g, b)
}

// --- Color Harmonies ---

export function getAnalogousColors(hex: string): string[] {
  const { h, s, l } = hexToHsl(hex)
  return [
    hslToHex((h - 60 + 360) % 360, s, l),
    hslToHex((h - 30 + 360) % 360, s, l),
    hslToHex((h + 30) % 360, s, l),
    hslToHex((h + 60) % 360, s, l),
  ]
}

export function getComplementaryColor(hex: string): string {
  const { h, s, l } = hexToHsl(hex)
  return hslToHex((h + 180) % 360, s, l)
}

export function getTriadicColors(hex: string): string[] {
  const { h, s, l } = hexToHsl(hex)
  return [
    hslToHex((h + 120) % 360, s, l),
    hslToHex((h + 240) % 360, s, l),
  ]
}

export function getSplitComplementaryColors(hex: string): string[] {
  const { h, s, l } = hexToHsl(hex)
  return [
    hslToHex((h + 150) % 360, s, l),
    hslToHex((h + 210) % 360, s, l),
  ]
}

export function getMonochromaticColors(hex: string): string[] {
  const { h, s, l } = hexToHsl(hex)
  const shades: string[] = []
  for (let offset = -40; offset <= 40; offset += 10) {
    if (offset === 0) continue
    const newL = Math.max(5, Math.min(95, l + offset))
    shades.push(hslToHex(h, s, newL))
  }
  return shades
}
