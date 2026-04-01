'use client'

import { useState, useMemo } from 'react'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/react'
import { PANTONE_MAP } from '@/features/color/data/pantone-map'

type ColorSearchInputProps = {
  value: string | null
  onChange: (code: string | null) => void
  placeholder?: string
}

const allEntries = Object.entries(PANTONE_MAP)

export function ColorSearchInput({ value, onChange, placeholder = 'Search Pantone...' }: ColorSearchInputProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query) return allEntries.slice(0, 30)
    const q = query.toLowerCase()
    return allEntries
      .filter(([key, { hex, name }]) =>
        key.toLowerCase().includes(q) ||
        name.toLowerCase().includes(q) ||
        hex.toLowerCase().includes(q)
      )
      .slice(0, 50)
  }, [query])

  const selectedEntry = value ? PANTONE_MAP[value] : null

  if (value && selectedEntry) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800">
        <span
          className="h-5 w-5 shrink-0 rounded border border-zinc-200 dark:border-zinc-600"
          style={{ backgroundColor: selectedEntry.hex }}
        />
        <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {selectedEntry.name}
        </span>
        <span className="text-xs text-zinc-400">{selectedEntry.hex}</span>
        <button
          onClick={() => onChange(null)}
          className="ml-auto shrink-0 rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative">
        <ComboboxInput
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          placeholder={placeholder}
          onChange={(e) => setQuery(e.target.value)}
          displayValue={() => query}
        />
        <ComboboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-zinc-400">No colors found</div>
          ) : (
            filtered.map(([key, entry]) => (
              <ComboboxOption
                key={key}
                value={key}
                className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm data-[focus]:bg-violet-50 dark:data-[focus]:bg-violet-950/50"
              >
                <span
                  className="h-5 w-5 shrink-0 rounded border border-zinc-200 dark:border-zinc-600"
                  style={{ backgroundColor: entry.hex }}
                />
                <span className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                  {entry.name}
                </span>
                <span className="ml-auto text-xs text-zinc-400">{entry.hex}</span>
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  )
}
