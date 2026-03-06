export const ORBSLAM_DATASET_KEYS = [
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
] as const;

export type OrbslamDatasetKey = (typeof ORBSLAM_DATASET_KEYS)[number];

export interface OrbslamDatasetMeta {
  key: OrbslamDatasetKey;
  label: string;
  scene: string;
  summary: string;
}

export const DEFAULT_ORBSLAM_DATASET: OrbslamDatasetKey = "AMtown02";

const DATASET_META_BY_KEY: Record<OrbslamDatasetKey, OrbslamDatasetMeta> = {
  AMtown01: {
    key: "AMtown01",
    label: "AMtown01",
    scene: "Rural Town",
    summary: "Rural town flight with vegetation-rich streets and low-rise structures.",
  },
  AMtown02: {
    key: "AMtown02",
    label: "AMtown02",
    scene: "Rural Town",
    summary: "Rural town reference sequence used by the current ORB-SLAM3 leaderboard.",
  },
  AMtown03: {
    key: "AMtown03",
    label: "AMtown03",
    scene: "Rural Town",
    summary: "Rural town flight with repeated road geometry and urban-rural transitions.",
  },
  AMvalley01: {
    key: "AMvalley01",
    label: "AMvalley01",
    scene: "Mountain Valley",
    summary: "Mountain valley route with large elevation changes and long forward views.",
  },
  AMvalley02: {
    key: "AMvalley02",
    label: "AMvalley02",
    scene: "Mountain Valley",
    summary: "Mountain valley sequence with sparse structures and wide terrain corridors.",
  },
  AMvalley03: {
    key: "AMvalley03",
    label: "AMvalley03",
    scene: "Mountain Valley",
    summary: "Mountain valley flight stressing scale and drift over open terrain.",
  },
  HKairport01: {
    key: "HKairport01",
    label: "HKairport01",
    scene: "Hong Kong International Airport",
    summary: "Airport daytime route with runways, terminals, and large open paved areas.",
  },
  HKairport02: {
    key: "HKairport02",
    label: "HKairport02",
    scene: "Hong Kong International Airport",
    summary: "Airport daytime route with long straight motion and repeated structural patterns.",
  },
  HKairport03: {
    key: "HKairport03",
    label: "HKairport03",
    scene: "Hong Kong International Airport",
    summary: "Airport daytime route emphasizing large-scale geometry and sparse texture zones.",
  },
  HKairport_GNSS01: {
    key: "HKairport_GNSS01",
    label: "HKairport_GNSS01",
    scene: "Hong Kong International Airport",
    summary: "Airport GNSS route for joint visual-inertial and GNSS-aware benchmarking.",
  },
  HKairport_GNSS02: {
    key: "HKairport_GNSS02",
    label: "HKairport_GNSS02",
    scene: "Hong Kong International Airport",
    summary: "Airport GNSS route with repeated runway textures and long travel distance.",
  },
  HKairport_GNSS03: {
    key: "HKairport_GNSS03",
    label: "HKairport_GNSS03",
    scene: "Hong Kong International Airport",
    summary: "Airport GNSS route covering terminal-side structures and open apron regions.",
  },
  HKairport_GNSS_Evening: {
    key: "HKairport_GNSS_Evening",
    label: "HKairport_GNSS_Evening",
    scene: "Hong Kong International Airport",
    summary: "Evening airport GNSS route with reduced illumination and stronger appearance shift.",
  },
  HKisland01: {
    key: "HKisland01",
    label: "HKisland01",
    scene: "Hong Kong Island",
    summary: "Dense urban island route with high-rise buildings and narrow street canyons.",
  },
  HKisland02: {
    key: "HKisland02",
    label: "HKisland02",
    scene: "Hong Kong Island",
    summary: "Dense urban island route with strong viewpoint variation and occlusion.",
  },
  HKisland03: {
    key: "HKisland03",
    label: "HKisland03",
    scene: "Hong Kong Island",
    summary: "Dense urban island route mixing waterfront openness and compact city blocks.",
  },
  HKisland_GNSS01: {
    key: "HKisland_GNSS01",
    label: "HKisland_GNSS01",
    scene: "Hong Kong Island",
    summary: "Urban island GNSS route for benchmarking in dense city environments.",
  },
  HKisland_GNSS02: {
    key: "HKisland_GNSS02",
    label: "HKisland_GNSS02",
    scene: "Hong Kong Island",
    summary: "Urban island GNSS route with complex building facades and road corridors.",
  },
  HKisland_GNSS03: {
    key: "HKisland_GNSS03",
    label: "HKisland_GNSS03",
    scene: "Hong Kong Island",
    summary: "Urban island GNSS route balancing open harbor views and dense downtown sections.",
  },
  HKisland_GNSS_Evening: {
    key: "HKisland_GNSS_Evening",
    label: "HKisland_GNSS_Evening",
    scene: "Hong Kong Island",
    summary: "Evening urban GNSS route with lighting changes and lower image contrast.",
  },
  Featureless_GNSS01: {
    key: "Featureless_GNSS01",
    label: "Featureless_GNSS01",
    scene: "Featureless Flight",
    summary: "Feature-poor GNSS route designed to stress tracking under weak visual texture.",
  },
  Featureless_GNSS02: {
    key: "Featureless_GNSS02",
    label: "Featureless_GNSS02",
    scene: "Featureless Flight",
    summary: "Feature-poor GNSS route with long texture-sparse spans and limited landmarks.",
  },
  Featureless_GNSS03: {
    key: "Featureless_GNSS03",
    label: "Featureless_GNSS03",
    scene: "Featureless Flight",
    summary: "Feature-poor GNSS route emphasizing low-texture failure modes across long motion.",
  },
};

export const ORBSLAM_DATASETS: OrbslamDatasetMeta[] = ORBSLAM_DATASET_KEYS.map(
  (datasetKey) => DATASET_META_BY_KEY[datasetKey]
);

export function getOrbslamDatasetMeta(
  datasetKey: OrbslamDatasetKey
): OrbslamDatasetMeta {
  return DATASET_META_BY_KEY[datasetKey];
}

export function getOrbslamDataUrl(
  datasetKey: OrbslamDatasetKey,
  basePath = ""
): string {
  const normalizedBasePath = normalizeBasePath(basePath);
  return `${normalizedBasePath}/data/orbslam3/${datasetKey}.json`;
}

export function getOrbslamSubmissionScope(
  datasetKey: OrbslamDatasetKey
): string {
  if (datasetKey === DEFAULT_ORBSLAM_DATASET) {
    return "orbslam3";
  }

  return `orbslam3:${datasetKey}`;
}

export function isOrbslamDatasetKey(value: string): value is OrbslamDatasetKey {
  return (ORBSLAM_DATASET_KEYS as readonly string[]).includes(value);
}

function normalizeBasePath(basePath: string): string {
  if (!basePath) {
    return "";
  }

  return basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
}
