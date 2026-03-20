import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  ORBSLAM_DATASETS,
  DEFAULT_ORBSLAM_DATASET,
  ORBSLAM_DATASET_KEYS,
  getOrbslamDataUrl,
  getOrbslamSubmissionScope,
  getOrbslamDatasetMeta,
} from "../../lib/orbslam-datasets";
import { normalizeLeaderboardEntries } from "../../lib/leaderboard-data";
import {
  buildDatasetSelectorStats,
  buildSceneSummaries,
  filterDatasetsByScene,
  filterDatasets,
  getDatasetsForScene,
  groupDatasetsByScene,
} from "../../lib/orbslam-dataset-selector";

test("orbslam dataset inventory matches the HKU MARS sequence list", () => {
  assert.equal(DEFAULT_ORBSLAM_DATASET, "AMtown02");
  assert.equal(ORBSLAM_DATASET_KEYS.length, 18);
  assert.deepEqual(ORBSLAM_DATASET_KEYS, [
    "AMtown01",
    "AMtown02",
    "AMtown03",
    "AMvalley01",
    "AMvalley02",
    "AMvalley03",
    "HKairport01",
    "HKairport02",
    "HKairport03",
    "HKairport_GNSS01",
    "HKairport_GNSS02",
    "HKairport_GNSS03",
    "HKisland01",
    "HKisland02",
    "HKisland03",
    "HKisland_GNSS01",
    "HKisland_GNSS02",
    "HKisland_GNSS03",
  ]);
});

test("orbslam data urls resolve to per-dataset JSON files", () => {
  assert.equal(
    getOrbslamDataUrl("AMtown02"),
    "/data/orbslam3/AMtown02.json"
  );
  assert.equal(
    getOrbslamDataUrl("HKairport_GNSS03", "/leaderboard_web"),
    "/leaderboard_web/data/orbslam3/HKairport_GNSS03.json"
  );
});

test("orbslam submission scopes stay backward compatible for AMtown02", () => {
  assert.equal(getOrbslamSubmissionScope("AMtown02"), "orbslam3");
  assert.equal(
    getOrbslamSubmissionScope("AMtown01"),
    "orbslam3:AMtown01"
  );
  assert.equal(
    getOrbslamSubmissionScope("HKisland_GNSS03"),
    "orbslam3:HKisland_GNSS03"
  );
});

test("dataset metadata is available for descriptive UI copy", () => {
  const airportGnss = getOrbslamDatasetMeta("HKairport_GNSS03");

  assert.equal(airportGnss.scene, "Hong Kong International Airport");
  assert.match(airportGnss.summary, /terminal-side|apron/i);
});

test("seed data files exist for every ORB-SLAM3 dataset", () => {
  const repoRoot = resolve(__dirname, "..", "..");
  const publicDir = resolve(repoRoot, "public", "data", "orbslam3");
  const sourceDir = resolve(repoRoot, "data", "orbslam3");

  for (const datasetKey of ORBSLAM_DATASET_KEYS) {
    assert.equal(
      existsSync(resolve(publicDir, `${datasetKey}.json`)),
      true,
      `missing public seed file for ${datasetKey}`
    );
    assert.equal(
      existsSync(resolve(sourceDir, `${datasetKey}.json`)),
      true,
      `missing source seed file for ${datasetKey}`
    );
  }
});

test("every ORB-SLAM3 seed file uses leaderboard array format", () => {
  const repoRoot = resolve(__dirname, "..", "..");
  const publicDir = resolve(repoRoot, "public", "data", "orbslam3");

  for (const datasetKey of ORBSLAM_DATASET_KEYS) {
    const parsed = JSON.parse(
      readFileSync(resolve(publicDir, `${datasetKey}.json`), "utf8")
    );

    assert.equal(
      Array.isArray(parsed),
      true,
      `seed file for ${datasetKey} must be a JSON array`
    );
  }
});

test("leaderboard payload normalizer accepts either a single entry or an array", () => {
  const singleEntry = {
    groupName: "Example Team",
    ate_rmse_m: 1.2345,
    rpe_trans_drift_m_per_m: 0.01234,
    completeness_pct: 98.76,
  };

  assert.deepEqual(normalizeLeaderboardEntries(singleEntry), [singleEntry]);
  assert.deepEqual(normalizeLeaderboardEntries([singleEntry]), [singleEntry]);
});

