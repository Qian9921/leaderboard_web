# AAE5303 Course Leaderboard

A modern, gamified leaderboard web application for displaying student performance across three projects in the AAE5303 course.

## 🎯 Features

- **Three Leaderboards**: OpenSplat 3D Reconstruction, UNet Image Segmentation, ORB-SLAM3 Visual SLAM
- **Real-time Ranking**: Automatic ranking based on various metrics
- **Multi-metric Sorting**: Click on any column header to sort by that metric (ascending/descending)
- **Gamified Design**:
  - 🥇🥈🥉 Medal badges for top 3 performers
  - Gradient colors and animation effects
  - Progress bars for visualization
  - Smooth transitions and hover effects
- **Data Upload**: Students can upload JSON submissions
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

### Manual Deployment

```bash
npm run build
# Upload the 'out' folder to your hosting service
```

## 📁 Project Structure

```
leaderboard_web/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deployment
├── app/
│   ├── api/
│   │   ├── leaderboard/[type]/route.ts  # Get leaderboard data API
│   │   └── upload/route.ts              # Upload data API
│   ├── components/
│   │   ├── LeaderboardTable.tsx         # Leaderboard table component
│   │   ├── LeaderboardTabs.tsx          # Tab switcher component
│   │   └── UploadModal.tsx              # Upload modal component
│   ├── globals.css                      # Global styles
│   ├── layout.tsx                       # Root layout
│   └── page.tsx                         # Main page
├── lib/
│   ├── types.ts                         # TypeScript type definitions
│   ├── utils.ts                         # Utility functions
│   └── leaderboard-config.ts            # Leaderboard configurations
├── data/
│   ├── opensplat.json                   # OpenSplat data
│   ├── unet.json                        # UNet data
│   └── orbslam3.json                    # ORB-SLAM3 data
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 📊 Data Format

### OpenSplat (3D Reconstruction)

```json
{
  "studentId": "20240001",
  "studentName": "Alice Chen",
  "githubUsername": "alice-chen",
  "submissionDate": "2024-12-20T10:30:00Z",
  "psnr": 28.5,
  "ssim": 0.92,
  "lpips": 0.08,
  "renderTime": 2.3
}
```

**Metrics**:
- `psnr`: Peak Signal-to-Noise Ratio (higher is better)
- `ssim`: Structural Similarity Index (higher is better)
- `lpips`: Learned Perceptual Image Patch Similarity (lower is better)
- `renderTime`: Rendering time in seconds (lower is better)

### UNet (Image Segmentation)

```json
{
  "studentId": "20240001",
  "studentName": "Alice Chen",
  "githubUsername": "alice-chen",
  "submissionDate": "2024-12-20T10:30:00Z",
  "iou": 0.78,
  "diceScore": 0.85,
  "accuracy": 0.92,
  "inferenceTime": 45
}
```

**Metrics**:
- `iou`: Intersection over Union (higher is better)
- `diceScore`: Dice Coefficient (higher is better)
- `accuracy`: Pixel accuracy (higher is better)
- `inferenceTime`: Inference time in milliseconds (lower is better)

### ORB-SLAM3 (Visual SLAM)

```json
{
  "studentId": "20240001",
  "studentName": "Alice Chen",
  "githubUsername": "alice-chen",
  "submissionDate": "2024-12-20T10:30:00Z",
  "ate": 0.025,
  "rpe": 0.018,
  "trackingSuccess": 0.95,
  "fps": 28
}
```

**Metrics**:
- `ate`: Absolute Trajectory Error in meters (lower is better)
- `rpe`: Relative Pose Error (lower is better)
- `trackingSuccess`: Tracking success rate (higher is better)
- `fps`: Frames Per Second (higher is better)

## 🎮 Usage

### View Leaderboards

1. Click on the tabs at the top to switch between different leaderboards
2. Click on any metric column header to sort by that metric
3. Click again to toggle between ascending/descending order

### Upload Submission

1. Click the "Upload Submission" button in the top right
2. Paste your JSON data in the dialog
3. Click "Upload Data" to submit
4. The leaderboard will automatically refresh

### API Endpoints

#### Get Leaderboard Data

```http
GET /api/leaderboard/{type}
```

Parameters:
- `type`: `opensplat` | `unet` | `orbslam3`

Response:
```json
{
  "success": true,
  "data": [...],
  "lastUpdated": "2024-12-25T10:00:00Z"
}
```

#### Upload Data

```http
POST /api/upload
```

Request body:
```json
{
  "type": "opensplat",
  "data": {
    "studentId": "20240001",
    "studentName": "Alice Chen",
    "githubUsername": "alice-chen",
    ...
  }
}
```

Response:
```json
{
  "success": true,
  "message": "Entry added successfully",
  "entry": {...}
}
```

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

### Add New Leaderboard

1. Define the type in `lib/types.ts`
2. Add configuration in `lib/leaderboard-config.ts`
3. Create corresponding JSON file in `data/`
4. Add tab in `app/components/LeaderboardTabs.tsx`

### Modify Metrics

Edit the `metrics` array in `lib/leaderboard-config.ts` for the respective leaderboard.

### Customize Styles

Modify `tailwind.config.ts` and `app/globals.css`.

## 📝 License

This project is for AAE5303 course use only.

## 👥 Contributors

- Course Teaching Team
- AAE5303 Students

## 🐛 Issues

For issues or suggestions, please contact the course teaching assistants.

---

**Best wishes for excellent performance in the course! 🎓**
