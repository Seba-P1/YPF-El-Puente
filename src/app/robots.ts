import { MetadataRoute } from 'next'
import { CANONICAL_DOMAIN } from '@/lib/seo/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/full'],
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${CANONICAL_DOMAIN}/sitemap.xml`,
  }
}
