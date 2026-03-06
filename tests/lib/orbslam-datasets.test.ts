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
  filterDatasets,
  groupDatasetsByScene,
} from "../../lib/orbslam-dataset-selector";

test("orbslam dataset inventory matches the HKU MARS sequence list", () => {
  assert.equal(DEFAULT_ORBSLAM_DATASET, "AMtown02");
  assert.equal(ORBSLAM_DATASET_KEYS.length, 23);
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
    "HKairport_GNSS_Evening",
    "HKisland01",
    "HKisland02",
    "HKisland03",
    "HKisland_GNSS01",
    "HKisland_GNSS02",
    "HKisland_GNSS03",
    "HKisland_GNSS_Evening",
    "Featureless_GNSS01",
    "Featureless_GNSS02",
    "Featureless_GNSS03",
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
    getOrbslamSubmissionScope("Featureless_GNSS03"),
    "orbslam3:Featureless_GNSS03"
  );
});

test("dataset metadata is available for descriptive UI copy", () => {
  const airportNight = getOrbslamDatasetMeta("HKairport_GNSS_Evening");

  assert.equal(airportNight.scene, "Hong Kong International Airport");
  assert.match(airportNight.summary, /Evening/i);
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
    groupName: "Placeholder Seed (AMtown01)",
    ate_rmse_m: 999.1234,
    rpe_trans_drift_m_per_m: 9.87654,
    rpe_rot_drift_deg_per_100m: 999.54321,
    completeness_pct: 12.34,
  };

  assert.deepEqual(normalizeLeaderboardEntries(singleEntry), [singleEntry]);
  assert.deepEqual(normalizeLeaderboardEntries([singleEntry]), [singleEntry]);
});

test("dataset selector groups datasets into stable product scene sections", () => {
  const grouped = groupDatasetsByScene(ORBSLAM_DATASETS);

  assert.deepEqual(
    grouped.map((group) => group.id),
    ["town", "valley", "airport", "island", "featureless"]
  );
  assert.equal(grouped[0].label, "Town");
  assert.equal(grouped[0].datasets.length, 3);
  assert.equal(grouped[2].label, "Airport");
  assert.equal(grouped[2].datasets.length, 7);
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
      "HKairport_GNSS_Evening",
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
    sceneFilter: "featureless",
  });

  assert.deepEqual(
    filtered.map((dataset) => dataset.key),
    ["Featureless_GNSS01", "Featureless_GNSS02", "Featureless_GNSS03"]
  );
});

test("dataset selector stats summarize the explorer state", () => {
  const stats = buildDatasetSelectorStats(ORBSLAM_DATASETS, DEFAULT_ORBSLAM_DATASET);

  assert.deepEqual(stats, {
    totalDatasets: 23,
    totalGroups: 5,
    activeDatasetLabel: "AMtown02",
  });
});
