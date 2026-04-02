'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  hslToHex,
  getContrastTextColor,
  getAnalogousColors,
  getComplementaryColor,
  getTriadicColors,
  getSplitComplementaryColors,
  getTetradicColors,
} from '@/features/color/lib/color-utils'
import { findClosestPantone } from '@/features/color/lib/find-closest'
import type { Dictionary } from '@/i18n/get-dictionary'

type HarmonyMode = 'analogous' | 'complementary' | 'triadic' | 'split' | 'tetradic'

const MODES: { key: HarmonyMode; label: string }[] = [
  { key: 'analogous', label: 'Analogous' },
  { key: 'complementary', label: 'Complementary' },
  { key: 'triadic', label: 'Triadic' },
  { key: 'split', label: 'Split Comp.' },
  { key: 'tetradic', label: 'Tetradic' },
]

type Props = { dictionary: Dictionary }

export function ColorWheel({ dictionary: _t }: Props) {
  const [hue, setHue] = useState(0)
  const [mode, setMode] = useState<HarmonyMode>('analogous')

  const mainHex = hslToHex(hue, 70, 50)

  const harmonyColors = useMemo(() => {
    switch (mode) {
      case 'analogous': return getAnalogousColors(mainHex)
      case 'complementary': return [getComplementaryColor(mainHex)]
      case 'triadic': return getTriadicColors(mainHex)
      case 'split': return getSplitComplementaryColors(mainHex)
      case 'tetradic': return getTetradicColors(mainHex)
    }
  }, [mainHex, mode])

  const allColors = [mainHex, ...harmonyColors]

  // Generate wheel segments
  const segments = 36
  const wheelColors = Array.from({ length: segments }, (_, i) => {
    const h = (i / segments) * 360
    return { h, hex: hslToHex(Math.round(h), 70, 50) }
  })

  return (
    <div className="space-y-8">
      {/* Mode selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              mode === m.key
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Color wheel */}
      <div className="flex justify-center">
        <div className="relative">
          <svg width="320" height="320" viewBox="0 0 320 320">
            {/* Wheel ring */}
            {wheelColors.map((seg, i) => {
              const angle1 = (i / segments) * 360
              const angle2 = ((i + 1) / segments) * 360
              const r1 = (angle1 * Math.PI) / 180
              const r2 = (angle2 * Math.PI) / 180
              const cx = 160, cy = 160, outerR = 150, innerR = 100
              const x1o = cx + outerR * Math.cos(r1)
              const y1o = cy + outerR * Math.sin(r1)
              const x2o = cx + outerR * Math.cos(r2)
              const y2o = cy + outerR * Math.sin(r2)
              const x1i = cx + innerR * Math.cos(r2)
              const y1i = cy + innerR * Math.sin(r2)
              const x2i = cx + innerR * Math.cos(r1)
              const y2i = cy + innerR * Math.sin(r1)
              return (
                <path
                  key={i}
                  d={`M${x1o},${y1o} A${outerR},${outerR} 0 0,1 ${x2o},${y2o} L${x1i},${y1i} A${innerR},${innerR} 0 0,0 ${x2i},${y2i} Z`}
                  fill={seg.hex}
                  stroke="none"
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onClick={() => setHue(Math.round(seg.h))}
                />
              )
            })}
            {/* Center circle */}
            <circle cx="160" cy="160" r="95" fill="white" className="dark:fill-zinc-900" />
            {/* Selected hue indicator */}
            {allColors.map((hex, i) => {
              // Calculate approximate hue from hex for positioning
              const hueAngle = i === 0 ? hue : (() => {
                const r = parseInt(hex.slice(1, 3), 16) / 255
                const g = parseInt(hex.slice(3, 5), 16) / 255
                const b = parseInt(hex.slice(5, 7), 16) / 255
                const max = Math.max(r, g, b), min = Math.min(r, g, b)
                if (max === min) return 0
                let h = 0
                if (max === r) h = ((g - b) / (max - min) + (g < b ? 6 : 0)) / 6
                else if (max === g) h = ((b - r) / (max - min) + 2) / 6
                else h = ((r - g) / (max - min) + 4) / 6
                return h * 360
              })()
              const rad = (hueAngle * Math.PI) / 180
              const dotR = 125
              const x = 160 + dotR * Math.cos(rad)
              const y = 160 + dotR * Math.sin(rad)
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={i === 0 ? 12 : 9}
                  fill={hex}
                  stroke="white"
                  strokeWidth={3}
                  className="drop-shadow-md"
                />
              )
            })}
            {/* Center text */}
            <text x="160" y="155" textAnchor="middle" className="fill-zinc-900 text-sm font-bold dark:fill-zinc-100">
              {hue}&deg;
            </text>
            <text x="160" y="175" textAnchor="middle" className="fill-zinc-400 text-xs">
              {mainHex.toUpperCase()}
            </text>
          </svg>
        </div>
      </div>

      {/* Hue slider */}
      <div className="mx-auto max-w-sm">
        <input
          type="range"
          min="0"
          max="359"
          value={hue}
          onChange={(e) => setHue(parseInt(e.target.value))}
          className="w-full accent-violet-500"
          style={{
            background: `linear-gradient(to right, ${Array.from({ length: 12 }, (_, i) => hslToHex(i * 30, 70, 50)).join(', ')})`
          }}
        />
      </div>

      {/* Selected colors palette */}
      <div className="flex justify-center gap-3">
        {allColors.map((hex, i) => {
          const closest = findClosestPantone(hex)
          const textColor = getContrastTextColor(hex)
          return (
            <Link
              key={i}
              href={closest ? `/color/${closest.code}` : '#'}
              className="group"
            >
              <div
                className={`flex h-20 w-20 flex-col items-center justify-center rounded-xl shadow-md transition-all hover:scale-110 sm:h-24 sm:w-24 ${
                  i === 0 ? 'ring-2 ring-zinc-900 dark:ring-zinc-100' : ''
                }`}
                style={{ backgroundColor: hex }}
              >
                <span className="text-[10px] font-bold" style={{ color: textColor }}>
                  {closest?.code ?? '\u2014'}
                </span>
                <span className="text-[8px] opacity-70" style={{ color: textColor }}>
                  {hex.toUpperCase()}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
