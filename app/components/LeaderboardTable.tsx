"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown, Github } from "lucide-react";
import { LeaderboardEntry, MetricConfig } from "@/lib/types";
import { sortEntries, getRankBadge, formatDate, cn } from "@/lib/utils";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  metrics: MetricConfig[];
  primaryMetric: string;
}

export default function LeaderboardTable({
  entries,
  metrics,
  primaryMetric,
}: LeaderboardTableProps) {
  // Default: first metric, descending
  const [sortKey, setSortKey] = useState<string>(primaryMetric);
  const [sortAscending, setSortAscending] = useState<boolean>(false);

  // Handle column sort
  // User requirement: first click => ascending, second click => descending
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAscending(!sortAscending);
    } else {
      setSortKey(key);
      setSortAscending(true);
    }
  };

  // Sort entries based on current sort configuration
  const sortedEntries = sortEntries(entries, sortKey, sortAscending);

  const getMetricDomain = (key: string): { min: number; max: number } => {
    const values = sortedEntries
      .map((e: any) => e[key])
      .filter((v: any) => typeof v === "number" && !Number.isNaN(v));

    if (values.length === 0) {
      return { min: 0, max: 1 };
    }

    return { min: Math.min(...values), max: Math.max(...values) };
  };

  const getMetricBarWidthPct = (
    value: number,
    min: number,
    max: number,
    higherIsBetter: boolean
  ): number => {
    if (max <= min) return 100;
    const normalized = (value - min) / (max - min);
    const score = higherIsBetter ? normalized : 1 - normalized;
    return Math.max(0, Math.min(100, score * 100));
  };

  const renderRepoCell = (projectPrivateRepoUrl?: string, githubUsername?: string) => {
    if (projectPrivateRepoUrl) {
    return (
      <a
        href={projectPrivateRepoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
      >
        <Github size={16} />
        <span className="truncate max-w-[220px]">{projectPrivateRepoUrl}</span>
      </a>
    );
    }

    if (!githubUsername) {
      return <span className="text-gray-400">—</span>;
    }

    return (
      <a
        href={`https://github.com/${githubUsername}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
      >
        <Github size={16} />
        <span>{githubUsername}</span>
      </a>
    );
  };

  return (
    <div className="overflow-x-auto rounded-3xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="px-6 py-4 text-left font-semibold">Rank</th>
            <th className="px-6 py-4 text-left font-semibold">Group</th>
            <th className="px-6 py-4 text-left font-semibold">Repo</th>
            {metrics.map((metric) => (
              <th
                key={metric.key}
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => handleSort(metric.key)}
              >
                <div className="flex items-center gap-2">
                  <span>{metric.label}</span>
                  {metric.unit && (
                    <span className="text-xs opacity-75">({metric.unit})</span>
                  )}
                  {sortKey === metric.key && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-yellow-300"
                    >
                      {sortAscending ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      )}
                    </motion.div>
                  )}
                </div>
              </th>
            ))}
            <th
              className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-white/10 transition-colors"
              onClick={() => handleSort("submissionDate")}
            >
              <div className="flex items-center gap-2">
                <span>Submission Time</span>
                {sortKey === "submissionDate" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-yellow-300"
                  >
                    {sortAscending ? (
                      <ArrowUp size={16} />
                    ) : (
                      <ArrowDown size={16} />
                    )}
                  </motion.div>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {sortedEntries.map((entry, index) => {
              const rank = index + 1;
              const rankBadge = getRankBadge(rank);

              return (
                <motion.tr
                  key={entry.groupName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "border-b border-gray-200/70 dark:border-gray-700/70 hover:bg-gray-50/70 dark:hover:bg-gray-800/70 transition-colors",
                    rank <= 3 && "bg-amber-50/60 dark:bg-amber-900/10"
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {rankBadge.emoji && (
                        <motion.span
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="text-2xl"
                        >
                          {rankBadge.emoji}
                        </motion.span>
                      )}
                      <span
                        className={cn(
                          "font-bold text-lg",
                          rankBadge.color
                        )}
                      >
                        #{rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {entry.groupName}
                  </td>
                  <td className="px-6 py-4">
                    {renderRepoCell(entry.projectPrivateRepoUrl, entry.githubUsername)}
                  </td>
                  {metrics.map((metric) => {
                    const value = (entry as any)[metric.key];
                    const formattedValue = metric.format
                      ? metric.format(value)
                      : value;
                    const { min, max } = getMetricDomain(metric.key);
                    const barWidth = getMetricBarWidthPct(
                      value,
                      min,
                      max,
                      metric.higherIsBetter
                    );

                    return (
                      <td key={metric.key} className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold">{formattedValue}</span>
                          {/* Performance indicator */}
                          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ delay: index * 0.05 + 0.2 }}
                              className={cn(
                                "h-full rounded-full",
                                rank <= 3 ? "bg-gradient-to-r from-green-400 to-green-600" : "bg-blue-500"
                              )}
                              style={{
                                width: `${barWidth}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {entry.submissionDate ? formatDate(entry.submissionDate) : "—"}
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

