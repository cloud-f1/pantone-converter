'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  getAnalogousColors,
  getComplementaryColor,
  getTriadicColors,
  getSplitComplementaryColors,
  getMonochromaticColors,
  getTetradicColors,
  getDoubleComplementaryColors,
  getContrastTextColor,
} from '@/features/color/lib/color-utils'
import { findClosestPantone } from '@/features/color/lib/find-closest'
import type { Dictionary } from '@/i18n/get-dictionary'

type Props = {
  hex: string
  dictionary: Dictionary
}

function HarmonyRow({ label, mainHex, colors }: { label: string; mainHex: string; colors: string[] }) {
  const allColors = [mainHex, ...colors]
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {label}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {allColors.map((color, i) => {
          const closest = findClosestPantone(color)
          const textColor = getContrastTextColor(color)
          const isMain = i === 0
          return (
            <Link
              key={i}
              href={closest ? `/color/${closest.code}` : '#'}
              className="group shrink-0"
              title={closest ? `${closest.entry.name} (ΔE ${closest.deltaE.toFixed(1)})` : color}
            >
              <div
                className={`flex h-16 w-20 flex-col items-center justify-center rounded-lg border shadow-sm transition-all hover:shadow-md hover:scale-105 sm:h-20 sm:w-24 ${
                  isMain ? 'border-2 border-zinc-900 dark:border-zinc-100' : 'border-zinc-200 dark:border-zinc-700'
                }`}
                style={{ backgroundColor: color }}
              >
                <span className="text-[10px] font-bold" style={{ color: textColor }}>
                  {isMain ? '●' : ''}{closest?.code ?? '—'}
                </span>
                <span className="text-[9px] opacity-70" style={{ color: textColor }}>
                  {color.toUpperCase()}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function ColorHarmonies({ hex, dictionary: t }: Props) {
  const harmonies = useMemo(() => ({
    analogous: getAnalogousColors(hex),
    complementary: [getComplementaryColor(hex)],
    triadic: getTriadicColors(hex),
    splitComplementary: getSplitComplementaryColors(hex),
    tetradic: getTetradicColors(hex),
    doubleComplementary: getDoubleComplementaryColors(hex),
    monochromatic: getMonochromaticColors(hex),
  }), [hex])

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {t.harmonies?.title ?? 'Color Harmonies'}
      </h2>
      <div className="space-y-6">
        <HarmonyRow label={t.harmonies?.analogous ?? 'Analogous'} mainHex={hex} colors={harmonies.analogous} />
        <HarmonyRow label={t.harmonies?.complementary ?? 'Complementary'} mainHex={hex} colors={harmonies.complementary} />
        <HarmonyRow label={t.harmonies?.triadic ?? 'Triadic'} mainHex={hex} colors={harmonies.triadic} />
        <HarmonyRow label={t.harmonies?.splitComplementary ?? 'Split Complementary'} mainHex={hex} colors={harmonies.splitComplementary} />
        <HarmonyRow label={t.harmonies?.tetradic ?? 'Tetradic (Rectangle)'} mainHex={hex} colors={harmonies.tetradic} />
        <HarmonyRow label={t.harmonies?.doubleComplementary ?? 'Double Complementary'} mainHex={hex} colors={harmonies.doubleComplementary} />
        <HarmonyRow label={t.harmonies?.monochromatic ?? 'Monochromatic'} mainHex={hex} colors={harmonies.monochromatic} />
      </div>
    </div>
  )
}
