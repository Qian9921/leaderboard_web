import { LeaderboardEntry } from "./types";

export function mergeLeaderboardEntries(
  baseEntries: LeaderboardEntry[],
  remoteEntries: LeaderboardEntry[]
): LeaderboardEntry[] {
  const markedRemoteEntries = remoteEntries.map(markSubmissionEntry);
  const remoteGroupNames = new Set(
    markedRemoteEntries.map((entry) => entry.groupName)
  );
  const uniqueBaseEntries = baseEntries
    .filter((entry) => !remoteGroupNames.has(entry.groupName))
    .map(markSeedEntry);

  return [...markedRemoteEntries, ...uniqueBaseEntries];
}

export function canDeleteEntry(entry: LeaderboardEntry): boolean {
  return entry.entrySource === "submission";
}

function markSubmissionEntry(entry: LeaderboardEntry): LeaderboardEntry {
  return {
    ...entry,
    entrySource: "submission",
  };
}

function markSeedEntry(entry: LeaderboardEntry): LeaderboardEntry {
  return {
    ...entry,
    entrySource: "seed",
  };
}
