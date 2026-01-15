# AAE5303 Course Leaderboard

A modern, gamified leaderboard web application for displaying student performance across two projects in the AAE5303 course.

## 🎯 Features

- **Two Leaderboards**: UNet Image Segmentation, ORB-SLAM3 Visual SLAM
- **Real-time Ranking**: Automatic ranking based on various metrics
- **Multi-metric Sorting**: Click on any column header to sort by that metric (ascending/descending)
- **Gamified Design**:
  - 🥇🥈🥉 Medal badges for top 3 performers
  - Gradient colors and animation effects
  - Progress bars for visualization
  - Smooth transitions and hover effects
- **Shared Upload (Class-wide)**: Students upload JSON submissions on the website, stored in a shared Supabase database (visible to everyone)
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark Mode Support**: Automatically adapts to system theme

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Start development server**

```bash
npm run dev
```

3. **Open in browser**

Visit [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

## 📦 Deploy to GitHub Pages

### Automatic Deployment (Recommended)

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/leaderboard_web.git
git push -u origin main
```

2. **Enable GitHub Pages**

- Go to your repository settings
- Navigate to **Pages** section
- Under **Source**, select **GitHub Actions**

3. **Automatic Deployment**

The workflow will automatically run on every push to the `main` branch. Your site will be available at:

```
https://YOUR_USERNAME.github.io/leaderboard_web/
```

## 🌍 Shared Submissions (Required for class-wide leaderboard)

GitHub Pages is a static site, so **class-wide shared submissions require a database**.
This project uses **Supabase** (free tier is usually enough for a course leaderboard).

### 1) Create a Supabase project

- Create a new project in Supabase
- Copy the **Project URL** and **Anon public key**

### 2) Create database table (SQL)

Run this in Supabase SQL editor:

```sql
-- Shared submissions table for AAE5303 leaderboard
create table if not exists public.submissions (
  leaderboard_type text not null check (leaderboard_type in ('unet', 'orbslam3')),
  group_name text not null,
  project_private_repo_url text not null,
  github_username text,
  metrics jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (leaderboard_type, group_name)
);

-- Keep updated_at fresh on updates, and treat overwrite as a new submission time
create or replace function public.touch_submission_timestamps()
returns trigger
language plpgsql
as $$
begin
  new.submitted_at = now();
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_submission_timestamps on public.submissions;
create trigger trg_touch_submission_timestamps
before update on public.submissions
for each row execute function public.touch_submission_timestamps();

-- RLS (Row Level Security)
alter table public.submissions enable row level security;

-- Public read (everyone can view the leaderboard)
drop policy if exists "public read submissions" on public.submissions;
create policy "public read submissions"
on public.submissions
for select
using (true);

-- Public write (students can submit without login)
-- Note: without authentication, anyone can overwrite entries.
-- For stricter security, use Supabase Auth or an Edge Function with a server-side secret.
drop policy if exists "public write submissions" on public.submissions;
create policy "public write submissions"
on public.submissions
for insert
with check (true);

drop policy if exists "public update submissions" on public.submissions;
create policy "public update submissions"
on public.submissions
for update
using (true)
with check (true);
```

### 3) Configure environment variables

#### Local development

Create `leaderboard_web/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

#### GitHub Pages (recommended)

In your GitHub repository:

- Settings → Secrets and variables → Actions → New repository secret
- Add:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The workflow injects these secrets at build time (see `.github/workflows/deploy.yml`).

## 📁 Project Structure

```
leaderboard_web/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deployment
├── app/
│   ├── components/
│   │   ├── LeaderboardTable.tsx    # Leaderboard table component
│   │   ├── LeaderboardTabs.tsx     # Tab switcher component
│   │   └── UploadModal.tsx         # Upload modal component
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main page
├── lib/
│   ├── types.ts                    # TypeScript type definitions
│   ├── utils.ts                    # Utility functions
│   └── leaderboard-config.ts       # Leaderboard configurations
├── public/
│   └── data/
│       ├── unet.json               # UNet data
│       └── orbslam3.json           # ORB-SLAM3 data
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 📊 Complete JSON Templates

### Semantic Segmentation (UNet)

Metrics are reported as percentages (0 to 100).

```json
{
  "group_name": "Team Alpha",
  "project_private_repo_url": "https://github.com/yourusername/project.git",
  "metrics": {
    "miou": 72.73,
    "dice_score": 39.80,
    "fwiou": 88.85
  }
}
```

**Fields explained**:
- `group_name`: Group name (string, required). Used as the overwrite key.
- `project_private_repo_url`: Private repo URL (string, required)
- `github_username`: GitHub username (string, optional)
- `metrics`: Metric object (required)
  - `miou`: Mean IoU in % (number, higher is better)
  - `dice_score`: Dice score in % (number, higher is better)
  - `fwiou`: Frequency weighted IoU in % (number, higher is better)

### Visual Odometry (ORB-SLAM3)

```json
{
  "group_name": "Team Alpha",
  "project_private_repo_url": "https://github.com/yourusername/project.git",
  "metrics": {
    "ate_rmse_m": 88.2281,
    "rpe_trans_drift_m_per_m": 2.04084,
    "rpe_rot_drift_deg_per_100m": 76.69911,
    "completeness_pct": 95.73
  }
}
```

**Fields explained**:
- `group_name`: Group name (string, required). Used as the overwrite key.
- `project_private_repo_url`: Private repo URL (string, required)
- `github_username`: GitHub username (string, optional)
- `metrics`: Metric object (required)
  - `ate_rmse_m`: ATE RMSE in meters (number, lower is better)
  - `rpe_trans_drift_m_per_m`: RPE translation drift (m/m) (number, lower is better)
  - `rpe_rot_drift_deg_per_100m`: RPE rotation drift (deg/100m) (number, lower is better)
  - `completeness_pct`: Completeness in % (number, higher is better)

**Note**: Submission time is recorded automatically by the database when you upload. Do not include it in your JSON.

## 🎮 Usage

### View Leaderboards

1. Click on the tabs at the top to switch between different leaderboards
2. Click on any metric column header to sort by that metric
3. Click again to toggle between ascending/descending order

### Upload Submission

1. Click the "Upload Submission" button in the top right
2. Paste your JSON data in the dialog (use single entry format from templates above)
3. Click "Upload Data" to submit
4. The leaderboard will automatically refresh

**Single entry format for upload:**

```json
{
  "group_name": "Team Alpha",
  "project_private_repo_url": "https://github.com/yourusername/project.git",
  "metrics": {
    "miou": 72.73,
    "dice_score": 39.80,
    "fwiou": 88.85
  }
}
```

Note: Don't include the array brackets `[]` when uploading a single entry.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Utilities**: class-variance-authority, clsx, tailwind-merge

## 🎨 Design Features

- **Gamification Elements**: Medals, badges, progress bars, rank animations
- **Modern UI**: Gradients, glass-morphism effects, shadows, rounded corners
- **Smooth Animations**: Framer Motion for page transitions and interactions
- **Responsive Layout**: Adapts to all screen sizes
- **Dark Mode**: Automatic system theme detection

## 🔧 Configuration

### Modify Repository Name

If your GitHub repository is not named `leaderboard_web`, update `next.config.js`:

```javascript
const nextConfig = {
  basePath: '/YOUR_REPO_NAME',
  assetPrefix: '/YOUR_REPO_NAME/',
}
```

### Add New Metrics

Edit the `metrics` array in `lib/leaderboard-config.ts` for the respective leaderboard.

### Customize Styles

Modify `tailwind.config.ts` and `app/globals.css`.

## 📝 Notes on Upload Feature

**Current Implementation** (localStorage):
- ✅ Uploads work in browser
- ✅ Data persists per user
- ✅ Great for testing/demos
- ⚠️ Data not shared between users
- ⚠️ Cleared when browser cache cleared

**For Production** (if needed):
- Consider using a backend service (Firebase, Supabase, etc.)
- Or use GitHub Issues/Discussions as a submission system
- Or collect submissions via Google Forms → manually update JSON

## 📄 License

This project is for AAE5303 course use only.

## 👥 Contributors

- Course Teaching Team
- AAE5303 Students

## 🐛 Issues

For issues or suggestions, please contact the course teaching assistants.

---

**Best wishes for excellent performance in the course! 🎓**
