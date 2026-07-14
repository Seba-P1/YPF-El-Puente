import type { Metadata } from 'next'
import { DEFAULT_LOCALE, OG_TYPE, SITE_NAME } from './constants'

interface PageMetaInput {
  title: string
  description: string
  keywords?: string[]
  canonical: string
}

/** Builds page metadata with canonical and text-only OpenGraph. */
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
