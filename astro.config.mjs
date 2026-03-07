import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

const site = 'https://sentry01.github.io';
const base = '/Shlomi';

// Build the set of full URLs for blog mirrors whose canonical lives outside
// the local site base so we can exclude them from the generated sitemap.
function getMirrorBlogUrls() {
  const blogDir = './src/content/blog';
  const urls = new Set();
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;

  for (const file of readdirSync(blogDir)) {
    if (!file.endsWith('.md')) continue;
    const content = readFileSync(`${blogDir}/${file}`, 'utf-8');
    const match = content.match(
      /^canonical:\s*['"]?(https?:\/\/[^\s'"]+)['"]?\s*$/m,
    );
    if (!match) continue;
    try {
      const url = new URL(match[1]);
      if (
        url.origin !== new URL(site).origin ||
        !url.pathname.startsWith(normalizedBase)
      ) {
        const slug = file.replace(/\.md$/, '');
        urls.add(`${site}${normalizedBase}blog/${slug}/`);
      }
    } catch {
      /* skip unparseable canonical */
    }
  }
  return urls;
}

const mirrorUrls = getMirrorBlogUrls();

export default defineConfig({
  output: 'static',
  site,
  base,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !mirrorUrls.has(page),
    }),
  ],
});
