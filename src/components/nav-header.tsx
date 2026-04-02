import Link from 'next/link'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { ArrowLeftIcon } from '@/components/icons'
import type { Locale } from '@/i18n/config'

type Props = {
  locale: Locale
  backLabel: string
}

const NAV_LINKS = [
  { href: '/', label: 'Colors' },
  { href: '/compare', label: 'Compare' },
  { href: '/palette', label: 'Palette' },
  { href: '/palettes', label: 'Curated' },
  { href: '/wheel', label: 'Wheel' },
]

export function NavHeader({ locale, backLabel }: Props) {
  return (
    <header className="border-b border-zinc-200 bg-white px-4 py-3 sm:px-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-1 overflow-x-auto">
          <Link
            href="/"
            className="mr-2 flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{backLabel}</span>
          </Link>
          <nav className="flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <LocaleSwitcher current={locale} />
      </div>
    </header>
  )
}
