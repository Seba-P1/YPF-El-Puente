import { MetadataRoute } from 'next'
import { CANONICAL_DOMAIN } from '@/lib/seo/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: CANONICAL_DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${CANONICAL_DOMAIN}/full`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${CANONICAL_DOMAIN}/combustibles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${CANONICAL_DOMAIN}/full/menu`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]
}
