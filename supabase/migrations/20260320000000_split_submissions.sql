-- ============================================================
-- Migration: Split generic "submissions" into typed tables
--
-- SAFETY: The old table is renamed to "submissions_backup".
--         No data is deleted. You can DROP it after verification.
-- ============================================================

BEGIN;

-- ----------------------------------------------------------
-- 1. Create unet_submissions with typed NOT NULL columns
-- ----------------------------------------------------------
CREATE TABLE unet_submissions (
  id              BIGSERIAL PRIMARY KEY,
  group_name      TEXT NOT NULL UNIQUE,
  project_private_repo_url TEXT,
  github_username TEXT,
  miou            REAL NOT NULL CHECK (miou >= 0),
  dice_score      REAL NOT NULL CHECK (dice_score >= 0),
  fwiou           REAL NOT NULL CHECK (fwiou >= 0),
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------
-- 2. Create orbslam3_submissions with dataset_key column
-- ----------------------------------------------------------
CREATE TABLE orbslam3_submissions (
  id              BIGSERIAL PRIMARY KEY,
  dataset_key     TEXT NOT NULL,
  group_name      TEXT NOT NULL,
  project_private_repo_url TEXT,
  github_username TEXT,
  ate_rmse_m                  REAL NOT NULL CHECK (ate_rmse_m >= 0),
  rpe_trans_drift_m_per_m     REAL NOT NULL CHECK (rpe_trans_drift_m_per_m >= 0),
  completeness_pct            REAL NOT NULL CHECK (completeness_pct >= 0 AND completeness_pct <= 100),
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(dataset_key, group_name)
);

-- ----------------------------------------------------------
-- 3. Migrate UNet data (skip rows with missing metrics)
-- ----------------------------------------------------------
INSERT INTO unet_submissions
  (group_name, project_private_repo_url, github_username, miou, dice_score, fwiou, submitted_at)
SELECT
  group_name,
  project_private_repo_url,
  github_username,
  (metrics->>'miou')::REAL,
  (metrics->>'dice_score')::REAL,
  (metrics->>'fwiou')::REAL,
  COALESCE(submitted_at, now())
FROM submissions
WHERE leaderboard_type = 'unet'
  AND metrics->>'miou'       IS NOT NULL
  AND metrics->>'dice_score' IS NOT NULL
  AND metrics->>'fwiou'      IS NOT NULL;

-- ----------------------------------------------------------
-- 4. Migrate ORB-SLAM3 data
--    "orbslam3"          → dataset_key = 'AMtown02'  (legacy default)
--    "orbslam3:AMtown01" → dataset_key = 'AMtown01'
-- ----------------------------------------------------------
INSERT INTO orbslam3_submissions
  (dataset_key, group_name, project_private_repo_url, github_username,
   ate_rmse_m, rpe_trans_drift_m_per_m, completeness_pct,
   submitted_at)
SELECT
  CASE
    WHEN leaderboard_type = 'orbslam3' THEN 'AMtown02'
    ELSE REPLACE(leaderboard_type, 'orbslam3:', '')
  END,
  group_name,
  project_private_repo_url,
  github_username,
  (metrics->>'ate_rmse_m')::REAL,
  (metrics->>'rpe_trans_drift_m_per_m')::REAL,
  (metrics->>'completeness_pct')::REAL,
  COALESCE(submitted_at, now())
FROM submissions
WHERE leaderboard_type LIKE 'orbslam3%'
  AND metrics->>'ate_rmse_m'                 IS NOT NULL
  AND metrics->>'rpe_trans_drift_m_per_m'    IS NOT NULL
  AND metrics->>'completeness_pct'           IS NOT NULL;

-- ----------------------------------------------------------
-- 5. Rename old table as backup (data preserved)
-- ----------------------------------------------------------
ALTER TABLE submissions RENAME TO submissions_backup;

-- ----------------------------------------------------------
-- 6. Row Level Security — allow anon read + upsert
-- ----------------------------------------------------------
ALTER TABLE unet_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orbslam3_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_unet" ON unet_submissions
  FOR SELECT USING (true);
CREATE POLICY "anon_insert_unet" ON unet_submissions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_unet" ON unet_submissions
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "anon_select_orbslam3" ON orbslam3_submissions
  FOR SELECT USING (true);
CREATE POLICY "anon_insert_orbslam3" ON orbslam3_submissions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_orbslam3" ON orbslam3_submissions
  FOR UPDATE USING (true) WITH CHECK (true);

COMMIT;
