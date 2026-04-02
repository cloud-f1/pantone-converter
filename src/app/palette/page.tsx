import type { Metadata } from 'next'
import { getLocale } from '@/i18n/get-locale'
import { getDictionary } from '@/i18n/get-dictionary'
import { PaletteGenerator } from '@/components/palette-generator'
import { NavHeader } from '@/components/nav-header'

export const metadata: Metadata = {
  title: 'Palette Generator',
  description: 'Generate beautiful color palettes from any Pantone color',
}

export default async function PalettePage() {
  const locale = await getLocale()
  const t = await getDictionary(locale)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <NavHeader locale={locale} backLabel={t.color?.backToAll ?? 'All Colors'} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            {t.palette?.title ?? 'Palette Generator'}
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {t.palette?.subtitle ?? 'Generate beautiful color palettes from any Pantone color'}
          </p>
        </div>
        <PaletteGenerator dictionary={t} />
      </main>
    </div>
  )
}
