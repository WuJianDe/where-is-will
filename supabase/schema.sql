-- ============================================================
-- 威力在哪裡 - Supabase 資料庫設定
-- 在 Supabase SQL Editor 執行此檔案
-- ============================================================

-- 1. 建立排行榜資料表
CREATE TABLE IF NOT EXISTS scores (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL CHECK (length(name) >= 1 AND length(name) <= 50),
  email      TEXT        NOT NULL CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  time_ms    INTEGER     NOT NULL CHECK (time_ms > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 加速排名查詢的索引
CREATE INDEX IF NOT EXISTS scores_time_ms_idx ON scores (time_ms ASC);

-- 3. 啟用 Row Level Security
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- 4. 允許所有人寫入成績（前端提交）
CREATE POLICY "allow_public_insert" ON scores
  FOR INSERT TO anon
  WITH CHECK (
    length(name) >= 1 AND
    length(name) <= 50 AND
    time_ms > 0
  );

-- 5. 建立公開排行榜 View（不含 Email，給前端使用）
CREATE OR REPLACE VIEW public_scores AS
  SELECT id, name, time_ms, created_at
  FROM scores
  ORDER BY time_ms ASC;

-- 6. 允許匿名用戶查詢公開 View
GRANT SELECT ON public_scores TO anon;
