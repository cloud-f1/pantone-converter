'use client'

import { useState, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getPantoneColor } from '@/features/color/data/pantone-map'
import {
  hexToRgb,
  getContrastTextColor,
  getRelativeLuminance,
  hexToLab,
  deltaE2000,
  getDeltaECategory,
  type DeltaECategory,
} from '@/features/color/lib/color-utils'
import { ColorSearchInput } from '@/components/color-search-input'
import { CopyButton } from '@/components/copy-button'
import { PlusIcon, LinkIcon, CopyIcon } from '@/components/icons'
import type { Dictionary } from '@/i18n/get-dictionary'

type Props = {
  dictionary: Dictionary
}

const DELTA_E_COLORS: Record<DeltaECategory, string> = {
  'imperceptible': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'close': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'noticeable': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'different': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'very-different': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const CATEGORY_LABELS: Record<DeltaECategory, keyof Dictionary['compare']> = {
  'imperceptible': 'imperceptible',
  'close': 'close',
  'noticeable': 'noticeable',
  'different': 'different',
  'very-different': 'veryDifferent',
}

function setColorsParam(codes: (string | null)[]) {
  const valid = codes.filter(Boolean) as string[]
  if (valid.length === 0) return ''
  return valid.join(',')
}

export function ColorCompare({ dictionary: t }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Init from URL params
  const initialCodes = useMemo(() => {
    const param = searchParams.get('colors')
    if (param) {
      const parsed = param.split(',').filter(c => getPantoneColor(c)).slice(0, 3)
      if (parsed.length > 0) {
        const slots: (string | null)[] = [...parsed]
        while (slots.length < 2) slots.push(null)
        return slots
      }
    }
    return [null, null] as (string | null)[]
  }, [searchParams])

  const [codes, setCodes] = useState<(string | null)[]>(initialCodes)

  // Sync to URL
  const updateUrl = useCallback((newCodes: (string | null)[]) => {
    const param = setColorsParam(newCodes)
    if (param) {
      router.replace(`/compare?colors=${param}`, { scroll: false })
    } else {
      router.replace('/compare', { scroll: false })
    }
  }, [router])

  const setCode = useCallback((index: number, code: string | null) => {
    setCodes(prev => {
      const next = [...prev]
      next[index] = code
      updateUrl(next)
      return next
    })
  }, [updateUrl])

  const addSlot = useCallback(() => {
    if (codes.length < 3) {
      const next = [...codes, null]
      setCodes(next)
    }
  }, [codes])

  const removeSlot = useCallback((index: number) => {
    if (codes.length <= 2) {
      setCode(index, null)
      return
    }
    const next = codes.filter((_, i) => i !== index)
    setCodes(next)
    updateUrl(next)
  }, [codes, setCode, updateUrl])

  // Resolved colors
  const colors = useMemo(() =>
    codes.map(code => code ? { code, ...getPantoneColor(code)! } : null),
    [codes]
  )

  const validColors = colors.filter(Boolean) as { code: string; hex: string; name: string; family: string }[]

  // Delta E pairs
  const pairs = useMemo(() => {
    const result: { code1: string; code2: string; deltaE: number; category: DeltaECategory }[] = []
    for (let i = 0; i < validColors.length; i++) {
      for (let j = i + 1; j < validColors.length; j++) {
        const lab1 = hexToLab(validColors[i].hex)
        const lab2 = hexToLab(validColors[j].hex)
        const de = deltaE2000(lab1, lab2)
        result.push({
          code1: validColors[i].code,
          code2: validColors[j].code,
          deltaE: de,
          category: getDeltaECategory(de),
        })
      }
    }
    return result
  }, [validColors])

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/compare?colors=${validColors.map(c => c.code).join(',')}`
    : ''

  const deltaESummary = pairs.map(p => `${p.code1} ↔ ${p.code2}: ΔE = ${p.deltaE.toFixed(1)}`).join('\n')

  const hasSelection = validColors.length > 0

  const examples = [
    { colors: ['485C', '186C'], label: 'Similar Reds' },
    { colors: ['485C', '286C', '347C'], label: 'Red vs Blue vs Green' },
    { colors: ['2377C', '7661C', '2342C'], label: 'Morandi Tones' },
    { colors: ['WARMGRAY5C', 'COOLGRAY5C', 'BLACKC'], label: 'Warm vs Cool' },
    { colors: ['2935C', '286C', '300C'], label: 'Blue Shades' },
  ]

  const loadExample = useCallback((colorCodes: string[]) => {
    const slots: (string | null)[] = [...colorCodes]
    while (slots.length < 2) slots.push(null)
    setCodes(slots)
    updateUrl(slots)
  }, [updateUrl])

  return (
    <div className="space-y-8">
      {/* Example comparisons — shown when empty */}
      {!hasSelection && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Try an example:
          </p>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex.label}
                onClick={() => loadExample(ex.colors)}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-violet-600 dark:hover:bg-violet-950/30 dark:hover:text-violet-300"
              >
                <span className="flex gap-0.5">
                  {ex.colors.map((c) => {
                    const entry = getPantoneColor(c)
                    return (
                      <span
                        key={c}
                        className="h-4 w-4 rounded-sm border border-zinc-200 dark:border-zinc-600"
                        style={{ backgroundColor: entry?.hex ?? '#808080' }}
                      />
                    )
                  })}
                </span>
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* A. Color Selection */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        {codes.map((code, i) => (
          <div key={i} className="relative flex-1">
            <ColorSearchInput
              value={code}
              onChange={(c) => setCode(i, c)}
              placeholder={t.compare.searchPlaceholder}
            />
            {codes.length > 2 && (
              <button
                onClick={() => removeSlot(i)}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-zinc-500 text-xs hover:bg-red-100 hover:text-red-500 dark:bg-zinc-700 dark:hover:bg-red-900/50"
              >
                ×
              </button>
            )}
          </div>
        ))}
        {codes.length < 3 && (
          <button
            onClick={addSlot}
            className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-500 transition-colors hover:border-violet-400 hover:text-violet-500 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-violet-500 dark:hover:text-violet-400 sm:flex-1"
          >
            <PlusIcon className="h-4 w-4" />
            {t.compare.addColor}
          </button>
        )}
      </div>

      {/* B. Swatch Cards */}
      <div className={`grid gap-4 ${codes.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {colors.map((color, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl shadow-lg"
          >
            {color ? (
              <div
                className="flex aspect-[4/3] flex-col items-center justify-center p-6"
                style={{ backgroundColor: color.hex }}
              >
                <p
                  className="text-2xl font-bold sm:text-3xl"
                  style={{ color: getContrastTextColor(color.hex) }}
                >
                  {color.name}
                </p>
                <p
                  className="mt-2 text-lg font-light"
                  style={{ color: getContrastTextColor(color.hex), opacity: 0.85 }}
                >
                  {color.hex.toUpperCase()}
                </p>
              </div>
            ) : (
              <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-100 text-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-500">
                <p className="text-sm">{t.compare.selectColor}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* C. Delta E Section */}
      {pairs.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {t.compare.deltaE}
          </h2>
          <div className="space-y-3">
            {pairs.map((pair, i) => (
              <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{pair.code1}</span>
                  <span className="text-zinc-400">↔</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{pair.code2}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    ΔE = {pair.deltaE.toFixed(1)}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${DELTA_E_COLORS[pair.category]}`}>
                    {t.compare[CATEGORY_LABELS[pair.category]] as string}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* D. Details Table */}
      {validColors.length >= 2 && (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                  {t.compare.property}
                </th>
                {validColors.map(c => (
                  <th key={c.code} className="px-4 py-3 text-left font-medium text-zinc-900 dark:text-zinc-100">
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded" style={{ backgroundColor: c.hex }} />
                      {c.code}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              <tr>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{t.compare.name}</td>
                {validColors.map(c => (
                  <td key={c.code} className="px-4 py-3 text-zinc-900 dark:text-zinc-100">{c.name}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{t.compare.hexCode}</td>
                {validColors.map(c => (
                  <td key={c.code} className="px-4 py-3 font-mono text-zinc-900 dark:text-zinc-100">{c.hex.toUpperCase()}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{t.compare.rgb}</td>
                {validColors.map(c => {
                  const { r, g, b } = hexToRgb(c.hex)
                  return (
                    <td key={c.code} className="px-4 py-3 font-mono text-zinc-900 dark:text-zinc-100">
                      {r}, {g}, {b}
                    </td>
                  )
                })}
              </tr>
              <tr>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{t.compare.family}</td>
                {validColors.map(c => (
                  <td key={c.code} className="px-4 py-3 capitalize text-zinc-900 dark:text-zinc-100">{c.family}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{t.compare.luminance}</td>
                {validColors.map(c => (
                  <td key={c.code} className="px-4 py-3 font-mono text-zinc-900 dark:text-zinc-100">
                    {getRelativeLuminance(c.hex).toFixed(3)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* E. Action Buttons */}
      {validColors.length >= 2 && (
        <div className="flex flex-wrap gap-3">
          <CopyButton
            text={shareUrl}
            label={t.compare.shareComparison}
            icon={<LinkIcon className="h-3.5 w-3.5" />}
          />
          <CopyButton
            text={deltaESummary}
            label={t.compare.copyDeltaE}
            icon={<CopyIcon className="h-3.5 w-3.5" />}
          />
        </div>
      )}
    </div>
  )
}
