# ORB-SLAM Guided Flow Dataset Selector Design

Date (Asia/Hong_Kong): 2026-03-07

## Objective

Replace the current dense second-level ORB-SLAM dataset explorer with a calmer, more guided, more user-friendly vertical flow. The new UI should feel like a smooth selection journey rather than a panel full of simultaneous controls.

## Problem Statement

The current redesign improved styling but still places too many concepts on screen at once:

- dataset explorer header
- stats
- search
- scene filters
- grouped cards
- current selection summary

Even though each part is visually modern, the combined result still feels crowded and cognitively heavy. The user specifically wants the experience to feel comfortable, user-friendly, and orderly.

## Approved Direction

Use a **vertical guided flow** rather than a top stepper or a dense dashboard.

The user journey should be:

1. Choose a scene
2. Pick a dataset
3. Review the current selection
4. View the leaderboard

## Design Goals

- Reduce cognitive load by showing fewer decisions at once
- Make the selection flow obvious and linear
- Preserve all current behavior:
  - dataset switching
  - upload context
  - delete context
  - per-dataset leaderboard isolation
- Keep the UI visually modern, but calmer and less noisy

## Information Architecture

### Section 1 — Choose a Scene

Show only the five scene categories first:

- Town
- Valley
- Airport
- Island
- Featureless

Each scene card should include:

- scene name
- short human-readable description
- dataset count

This section is the primary first decision point.

### Section 2 — Pick a Dataset

After a scene is active, show only datasets in that scene.

This section should include:

- a lightweight section label
- optional local search input scoped to the current scene
- dataset cards in a responsive grid

Dataset cards should be simpler than the current explorer cards:

- dataset ID
- one-line summary
- active indicator

The goal is clarity, not feature richness.

### Section 3 — Review Current Selection

Insert a compact confirmation block between selection and results.

This should show:

- selected scene
- selected dataset
- short summary
- small reassurance text such as “Independent leaderboard”

This gives the user a moment of orientation before the table.

### Section 4 — Leaderboard

The table remains unchanged and stays below the selection flow. The surrounding page layout should let the table feel like the final “result area.”

## Visual Style

### Tone

The visual tone should be:

- premium but restrained
- soft spacing
- lower information density
- less dashboard-like
- more sequence-based

### Card Treatment

Scene cards:

- slightly larger
- cleaner than the current dataset cards
- strong active state
- subtle hover lift

Dataset cards:

- smaller than scene cards
- simpler content
- less visual chrome

### Hierarchy

Use strong visual rhythm:

- section labels
- generous spacing between steps
- distinct but soft containers
- reduced decorative noise

## Technical Approach

Reuse the existing scene grouping helpers, but refactor the selector behavior into a scene-first flow.

Add helper support for:

- scene summaries with counts/descriptions
- retrieving datasets within the selected scene
- filtering inside the currently selected scene

Keep the page-level contract unchanged:

- `activeDataset`
- `onDatasetChange`

So the rest of the app does not need behavioral changes.

## Testing Strategy

Extend the existing node-based helper tests with:

- scene summary generation
- scene-specific dataset retrieval
- search within selected scene

This protects the new step-based logic without requiring browser UI tests.

## Out Of Scope

- redesigning the leaderboard table
- changing metrics
- changing upload JSON format
- changing Supabase schema or routing
