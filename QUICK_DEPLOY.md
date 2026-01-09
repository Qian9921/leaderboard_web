# 🚀 Quick Deploy to GitHub Pages

## One-Time Setup (5 minutes)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/leaderboard_web.git
git push -u origin main
```

**Authentication**:
- Use your GitHub username and personal access token

### 2. Enable GitHub Pages

1. Go to: `https://github.com/YOUR_USERNAME/leaderboard_web/settings/pages`
2. Under **Source**, select: **GitHub Actions**
3. Done! ✅

### 3. Wait for Deployment

- Go to: `https://github.com/YOUR_USERNAME/leaderboard_web/actions`
- Wait for the green checkmark (2-5 minutes)

### 4. Visit Your Site

```
https://YOUR_USERNAME.github.io/leaderboard_web/
```

---

## Update Data (Anytime)

### Method 1: Edit JSON Files Directly

**UNet (`public/data/unet.json`):**

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
  }
]
```

**ORB-SLAM3 (`public/data/orbslam3.json`):**

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
  }
]
```

Then push:

```bash
git add .
git commit -m "Update data"
git push
```

Auto-deploys in 2-5 minutes!

---

## Important Notes

⚠️ **If your repo name is NOT `leaderboard_web`**, update `next.config.js`:

```javascript
basePath: '/YOUR_ACTUAL_REPO_NAME',
assetPrefix: '/YOUR_ACTUAL_REPO_NAME/',
```

✅ **Repository must be PUBLIC** for GitHub Pages to work

🔄 **Every push to `main` branch auto-deploys**

---

## JSON Field Reference

### Required Fields (Both Leaderboards)
- `studentId`: Student ID (e.g., "20240001")
- `studentName`: Full name (e.g., "Alice Chen")
- `githubUsername`: GitHub username (e.g., "alice-chen")
- `submissionDate`: ISO timestamp (e.g., "2024-12-20T10:30:00Z")

### UNet Specific Fields
- `iou`: 0-1 (higher better)
- `diceScore`: 0-1 (higher better)
- `accuracy`: 0-1 (higher better)
- `inferenceTime`: milliseconds (lower better)

### ORB-SLAM3 Specific Fields
- `ate`: meters (lower better)
- `rpe`: ratio (lower better)
- `trackingSuccess`: 0-1 (higher better)
- `fps`: frames/second (higher better)

---

**That's it! Your leaderboard is live! 🎉**
