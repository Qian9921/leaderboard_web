"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LeaderboardType } from "@/lib/types";

interface LeaderboardTabsProps {
  activeTab: LeaderboardType;
  onTabChange: (tab: LeaderboardType) => void;
}

const tabs: { id: LeaderboardType; label: string; icon: string }[] = [
  { id: "unet", label: "UNet Segmentation", icon: "🧠" },
  { id: "orbslam3", label: "ORB-SLAM3", icon: "🗺️" },
];

export default function LeaderboardTabs({
  activeTab,
  onTabChange,
}: LeaderboardTabsProps) {
  return (
    <div className="flex gap-2 p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-300",
            "hover:scale-105 active:scale-95",
            activeTab === tab.id
              ? "text-white"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg"
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

