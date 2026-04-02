'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getPantoneColor } from '@/features/color/data/pantone-map'
import { getContrastTextColor } from '@/features/color/lib/color-utils'
import { CURATED_PALETTES, PALETTE_THEMES, type PaletteTheme } from '@/features/color/data/curated-palettes'
import { CopyButton } from '@/components/copy-button'
import { CopyIcon } from '@/components/icons'
export function PaletteBrowser() {
  const [activeTheme, setActiveTheme] = useState<PaletteTheme | 'all'>('all')

  const filtered = activeTheme === 'all'
    ? CURATED_PALETTES
    : CURATED_PALETTES.filter(p => p.theme === activeTheme)

  return (
    <div className="space-y-6">
      {/* Theme tabs */}
      <div className="flex flex-wrap gap-1.5">
        {PALETTE_THEMES.map((theme) => {
          const count = theme.key === 'all'
            ? CURATED_PALETTES.length
            : CURATED_PALETTES.filter(p => p.theme === theme.key).length
          if (count === 0 && theme.key !== 'all') return null
          return (
            <button
              key={theme.key}
              onClick={() => setActiveTheme(theme.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeTheme === theme.key
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
            >
              {theme.label}
              <span className="ml-1 text-[10px] opacity-60">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Palette grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((palette) => {
          const copyText = palette.colors.join(', ')
          return (
            <div key={palette.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              {/* Color bars */}
              <div className="flex flex-col">
                {palette.colors.map((code) => {
                  const entry = getPantoneColor(code)
                  const hex = entry?.hex ?? '#808080'
                  const textColor = getContrastTextColor(hex)
                  return (
                    <Link
                      key={code}
                      href={`/color/${code}`}
                      className="flex items-center justify-between px-4 py-6 transition-opacity hover:opacity-90"
                      style={{ backgroundColor: hex }}
                    >
                      <span className="text-sm font-semibold" style={{ color: textColor }}>
                        {entry?.name ?? code}
                      </span>
                      <span className="text-xs opacity-70" style={{ color: textColor }}>
                        {hex.toUpperCase()}
                      </span>
                    </Link>
                  )
                })}
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{palette.name}</p>
                  <p className="text-xs capitalize text-zinc-400">{palette.theme}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CopyButton text={copyText} label="" icon={<CopyIcon className="h-3.5 w-3.5" />} />
                  <Link
                    href={`/compare?colors=${palette.colors.join(',')}`}
                    className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    Compare
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
