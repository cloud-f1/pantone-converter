import type { Metadata } from 'next'
import { getLocale } from '@/i18n/get-locale'
import { getDictionary } from '@/i18n/get-dictionary'
import { PaletteBrowser } from '@/components/palette-browser'
import { NavHeader } from '@/components/nav-header'

export const metadata: Metadata = {
  title: 'Curated Palettes',
  description: 'Browse curated Pantone color palettes for designers',
}

export default async function PalettesPage() {
  const locale = await getLocale()
  const t = await getDictionary(locale)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <NavHeader locale={locale} backLabel={t.color?.backToAll ?? 'All Colors'} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            {t.palettes?.title ?? 'Curated Palettes'}
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {t.palettes?.subtitle ?? 'Hand-picked Pantone color palettes for designers'}
          </p>
        </div>
        <PaletteBrowser />
      </main>
    </div>
  )
}
