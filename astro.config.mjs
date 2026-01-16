// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://healthycatlitter.com',
  adapter: vercel(),
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
