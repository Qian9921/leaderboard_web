// Leaderboard entry types for different competitions

export type LeaderboardType = 'opensplat' | 'unet' | 'orbslam3';

// Base interface for all leaderboard entries
export interface BaseLeaderboardEntry {
  studentId: string;
  studentName: string;
  githubUsername: string;
  submissionDate: string;
  rank?: number;
}

// OpenSplat (3D Reconstruction) metrics
export interface OpenSplatEntry extends BaseLeaderboardEntry {
  psnr: number;      // Peak Signal-to-Noise Ratio (higher is better)
  ssim: number;      // Structural Similarity Index (higher is better)
  lpips: number;     // Learned Perceptual Image Patch Similarity (lower is better)
  renderTime: number; // Rendering time in seconds (lower is better)
}

// UNet (Image Segmentation) metrics
export interface UNetEntry extends BaseLeaderboardEntry {
  iou: number;           // Intersection over Union (higher is better)
  diceScore: number;     // Dice Coefficient (higher is better)
  accuracy: number;      // Pixel accuracy (higher is better)
  inferenceTime: number; // Inference time in ms (lower is better)
}

// ORB-SLAM3 (Visual SLAM) metrics
export interface OrbSlam3Entry extends BaseLeaderboardEntry {
  ate: number;           // Absolute Trajectory Error in meters (lower is better)
  rpe: number;           // Relative Pose Error (lower is better)
  trackingSuccess: number; // Tracking success rate (higher is better)
  fps: number;           // Frames per second (higher is better)
}

// Union type for all entries
export type LeaderboardEntry = OpenSplatEntry | UNetEntry | OrbSlam3Entry;

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

