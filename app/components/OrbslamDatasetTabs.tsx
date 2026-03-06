"use client";

import {
  ORBSLAM_DATASETS,
  type OrbslamDatasetKey,
} from "@/lib/orbslam-datasets";
import { cn } from "@/lib/utils";

interface OrbslamDatasetTabsProps {
  activeDataset: OrbslamDatasetKey;
  onDatasetChange: (datasetKey: OrbslamDatasetKey) => void;
}

export default function OrbslamDatasetTabs({
  activeDataset,
  onDatasetChange,
}: OrbslamDatasetTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ORBSLAM_DATASETS.map((dataset) => {
        const isActive = dataset.key === activeDataset;

        return (
          <button
            key={dataset.key}
            onClick={() => onDatasetChange(dataset.key)}
            className={cn(
              "rounded-2xl border px-4 py-2 text-left transition-all",
              "hover:-translate-y-0.5 hover:shadow-sm",
              isActive
                ? "border-gray-900 bg-gray-900 text-white shadow-sm"
                : "border-black/5 bg-white/90 text-gray-700 hover:border-gray-300 hover:text-gray-900 dark:border-white/10 dark:bg-gray-900/70 dark:text-gray-300 dark:hover:border-white/20 dark:hover:text-white"
            )}
          >
            <div className="text-sm font-semibold">{dataset.label}</div>
            <div
              className={cn(
                "text-xs",
                isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"
              )}
            >
              {dataset.scene}
            </div>
          </button>
        );
      })}
    </div>
  );
}
