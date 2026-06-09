-- ============================================================
-- CIELO — Supabase Schema
-- ============================================================

-- ------------------------------------------------------------
-- Table: gallery_images
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery_images (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug            TEXT        UNIQUE,
  image_url       TEXT        NOT NULL,
  -- Legacy fallback (JP source)
  title           TEXT,
  description     TEXT,
  -- Multilingual titles
  title_jp        TEXT,
  title_en        TEXT,
  title_fr        TEXT,
  title_cn        TEXT,
  title_th        TEXT,
  -- Multilingual descriptions
  description_jp  TEXT,
  description_en  TEXT,
  description_fr  TEXT,
  description_cn  TEXT,
  description_th  TEXT,
  sort_order      INTEGER     DEFAULT 0,
  is_featured     BOOLEAN     DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Row Level Security
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy: public read
CREATE POLICY "Public read gallery_images"
  ON gallery_images
  FOR SELECT
  TO public
  USING (true);

-- Policy: service_role write (sync script uses service role key)
CREATE POLICY "Service role write gallery_images"
  ON gallery_images
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS gallery_images_sort_order_idx
  ON gallery_images (sort_order ASC, created_at DESC);

CREATE INDEX IF NOT EXISTS gallery_images_featured_idx
  ON gallery_images (is_featured, sort_order ASC)
  WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS gallery_images_slug_idx
  ON gallery_images (slug);

-- ------------------------------------------------------------
-- Storage Bucket: hero-images
-- ------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-images',
  'hero-images',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read hero-images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'hero-images');

CREATE POLICY "Service role manage hero-images"
  ON storage.objects FOR ALL
  TO service_role
  USING (bucket_id = 'hero-images')
  WITH CHECK (bucket_id = 'hero-images');

-- ------------------------------------------------------------
-- Migration: 既存テーブルに slug カラムを追加 (既に作成済みの場合)
-- ------------------------------------------------------------
-- ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
-- ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- ------------------------------------------------------------
-- Verification
-- ------------------------------------------------------------
-- SELECT slug, title, is_featured, sort_order FROM gallery_images ORDER BY sort_order;
-- SELECT * FROM storage.buckets WHERE id = 'hero-images';
