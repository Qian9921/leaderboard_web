import test from "node:test";
import assert from "node:assert/strict";

import {
  canDeleteEntry,
  mergeLeaderboardEntries,
} from "../../lib/leaderboard-entries";
import { LeaderboardEntry } from "../../lib/types";

test("mergeLeaderboardEntries marks remote rows as deletable submissions", () => {
  const remoteEntries: LeaderboardEntry[] = [
    {
      groupName: "Team Remote",
      submissionDate: "2026-03-12T10:00:00.000Z",
      ate_rmse_m: 1.23,
      rpe_trans_drift_m_per_m: 0.01,
      completeness_pct: 98.7,
    },
  ];

  const merged = mergeLeaderboardEntries([], remoteEntries);

  assert.equal(merged.length, 1);
  assert.equal(merged[0].entrySource, "submission");
  assert.equal(canDeleteEntry(merged[0]), true);
});

test("mergeLeaderboardEntries marks seed rows as non-deletable when no remote override exists", () => {
  const baseEntries: LeaderboardEntry[] = [
    {
      groupName: "Static Seed (AMtown01)",
      ate_rmse_m: 999.1234,
      rpe_trans_drift_m_per_m: 9.87654,
      completeness_pct: 12.34,
    },
  ];

  const merged = mergeLeaderboardEntries(baseEntries, []);

  assert.equal(merged.length, 1);
  assert.equal(merged[0].entrySource, "seed");
  assert.equal(canDeleteEntry(merged[0]), false);
});

test("mergeLeaderboardEntries prefers remote submissions over seed rows with the same group name", () => {
  const baseEntries: LeaderboardEntry[] = [
    {
      groupName: "Same Team",
      ate_rmse_m: 999.1234,
      rpe_trans_drift_m_per_m: 9.87654,
      completeness_pct: 12.34,
    },
  ];
  const remoteEntries: LeaderboardEntry[] = [
    {
      groupName: "Same Team",
      submissionDate: "2026-03-12T10:00:00.000Z",
      ate_rmse_m: 1.23,
      rpe_trans_drift_m_per_m: 0.01,
      completeness_pct: 98.7,
    },
  ];

  const merged = mergeLeaderboardEntries(baseEntries, remoteEntries);

  assert.equal(merged.length, 1);
  assert.equal(merged[0].entrySource, "submission");
  assert.equal(merged[0].ate_rmse_m, 1.23);
});
