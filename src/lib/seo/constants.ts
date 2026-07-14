/** Canonical domain with env fallback. Drives metadataBase, sitemap, and robots. */
export const CANONICAL_DOMAIN =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://ypfelpuente.com.ar'

export const SITE_NAME = 'YPF El Puente'
export const DEFAULT_LOCALE = 'es_AR'
export const OG_TYPE = 'website'
