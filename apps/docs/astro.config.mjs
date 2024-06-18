import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';
import starlight from '@astrojs/starlight';
import solid from '@astrojs/solid-js';

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
        baseUrl: 'https://github.com/dafnik/notymail/edit/main/apps/docs/',
      },
      customCss: ['./src/styles/custom.css'],
      social: {
        github: 'https://github.com/Dafnik/notymail',
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
