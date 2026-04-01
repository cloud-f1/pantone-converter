'use client'

import {
  hexToRgb,
  hexToCmyk,
  hexToHsl,
  hexToHsv,
  hexToLab,
  getRelativeLuminance,
} from '@/features/color/lib/color-utils'
import { CopyButton } from '@/components/copy-button'
import { CopyIcon } from '@/components/icons'
import type { Dictionary } from '@/i18n/get-dictionary'

type Props = {
  hex: string
  dictionary: Dictionary
}

export function ColorProperties({ hex, dictionary: t }: Props) {
  const rgb = hexToRgb(hex)
  const cmyk = hexToCmyk(hex)
  const hsl = hexToHsl(hex)
  const hsv = hexToHsv(hex)
  const lab = hexToLab(hex)
  const luminance = getRelativeLuminance(hex)

  const rows = [
    {
      label: t.properties?.hex ?? 'HEX',
      value: hex.toUpperCase(),
      copyValue: hex.toUpperCase(),
      tag: t.properties?.webUse ?? 'Web',
    },
    {
      label: t.properties?.rgb ?? 'RGB',
      value: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
      copyValue: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      tag: t.properties?.screenUse ?? 'Screen',
    },
    {
      label: t.properties?.cmyk ?? 'CMYK',
      value: `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`,
      copyValue: `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`,
      tag: t.properties?.printUse ?? 'Print',
    },
    {
      label: t.properties?.hsl ?? 'HSL',
      value: `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`,
      copyValue: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      tag: t.properties?.designUse ?? 'Design',
    },
    {
      label: t.properties?.hsv ?? 'HSV',
      value: `${hsv.h}°, ${hsv.s}%, ${hsv.v}%`,
      copyValue: `${hsv.h}, ${hsv.s}, ${hsv.v}`,
      tag: t.properties?.designUse ?? 'Design',
    },
    {
      label: t.properties?.lab ?? 'Lab',
      value: `${lab.L.toFixed(1)}, ${lab.a.toFixed(1)}, ${lab.b.toFixed(1)}`,
      copyValue: `${lab.L.toFixed(1)}, ${lab.a.toFixed(1)}, ${lab.b.toFixed(1)}`,
      tag: t.properties?.scienceUse ?? 'Science',
    },
    {
      label: t.properties?.luminance ?? 'Luminance',
      value: luminance.toFixed(3),
      copyValue: luminance.toFixed(3),
      tag: 'WCAG',
    },
  ]

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {t.properties?.title ?? 'Color Properties'}
      </h2>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3 py-3">
            <div className="w-16 shrink-0">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {row.label}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                {row.value}
              </span>
            </div>
            <span className="hidden shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 sm:inline-block dark:bg-zinc-800 dark:text-zinc-400">
              {row.tag}
            </span>
            <CopyButton
              text={row.copyValue}
              label=""
              icon={<CopyIcon className="h-3.5 w-3.5" />}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
