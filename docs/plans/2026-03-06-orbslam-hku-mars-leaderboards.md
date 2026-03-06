# HKU MARS ORB-SLAM3 Multi-Dataset Leaderboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add dataset-specific ORB-SLAM3 sub-leaderboards for all 23 HKU MARS sequences while preserving AMtown02’s current data and seeding all other datasets with one fake placeholder entry.

**Architecture:** Keep the existing top-level `orbslam3` tab and add a second-level dataset selector that switches between per-dataset local JSON files and dataset-scoped remote submission keys. Extract dataset metadata and fetch/scope helpers into pure utilities so the UI stays data-driven and testable.

**Tech Stack:** Next.js 14 App Router, React, TypeScript, Tailwind CSS, Framer Motion, Node test runner via `tsx`

---

### Task 1: Add test harness and failing tests for dataset helpers

**Files:**
- Modify: `package.json`
- Create: `tests/lib/orbslam-datasets.test.ts`
- Create: `lib/orbslam-datasets.ts`

**Step 1: Write the failing test**

Write tests that assert:

- the dataset list contains 23 HKU MARS sequence keys
- `AMtown02` is the default dataset
- local data URLs resolve to `/data/orbslam3/<dataset>.json`
- remote submission scope keeps `AMtown02` on legacy `orbslam3`
- remote submission scope maps other datasets to `orbslam3:<dataset>`

**Step 2: Run test to verify it fails**

Run: `npm test -- --test-name-pattern="orbslam"`

Expected: failure because the helper module and/or test script does not exist yet.

**Step 3: Write minimal implementation**

Create the dataset metadata module with:

- dataset constants
- dataset metadata
- default dataset key
- URL helper
- submission-scope helper

**Step 4: Run test to verify it passes**

Run: `npm test -- --test-name-pattern="orbslam"`

Expected: PASS

**Step 5: Commit**

```bash
git add package.json package-lock.json lib/orbslam-datasets.ts tests/lib/orbslam-datasets.test.ts
git commit -m "test: add orbslam dataset helper coverage"
```

### Task 2: Add per-dataset ORB-SLAM3 seed data

**Files:**
- Create: `public/data/orbslam3/*.json`
- Create: `data/orbslam3/*.json`

**Step 1: Write the failing test**

Add a test that checks representative dataset files exist for:

- `AMtown02`
- `AMtown01`
- `HKairport01`
- `Featureless_GNSS03`

**Step 2: Run test to verify it fails**

Run: `npm test -- --test-name-pattern="seed data"`

Expected: FAIL because the new directory structure is missing.

**Step 3: Write minimal implementation**

- copy the current AMtown02 data into `AMtown02.json`
- create one fake placeholder entry for every other dataset
- mirror the files under both `public/data/orbslam3/` and `data/orbslam3/`

**Step 4: Run test to verify it passes**

Run: `npm test -- --test-name-pattern="seed data"`

Expected: PASS

**Step 5: Commit**

```bash
git add public/data/orbslam3 data/orbslam3 tests/lib/orbslam-datasets.test.ts
git commit -m "feat: add per-dataset orbslam seed data"
```

### Task 3: Add dataset selector UI and wire page fetch logic

**Files:**
- Modify: `app/page.tsx`
- Create: `app/components/OrbslamDatasetTabs.tsx`
- Modify: `lib/types.ts`
- Modify: `lib/leaderboard-config.ts`

**Step 1: Write the failing test**

Add or extend tests around helper behavior needed by the UI, especially default dataset selection and description lookup.

**Step 2: Run test to verify it fails**

Run: `npm test -- --test-name-pattern="dataset"`

Expected: FAIL for the new helper/lookup behavior.

**Step 3: Write minimal implementation**

- add dataset selection state to `app/page.tsx`
- show dataset pills only for ORB-SLAM3
- fetch the correct local JSON file for the active dataset
- keep UNet behavior unchanged
- keep AMtown02 as the default

**Step 4: Run test to verify it passes**

Run: `npm test -- --test-name-pattern="dataset"`

Expected: PASS

**Step 5: Commit**

```bash
git add app/page.tsx app/components/OrbslamDatasetTabs.tsx lib/types.ts lib/leaderboard-config.ts lib/orbslam-datasets.ts tests/lib/orbslam-datasets.test.ts
git commit -m "feat: add orbslam dataset selector"
```

### Task 4: Make upload/delete dataset-aware

**Files:**
- Modify: `app/components/UploadModal.tsx`
- Modify: `app/components/LeaderboardTable.tsx`

**Step 1: Write the failing test**

Add a failing helper test for submission scope resolution if additional edge cases are needed for upload/delete wiring.

**Step 2: Run test to verify it fails**

Run: `npm test -- --test-name-pattern="submission scope"`

Expected: FAIL if new behavior is not yet implemented.

**Step 3: Write minimal implementation**

- pass selected dataset context into upload/delete components
- use the resolved dataset submission scope for Supabase fetch/upsert/delete
- keep JSON metric validation unchanged
- update the modal copy to show the active dataset

**Step 4: Run test to verify it passes**

Run: `npm test -- --test-name-pattern="submission scope"`

Expected: PASS

**Step 5: Commit**

```bash
git add app/components/UploadModal.tsx app/components/LeaderboardTable.tsx app/page.tsx lib/orbslam-datasets.ts tests/lib/orbslam-datasets.test.ts
git commit -m "feat: scope orbslam uploads by dataset"
```

### Task 5: Update docs and verify the full app

**Files:**
- Modify: `README.md`

**Step 1: Write the failing test**

No code test needed; verification will be lint/build/test plus manual review of docs.

**Step 2: Run verification before docs changes**

Run:

- `npm test`
- `npm run lint`
- `npm run build`

Expected: identify any remaining failures before finalizing docs.

**Step 3: Write minimal implementation**

- document the new per-dataset ORB-SLAM3 file layout
- document that non-AMtown02 remote uploads need dataset-scoped `leaderboard_type` values accepted by Supabase

**Step 4: Run full verification**

Run:

- `npm test`
- `npm run lint`
- `npm run build`

Expected: all commands pass.

**Step 5: Commit**

```bash
git add README.md
git commit -m "docs: document multi-dataset orbslam leaderboards"
```
