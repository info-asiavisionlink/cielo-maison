import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ── Lazy singleton ────────────────────────────────────────────────────────────
// Never instantiate at module scope. Cloudflare Pages build runs module
// evaluation without env vars — calling createClient(undefined, undefined)
// throws "supabaseUrl is required" and fails prerendering.
let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    // Build time or missing config — return null, callers handle gracefully
    return null
  }

  _client = createClient(url, key)
  return _client
}

// ── Types ─────────────────────────────────────────────────────────────────────
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
