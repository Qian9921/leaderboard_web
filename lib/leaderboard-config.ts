import { LeaderboardConfig } from "./types";
import { formatNumber, formatPercentageValue } from "./utils";

export const leaderboardConfigs: Record<string, LeaderboardConfig> = {
  unet: {
    type: "unet",
    title: "Project: Semantic Segmentation (UNet)",
    description: "UAVScenes AMtown02 (interval=5)",
    metrics: [
      {
        key: "miou",
        label: "mIoU",
        unit: "%",
        higherIsBetter: true,
        format: (v) => formatPercentageValue(v),
      },
      {
        key: "dice_score",
        label: "Dice Score",
        unit: "%",
        higherIsBetter: true,
        format: (v) => formatPercentageValue(v),
      },
      {
        key: "fwiou",
        label: "FWIoU",
        unit: "%",
        higherIsBetter: true,
        format: (v) => formatPercentageValue(v),
      },
    ],
  },
  orbslam3: {
    type: "orbslam3",
    title: "Project: Visual Odometry (ORB-SLAM3)",
    description: "MARS-LVIG (AMtown02) · Sim(3) alignment + scale correction",
    metrics: [
      {
        key: "ate_rmse_m",
        label: "ATE RMSE",
        unit: "m",
        higherIsBetter: false,
        format: (v) => formatNumber(v, 4),
      },
      {
        key: "rpe_trans_drift_m_per_m",
        label: "RPE Trans",
        unit: "m/m",
        higherIsBetter: false,
        format: (v) => formatNumber(v, 5),
      },
      {
        key: "rpe_rot_drift_deg_per_100m",
        label: "RPE Rot",
        unit: "deg/100m",
        higherIsBetter: false,
        format: (v) => formatNumber(v, 5),
      },
      {
        key: "completeness_pct",
        label: "Completeness",
        unit: "%",
        higherIsBetter: true,
        format: (v) => formatPercentageValue(v),
      },
    ],
  },
};

// Get primary metric for ranking (first metric in the list)
export function getPrimaryMetric(type: string): string {
  return leaderboardConfigs[type]?.metrics[0]?.key || "";
}

// Get primary metric config
export function getPrimaryMetricConfig(type: string) {
  return leaderboardConfigs[type]?.metrics[0];
}
