import { LeaderboardConfig } from "./types";
import { formatNumber, formatPercentage, formatTime } from "./utils";

export const leaderboardConfigs: Record<string, LeaderboardConfig> = {
  opensplat: {
    type: "opensplat",
    title: "OpenSplat 3D Reconstruction",
    description: "3D scene reconstruction quality evaluation using Gaussian Splatting",
    metrics: [
      {
        key: "psnr",
        label: "PSNR",
        unit: "dB",
        higherIsBetter: true,
        format: (v) => formatNumber(v, 2),
      },
      {
        key: "ssim",
        label: "SSIM",
        higherIsBetter: true,
        format: (v) => formatNumber(v, 3),
      },
      {
        key: "lpips",
        label: "LPIPS",
        higherIsBetter: false,
        format: (v) => formatNumber(v, 3),
      },
      {
        key: "renderTime",
        label: "Render Time",
        unit: "s",
        higherIsBetter: false,
        format: (v) => formatNumber(v, 2),
      },
    ],
  },
  unet: {
    type: "unet",
    title: "UNet Image Segmentation",
    description: "Medical image segmentation model performance evaluation",
    metrics: [
      {
        key: "iou",
        label: "IoU",
        higherIsBetter: true,
        format: (v) => formatPercentage(v),
      },
      {
        key: "diceScore",
        label: "Dice Score",
        higherIsBetter: true,
        format: (v) => formatPercentage(v),
      },
      {
        key: "accuracy",
        label: "Accuracy",
        higherIsBetter: true,
        format: (v) => formatPercentage(v),
      },
      {
        key: "inferenceTime",
        label: "Inference Time",
        unit: "ms",
        higherIsBetter: false,
        format: (v) => formatTime(v),
      },
    ],
  },
  orbslam3: {
    type: "orbslam3",
    title: "ORB-SLAM3 Visual SLAM",
    description: "Real-time visual simultaneous localization and mapping evaluation",
    metrics: [
      {
        key: "ate",
        label: "ATE",
        unit: "m",
        higherIsBetter: false,
        format: (v) => formatNumber(v, 3),
      },
      {
        key: "rpe",
        label: "RPE",
        higherIsBetter: false,
        format: (v) => formatNumber(v, 3),
      },
      {
        key: "trackingSuccess",
        label: "Tracking Success",
        higherIsBetter: true,
        format: (v) => formatPercentage(v),
      },
      {
        key: "fps",
        label: "FPS",
        higherIsBetter: true,
        format: (v) => formatNumber(v, 0),
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

