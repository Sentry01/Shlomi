/**
 * Shared helpers for blog post canonical-URL handling.
 *
 * A post whose `canonical` URL resolves outside the local site
 * origin + base path is treated as a **mirror** of an externally-published
 * original. These mirrors still render locally but are excluded from the
 * sitemap and marked `noindex,follow`.
 */

const SITE = 'https://sentry01.github.io';
const BASE = '/Shlomi';

/**
 * Returns `true` when the canonical URL lives outside the local site base.
 */
export function isExternalCanonical(canonical: string | undefined): boolean {
  if (!canonical) return false;
  try {
    const url = new URL(canonical);
    const siteOrigin = new URL(SITE).origin;
    if (url.origin !== siteOrigin) return true;
    const normalizedBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
    return !url.pathname.startsWith(normalizedBase);
  } catch {
    return false;
  }
}

/** Derive the local route path for a blog content entry id. */
export const blogSlug = (id: string) => id.replace(/\.md$/, '');
