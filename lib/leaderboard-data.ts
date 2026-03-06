import { LeaderboardEntry } from "./types";

export function normalizeLeaderboardEntries(
  payload: unknown
): LeaderboardEntry[] {
  if (Array.isArray(payload)) {
    return payload as LeaderboardEntry[];
  }

  if (payload && typeof payload === "object") {
    return [payload as LeaderboardEntry];
  }

  throw new Error("Leaderboard payload must be a JSON object or array.");
}
