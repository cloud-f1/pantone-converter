import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from '@/i18n/get-locale'
import { getDictionary } from '@/i18n/get-dictionary'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { ColorWheel } from '@/components/color-wheel'
import { ArrowLeftIcon } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Color Wheel',
  description: 'Interactive color wheel with Pantone color harmony visualization',
}

export default async function WheelPage() {
  const locale = await getLocale()
  const t = await getDictionary(locale)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
            <ArrowLeftIcon className="h-4 w-4" />
            {t.color?.backToAll ?? 'All Colors'}
          </Link>
          <LocaleSwitcher current={locale} />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            {t.wheel?.title ?? 'Color Wheel'}
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {t.wheel?.subtitle ?? 'Explore color harmonies on the wheel'}
          </p>
        </div>
        <ColorWheel dictionary={t} />
      </main>
    </div>
  )
}
