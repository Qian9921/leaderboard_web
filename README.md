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
- **Data Upload**: Students can upload JSON submissions (stored in browser localStorage)
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

### UNet (Image Segmentation)

**Complete example with 3 entries:**

```json
[
  {
    "studentId": "20240001",
    "studentName": "Alice Chen",
    "githubUsername": "alice-chen",
    "submissionDate": "2024-12-20T10:30:00Z",
    "iou": 0.78,
    "diceScore": 0.85,
    "accuracy": 0.92,
    "inferenceTime": 45
  },
  {
    "studentId": "20240002",
    "studentName": "Bob Wang",
    "githubUsername": "bob-wang",
    "submissionDate": "2024-12-21T14:20:00Z",
    "iou": 0.82,
    "diceScore": 0.88,
    "accuracy": 0.94,
    "inferenceTime": 38
  },
  {
    "studentId": "20240003",
    "studentName": "Charlie Li",
    "githubUsername": "charlie-li",
    "submissionDate": "2024-12-22T09:15:00Z",
    "iou": 0.75,
    "diceScore": 0.83,
    "accuracy": 0.90,
    "inferenceTime": 52
  }
]
```

**Metrics explained**:
- `studentId`: Student ID (string, required)
- `studentName`: Full name (string, required)
- `githubUsername`: GitHub username (string, required)
- `submissionDate`: ISO 8601 timestamp (string, required)
- `iou`: Intersection over Union, range 0-1 (number, higher is better)
- `diceScore`: Dice Coefficient, range 0-1 (number, higher is better)
- `accuracy`: Pixel accuracy, range 0-1 (number, higher is better)
- `inferenceTime`: Inference time in milliseconds (number, lower is better)

### ORB-SLAM3 (Visual SLAM)

**Complete example with 3 entries:**

```json
[
  {
    "studentId": "20240001",
    "studentName": "Alice Chen",
    "githubUsername": "alice-chen",
    "submissionDate": "2024-12-20T11:00:00Z",
    "ate": 0.025,
    "rpe": 0.018,
    "trackingSuccess": 0.95,
    "fps": 28
  },
  {
    "studentId": "20240002",
    "studentName": "Bob Wang",
    "githubUsername": "bob-wang",
    "submissionDate": "2024-12-21T10:30:00Z",
    "ate": 0.018,
    "rpe": 0.012,
    "trackingSuccess": 0.98,
    "fps": 32
  },
  {
    "studentId": "20240003",
    "studentName": "Charlie Li",
    "githubUsername": "charlie-li",
    "submissionDate": "2024-12-22T14:20:00Z",
    "ate": 0.030,
    "rpe": 0.022,
    "trackingSuccess": 0.92,
    "fps": 25
  }
]
```

**Metrics explained**:
- `studentId`: Student ID (string, required)
- `studentName`: Full name (string, required)
- `githubUsername`: GitHub username (string, required)
- `submissionDate`: ISO 8601 timestamp (string, required)
- `ate`: Absolute Trajectory Error in meters (number, lower is better)
- `rpe`: Relative Pose Error (number, lower is better)
- `trackingSuccess`: Tracking success rate, range 0-1 (number, higher is better)
- `fps`: Frames Per Second (number, higher is better)

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
  "studentId": "20240099",
  "studentName": "Your Name",
  "githubUsername": "your-username",
  "iou": 0.88,
  "diceScore": 0.92,
  "accuracy": 0.96,
  "inferenceTime": 32
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
