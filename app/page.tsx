"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Upload as UploadIcon,
  RefreshCw,
  GraduationCap,
} from "lucide-react";
import LeaderboardTabs from "./components/LeaderboardTabs";
import OrbslamDatasetTabs from "./components/OrbslamDatasetTabs";
import LeaderboardTable from "./components/LeaderboardTable";
import UploadModal from "./components/UploadModal";
import { LeaderboardType, LeaderboardEntry } from "@/lib/types";
import { leaderboardConfigs } from "@/lib/leaderboard-config";
import { normalizeLeaderboardEntries } from "@/lib/leaderboard-data";
import { cn } from "@/lib/utils";
import { getSupabaseClient } from "@/lib/supabase";
import {
  DEFAULT_ORBSLAM_DATASET,
  getOrbslamDataUrl,
  getOrbslamSubmissionScope,
  type OrbslamDatasetKey,
} from "@/lib/orbslam-datasets";

export default function Home() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>("orbslam3");
  const [activeOrbslamDataset, setActiveOrbslamDataset] =
    useState<OrbslamDatasetKey>(DEFAULT_ORBSLAM_DATASET);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchLeaderboard = async (
    type: LeaderboardType,
    orbslamDatasetKey: OrbslamDatasetKey
  ) => {
    setIsLoading(true);
    try {
      const baseEntries = await fetchBaseEntries(type, orbslamDatasetKey);
      const remoteEntries = await fetchRemoteEntries(type, orbslamDatasetKey);
      const mergedEntries = mergeWithRemoteEntries(baseEntries, remoteEntries);
      const rankedEntries = rankEntries(type, mergedEntries);
      setLeaderboardData(rankedEntries);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      setLeaderboardData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(activeTab, activeOrbslamDataset);
  }, [activeTab, activeOrbslamDataset]);

  const handleTabChange = (tab: LeaderboardType) => {
    setActiveTab(tab);
  };

  const handleOrbslamDatasetChange = (datasetKey: OrbslamDatasetKey) => {
    setActiveOrbslamDataset(datasetKey);
  };

  const handleRefresh = () => {
    fetchLeaderboard(activeTab, activeOrbslamDataset);
  };

  const handleUploadSuccess = () => {
    fetchLeaderboard(activeTab, activeOrbslamDataset);
  };

  const config = leaderboardConfigs[activeTab];

  return (
    <div className="min-h-screen px-4 py-10 md:px-10 lg:px-14 lg:py-14">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-12 max-w-6xl"
      >
        <div className="mb-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-5 inline-flex items-center justify-center gap-3"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 shadow-sm ring-1 ring-black/5 dark:bg-white/10">
              <GraduationCap
                size={26}
                className="text-indigo-600 dark:text-indigo-300"
              />
            </span>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 shadow-sm ring-1 ring-black/5 dark:bg-white/10">
              <Trophy
                size={26}
                className="animate-bounce-subtle text-amber-500"
              />
            </span>
          </motion.div>

          <h1 className="mb-3 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-6xl">
            AAE5303 - Robust Control Technology in Low-Altitude Aerial Vehicle
          </h1>
          <div className="space-y-1 text-base text-gray-600 dark:text-gray-300 md:text-lg">
            <p>Department of Aeronautical and Aviation Engineering</p>
            <p>The Hong Kong Polytechnic University</p>
            <p className="font-semibold">Jan 2026</p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <LeaderboardTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-6 rounded-3xl border border-black/5 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-gray-900/70 md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="mb-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {config.title}
              </h2>
              {activeTab === "orbslam3" ? (
                <div className="space-y-1 text-gray-600 dark:text-gray-300">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                    Guided flow
                  </p>
                  <p className="font-medium">
                    Choose a scene first, then a dataset, then review the
                    leaderboard.
                  </p>
                  <p>
                    Each HKU MARS sequence keeps its own independent leaderboard
                    and submission history.
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  {config.description}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-5 py-2.5 font-medium transition-all",
                  "bg-gray-100 text-gray-700 hover:bg-gray-200/80 disabled:cursor-not-allowed disabled:opacity-50",
                  "dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/80"
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
                className="flex items-center gap-2 rounded-2xl bg-gray-900 px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md"
              >
                <UploadIcon size={20} />
                Upload Submission
              </button>
            </div>
          </div>

          {activeTab === "orbslam3" && (
            <div className="mt-6 border-t border-black/5 pt-6 dark:border-white/10">
              <OrbslamDatasetTabs
                activeDataset={activeOrbslamDataset}
                onDatasetChange={handleOrbslamDatasetChange}
              />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-14 w-14 rounded-full border-4 border-slate-900/80 border-t-transparent"
            />
          </div>
        ) : leaderboardData.length > 0 ? (
          <div className="rounded-3xl border border-black/5 bg-white/95 shadow-sm backdrop-blur dark:border-white/10 dark:bg-gray-900/70">
            <LeaderboardTable
              key={`${activeTab}-${activeTab === "orbslam3" ? activeOrbslamDataset : "default"}`}
              entries={leaderboardData}
              metrics={config.metrics}
              primaryMetric={config.metrics[0].key}
              leaderboardType={activeTab}
              orbslamDatasetKey={
                activeTab === "orbslam3" ? activeOrbslamDataset : undefined
              }
              onDeleteSuccess={handleRefresh}
            />
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No data yet. Be the first to submit!
            </p>
          </div>
        )}
      </motion.div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        leaderboardType={activeTab}
        orbslamDatasetKey={
          activeTab === "orbslam3" ? activeOrbslamDataset : undefined
        }
        onUploadSuccess={handleUploadSuccess}
      />

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mx-auto mt-16 max-w-6xl py-10 text-center text-gray-600 dark:text-gray-300"
      >
        <p className="font-semibold">
          AAE5303 - Robust Control Technology in Low-Altitude Aerial Vehicle
        </p>
        <p className="mt-1">
          Department of Aeronautical and Aviation Engineering · The Hong Kong
          Polytechnic University
        </p>
        <p className="mt-2 text-sm">
          Built with Next.js, TypeScript, and Tailwind CSS
        </p>
      </motion.footer>
    </div>
  );
}

async function fetchBaseEntries(
  type: LeaderboardType,
  orbslamDatasetKey: OrbslamDatasetKey
): Promise<LeaderboardEntry[]> {
  const basePath = getBasePath();
  const dataUrl =
    type === "orbslam3"
      ? getOrbslamDataUrl(orbslamDatasetKey, basePath)
      : `${basePath}/data/${type}.json`;
  const response = await fetch(dataUrl);

  if (!response.ok) {
    throw new Error(`Failed to load leaderboard data from ${dataUrl}`);
  }

  const payload = await response.json();
  return normalizeLeaderboardEntries(payload);
}

async function fetchRemoteEntries(
  type: LeaderboardType,
  orbslamDatasetKey: OrbslamDatasetKey
): Promise<LeaderboardEntry[]> {
  try {
    const supabase = getSupabaseClient();
    const submissionScope =
      type === "orbslam3"
        ? getOrbslamSubmissionScope(orbslamDatasetKey)
        : type;
    const { data, error } = await supabase
      .from("submissions")
      .select(
        "leaderboard_type, group_name, project_private_repo_url, github_username, metrics, submitted_at"
      )
      .eq("leaderboard_type", submissionScope);

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
  } catch (error) {
    console.warn("Supabase remote fetch disabled:", error);
    return [];
  }
}

function mergeWithRemoteEntries(
  baseEntries: LeaderboardEntry[],
  remoteEntries: LeaderboardEntry[]
): LeaderboardEntry[] {
  const groupNames = new Set(remoteEntries.map((entry) => entry.groupName));
  return [
    ...remoteEntries,
    ...baseEntries.filter((entry) => !groupNames.has(entry.groupName)),
  ];
}

function rankEntries(
  type: LeaderboardType,
  entries: LeaderboardEntry[]
): LeaderboardEntry[] {
  const config = leaderboardConfigs[type];
  const primaryMetric = config.metrics[0];

  return entries
    .sort((a: any, b: any) => {
      const aValue = a[primaryMetric.key];
      const bValue = b[primaryMetric.key];
      return primaryMetric.higherIsBetter
        ? bValue - aValue
        : aValue - bValue;
    })
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}

function getBasePath(): string {
  return process.env.NODE_ENV === "production" ? "/leaderboard_web" : "";
}
