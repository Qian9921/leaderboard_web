import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import {
  DEFAULT_ORBSLAM_DATASET,
  ORBSLAM_DATASET_KEYS,
  getOrbslamDataUrl,
  getOrbslamSubmissionScope,
  getOrbslamDatasetMeta,
} from "../../lib/orbslam-datasets";

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
