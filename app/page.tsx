"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Upload as UploadIcon, RefreshCw, GraduationCap } from "lucide-react";
import LeaderboardTabs from "./components/LeaderboardTabs";
import LeaderboardTable from "./components/LeaderboardTable";
import UploadModal from "./components/UploadModal";
import { LeaderboardType, LeaderboardEntry } from "@/lib/types";
import { leaderboardConfigs } from "@/lib/leaderboard-config";
import { cn } from "@/lib/utils";
import { getSupabaseClient } from "@/lib/supabase";

export default function Home() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>("orbslam3");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchLeaderboard = async (type: LeaderboardType) => {
    setIsLoading(true);
    try {
      const baseEntries = await fetchBaseEntries(type);
      const remoteEntries = await fetchRemoteEntries(type);
      const mergedEntries = mergeWithRemoteEntries(baseEntries, remoteEntries);
      const rankedEntries = rankEntries(type, mergedEntries);
      setLeaderboardData(rankedEntries);
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
    <div className="min-h-screen px-4 py-10 md:px-10 lg:px-14 lg:py-14">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-12"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center gap-3 mb-5"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 dark:bg-white/10 shadow-sm ring-1 ring-black/5">
              <GraduationCap size={26} className="text-indigo-600 dark:text-indigo-300" />
            </span>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 dark:bg-white/10 shadow-sm ring-1 ring-black/5">
              <Trophy size={26} className="text-amber-500 animate-bounce-subtle" />
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight">
            AAE5303 - Robust Control Technology in Low-Altitude Aerial Vehicle
          </h1>
          <div className="text-gray-600 dark:text-gray-300 text-base md:text-lg space-y-1">
            <p>Department of Aeronautical and Aviation Engineering</p>
            <p>The Hong Kong Polytechnic University</p>
            <p className="font-semibold">Jan 2026</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <LeaderboardTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto"
      >
        {/* Info Section */}
        <div className="mb-6 p-6 md:p-7 bg-white/95 dark:bg-gray-900/70 backdrop-blur rounded-3xl shadow-sm border border-black/5 dark:border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                {config.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {config.description}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium transition-all",
                  "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200",
                  "hover:bg-gray-200/80 dark:hover:bg-gray-700/80",
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
              >
                <UploadIcon size={20} />
                Upload Submission
              </button>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 border-4 border-slate-900/80 border-t-transparent rounded-full"
            />
          </div>
        ) : leaderboardData.length > 0 ? (
          <div className="rounded-3xl bg-white/95 dark:bg-gray-900/70 backdrop-blur border border-black/5 dark:border-white/10 shadow-sm">
            <LeaderboardTable
              entries={leaderboardData}
              metrics={config.metrics}
              primaryMetric={config.metrics[0].key}
            />
          </div>
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
        className="max-w-6xl mx-auto mt-16 py-10 text-center text-gray-600 dark:text-gray-300"
      >
        <p className="font-semibold">
          AAE5303 - Robust Control Technology in Low-Altitude Aerial Vehicle
        </p>
        <p className="mt-1">Department of Aeronautical and Aviation Engineering · The Hong Kong Polytechnic University</p>
        <p className="text-sm mt-2">
          Built with Next.js, TypeScript, and Tailwind CSS
        </p>
      </motion.footer>
    </div>
  );
}

async function fetchBaseEntries(type: LeaderboardType): Promise<LeaderboardEntry[]> {
  const basePath = getBasePath();
  const response = await fetch(`${basePath}/data/${type}.json`);
  return await response.json();
}

async function fetchRemoteEntries(type: LeaderboardType): Promise<LeaderboardEntry[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("submissions")
      .select("leaderboard_type, group_name, project_private_repo_url, github_username, metrics, submitted_at")
      .eq("leaderboard_type", type);

    if (error) {
      throw error;
    }

    return (data ?? []).map((row: any) => ({
      groupName: row.group_name,
      projectPrivateRepoUrl: row.project_private_repo_url,
      githubUsername: row.github_username,
      submissionDate: row.submitted_at,
      ...(row.metrics ?? {}),
    })) as LeaderboardEntry[];
  } catch (e) {
    // Supabase is optional for local preview or before env vars are configured.
    console.warn("Supabase remote fetch disabled:", e);
    return [];
  }
}

function mergeWithRemoteEntries(
  baseEntries: LeaderboardEntry[],
  remoteEntries: LeaderboardEntry[]
): LeaderboardEntry[] {
  const groupNames = new Set(remoteEntries.map((e: any) => e.groupName));
  return [...remoteEntries, ...baseEntries.filter((e: any) => !groupNames.has(e.groupName))];
}

function rankEntries(type: LeaderboardType, entries: LeaderboardEntry[]): LeaderboardEntry[] {
  const config = leaderboardConfigs[type];
  const primaryMetric = config.metrics[0];

  return entries
    .sort((a: any, b: any) => {
      const aVal = a[primaryMetric.key];
      const bVal = b[primaryMetric.key];
      return primaryMetric.higherIsBetter ? bVal - aVal : aVal - bVal;
    })
    .map((entry: any, index: number) => ({
      ...entry,
      rank: index + 1,
    }));
}

function getBasePath(): string {
  return process.env.NODE_ENV === "production" ? "/leaderboard_web" : "";
}
