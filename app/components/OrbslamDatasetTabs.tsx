"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, CheckCircle2, Search, Waypoints } from "lucide-react";
import {
  ORBSLAM_DATASETS,
  type OrbslamDatasetKey,
} from "@/lib/orbslam-datasets";
import {
  buildSceneSummaries,
  filterDatasetsByScene,
  getDatasetsForScene,
  getDatasetSceneGroupId,
  type DatasetSceneGroupId,
} from "@/lib/orbslam-dataset-selector";
import { cn } from "@/lib/utils";

interface OrbslamDatasetTabsProps {
  activeDataset: OrbslamDatasetKey;
  onDatasetChange: (datasetKey: OrbslamDatasetKey) => void;
}

export default function OrbslamDatasetTabs({
  activeDataset,
  onDatasetChange,
}: OrbslamDatasetTabsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const activeDatasetMeta = useMemo(
    () => ORBSLAM_DATASETS.find((dataset) => dataset.key === activeDataset),
    [activeDataset]
  );

  const activeScene = useMemo(
    () =>
      activeDatasetMeta
        ? getDatasetSceneGroupId(activeDatasetMeta)
        : ("town" as Exclude<DatasetSceneGroupId, "all">),
    [activeDatasetMeta]
  );

  const [selectedScene, setSelectedScene] = useState<
    Exclude<DatasetSceneGroupId, "all">
  >(activeScene);

  useEffect(() => {
    setSelectedScene(activeScene);
  }, [activeScene]);

  const sceneSummaries = useMemo(
    () => buildSceneSummaries(ORBSLAM_DATASETS),
    []
  );

  const selectedSceneSummary = useMemo(
    () => sceneSummaries.find((scene) => scene.id === selectedScene),
    [sceneSummaries, selectedScene]
  );

  const sceneDatasets = useMemo(
    () => getDatasetsForScene(ORBSLAM_DATASETS, selectedScene),
    [selectedScene]
  );

  const filteredSceneDatasets = useMemo(
    () => filterDatasetsByScene(ORBSLAM_DATASETS, selectedScene, searchQuery),
    [searchQuery, selectedScene]
  );

  const handleSceneSelect = (
    sceneId: Exclude<DatasetSceneGroupId, "all">
  ) => {
    setSelectedScene(sceneId);
    setSearchQuery("");

    if (sceneId === activeScene) {
      return;
    }

    const firstDataset = getDatasetsForScene(ORBSLAM_DATASETS, sceneId)[0];
    if (firstDataset) {
      onDatasetChange(firstDataset.key);
    }
  };

  return (
    <div className="space-y-5">
      <FlowSection
        step="01"
        title="Choose a scene"
        description="Start broad. Pick the environment first so you only see the datasets that matter."
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {sceneSummaries.map((scene) => {
            const isActive = scene.id === selectedScene;

            return (
              <button
                key={scene.id}
                onClick={() => handleSceneSelect(scene.id)}
                className={cn(
                  "rounded-[24px] border p-4 text-left transition-all duration-200",
                  "hover:-translate-y-0.5 hover:shadow-md",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/10",
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10 dark:border-white dark:bg-white dark:text-slate-950"
                    : "border-black/5 bg-white/95 text-slate-900 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20"
                )}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
                      isActive
                        ? "bg-white/15 text-white dark:bg-slate-900/10 dark:text-slate-900"
                        : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"
                    )}
                  >
                    {scene.datasetCount} datasets
                  </span>
                  {isActive && <CheckCircle2 size={18} />}
                </div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {scene.label}
                </h3>
                <p
                  className={cn(
                    "mt-2 text-sm leading-6",
                    isActive
                      ? "text-white/80 dark:text-slate-700"
                      : "text-slate-600 dark:text-slate-300"
                  )}
                >
                  {scene.description}
                </p>
              </button>
            );
          })}
        </div>
      </FlowSection>

      <FlowSection
        step="02"
        title="Pick a dataset"
        description={`Now narrow down inside ${selectedSceneSummary?.label ?? "this scene"}. Search only applies to the currently selected scene.`}
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-[24px] border border-black/5 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Scene focus
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
                  {selectedSceneSummary?.label}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {sceneDatasets.length} dataset
                  {sceneDatasets.length === 1 ? "" : "s"} available
                </span>
              </div>
            </div>

            <label className="group relative block w-full lg:max-w-sm">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={`Search inside ${selectedSceneSummary?.label ?? "scene"}...`}
                className={cn(
                  "w-full rounded-2xl border border-black/5 bg-white/90 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all",
                  "placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10",
                  "dark:border-white/10 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400/30"
                )}
              />
            </label>
          </div>

          {filteredSceneDatasets.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-10 text-center dark:border-white/10 dark:bg-white/5">
              <p className="text-base font-medium text-slate-900 dark:text-white">
                No dataset matches this search
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Try a different keyword or clear the search to see all datasets
                in {selectedSceneSummary?.label}.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredSceneDatasets.map((dataset) => {
                const isActive = dataset.key === activeDataset;

                return (
                  <button
                    key={dataset.key}
                    onClick={() => onDatasetChange(dataset.key)}
                    className={cn(
                      "rounded-[22px] border p-4 text-left transition-all duration-200",
                      "hover:-translate-y-0.5 hover:shadow-md",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/10",
                      isActive
                        ? "border-indigo-300 bg-indigo-50/80 shadow-sm shadow-indigo-500/10 dark:border-indigo-400/30 dark:bg-indigo-500/10"
                        : "border-black/5 bg-white/95 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-base font-semibold tracking-tight text-slate-950 dark:text-white">
                        {dataset.label}
                      </p>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"
                        )}
                      >
                        {isActive ? "Selected" : "Choose"}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {dataset.summary}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </FlowSection>

      <FlowSection
        step="03"
        title="Review your current selection"
        description="Confirm what you are looking at before you read the leaderboard results below."
      >
        <motion.div
          key={activeDataset}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[26px] border border-black/5 bg-gradient-to-br from-white via-slate-50/80 to-slate-100/60 p-5 shadow-sm dark:border-white/10 dark:from-slate-950/70 dark:via-slate-900/70 dark:to-slate-950/40"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                <Waypoints size={14} />
                Independent leaderboard
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {activeDatasetMeta?.label ?? activeDataset}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white dark:bg-white dark:text-slate-950">
                  {selectedSceneSummary?.label}
                </span>
                <span>Leaderboard updates below are scoped to this dataset only.</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {activeDatasetMeta?.summary}
              </p>
            </div>

            <div className="rounded-[22px] border border-black/5 bg-white/85 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Next
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Scroll down to view the leaderboard table, refresh results, or
                upload a new submission for this selected dataset.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                Continue to leaderboard
                <ArrowDownRight size={16} />
              </div>
            </div>
          </div>
        </motion.div>
      </FlowSection>
    </div>
  );
}

interface FlowSectionProps {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

function FlowSection({
  step,
  title,
  description,
  children,
}: FlowSectionProps) {
  return (
    <section className="rounded-[30px] border border-black/5 bg-white/90 p-5 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-slate-950/55 dark:shadow-black/20 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-white/10 dark:text-slate-300">
            Step {step}
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {title}
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}
