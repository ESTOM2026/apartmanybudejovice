// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://apartmanybudejovice.cz',
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'cs',
    locales: ['cs', 'en', 'de'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'cs',
        locales: {
          cs: 'cs-CZ',
          en: 'en-US',
          de: 'de-DE',
        },
      },
    }),
  ],
  image: {
    responsiveStyles: true,
  },
});
