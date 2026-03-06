"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Layers3, MapPinned, Search, Sparkles } from "lucide-react";
import {
  ORBSLAM_DATASETS,
  type OrbslamDatasetKey,
} from "@/lib/orbslam-datasets";
import {
  buildDatasetSelectorStats,
  DATASET_SCENE_FILTERS,
  filterDatasets,
  groupDatasetsByScene,
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
  const [sceneFilter, setSceneFilter] = useState<DatasetSceneGroupId>("all");

  const filteredDatasets = useMemo(
    () =>
      filterDatasets(ORBSLAM_DATASETS, {
        query: searchQuery,
        sceneFilter,
      }),
    [sceneFilter, searchQuery]
  );

  const groupedDatasets = useMemo(
    () => groupDatasetsByScene(filteredDatasets),
    [filteredDatasets]
  );

  const stats = useMemo(
    () => buildDatasetSelectorStats(ORBSLAM_DATASETS, activeDataset),
    [activeDataset]
  );

  const activeDatasetMeta = useMemo(
    () => ORBSLAM_DATASETS.find((dataset) => dataset.key === activeDataset),
    [activeDataset]
  );

  return (
    <div className="rounded-[28px] border border-black/5 bg-gradient-to-br from-white/95 via-white/90 to-slate-50/90 p-4 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/80 dark:via-slate-900/80 dark:to-slate-950/60 dark:shadow-black/20 sm:p-5">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-200">
            <Sparkles size={14} />
            Dataset Explorer
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Browse sequences like a benchmark product, not a button wall
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Every HKU MARS sequence has its own independent leaderboard. Search,
            filter by scene, then jump directly into the dataset you want to
            inspect.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[420px]">
          <StatCard
            icon={<MapPinned size={16} />}
            label="Active Dataset"
            value={stats.activeDatasetLabel}
            accent="from-indigo-500/15 to-sky-500/15"
          />
          <StatCard
            icon={<Layers3 size={16} />}
            label="Datasets"
            value={String(stats.totalDatasets)}
            accent="from-fuchsia-500/15 to-rose-500/15"
          />
          <StatCard
            icon={<Sparkles size={16} />}
            label="Scene Groups"
            value={String(stats.totalGroups)}
            accent="from-emerald-500/15 to-cyan-500/15"
          />
        </div>
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <label className="group relative block">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by dataset ID, scene, or keyword..."
            className={cn(
              "w-full rounded-2xl border border-black/5 bg-white/90 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition-all",
              "placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10",
              "dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400/30 dark:focus:ring-indigo-400/10"
            )}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {DATASET_SCENE_FILTERS.map((filter) => {
            const isActive = sceneFilter === filter.id;

            return (
              <button
                key={filter.id}
                onClick={() => setSceneFilter(filter.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  "hover:-translate-y-0.5 hover:shadow-sm",
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-slate-950"
                    : "border-black/5 bg-white/85 text-slate-600 hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-black/5 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Currently viewing
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
              {activeDatasetMeta?.label ?? activeDataset}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {activeDatasetMeta?.scene}
            </span>
          </div>
        </div>

        <div className="text-sm text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {filteredDatasets.length}
          </span>{" "}
          dataset{filteredDatasets.length === 1 ? "" : "s"}
          {searchQuery.trim() && (
            <>
              {" "}
              for{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                “{searchQuery.trim()}”
              </span>
            </>
          )}
        </div>
      </div>

      {groupedDatasets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-5 py-10 text-center dark:border-white/10 dark:bg-white/5">
          <p className="text-base font-medium text-slate-900 dark:text-white">
            No datasets match this filter
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Try another keyword or reset the scene filter to browse all 23
            sequences.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <AnimatePresence mode="popLayout">
            {groupedDatasets.map((group, groupIndex) => (
              <motion.section
                key={group.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: groupIndex * 0.04 }}
                className="rounded-3xl border border-black/5 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-950 dark:text-white">
                      {group.label}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {group.datasets.length} dataset
                      {group.datasets.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="rounded-full border border-black/5 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                    {group.label}
                  </span>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {group.datasets.map((dataset) => {
                    const isActive = dataset.key === activeDataset;

                    return (
                      <button
                        key={dataset.key}
                        onClick={() => onDatasetChange(dataset.key)}
                        className={cn(
                          "group relative overflow-hidden rounded-[24px] border p-4 text-left transition-all duration-200",
                          "hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/10",
                          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/10",
                          isActive
                            ? "border-indigo-400/60 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-lg shadow-indigo-500/10"
                            : "border-black/5 bg-white/95 text-slate-800 hover:border-indigo-200 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:border-indigo-400/20"
                        )}
                      >
                        <div
                          className={cn(
                            "absolute inset-0 opacity-0 transition-opacity duration-300",
                            !isActive &&
                              "bg-gradient-to-br from-indigo-500/5 via-transparent to-sky-500/10 group-hover:opacity-100"
                          )}
                        />

                        <div className="relative z-10">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                              <p
                                className={cn(
                                  "text-xs font-semibold uppercase tracking-[0.18em]",
                                  isActive
                                    ? "text-white/65"
                                    : "text-slate-400 dark:text-slate-500"
                                )}
                              >
                                {group.label}
                              </p>
                              <h5 className="mt-1 text-lg font-semibold tracking-tight">
                                {dataset.label}
                              </h5>
                            </div>
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                                isActive
                                  ? "bg-white/15 text-white"
                                  : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                              )}
                            >
                              {isActive ? "Active" : "Open"}
                            </span>
                          </div>

                          <p
                            className={cn(
                              "mb-4 line-clamp-2 text-sm leading-6",
                              isActive
                                ? "text-white/80"
                                : "text-slate-600 dark:text-slate-300"
                            )}
                          >
                            {dataset.summary}
                          </p>

                          <div className="flex items-center justify-between">
                            <span
                              className={cn(
                                "text-sm font-medium",
                                isActive
                                  ? "text-white/90"
                                  : "text-slate-500 dark:text-slate-400"
                              )}
                            >
                              Independent leaderboard
                            </span>
                            <span
                              className={cn(
                                "text-sm font-semibold",
                                isActive
                                  ? "text-white"
                                  : "text-indigo-600 dark:text-indigo-300"
                              )}
                            >
                              View →
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.section>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}

function StatCard({ icon, label, value, accent }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/5 bg-white/85 p-3 dark:border-white/10 dark:bg-white/5",
        "bg-gradient-to-br",
        accent
      )}
    >
      <div className="mb-2 inline-flex rounded-xl bg-white/85 p-2 text-slate-700 shadow-sm dark:bg-black/20 dark:text-white">
        {icon}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}
