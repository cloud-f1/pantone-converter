'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { SwatchIcon, CompareIcon, PaletteIcon, StarIcon, WheelIcon, MenuIcon, XIcon } from '@/components/icons'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/get-dictionary'
import type { ReactNode } from 'react'

type Props = {
  locale: Locale
  dictionary: Dictionary
}

export function NavHeader({ locale, dictionary: t }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const links: { href: string; label: string; icon: ReactNode }[] = [
    { href: '/', label: t.nav?.colors ?? 'Colors', icon: <SwatchIcon className="h-5 w-5" /> },
    { href: '/compare', label: t.nav?.compare ?? 'Compare', icon: <CompareIcon className="h-5 w-5" /> },
    { href: '/palette', label: t.nav?.palette ?? 'Palette', icon: <PaletteIcon className="h-5 w-5" /> },
    { href: '/palettes', label: t.nav?.curated ?? 'Curated', icon: <StarIcon className="h-5 w-5" /> },
    { href: '/wheel', label: t.nav?.wheel ?? 'Wheel', icon: <WheelIcon className="h-5 w-5" /> },
  ]

  return (
    <header className="border-b border-zinc-200 bg-white px-4 py-3 sm:px-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xl font-medium transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 ${
                pathname === link.href
                  ? 'text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 sm:hidden dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          aria-label="Toggle menu"
        >
          {open ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>

        <LocaleSwitcher current={locale} />
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="mt-2 border-t border-zinc-200 pt-2 sm:hidden dark:border-zinc-800">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-md px-3 py-3 text-lg font-medium transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 ${
                pathname === link.href
                  ? 'text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
