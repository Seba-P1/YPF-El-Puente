import type { Metadata } from 'next'
import { DEFAULT_LOCALE, OG_TYPE, SITE_NAME } from './constants'

const OG_IMAGE_ALT = 'YPF El Puente — Río Colorado'

interface PageMetaInput {
  title: string
  description: string
  keywords?: string[]
  canonical: string
  /** Relative path to the OG image, e.g. '/opengraph-image' */
  image?: string
}

/** Builds page metadata with canonical and OpenGraph (with optional OG image). */
export function createPageMetadata(input: PageMetaInput): Metadata {
  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: input.canonical },
    openGraph: {
      title: input.title,
      description: input.description,
      locale: DEFAULT_LOCALE,
      type: OG_TYPE,
      siteName: SITE_NAME,
      images: input.image
        ? [{ url: input.image, width: 1200, height: 630, alt: OG_IMAGE_ALT }]
        : undefined,
    },
  }
}

/** Builds no-index metadata for error pages. */
export function createNoIndexMetadata(
  title: string,
  description: string
): Metadata {
  return {
    title,
    description,
    robots: { index: false },
  }
}
