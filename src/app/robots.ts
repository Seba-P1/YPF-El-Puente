import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/full'],
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://ypfelpuente.com/sitemap.xml',
  }
}
