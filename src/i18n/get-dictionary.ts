import type { Locale } from './config'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((m) => m.default),
  'zh-tw': () => import('./dictionaries/zh-tw.json').then((m) => m.default),
  'zh-cn': () => import('./dictionaries/zh-cn.json').then((m) => m.default),
}

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)['en']>>

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}
