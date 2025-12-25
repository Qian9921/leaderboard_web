import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LeaderboardEntry, MetricConfig } from "./types";

// Utility function for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format number to fixed decimal places
export function formatNumber(value: number, decimals: number = 2): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "N/A";
  }
  return value.toFixed(decimals);
}

// Format percentage
export function formatPercentage(value: number): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "N/A";
  }
  return `${(value * 100).toFixed(2)}%`;
}

// Format time in milliseconds
export function formatTime(ms: number): string {
  if (ms === undefined || ms === null || isNaN(ms)) {
    return "N/A";
  }
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

// Sort leaderboard entries by a specific metric
export function sortEntries<T extends LeaderboardEntry>(
  entries: T[],
  sortKey: string,
  ascending: boolean = true
): T[] {
  return [...entries].sort((a, b) => {
    const aValue = (a as any)[sortKey];
    const bValue = (b as any)[sortKey];
    
    if (aValue === undefined || bValue === undefined) return 0;
    
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return ascending ? comparison : -comparison;
  });
}

// Calculate rank based on primary metric
export function calculateRanks<T extends LeaderboardEntry>(
  entries: T[],
  primaryMetric: string,
  higherIsBetter: boolean
): T[] {
  const sorted = sortEntries(entries, primaryMetric, !higherIsBetter);
  return sorted.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

// Get rank badge style
export function getRankBadge(rank: number): {
  emoji: string;
  color: string;
  gradient: string;
} {
  switch (rank) {
    case 1:
      return {
        emoji: "🥇",
        color: "text-yellow-500",
        gradient: "from-yellow-400 to-yellow-600",
      };
    case 2:
      return {
        emoji: "🥈",
        color: "text-gray-400",
        gradient: "from-gray-300 to-gray-500",
      };
    case 3:
      return {
        emoji: "🥉",
        color: "text-orange-600",
        gradient: "from-orange-400 to-orange-600",
      };
    default:
      return {
        emoji: "",
        color: "text-gray-600",
        gradient: "from-gray-200 to-gray-400",
      };
  }
}

// Format date to readable string
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Get color based on performance (for progress bars)
export function getPerformanceColor(
  value: number,
  min: number,
  max: number,
  higherIsBetter: boolean
): string {
  const normalized = (value - min) / (max - min);
  const score = higherIsBetter ? normalized : 1 - normalized;
  
  if (score >= 0.8) return "bg-green-500";
  if (score >= 0.6) return "bg-blue-500";
  if (score >= 0.4) return "bg-yellow-500";
  if (score >= 0.2) return "bg-orange-500";
  return "bg-red-500";
}

