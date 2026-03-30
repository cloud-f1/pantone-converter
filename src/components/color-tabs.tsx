'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import type { PantoneEntry } from '@/features/color/data/pantone-map'
import { getRelativeLuminance } from '@/features/color/lib/color-utils'

type SortOption = 'default' | 'name-asc' | 'name-desc' | 'light' | 'dark' | 'code'

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'default', label: 'Default' },
  { key: 'name-asc', label: 'Name A→Z' },
  { key: 'name-desc', label: 'Name Z→A' },
  { key: 'light', label: 'Light → Dark' },
  { key: 'dark', label: 'Dark → Light' },
  { key: 'code', label: 'Code Numeric' },
]

const FAMILY_TABS = [
  { key: 'all', label: 'All' },
  { key: 'red', label: 'Reds' },
  { key: 'orange', label: 'Oranges' },
  { key: 'yellow', label: 'Yellows' },
  { key: 'green', label: 'Greens' },
  { key: 'teal', label: 'Teals' },
  { key: 'blue', label: 'Blues' },
  { key: 'purple', label: 'Purples' },
  { key: 'pink', label: 'Pinks' },
  { key: 'brown', label: 'Browns' },
  { key: 'neutral', label: 'Neutrals' },
] as const

const SERIES_TABS = [
  { key: 'all', label: 'All' },
  { key: '0xx', label: '0xx', range: [0, 99] as const },
  { key: '1xx', label: '1xx', range: [100, 199] as const },
  { key: '2xx', label: '2xx', range: [200, 299] as const },
  { key: '3xx', label: '3xx', range: [300, 399] as const },
  { key: '4xx', label: '4xx', range: [400, 499] as const },
  { key: '5xx', label: '5xx', range: [500, 599] as const },
  { key: '6xx', label: '6xx', range: [600, 699] as const },
  { key: '7xx', label: '7xx', range: [700, 799] as const },
  { key: '1xxx', label: '1xxx', range: [1000, 1999] as const },
  { key: '2xxx', label: '2xxx', range: [2000, 2999] as const },
  { key: '3xxx', label: '3xxx', range: [3000, 3999] as const },
  { key: '4xxx', label: '4xxx', range: [4000, 4999] as const },
  { key: '7xxx', label: '7xxx', range: [7000, 7999] as const },
  { key: 'named', label: 'Named' },
]

type ColorTabsProps = {
  entries: [string, PantoneEntry][]
}

function getNumericPrefix(key: string): number | null {
  const match = key.match(/^(\d+)/)
  return match ? parseInt(match[1], 10) : null
}

function filterBySeries(entries: [string, PantoneEntry][], tabKey: string) {
  if (tabKey === 'named') {
    return entries.filter(([key]) => getNumericPrefix(key) === null)
  }
  const tab = SERIES_TABS.find((t) => t.key === tabKey)
  if (!tab || !('range' in tab) || !tab.range) return entries
  const [min, max] = tab.range as readonly [number, number]
  return entries.filter(([key]) => {
    const num = getNumericPrefix(key)
    return num !== null && num >= min && num <= max
  })
}

function countBySeries(entries: [string, PantoneEntry][], tabKey: string) {
  if (tabKey === 'all') return entries.length
  return filterBySeries(entries, tabKey).length
}

export function ColorTabs({ entries }: ColorTabsProps) {
  const [mode, setMode] = useState<'family' | 'series'>('family')
  const [activeTab, setActiveTab] = useState('all')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('default')

  const filtered = (() => {
    if (activeTab === 'all') return entries
    if (mode === 'family') {
      return entries.filter(([, entry]) => entry.family === activeTab)
    }
    return filterBySeries(entries, activeTab)
  })()

  const searched = query
    ? filtered.filter(([key, { hex, name }]) => {
        const q = query.toLowerCase()
        return key.toLowerCase().includes(q)
          || name.toLowerCase().includes(q)
          || hex.toLowerCase().includes(q)
      })
    : filtered

  const sorted = [...searched].sort((a, b) => {
    const [keyA, entryA] = a
    const [keyB, entryB] = b
    switch (sortBy) {
      case 'name-asc': return entryA.name.localeCompare(entryB.name)
      case 'name-desc': return entryB.name.localeCompare(entryA.name)
      case 'light': return getRelativeLuminance(entryB.hex) - getRelativeLuminance(entryA.hex)
      case 'dark': return getRelativeLuminance(entryA.hex) - getRelativeLuminance(entryB.hex)
      case 'code': {
        const numA = parseInt(keyA) || 9999
        const numB = parseInt(keyB) || 9999
        return numA - numB
      }
      default: return 0
    }
  })

  const tabs = mode === 'family' ? FAMILY_TABS : SERIES_TABS

  const getCount = (tabKey: string) => {
    if (tabKey === 'all') return entries.length
    if (mode === 'family') {
      return entries.filter(([, e]) => e.family === tabKey).length
    }
    return countBySeries(entries, tabKey)
  }

  return (
    <section id="colors">
      {/* Search + Sort row */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search colors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 5.1 5.1a7.5 7.5 0 0 0 11.55 11.55z" />
          </svg>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <Menu as="div" className="relative">
          <MenuButton className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
            <span>{SORT_OPTIONS.find((o) => o.key === sortBy)?.label ?? 'Sort'}</span>
            <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </MenuButton>
          <MenuItems
            transition
            className="absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-xl border border-zinc-200 bg-white p-1 shadow-lg ring-1 ring-black/5 transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 dark:border-zinc-700 dark:bg-zinc-800 dark:ring-white/5"
          >
            {SORT_OPTIONS.map((opt) => (
              <MenuItem key={opt.key}>
                <button
                  onClick={() => setSortBy(opt.key)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors data-[focus]:bg-violet-50 dark:data-[focus]:bg-violet-950/50"
                >
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{opt.label}</span>
                  {opt.key === sortBy && (
                    <svg className="h-4 w-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </div>

      {/* Mode toggle */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
          <button
            onClick={() => { setMode('family'); setActiveTab('all') }}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === 'family'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            By Color
          </button>
          <button
            onClick={() => { setMode('series'); setActiveTab('all') }}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === 'series'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            By Series
          </button>
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Showing {sorted.length} of {entries.length} colors
        </p>
      </div>

      {/* Tab pills */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const count = getCount(tab.key)
          if (count === 0 && tab.key !== 'all') return null
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-60">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Empty state */}
      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
          <p className="text-lg font-medium">No colors found</p>
          <p className="mt-1 text-sm">Try a different search term or filter</p>
        </div>
      )}

      {/* Color grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {sorted.map(([key, { hex, name }]) => (
          <Link
            key={key}
            href={`/color/${key}`}
            className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-lg hover:ring-2 hover:ring-violet-400/50 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div
              className="aspect-square w-full"
              style={{ backgroundColor: hex }}
            />
            <div className="px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {name}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {hex.toUpperCase()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
