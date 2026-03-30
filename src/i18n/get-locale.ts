import { cookies } from 'next/headers'
import { defaultLocale, locales, type Locale } from './config'

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('locale')?.value
  if (localeCookie && locales.includes(localeCookie as Locale)) {
    return localeCookie as Locale
  }
  return defaultLocale
}
