import {
  ORBSLAM_DATASETS,
  type OrbslamDatasetKey,
  type OrbslamDatasetMeta,
} from "./orbslam-datasets";

export type DatasetSceneGroupId =
  | "all"
  | "town"
  | "valley"
  | "airport"
  | "island"
  | "featureless";

export interface DatasetSceneGroup {
  id: Exclude<DatasetSceneGroupId, "all">;
  label: string;
  datasets: OrbslamDatasetMeta[];
}

export interface SceneSummary {
  id: Exclude<DatasetSceneGroupId, "all">;
  label: string;
  datasetCount: number;
  description: string;
}

interface DatasetFilterOptions {
  query: string;
  sceneFilter: DatasetSceneGroupId;
}

interface DatasetSelectorStats {
  totalDatasets: number;
  totalGroups: number;
  activeDatasetLabel: string;
}

const GROUP_ORDER: Exclude<DatasetSceneGroupId, "all">[] = [
  "town",
  "valley",
  "airport",
  "island",
  "featureless",
];

const GROUP_LABELS: Record<Exclude<DatasetSceneGroupId, "all">, string> = {
  town: "Town",
  valley: "Valley",
  airport: "Airport",
  island: "Island",
  featureless: "Featureless",
};

const GROUP_DESCRIPTIONS: Record<Exclude<DatasetSceneGroupId, "all">, string> = {
  town: "Compact urban-style routes with repeated street geometry and dense landmarks.",
  valley: "Open-terrain routes that emphasize scale drift across large natural structure.",
  airport: "Large-scale airport routes with runway geometry, GNSS variants, and evening conditions.",
  island: "Dense city routes with high-rise facades, waterfront transitions, and GNSS variants.",
  featureless: "Low-texture routes designed to stress tracking when landmarks are scarce.",
};

export const DATASET_SCENE_FILTERS: Array<{
  id: DatasetSceneGroupId;
  label: string;
}> = [
  { id: "all", label: "All" },
  ...GROUP_ORDER.map((id) => ({
    id,
    label: GROUP_LABELS[id],
  })),
];

export function groupDatasetsByScene(
  datasets: OrbslamDatasetMeta[]
): DatasetSceneGroup[] {
  const grouped = new Map<
    Exclude<DatasetSceneGroupId, "all">,
    OrbslamDatasetMeta[]
  >();

  for (const dataset of datasets) {
    const groupId = getDatasetSceneGroupId(dataset);
    const items = grouped.get(groupId) ?? [];
    items.push(dataset);
    grouped.set(groupId, items);
  }

  return GROUP_ORDER.map((groupId) => ({
    id: groupId,
    label: GROUP_LABELS[groupId],
    datasets: grouped.get(groupId) ?? [],
  })).filter((group) => group.datasets.length > 0);
}

export function filterDatasets(
  datasets: OrbslamDatasetMeta[],
  { query, sceneFilter }: DatasetFilterOptions
): OrbslamDatasetMeta[] {
  const normalizedQuery = query.trim().toLowerCase();

  return datasets.filter((dataset) => {
    const matchesScene =
      sceneFilter === "all" ||
      getDatasetSceneGroupId(dataset) === sceneFilter;

    if (!matchesScene) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [
      dataset.key,
      dataset.label,
      dataset.scene,
      dataset.summary,
      GROUP_LABELS[getDatasetSceneGroupId(dataset)],
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export function buildDatasetSelectorStats(
  datasets: OrbslamDatasetMeta[],
  activeDatasetKey: OrbslamDatasetKey
): DatasetSelectorStats {
  return {
    totalDatasets: datasets.length,
    totalGroups: groupDatasetsByScene(datasets).length,
    activeDatasetLabel:
      datasets.find((dataset) => dataset.key === activeDatasetKey)?.label ??
      activeDatasetKey,
  };
}

export function buildSceneSummaries(
  datasets: OrbslamDatasetMeta[]
): SceneSummary[] {
  return groupDatasetsByScene(datasets).map((group) => ({
    id: group.id,
    label: group.label,
    datasetCount: group.datasets.length,
    description: GROUP_DESCRIPTIONS[group.id],
  }));
}

export function getDatasetsForScene(
  datasets: OrbslamDatasetMeta[],
  sceneId: Exclude<DatasetSceneGroupId, "all">
): OrbslamDatasetMeta[] {
  return datasets.filter(
    (dataset) => getDatasetSceneGroupId(dataset) === sceneId
  );
}

export function filterDatasetsByScene(
  datasets: OrbslamDatasetMeta[],
  sceneId: Exclude<DatasetSceneGroupId, "all">,
  query: string
): OrbslamDatasetMeta[] {
  return filterDatasets(getDatasetsForScene(datasets, sceneId), {
    query,
    sceneFilter: sceneId,
  });
}

export function getDatasetSceneGroupId(
  dataset: OrbslamDatasetMeta
): Exclude<DatasetSceneGroupId, "all"> {
  const sceneText = dataset.scene.toLowerCase();

  if (sceneText.includes("town")) {
    return "town";
  }

  if (sceneText.includes("valley")) {
    return "valley";
  }

  if (sceneText.includes("airport")) {
    return "airport";
  }

  if (sceneText.includes("island")) {
    return "island";
  }

  return "featureless";
}

export function getDefaultGroupedDatasets(): DatasetSceneGroup[] {
  return groupDatasetsByScene(ORBSLAM_DATASETS);
}