test("all ORB-SLAM3 dataset files are empty except the selected live submissions source", () => {
  const repoRoot = resolve(__dirname, "..", "..");
  const publicDir = resolve(repoRoot, "public", "data", "orbslam3");

  for (const datasetKey of ORBSLAM_DATASET_KEYS) {
    const parsed = JSON.parse(
      readFileSync(resolve(publicDir, `${datasetKey}.json`), "utf8")
    );

    assert.deepEqual(
      parsed,
      [],
      `${datasetKey} should not retain static seed rows`
    );
  }
});

test("dataset selector groups datasets into stable product scene sections", () => {
  const grouped = groupDatasetsByScene(ORBSLAM_DATASETS);

  assert.deepEqual(
    grouped.map((group) => group.id),
    ["town", "valley", "airport", "island"]
  );
  assert.equal(grouped[0].label, "Town");
  assert.equal(grouped[0].datasets.length, 3);
  assert.equal(grouped[2].label, "Airport");
  assert.equal(grouped[2].datasets.length, 6);
});

test("dataset selector search matches dataset ids and scene names", () => {
  assert.deepEqual(
    filterDatasets(ORBSLAM_DATASETS, { query: "airport", sceneFilter: "all" }).map(
      (dataset) => dataset.key
    ),
    [
      "HKairport01",
      "HKairport02",
      "HKairport03",
      "HKairport_GNSS01",
      "HKairport_GNSS02",
      "HKairport_GNSS03",
    ]
  );

  assert.deepEqual(
    filterDatasets(ORBSLAM_DATASETS, { query: "town02", sceneFilter: "all" }).map(
      (dataset) => dataset.key
    ),
    ["AMtown02"]
  );
});

test("dataset selector scene filter narrows visible datasets", () => {
  const filtered = filterDatasets(ORBSLAM_DATASETS, {
    query: "",
    sceneFilter: "airport",
  });

  assert.deepEqual(
    filtered.map((dataset) => dataset.key),
    [
      "HKairport01",
      "HKairport02",
      "HKairport03",
      "HKairport_GNSS01",
      "HKairport_GNSS02",
      "HKairport_GNSS03",
    ]
  );
});

test("dataset selector stats summarize the explorer state", () => {
  const stats = buildDatasetSelectorStats(ORBSLAM_DATASETS, DEFAULT_ORBSLAM_DATASET);

  assert.deepEqual(stats, {
    totalDatasets: 18,
    totalGroups: 4,
    activeDatasetLabel: "AMtown02",
  });
});

test("scene summaries support step-one scene selection cards", () => {
  const summaries = buildSceneSummaries(ORBSLAM_DATASETS);

  assert.deepEqual(
    summaries.map((summary) => summary.id),
    ["town", "valley", "airport", "island"]
  );
  assert.deepEqual(
    summaries.map((summary) => summary.datasetCount),
    [3, 3, 6, 6]
  );
  assert.equal(summaries[2].label, "Airport");
});

test("getDatasetsForScene returns only datasets in the chosen scene", () => {
  assert.deepEqual(
    getDatasetsForScene(ORBSLAM_DATASETS, "town").map((dataset) => dataset.key),
    ["AMtown01", "AMtown02", "AMtown03"]
  );

  assert.deepEqual(
    getDatasetsForScene(ORBSLAM_DATASETS, "island").map((dataset) => dataset.key),
    [
      "HKisland01",
      "HKisland02",
      "HKisland03",
      "HKisland_GNSS01",
      "HKisland_GNSS02",
      "HKisland_GNSS03",
    ]
  );
});

test("scene-scoped dataset search only filters within the active scene", () => {
  assert.deepEqual(
    filterDatasetsByScene(ORBSLAM_DATASETS, "airport", "gnss").map(
      (dataset) => dataset.key
    ),
    [
      "HKairport_GNSS01",
      "HKairport_GNSS02",
      "HKairport_GNSS03",
    ]
  );

  assert.deepEqual(
    filterDatasetsByScene(ORBSLAM_DATASETS, "town", "gnss").map(
      (dataset) => dataset.key
    ),
    []
  );
});
