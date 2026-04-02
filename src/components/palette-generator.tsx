'use client'

import { useState, useMemo, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getPantoneColor } from '@/features/color/data/pantone-map'
import { getContrastTextColor } from '@/features/color/lib/color-utils'
import { findClosestPantone } from '@/features/color/lib/find-closest'
import {
  generateGenericGradient,
  generateWarmGradient,
  generateCoolGradient,
  generatePastelGradient,
  generateLightnessGradient,
  generateMonochromeGradient,
} from '@/features/color/lib/gradient-utils'
import { ColorSearchInput } from '@/components/color-search-input'
import { CopyButton } from '@/components/copy-button'
import { CopyIcon } from '@/components/icons'
import type { Dictionary } from '@/i18n/get-dictionary'

type Props = { dictionary: Dictionary }

function PaletteRow({ label, colors }: { label: string; colors: string[] }) {
  const copyText = colors.map(c => c.toUpperCase()).join(', ')
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{label}</h3>
        <CopyButton text={copyText} label="" icon={<CopyIcon className="h-3.5 w-3.5" />} />
      </div>
      <div className="flex overflow-hidden rounded-lg">
        {colors.map((hex, i) => {
          const closest = findClosestPantone(hex)
          const textColor = getContrastTextColor(hex)
          return (
            <div
              key={i}
              className="flex flex-1 flex-col items-center justify-center py-8 sm:py-12"
              style={{ backgroundColor: hex }}
            >
              <span className="text-[10px] font-bold sm:text-xs" style={{ color: textColor }}>
                {closest?.code ?? ''}
              </span>
              <span className="text-[9px] opacity-70 sm:text-[10px]" style={{ color: textColor }}>
                {hex.toUpperCase()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function PaletteGenerator({ dictionary: t }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialCode = searchParams.get('color') ?? null
  const [selectedCode, setSelectedCode] = useState<string | null>(
    initialCode && getPantoneColor(initialCode) ? initialCode : null
  )

  const selectedHex = selectedCode ? getPantoneColor(selectedCode)?.hex ?? null : null

  const handleSelect = useCallback((code: string | null) => {
    setSelectedCode(code)
    if (code) router.replace(`/palette?color=${code}`, { scroll: false })
    else router.replace('/palette', { scroll: false })
  }, [router])

  const palettes = useMemo(() => {
    if (!selectedHex) return null
    return {
      generic: generateGenericGradient(selectedHex),
      warm: generateWarmGradient(selectedHex),
      cool: generateCoolGradient(selectedHex),
      pastel: generatePastelGradient(selectedHex),
      lightness: generateLightnessGradient(selectedHex),
      mono: generateMonochromeGradient(selectedHex),
    }
  }, [selectedHex])

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-md">
        <ColorSearchInput
          value={selectedCode}
          onChange={handleSelect}
          placeholder={t.palette?.searchPlaceholder ?? 'Search Pantone color...'}
        />
      </div>

      {palettes ? (
        <div className="space-y-4">
          <PaletteRow label={t.palette?.generic ?? 'Generic Gradient'} colors={palettes.generic} />
          <PaletteRow label={t.palette?.warm ?? 'Warm Gradient'} colors={palettes.warm} />
          <PaletteRow label={t.palette?.cool ?? 'Cool Gradient'} colors={palettes.cool} />
          <PaletteRow label={t.palette?.pastel ?? 'Pastel'} colors={palettes.pastel} />
          <PaletteRow label={t.palette?.lightness ?? 'Lightness Gradient'} colors={palettes.lightness} />
          <PaletteRow label={t.palette?.mono ?? 'Monochrome'} colors={palettes.mono} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Try an example:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { code: '485C', label: 'Red' },
                { code: '286C', label: 'Blue' },
                { code: '347C', label: 'Green' },
                { code: '116C', label: 'Yellow' },
                { code: '2685C', label: 'Purple' },
                { code: '151C', label: 'Orange' },
                { code: 'BLACKC', label: 'Black' },
              ].map((ex) => {
                const entry = getPantoneColor(ex.code)
                return (
                  <button
                    key={ex.code}
                    onClick={() => handleSelect(ex.code)}
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-violet-600 dark:hover:bg-violet-950/30"
                  >
                    <span className="h-4 w-4 rounded-sm border border-zinc-200 dark:border-zinc-600" style={{ backgroundColor: entry?.hex ?? '#808080' }} />
                    {ex.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="py-12 text-center text-zinc-400 dark:text-zinc-500">
            <p className="text-lg font-medium">{t.palette?.empty ?? 'Select a color to generate palettes'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
