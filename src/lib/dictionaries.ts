import 'server-only'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  ko: () => import('@/dictionaries/ko.json').then((module) => module.default),
  ja: () => import('@/dictionaries/ja.json').then((module) => module.default),
  th: () => import('@/dictionaries/th.json').then((module) => module.default),
  vi: () => import('@/dictionaries/vi.json').then((module) => module.default),
  de: () => import('@/dictionaries/de.json').then((module) => module.default),
  fr: () => import('@/dictionaries/fr.json').then((module) => module.default),
  "zh-CN": () => import('@/dictionaries/zh-CN.json').then((module) => module.default),
  "zh-TW": () => import('@/dictionaries/zh-TW.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
  return dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.en()
}
