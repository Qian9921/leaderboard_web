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
  const [sortKey, setSortKey] = useState<string>(primaryMetric);
  const [sortAscending, setSortAscending] = useState<boolean>(false);

  // Handle column sort
  const handleSort = (key: string, higherIsBetter: boolean) => {
    if (sortKey === key) {
      setSortAscending(!sortAscending);
    } else {
      setSortKey(key);
      setSortAscending(!higherIsBetter);
    }
  };

  // Sort entries based on current sort configuration
  const sortedEntries = sortEntries(entries, sortKey, sortAscending);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <th className="px-6 py-4 text-left font-semibold">Rank</th>
            <th className="px-6 py-4 text-left font-semibold">Student ID</th>
            <th className="px-6 py-4 text-left font-semibold">Name</th>
            <th className="px-6 py-4 text-left font-semibold">GitHub</th>
            {metrics.map((metric) => (
              <th
                key={metric.key}
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => handleSort(metric.key, metric.higherIsBetter)}
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
            <th className="px-6 py-4 text-left font-semibold">Submission Time</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {sortedEntries.map((entry, index) => {
              const rank = index + 1;
              const rankBadge = getRankBadge(rank);

              return (
                <motion.tr
                  key={entry.studentId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                    rank <= 3 && "bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-900/20"
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
                  <td className="px-6 py-4 font-mono text-sm">
                    {entry.studentId}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {entry.studentName}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`https://github.com/${entry.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      <Github size={16} />
                      <span>{entry.githubUsername}</span>
                    </a>
                  </td>
                  {metrics.map((metric) => {
                    const value = (entry as any)[metric.key];
                    const formattedValue = metric.format
                      ? metric.format(value)
                      : value;

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
                                width: `${Math.min(100, (value / Math.max(...sortedEntries.map((e: any) => e[metric.key]))) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(entry.submissionDate)}
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

