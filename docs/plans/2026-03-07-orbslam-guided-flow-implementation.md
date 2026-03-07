# ORB-SLAM Guided Flow Dataset Selector Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the dense ORB-SLAM dataset explorer with a calmer, vertical guided-flow selector that leads users from scene choice to dataset choice to leaderboard results.

**Architecture:** Keep the page-level dataset state unchanged and refactor `OrbslamDatasetTabs.tsx` into a 4-section vertical flow. Support the new scene-first flow with pure helper functions for scene summaries and scene-scoped dataset retrieval so behavior remains testable and stable.

**Tech Stack:** Next.js 14 App Router, React client components, TypeScript, Tailwind CSS, Framer Motion, Node test runner via `tsx`

---

### Task 1: Add failing tests for scene-first flow helpers

**Files:**
- Modify: `tests/lib/orbslam-datasets.test.ts`
- Modify: `lib/orbslam-dataset-selector.ts`

**Step 1: Write the failing test**

Add tests for:

- scene summary card data with counts and labels
- getting datasets for a selected scene
- searching only within the selected scene

**Step 2: Run test to verify it fails**

Run: `npm test`

Expected: FAIL because the new helper functions do not exist yet.

**Step 3: Write minimal implementation**

Add pure helper functions for:

- `buildSceneSummaries`
- `getDatasetsForScene`
- `filterDatasetsByScene`

**Step 4: Run test to verify it passes**

Run: `npm test`

Expected: PASS

**Step 5: Commit**

```bash
git add tests/lib/orbslam-datasets.test.ts lib/orbslam-dataset-selector.ts
git commit -m "test: cover orbslam guided flow helpers"
```

### Task 2: Refactor the selector into a vertical guided flow

**Files:**
- Modify: `app/components/OrbslamDatasetTabs.tsx`

**Step 1: Write the failing test**

If helper behavior needed by the new flow is still missing, add one minimal helper test before implementation.

**Step 2: Run test to verify it fails**

Run: `npm test`

Expected: FAIL only if helper coverage is incomplete.

**Step 3: Write minimal implementation**

Replace the current “explorer dashboard” with:

- Section 1: Choose Scene
- Section 2: Pick Dataset
- Section 3: Review Current Selection

Keep only the UI logic necessary for the guided flow.

**Step 4: Run test to verify it passes**

Run: `npm test`

Expected: PASS

**Step 5: Commit**

```bash
git add app/components/OrbslamDatasetTabs.tsx
git commit -m "feat: add orbslam guided dataset flow"
```

### Task 3: Light integration cleanup

**Files:**
- Modify: `app/page.tsx`

**Step 1: Run tests before page changes**

Run: `npm test`

Expected: PASS

**Step 2: Write minimal implementation**

Adjust surrounding copy/spacing only if needed so the guided flow sits naturally above the table and does not duplicate context unnecessarily.

**Step 3: Run tests after implementation**

Run: `npm test`

Expected: PASS

**Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "style: integrate orbslam guided flow"
```

### Task 4: Final verification

**Files:**
- Modify if needed: `app/components/OrbslamDatasetTabs.tsx`, `app/page.tsx`

**Step 1: Run test suite**

Run: `npm test`

Expected: PASS

**Step 2: Run lint**

Run: `npm run lint`

Expected: PASS

**Step 3: Run production build**

Run: `npm run build`

Expected: PASS

**Step 4: Make only minimal cleanup edits if verification exposes issues**

**Step 5: Commit**

```bash
git add app/components/OrbslamDatasetTabs.tsx app/page.tsx lib/orbslam-dataset-selector.ts tests/lib/orbslam-datasets.test.ts
git commit -m "feat: polish orbslam guided flow ui"
```
