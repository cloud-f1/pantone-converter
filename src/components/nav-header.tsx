import Link from 'next/link'
import { LocaleSwitcher } from '@/components/locale-switcher'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/get-dictionary'

type Props = {
  locale: Locale
  dictionary: Dictionary
}

export function NavHeader({ locale, dictionary: t }: Props) {
  const links = [
    { href: '/', label: t.nav?.colors ?? 'Colors' },
    { href: '/compare', label: t.nav?.compare ?? 'Compare' },
    { href: '/palette', label: t.nav?.palette ?? 'Palette' },
    { href: '/palettes', label: t.nav?.curated ?? 'Curated' },
    { href: '/wheel', label: t.nav?.wheel ?? 'Wheel' },
  ]

  return (
    <header className="border-b border-zinc-200 bg-white px-4 py-3 sm:px-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <nav className="flex items-center gap-0.5 overflow-x-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <LocaleSwitcher current={locale} />
      </div>
    </header>
  )
}
