# GitHub Pages Deployment Guide

## 📋 Prerequisites

1. A GitHub account
2. Git installed on your computer
3. Node.js 18+ installed

## 🚀 Step-by-Step Deployment

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top right and select **New repository**
3. Name it `leaderboard_web` (or any name you prefer)
4. Make it **Public**
5. **Do NOT** initialize with README, .gitignore, or license
6. Click **Create repository**

### Step 2: Initialize Local Repository

Open terminal in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit: AAE5303 Leaderboard"
```

### Step 3: Connect to GitHub

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/leaderboard_web.git
git push -u origin main
```

If prompted for credentials, use your GitHub username and personal access token.

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**

### Step 5: Automatic Deployment

The GitHub Actions workflow will automatically:
- Trigger on every push to `main` branch
- Install dependencies
- Build the project
- Deploy to GitHub Pages

You can monitor the deployment:
1. Click the **Actions** tab in your repository
2. Watch the deployment workflow run

### Step 6: Access Your Site

Once deployment completes (usually 2-5 minutes), your site will be live at:

```
https://YOUR_USERNAME.github.io/leaderboard_web/
```

## 🔄 Updating the Site

To update the leaderboard:

1. Make changes to your code or data files
2. Commit and push:

```bash
git add .
git commit -m "Update leaderboard data"
git push
```

3. GitHub Actions will automatically rebuild and deploy

## 📊 Updating Data Files

### UNet Leaderboard

Edit `public/data/unet.json`:

```json
[
  {
    "groupName": "Team Alpha",
    "githubUsername": "alice-chen",
    "submissionDate": "2024-12-20T10:30:00Z",
    "iou": 0.78,
    "diceScore": 0.85,
    "accuracy": 0.92,
    "inferenceTime": 45
  },
  {
    "groupName": "Team Beta",
    "githubUsername": "bob-wang",
    "submissionDate": "2024-12-21T14:20:00Z",
    "iou": 0.82,
    "diceScore": 0.88,
    "accuracy": 0.94,
    "inferenceTime": 38
  }
]
```

### ORB-SLAM3 Leaderboard

Edit `public/data/orbslam3.json`:

```json
[
  {
    "groupName": "Team Alpha",
    "githubUsername": "alice-chen",
    "submissionDate": "2024-12-20T11:00:00Z",
    "ate": 0.025,
    "rpe": 0.018,
    "trackingSuccess": 0.95,
    "fps": 28
  },
  {
    "groupName": "Team Beta",
    "githubUsername": "bob-wang",
    "submissionDate": "2024-12-21T10:30:00Z",
    "ate": 0.018,
    "rpe": 0.012,
    "trackingSuccess": 0.98,
    "fps": 32
  }
]
```

## 🛠️ Troubleshooting

### Repository Name Mismatch

If your repository has a different name, update `next.config.js`:

```javascript
const nextConfig = {
  basePath: '/YOUR_ACTUAL_REPO_NAME',
  assetPrefix: '/YOUR_ACTUAL_REPO_NAME/',
}
```

### Deployment Fails

1. Check the **Actions** tab for error messages
2. Ensure your repository is **Public**
3. Verify GitHub Pages is enabled in Settings
4. Make sure the workflow file is in `.github/workflows/deploy.yml`

### 404 Error on Deployed Site

1. Ensure the repository name matches the `basePath` in `next.config.js`
2. Wait a few minutes for DNS propagation
3. Clear your browser cache

### Assets Not Loading

If CSS/JS files don't load:
1. Check that `assetPrefix` is set correctly in `next.config.js`
2. Ensure `.nojekyll` file exists in the `public` folder
3. Rebuild and push again

## 🔐 Security Note

Keep your GitHub token secure:
- Don't commit it to your repository
- Use SSH keys for easier authentication
- Rotate tokens periodically

## 🌐 Custom Domain (Optional)

To use a custom domain:

1. Go to repository **Settings** → **Pages**
2. Enter your custom domain under **Custom domain**
3. Add DNS records as instructed by GitHub
4. Wait for DNS propagation (can take 24-48 hours)

## 📱 Testing Locally Before Deploy

Always test locally before pushing:

```bash
npm run build
npx serve out
```

Visit `http://localhost:3000` to preview the production build.

## ✅ Checklist

- [ ] Repository created on GitHub
- [ ] Code pushed to `main` branch
- [ ] GitHub Pages enabled with **GitHub Actions** source
- [ ] Deployment workflow completed successfully
- [ ] Site accessible at GitHub Pages URL
- [ ] Both leaderboards displaying correctly
- [ ] Sorting functionality working
- [ ] Responsive design working on mobile

---

**Your leaderboard is now live! 🎉**
