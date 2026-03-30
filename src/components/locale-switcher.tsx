'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import { locales, localeNames, type Locale } from '@/i18n/config'

const localeFlags: Record<Locale, string> = {
  en: 'EN',
  'zh-tw': '繁',
  'zh-cn': '简',
}

function setLocaleCookie(locale: string) {
  document.cookie = `locale=${locale};path=/;max-age=31536000`
}

export function LocaleSwitcher({ current }: { current: Locale }) {
  const router = useRouter()

  const handleChange = useCallback((newLocale: Locale) => {
    if (newLocale === current) return
    setLocaleCookie(newLocale)
    toast.success(`Language changed to ${localeNames[newLocale]}`)
    router.refresh()
  }, [router, current])

  return (
    <Menu as="div" className="relative">
      <MenuButton className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white/80 px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-violet-500 to-cyan-500 text-[10px] font-bold text-white">
          {localeFlags[current]}
        </span>
        <span>{localeNames[current]}</span>
        <svg
          className="h-4 w-4 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </MenuButton>

      <MenuItems
        transition
        className="absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-xl border border-zinc-200 bg-white p-1 shadow-lg ring-1 ring-black/5 transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 dark:border-zinc-700 dark:bg-zinc-800 dark:ring-white/5"
      >
        {locales.map((locale) => (
          <MenuItem key={locale}>
            <button
              onClick={() => handleChange(locale)}
              className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors data-[focus]:bg-violet-50 dark:data-[focus]:bg-violet-950/50"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-violet-500 to-cyan-500 text-[10px] font-bold text-white">
                {localeFlags[locale]}
              </span>
              <div className="flex flex-col items-start">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {localeNames[locale]}
                </span>
              </div>
              {locale === current && (
                <svg
                  className="ml-auto h-4 w-4 text-violet-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}
