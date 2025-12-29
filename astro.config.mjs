// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://healthycatlitter.com',
  compressHTML: true,
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date()
    })
  ],
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    css: {
      modules: {
        localsConvention: 'camelCase'
      }
    }
  }
});
