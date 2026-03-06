# HKU MARS ORB-SLAM3 Multi-Dataset Leaderboard Design

Date (Asia/Hong_Kong): 2026-03-06

## Objective

Extend the existing ORB-SLAM3 leaderboard so that every HKU MARS dataset sequence has its own sub-leaderboard under the existing `orbslam3` tab. The AMtown02 leaderboard must retain its current real baseline data, while all other datasets start with one clearly fake placeholder entry. All ORB-SLAM3 datasets must support the same metric schema, upload flow, refresh flow, and delete flow.

## Confirmed Requirements

- Keep the existing top-level leaderboard tabs: `orbslam3` and `unet`.
- Add a dataset selector below the ORB-SLAM3 leaderboard so each HKU MARS sequence can be viewed independently.
- Preserve the current AMtown02 data unchanged.
- Seed every other HKU MARS sequence with one fake placeholder entry for now.
- Reuse the exact same ORB-SLAM3 metrics for every dataset:
  - `ate_rmse_m`
  - `rpe_trans_drift_m_per_m`
  - `rpe_rot_drift_deg_per_100m`
  - `completeness_pct`
- Support the same add/delete behavior for every ORB-SLAM3 dataset.

## Dataset Scope

The HKU MARS page lists 23 sequences:

- AMtown01
- AMtown02
- AMtown03
- AMvalley01
- AMvalley02
- AMvalley03
- HKairport01
- HKairport02
- HKairport03
- HKairport_GNSS01
- HKairport_GNSS02
- HKairport_GNSS03
- HKairport_GNSS_Evening
- HKisland01
- HKisland02
- HKisland03
- HKisland_GNSS01
- HKisland_GNSS02
- HKisland_GNSS03
- HKisland_GNSS_Evening
- Featureless_GNSS01
- Featureless_GNSS02
- Featureless_GNSS03

## Recommended Architecture

### 1. Keep top-level leaderboard types unchanged

Do not create 23 new top-level tabs. Keep `orbslam3` as a single top-level leaderboard type and add a second-level dataset selector inside that view. This matches the user’s requested information architecture and minimizes disruption to the rest of the app.

### 2. Move ORB-SLAM3 local data to per-dataset files

Store local ORB-SLAM3 seed data as:

- `public/data/orbslam3/<dataset>.json`
- `data/orbslam3/<dataset>.json`

This makes future maintenance straightforward: users and students can append real entries to the dataset they care about without editing a single large monolithic file.

### 3. Centralize dataset metadata

Create a single source of truth for:

- dataset keys
- labels
- scenario descriptions
- light/degradation notes
- fetch path generation
- submission scope generation

This avoids hard-coded dataset strings in components.

### 4. Preserve AMtown02 remote compatibility

To avoid breaking existing live submissions, keep AMtown02 mapped to the legacy remote scope:

- `orbslam3`

All other ORB-SLAM3 datasets should use dataset-scoped remote keys such as:

- `orbslam3:AMtown01`
- `orbslam3:HKairport01`

This preserves existing AMtown02 data while enabling dataset-specific upload/delete behavior for new sequences.

## UI Design

Inside the ORB-SLAM3 view:

- show the existing title
- show a dataset selector directly underneath
- default the selector to `AMtown02`
- update the description card with the selected dataset’s scenario metadata
- keep the table component unchanged as much as possible

The selector should be a compact, responsive list of pills so the structure still feels like “leaderboards under ORB-SLAM3” rather than separate products.

## Data Flow

For `unet`:

- existing fetch path remains unchanged
- existing upload/delete scope remains unchanged

For `orbslam3`:

1. resolve the selected dataset
2. fetch local seed entries from `public/data/orbslam3/<dataset>.json`
3. fetch remote entries using a dataset-specific submission scope
4. merge remote entries over local entries by `groupName`
5. rank using the existing primary metric

## Remote Submission Strategy

The browser upload JSON format stays the same. Dataset context comes from the selected dataset in the UI, not from the payload body. This keeps the student-facing submission format simple and consistent.

Delete behavior should use the same selected dataset scope so deletions only affect the active dataset leaderboard.

## Risks and Mitigations

### Risk 1: Existing Supabase check constraint rejects new dataset-scoped keys

Mitigation:

- keep AMtown02 backward-compatible
- update docs to note that non-AMtown02 uploads need the `leaderboard_type` constraint relaxed or expanded

### Risk 2: Confusion about where to add future local JSON entries

Mitigation:

- use one file per dataset
- keep naming identical to HKU MARS sequence names
- document the new file layout

### Risk 3: UI clutter with 23 datasets

Mitigation:

- use compact dataset pills with wrapping
- keep the top-level tab layout unchanged

## Testing Strategy

- Add a small test harness so new pure helper logic can be tested.
- Write failing tests first for:
  - dataset inventory
  - local data path generation
  - submission scope generation
- Run lint and a production build after implementation.

## Out of Scope

- redesigning the entire homepage
- changing UNet behavior
- redesigning metric definitions
- migrating existing database rows automatically
