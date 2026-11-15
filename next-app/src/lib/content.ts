import siteContent from '@/content/site.json';

export type Locale = 'en' | 'hi';

export function getContent(locale: Locale) {
  return siteContent;
}

export function t(locale: Locale, path: string): string {
  const keys = path.split('.');
  let value: unknown = siteContent;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  if (typeof value === 'object' && value !== null && locale in value) {
    return (value as Record<string, string>)[locale];
  }
  return path;
}

export function getSiteContent() {
  return siteContent;
}