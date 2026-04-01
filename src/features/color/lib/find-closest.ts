import { PANTONE_MAP, type PantoneEntry } from '@/features/color/data/pantone-map'
import { hexToLab, deltaE2000 } from './color-utils'

export function findClosestPantone(hex: string): { code: string; entry: PantoneEntry; deltaE: number } | null {
  const targetLab = hexToLab(hex)
  let best: { code: string; entry: PantoneEntry; deltaE: number } | null = null

  for (const [code, entry] of Object.entries(PANTONE_MAP)) {
    const de = deltaE2000(targetLab, hexToLab(entry.hex))
    if (!best || de < best.deltaE) {
      best = { code, entry, deltaE: de }
    }
  }

  return best
}

export function findClosestPantoneN(hex: string, n: number = 3): { code: string; entry: PantoneEntry; deltaE: number }[] {
  const targetLab = hexToLab(hex)
  const results: { code: string; entry: PantoneEntry; deltaE: number }[] = []

  for (const [code, entry] of Object.entries(PANTONE_MAP)) {
    results.push({ code, entry, deltaE: deltaE2000(targetLab, hexToLab(entry.hex)) })
  }

  return results.sort((a, b) => a.deltaE - b.deltaE).slice(0, n)
}
