# ORB-SLAM Dataset Selector Product Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the ORB-SLAM second-level dataset selector into a modern, product-style grouped explorer with search and scene filters while preserving existing dataset behavior.

**Architecture:** Keep the page-level dataset selection contract unchanged and move the new browsing behavior into `OrbslamDatasetTabs.tsx`, backed by small pure helpers for grouping, filtering, and UI summary data. This keeps the interaction testable and avoids changing the existing leaderboard fetch/upload/delete data flow.

**Tech Stack:** Next.js 14 App Router, React client components, TypeScript, Tailwind CSS, Framer Motion, Node test runner via `tsx`

---

### Task 1: Add failing tests for dataset selector UI helpers

**Files:**
- Create: `lib/orbslam-dataset-selector.ts`
- Modify: `tests/lib/orbslam-datasets.test.ts`

**Step 1: Write the failing test**

Add tests for:

- grouping datasets into product-style scene buckets
- filtering by search query
- filtering by selected scene
- computing simple selector stats

**Step 2: Run test to verify it fails**

Run: `npm test`

Expected: FAIL because the selector helper module does not exist yet.

**Step 3: Write minimal implementation**

Create pure helper functions for:

- `groupDatasetsByScene`
- `filterDatasets`
- `buildDatasetSelectorStats`

**Step 4: Run test to verify it passes**

Run: `npm test`

Expected: PASS for the new helper coverage.

**Step 5: Commit**

```bash
git add lib/orbslam-dataset-selector.ts tests/lib/orbslam-datasets.test.ts
git commit -m "test: cover orbslam dataset selector helpers"
```

### Task 2: Redesign the selector component into a product-style explorer

**Files:**
- Modify: `app/components/OrbslamDatasetTabs.tsx`

**Step 1: Write the failing test**

If helper behavior is still missing for the intended component rendering rules, add one more failing helper test first.

**Step 2: Run test to verify it fails**

Run: `npm test`

Expected: FAIL only if the new behavior lacks helper support.

**Step 3: Write minimal implementation**

Refactor the selector to include:

- explorer header
- search input
- scene quick filters
- grouped dataset sections
- product-style dataset cards
- active card highlighting

**Step 4: Run test to verify it passes**

Run: `npm test`

Expected: PASS

**Step 5: Commit**

```bash
git add app/components/OrbslamDatasetTabs.tsx
git commit -m "feat: redesign orbslam dataset selector"
```

### Task 3: Polish the ORB-SLAM info section integration

**Files:**
- Modify: `app/page.tsx`

**Step 1: Write the failing test**

No additional runtime test required if helper coverage already protects grouping/filtering behavior.

**Step 2: Run existing tests to keep baseline**

Run: `npm test`

Expected: PASS before page polish changes.

**Step 3: Write minimal implementation**

Tighten the surrounding layout so the selector feels integrated with the main content:

- improve selector placement in the ORB-SLAM info section
- preserve current summary text
- keep desktop/mobile spacing balanced

**Step 4: Run test to verify it passes**

Run: `npm test`

Expected: PASS

**Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "style: integrate orbslam selector into info panel"
```

### Task 4: Full verification and closeout

**Files:**
- Modify if needed: `app/globals.css`

**Step 1: Run tests**

Run: `npm test`

Expected: PASS

**Step 2: Run lint**

Run: `npm run lint`

Expected: PASS with no ESLint warnings or errors.

**Step 3: Run production build**

Run: `npm run build`

Expected: PASS with static export build completed.

**Step 4: Make only minimal cleanup edits if verification reveals issues**

Keep any fixes narrowly scoped to the redesign.

**Step 5: Commit**

```bash
git add app/components/OrbslamDatasetTabs.tsx app/page.tsx app/globals.css lib/orbslam-dataset-selector.ts tests/lib/orbslam-datasets.test.ts
git commit -m "feat: polish orbslam dataset explorer UI"
```
