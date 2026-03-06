# ORB-SLAM Dataset Selector Product-Style Redesign

Date (Asia/Hong_Kong): 2026-03-06

## Objective

Redesign the second-level ORB-SLAM dataset selector so it feels like a modern product UI rather than a wall of utility buttons. The new experience should be faster to scan, visually richer, and easier to use across desktop and mobile while keeping the existing dataset switching behavior unchanged.

## Approved Direction

The user approved a **product-style** redesign and selected the “Spotlight product filter + grouped card navigation” direction.

## UX Problems In The Current UI

- All 23 datasets appear as one flat list of pills with weak hierarchy.
- Users must scan every chip manually to find airport, island, town, or valley sequences.
- The second-level selector does not feel visually integrated with the main leaderboard content.
- The selector looks functional but not polished or productized.

## Design Goals

- Make the dataset selector feel like a premium product filter surface.
- Group datasets by scene so users can browse semantically instead of scanning raw IDs.
- Keep the active dataset obvious at a glance.
- Preserve the current functionality:
  - dataset switching
  - upload context
  - delete context
  - per-dataset leaderboard data isolation
- Keep mobile usability strong without creating a heavy dashboard layout.

## Information Architecture

### Top summary bar

Add a compact “selector header” inside the ORB-SLAM info section with:

- a small product-style label such as “Dataset Explorer”
- a short sentence explaining that each dataset has an independent leaderboard
- lightweight stats such as:
  - active dataset
  - total datasets
  - total scene groups

### Search and filter strip

Add a modern utility row with:

- a search input for dataset ID or scene keyword
- optional quick scene badges for:
  - Town
  - Valley
  - Airport
  - Island
  - Featureless
- a small result count

This allows “search first, then browse.”

### Grouped dataset cards

Instead of one flat row of pills, render grouped sections by scene.

Each group should include:

- group title
- short count badge
- responsive grid of dataset cards

Each dataset card should show:

- dataset ID
- scene label
- one-line summary
- active state styling
- hover/focus affordance

## Visual Style

### Overall look

Use a product-style visual language:

- soft glass / blurred panel surface
- strong active state
- subtle gradients
- better spacing and shadows
- rounded cards with layered depth

### Active card

The selected dataset should look distinct via:

- darker or gradient background
- stronger border/ring
- elevated shadow
- small “Active” badge or highlighted indicator

### Inactive card

Inactive cards should feel lightweight but clickable:

- muted background
- soft border
- hover lift
- subtle iconography or badge accents

## Interaction Model

- Search should filter datasets client-side only.
- Scene badges should narrow the visible grouped sections.
- Clicking a dataset card should switch the active dataset immediately.
- Clearing the search or selecting “All” should restore the full grouped view.
- The current dataset summary above the table remains and works as before.

## Technical Approach

### Data model

Extend the existing ORB-SLAM dataset metadata with a derived UI grouping layer.

Introduce pure helper functions for:

- mapping scene names to product-style group labels
- grouping datasets by scene
- filtering by search query and selected scene
- computing UI stats

These helpers should be tested independently.

### Component structure

Keep `OrbslamDatasetTabs.tsx` as the selector component but refactor it into:

- local search/filter state
- grouped display
- reusable dataset card renderer

This keeps the page component simple.

### Styling

Prefer Tailwind utility classes and existing Framer Motion usage for:

- hover transitions
- fade/slide reveal for grouped sections
- active card motion polish

No large CSS framework or dependency change is needed.

## Mobile Behavior

- Keep search input full width on small screens.
- Keep scene filters horizontally scrollable or wrap cleanly.
- Use a single-column card grid on very small screens.
- Expand to two or three columns on larger viewports.

## Testing Strategy

Because this project currently has lightweight node-based tests, add pure helper coverage for:

- scene grouping
- search filtering
- scene filter behavior
- UI stat computation

This keeps the redesign testable without introducing a full browser UI test stack.

## Out Of Scope

- redesigning the main leaderboard table
- changing ORB-SLAM metrics
- changing dataset upload payload format
- introducing a full sidebar layout
