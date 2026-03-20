import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeMetricValue,
  computeTotalScores,
} from "../../lib/scoring";
import { LeaderboardEntry, MetricConfig } from "../../lib/types";
import { leaderboardConfigs } from "../../lib/leaderboard-config";

// --- normalizeMetricValue ---

test("normalizeMetricValue: higher is better, max gets 1, min gets 0", () => {
  assert.equal(normalizeMetricValue(100, 0, 100, true), 1.0);
  assert.equal(normalizeMetricValue(0, 0, 100, true), 0.0);
  assert.equal(normalizeMetricValue(50, 0, 100, true), 0.5);
});

test("normalizeMetricValue: lower is better, min gets 1, max gets 0", () => {
  assert.equal(normalizeMetricValue(0, 0, 100, false), 1.0);
  assert.equal(normalizeMetricValue(100, 0, 100, false), 0.0);
  assert.equal(normalizeMetricValue(50, 0, 100, false), 0.5);
});

test("normalizeMetricValue: degenerate case (min == max) returns 1.0", () => {
  assert.equal(normalizeMetricValue(42, 42, 42, true), 1.0);
  assert.equal(normalizeMetricValue(42, 42, 42, false), 1.0);
});

// --- computeTotalScores ---

test("computeTotalScores: empty entries returns empty map", () => {
  const scores = computeTotalScores([], leaderboardConfigs.unet.metrics);
  assert.equal(scores.size, 0);
});

test("computeTotalScores: single entry gets 100", () => {
  const entries: LeaderboardEntry[] = [
    { groupName: "Solo", miou: 72.73, dice_score: 39.80, fwiou: 88.85 },
  ];
  const scores = computeTotalScores(entries, leaderboardConfigs.unet.metrics);
  assert.equal(scores.get("Solo"), 100);
});

test("computeTotalScores: best entry near 100, worst near 0 (higher is better)", () => {
  const entries: LeaderboardEntry[] = [
    { groupName: "Best", miou: 90, dice_score: 90, fwiou: 90 },
    { groupName: "Worst", miou: 10, dice_score: 10, fwiou: 10 },
  ];
  const scores = computeTotalScores(entries, leaderboardConfigs.unet.metrics);
  assert.equal(scores.get("Best"), 100);
  assert.equal(scores.get("Worst"), 0);
});

test("computeTotalScores: lower is better metrics work correctly", () => {
  const entries: LeaderboardEntry[] = [
    {
      groupName: "Accurate",
      ate_rmse_m: 1.0,
      rpe_trans_drift_m_per_m: 0.01,
      completeness_pct: 100,
    },
    {
      groupName: "Drifty",
      ate_rmse_m: 10.0,
      rpe_trans_drift_m_per_m: 1.0,
      completeness_pct: 50,
    },
  ];
  const scores = computeTotalScores(
    entries,
    leaderboardConfigs.orbslam3.metrics
  );
  assert.equal(scores.get("Accurate"), 100);
  assert.equal(scores.get("Drifty"), 0);
});

test("computeTotalScores: weights affect intermediate scores", () => {
  const metrics: MetricConfig[] = [
    { key: "a", label: "A", higherIsBetter: true, weight: 0.75 },
    { key: "b", label: "B", higherIsBetter: true, weight: 0.25 },
  ];
  const entries: LeaderboardEntry[] = [
    { groupName: "AOnly", a: 100, b: 0 } as any,
    { groupName: "BOnly", a: 0, b: 100 } as any,
  ];
  const scores = computeTotalScores(entries, metrics);
  assert.equal(scores.get("AOnly"), 75);
  assert.equal(scores.get("BOnly"), 25);
});

test("config weights sum to 1.0 for both leaderboards", () => {
  for (const [name, config] of Object.entries(leaderboardConfigs)) {
    const sum = config.metrics.reduce((s, m) => s + m.weight, 0);
    assert.ok(
      Math.abs(sum - 1.0) < 1e-9,
      `${name} weights sum to ${sum}, expected 1.0`
    );
  }
});
