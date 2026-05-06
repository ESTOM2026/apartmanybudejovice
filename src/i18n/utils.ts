import { ui, defaultLang, languages, type Lang, type UIKey } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, segment] = url.pathname.split('/');
  if (segment in languages) return segment as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

export function getLocalizedPath(lang: Lang, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return cleanPath === '/' ? '/' : cleanPath;
  return cleanPath === '/' ? `/${lang}` : `/${lang}${cleanPath}`;
}

export function getAlternateLanguagePath(currentLang: Lang, targetLang: Lang, currentPath: string): string {
  let basePath = currentPath;
  if (currentLang !== defaultLang) {
    basePath = currentPath.replace(new RegExp(`^/${currentLang}`), '') || '/';
  }
  return getLocalizedPath(targetLang, basePath);
}

export { languages, defaultLang };
export type { Lang };
