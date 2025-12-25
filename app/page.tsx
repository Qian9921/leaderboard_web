"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Upload as UploadIcon, RefreshCw } from "lucide-react";
import LeaderboardTabs from "./components/LeaderboardTabs";
import LeaderboardTable from "./components/LeaderboardTable";
import UploadModal from "./components/UploadModal";
import { LeaderboardType, LeaderboardEntry } from "@/lib/types";
import { leaderboardConfigs } from "@/lib/leaderboard-config";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>("opensplat");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Fetch leaderboard data
  const fetchLeaderboard = async (type: LeaderboardType) => {
    setIsLoading(true);
    try {
      const basePath = process.env.NODE_ENV === 'production' ? '/leaderboard_web' : '';
      const response = await fetch(`${basePath}/data/${type}.json`);
      let data = await response.json();
      
      // Merge with localStorage data (for user uploads)
      const storageKey = `leaderboard_${type}`;
      const localData = localStorage.getItem(storageKey);
      if (localData) {
        const localEntries = JSON.parse(localData);
        // Merge, preferring local data for same studentId
        const studentIds = new Set(localEntries.map((e: any) => e.studentId));
        data = [
          ...localEntries,
          ...data.filter((e: any) => !studentIds.has(e.studentId))
        ];
      }
      
      // Calculate ranks
      const config = leaderboardConfigs[type];
      const primaryMetric = config.metrics[0];
      const rankedData = data
        .sort((a: any, b: any) => {
          const aVal = a[primaryMetric.key];
          const bVal = b[primaryMetric.key];
          return primaryMetric.higherIsBetter ? bVal - aVal : aVal - bVal;
        })
        .map((entry: any, index: number) => ({
          ...entry,
          rank: index + 1,
        }));
      
      setLeaderboardData(rankedData);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab]);

  const handleTabChange = (tab: LeaderboardType) => {
    setActiveTab(tab);
  };

  const handleRefresh = () => {
    fetchLeaderboard(activeTab);
  };

  const handleUploadSuccess = () => {
    fetchLeaderboard(activeTab);
  };

  const config = leaderboardConfigs[activeTab];

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <Trophy size={64} className="text-yellow-500 animate-bounce-subtle" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            AAE5303 Course Leaderboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Showcasing outstanding student achievements across projects
          </p>
        </div>

        {/* Tabs */}
        <LeaderboardTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto"
      >
        {/* Info Section */}
        <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {config.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {config.description}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all",
                  "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
                  "hover:bg-gray-300 dark:hover:bg-gray-600",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <RefreshCw
                  size={20}
                  className={cn(isLoading && "animate-spin")}
                />
                Refresh
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <UploadIcon size={20} />
                Upload Submission
              </button>
            </div>
          </div>
          {lastUpdated && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Last Updated: {new Date(lastUpdated).toLocaleString("en-US")}
            </p>
          )}
        </div>

        {/* Leaderboard Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full"
            />
          </div>
        ) : leaderboardData.length > 0 ? (
          <LeaderboardTable
            entries={leaderboardData}
            metrics={config.metrics}
            primaryMetric={config.metrics[0].key}
          />
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No data yet. Be the first to submit!
            </p>
          </div>
        )}
      </motion.div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        leaderboardType={activeTab}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-7xl mx-auto mt-16 py-8 text-center text-gray-600 dark:text-gray-400"
      >
        <p>AAE5303 Computer Vision and Deep Learning © 2024</p>
        <p className="text-sm mt-2">
          Built with Next.js, TypeScript, and Tailwind CSS
        </p>
      </motion.footer>
    </div>
  );
}

