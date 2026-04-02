import type { Metadata } from 'next'
import { getLocale } from '@/i18n/get-locale'
import { getDictionary } from '@/i18n/get-dictionary'
import { ColorCompare } from '@/components/color-compare'
import { NavHeader } from '@/components/nav-header'

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
      <NavHeader locale={locale} backLabel={t.color?.backToAll ?? 'All Colors'} />

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
