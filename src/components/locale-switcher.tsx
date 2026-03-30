'use client'

import { useRouter } from 'next/navigation'
import { locales, localeNames, type Locale } from '@/i18n/config'

export function LocaleSwitcher({ current }: { current: Locale }) {
  const router = useRouter()

  const handleChange = (newLocale: string) => {
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`
    router.refresh()
  }

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      aria-label="Language"
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {localeNames[locale]}
        </option>
      ))}
    </select>
  )
}
