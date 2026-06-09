import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

export const supabase = createClient(url, key)

export type GalleryImage = {
  id: string
  image_url: string
  // Legacy fallback columns (always present)
  title: string | null
  description: string | null
  // Multilingual columns — populated by scripts/translate-gallery.ts
  title_jp: string | null
  title_en: string | null
  title_fr: string | null
  title_cn: string | null
  title_th: string | null
  description_jp: string | null
  description_en: string | null
  description_fr: string | null
  description_cn: string | null
  description_th: string | null
  sort_order: number
  is_featured: boolean
  created_at: string
}
