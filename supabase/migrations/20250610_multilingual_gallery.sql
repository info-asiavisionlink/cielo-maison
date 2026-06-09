-- ============================================================
-- CIELO — Multilingual Gallery Migration
-- gallery_images へ多言語カラムを追加
-- ============================================================

-- title (多言語)
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS title_jp   TEXT;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS title_en   TEXT;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS title_fr   TEXT;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS title_cn   TEXT;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS title_th   TEXT;

-- description (多言語)
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS description_jp TEXT;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS description_fr TEXT;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS description_cn TEXT;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS description_th TEXT;

-- 既存の title / description を JP の初期値としてコピー
UPDATE gallery_images
SET
  title_jp       = title,
  description_jp = description
WHERE title_jp IS NULL OR description_jp IS NULL;

-- ============================================================
-- Verification
-- ============================================================
-- SELECT slug, title, title_jp, title_en, description_jp, description_en
-- FROM gallery_images
-- ORDER BY sort_order
-- LIMIT 5;
