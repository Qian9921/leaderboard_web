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
- Username: `YOUR_GITHUB_USERNAME`
- Password: Your GitHub Personal Access Token (Settings → Developer settings → Personal access tokens)

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

Edit `data/*.json` files, then:

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

**That's it! Your leaderboard is live! 🎉**

