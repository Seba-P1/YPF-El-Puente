import { CANONICAL_DOMAIN } from '@/lib/seo/constants'

const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'YPF El Puente',
  telephone: '+5492920264433',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ruta Nacional 22 Km 857',
    addressLocality: 'Río Colorado',
    addressRegion: 'Río Negro',
    addressCountry: 'AR',
  },
  priceRange: '$$',
  servesCuisine: ['Hamburguesas', 'Cafetería', 'Comida rápida'],
  sameAs: ['https://www.instagram.com/ypf.elpuente'],
  image: `${CANONICAL_DOMAIN}/opengraph-image`,
  // TODO(client): openingHoursSpecification — horarios del negocio
  // TODO(client): geo — coordenadas GPS (latitude, longitude)
}

export default function LocalBusinessSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(restaurantSchema).replace(/</g, '\\u003c'),
      }}
    />
  )
}
