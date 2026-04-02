import { hexToHsl, hslToHex } from './color-utils'

function interpolateHsl(h1: number, s1: number, l1: number, h2: number, s2: number, l2: number, t: number) {
  // Shortest path hue interpolation
  let dh = h2 - h1
  if (dh > 180) dh -= 360
  if (dh < -180) dh += 360
  const h = ((h1 + dh * t) % 360 + 360) % 360
  const s = s1 + (s2 - s1) * t
  const l = l1 + (l2 - l1) * t
  return hslToHex(Math.round(h), Math.round(s), Math.round(l))
}

export function generateGenericGradient(hex: string, steps: number = 6): string[] {
  const { h, s, l } = hexToHsl(hex)
  const compH = (h + 180) % 360
  return Array.from({ length: steps }, (_, i) =>
    interpolateHsl(h, s, l, compH, s, l, i / (steps - 1))
  )
}

export function generateWarmGradient(hex: string, steps: number = 6): string[] {
  const { h, s, l } = hexToHsl(hex)
  // Shift towards warm (0-60 range)
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1)
    const newH = ((h + t * 60) % 360 + 360) % 360
    const newS = Math.min(100, s + t * 10)
    const newL = Math.max(30, Math.min(80, l + (t - 0.5) * 20))
    return hslToHex(Math.round(newH), Math.round(newS), Math.round(newL))
  })
}

export function generateCoolGradient(hex: string, steps: number = 6): string[] {
  const { h, s, l } = hexToHsl(hex)
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1)
    const newH = ((h + 180 + t * 60) % 360 + 360) % 360
    const newS = Math.min(100, s + t * 10)
    const newL = Math.max(30, Math.min(80, l + (t - 0.5) * 20))
    return hslToHex(Math.round(newH), Math.round(newS), Math.round(newL))
  })
}

export function generatePastelGradient(hex: string, steps: number = 6): string[] {
  const { h } = hexToHsl(hex)
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1)
    const newH = ((h + t * 120) % 360 + 360) % 360
    return hslToHex(Math.round(newH), 35, 80)
  })
}

export function generateLightnessGradient(hex: string, steps: number = 7): string[] {
  const { h, s } = hexToHsl(hex)
  return Array.from({ length: steps }, (_, i) => {
    const l = 10 + (i / (steps - 1)) * 80 // 10% (dark) to 90% (light)
    return hslToHex(h, s, Math.round(l))
  })
}

export function generateMonochromeGradient(hex: string, steps: number = 7): string[] {
  const { h, s } = hexToHsl(hex)
  return Array.from({ length: steps }, (_, i) => {
    const l = 15 + (i / (steps - 1)) * 70 // 15% to 85%
    return hslToHex(h, s, Math.round(l))
  })
}
