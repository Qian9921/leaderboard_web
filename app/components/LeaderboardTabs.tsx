"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LeaderboardType } from "@/lib/types";

interface LeaderboardTabsProps {
  activeTab: LeaderboardType;
  onTabChange: (tab: LeaderboardType) => void;
}

const tabs: { id: LeaderboardType; label: string; icon: string }[] = [
  { id: "orbslam3", label: "Visual Odometry (ORB-SLAM3)", icon: "🗺️" },
  { id: "unet", label: "Semantic Segmentation (UNet)", icon: "🧠" },
];

export default function LeaderboardTabs({
  activeTab,
  onTabChange,
}: LeaderboardTabsProps) {
  return (
    <div className="flex gap-2 p-2 bg-white/80 dark:bg-gray-900/70 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative flex items-center gap-3 px-5 py-2.5 rounded-2xl font-medium transition-all duration-300",
            "hover:translate-y-[-1px] active:translate-y-0",
            activeTab === tab.id
              ? "text-white"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gray-900 rounded-2xl shadow-sm"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10 text-2xl">{tab.icon}</span>
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

