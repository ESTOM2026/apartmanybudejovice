import type { Lang } from './ui';

export type PageKey = 'home' | 'apartment' | 'business' | 'about' | 'contact';

export const routes: Record<PageKey, Record<Lang, string>> = {
  home:      { cs: '/',          en: '/en',                 de: '/de' },
  apartment: { cs: '/apartman',  en: '/en/apartment',       de: '/de/apartment' },
  business:  { cs: '/pro-firmy', en: '/en/for-companies',   de: '/de/fuer-firmen' },
  about:     { cs: '/o-nas',     en: '/en/about',           de: '/de/ueber-uns' },
  contact:   { cs: '/kontakt',   en: '/en/contact',         de: '/de/kontakt' },
};

export function getRoute(key: PageKey, lang: Lang): string {
  return routes[key][lang];
}

export function getAlternates(key: PageKey): Record<Lang, string> {
  return routes[key];
}
