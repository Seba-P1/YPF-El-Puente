interface MenuSchemaSection {
  name: string
  products: { name: string; price: number }[]
}

interface MenuSchemaProps {
  sections: MenuSchemaSection[]
}

function buildMenuSchema(sections: MenuSchemaSection[]) {
  const validSections = sections
    .map((s) => ({
      ...s,
      products: s.products.filter((p) => p.price > 0),
    }))
    .filter((s) => s.products.length > 0)

  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'Menú FULL — YPF El Puente',
    hasMenuSection: validSections.map((s) => ({
      '@type': 'MenuSection',
      name: s.name,
      hasMenuItem: s.products.map((p) => ({
        '@type': 'MenuItem',
        name: p.name,
        offers: {
          '@type': 'Offer',
          price: p.price.toFixed(2),
          priceCurrency: 'ARS',
        },
      })),
    })),
  }
}

export default function MenuSchema({ sections }: MenuSchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildMenuSchema(sections)).replace(
          /</g,
          '\\u003c'
        ),
      }}
    />
  )
}
