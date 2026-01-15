// Leaderboard entry types for different competitions

export type LeaderboardType = 'unet' | 'orbslam3';

// Base interface for all leaderboard entries
export interface BaseLeaderboardEntry {
  groupName: string;
  projectPrivateRepoUrl?: string;
  githubUsername?: string;
  submissionDate?: string;
  rank?: number;
}

// UNet (Image Segmentation) metrics
export interface UNetEntry extends BaseLeaderboardEntry {
  dice_score: number;    // Dice Score (higher is better)
  miou: number;          // Mean Intersection over Union (higher is better)
  fwiou: number;         // Frequency Weighted IoU (higher is better)
}

// ORB-SLAM3 (Visual SLAM) metrics
export interface OrbSlam3Entry extends BaseLeaderboardEntry {
  ate_rmse_m: number;                  // Absolute Trajectory Error RMSE (lower is better)
  rpe_trans_drift_m_per_m: number;     // RPE Translation Drift (lower is better)
  rpe_rot_drift_deg_per_100m: number;  // RPE Rotation Drift (lower is better)
  completeness_pct: number;            // Completeness % (higher is better)
}

// Union type for all entries
export type LeaderboardEntry = UNetEntry | OrbSlam3Entry;

// Configuration for each leaderboard
export interface LeaderboardConfig {
  type: LeaderboardType;
  title: string;
  description: string;
  metrics: MetricConfig[];
}

export interface MetricConfig {
  key: string;
  label: string;
  unit?: string;
  higherIsBetter: boolean;
  format?: (value: number) => string;
}

// API response types
export interface LeaderboardResponse<T extends LeaderboardEntry> {
  success: boolean;
  data: T[];
  lastUpdated: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  entry?: LeaderboardEntry;
}
