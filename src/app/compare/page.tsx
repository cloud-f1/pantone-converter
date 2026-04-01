import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from '@/i18n/get-locale'
import { getDictionary } from '@/i18n/get-dictionary'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { ColorCompare } from '@/components/color-compare'
import { ArrowLeftIcon } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Compare Colors',
  description: 'Compare Pantone colors side by side and measure perceptual difference with Delta E (CIEDE2000)',
  openGraph: {
    title: 'Color Comparison — Pantone Converter',
    description: 'Compare Pantone colors side by side with Delta E (CIEDE2000)',
    images: [{ url: '/api/og/compare', width: 1200, height: 630 }],
  },
}

export default async function ComparePage() {
  const locale = await getLocale()
  const t = await getDictionary(locale)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Top bar */}
      <header className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {t.color.backToAll}
          </Link>
          <LocaleSwitcher current={locale} />
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            {t.compare.title}
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {t.compare.subtitle}
          </p>
        </div>

        <ColorCompare dictionary={t} />
      </main>
    </div>
  )
}
