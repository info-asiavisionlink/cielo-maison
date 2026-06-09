import type { GalleryImage } from './supabase'
import type { Locale } from '@/contexts/i18n'

type LocaleKey = Lowercase<Locale>

/**
 * Returns the localized title for a gallery work.
 * Falls back: locale column → title_jp → title (legacy)
 */
export function localizedTitle(image: GalleryImage, locale: Locale): string | null {
  const col = `title_${locale.toLowerCase() as LocaleKey}` as keyof GalleryImage
  return (image[col] as string | null)
    ?? image.title_jp
    ?? image.title
}

/**
 * Returns the localized description for a gallery work.
 * Falls back: locale column → description_jp → description (legacy)
 */
export function localizedDescription(image: GalleryImage, locale: Locale): string | null {
  const col = `description_${locale.toLowerCase() as LocaleKey}` as keyof GalleryImage
  return (image[col] as string | null)
    ?? image.description_jp
    ?? image.description
}
