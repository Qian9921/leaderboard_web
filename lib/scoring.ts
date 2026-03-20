import { LeaderboardEntry, MetricConfig } from "./types";

export function normalizeMetricValue(
  value: number,
  min: number,
  max: number,
  higherIsBetter: boolean
): number {
  if (max <= min) return 1.0;
  const normalized = (value - min) / (max - min);
  return higherIsBetter ? normalized : 1 - normalized;
}

export function computeTotalScores(
  entries: LeaderboardEntry[],
  metrics: MetricConfig[]
): Map<string, number> {
  const scores = new Map<string, number>();
  if (entries.length === 0) return scores;

  const domains = metrics.map((metric) => {
    const values = entries
      .map((e) => (e as any)[metric.key])
      .filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
    return {
      min: values.length > 0 ? Math.min(...values) : 0,
      max: values.length > 0 ? Math.max(...values) : 0,
    };
  });

  const weightSum = metrics.reduce((sum, m) => sum + m.weight, 0);

  for (const entry of entries) {
    let total = 0;
    for (let i = 0; i < metrics.length; i++) {
      const raw = (entry as any)[metrics[i].key];
      if (typeof raw !== "number" || Number.isNaN(raw)) continue;
      const score = normalizeMetricValue(
        raw,
        domains[i].min,
        domains[i].max,
        metrics[i].higherIsBetter
      );
      total += score * metrics[i].weight;
    }
    scores.set(entry.groupName, (total / weightSum) * 100);
  }

  return scores;
}
