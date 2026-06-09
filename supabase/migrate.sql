-- ============================================================
-- CIELO — Migration
-- 既存の gallery_images テーブルへ slug カラムを追加
-- Supabaseダッシュボード > SQL Editor で実行してください
-- ============================================================

ALTER TABLE gallery_images
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

ALTER TABLE gallery_images
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS gallery_images_slug_idx
  ON gallery_images (slug);

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS gallery_images_updated_at ON gallery_images;
CREATE TRIGGER gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ストレージポリシー: service_role による管理
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
    AND policyname = 'Service role manage hero-images'
  ) THEN
    EXECUTE $pol$
      CREATE POLICY "Service role manage hero-images"
        ON storage.objects FOR ALL
        TO service_role
        USING (bucket_id = 'hero-images')
        WITH CHECK (bucket_id = 'hero-images')
    $pol$;
  END IF;
END $$;

SELECT 'Migration complete' AS status;
