import solid from '@astrojs/solid-js';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  outDir: '../../dist/apps/docs',
  site: 'https://notymail.dafnik.me',
  integrations: [
    solid({ devtools: true }),
    tailwind({
      configFile: fileURLToPath(
        new URL('./tailwind.config.cjs', import.meta.url),
      ),
    }),
    starlight({
      title: 'notymail',
      editLink: {
        baseUrl: 'https://github.com/notymail/core/edit/main/apps/docs/',
      },
      customCss: ['./src/styles/custom.css'],
      social: {
        github: 'https://github.com/notymail/core',
      },
      favicon: '/favicon.png',
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Installation', link: '/getting-started/installation' },
            { label: 'Updating', link: '/getting-started/update' },
            { label: 'Reverse proxy', link: '/getting-started/reverse-proxy' },
          ],
        },
        {
          label: 'Usage',
          items: [
            { label: 'curl', link: '/usage/curl' },
            { label: 'fetch', link: '/usage/fetch' },
            {
              label: 'Swagger Docs',
              link: 'https://private.notymail.dafnik.me/docs',
            },
          ],
        },
      ],
    }),
  ],
});
