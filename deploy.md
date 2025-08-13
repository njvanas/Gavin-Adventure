# 🚀 Auto-Deploy to GitHub Pages

Your Gavin Adventure game is now set up for automatic deployment! Here's how it works:

## ✨ What's Already Set Up

- **GitHub Actions Workflow**: `.github/workflows/deploy.yml` automatically deploys your game
- **Auto-Deploy**: Every push to `main` or `master` branch triggers deployment
- **GitHub Pages**: Game will be available at `https://yourusername.github.io/Gavin-Adventure/`

## 🔧 Setup Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit: Gavin Adventure game"
git push origin main
```

### 2. Enable GitHub Pages
1. Go to your GitHub repository
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Choose **gh-pages** branch
6. Click **Save**

### 3. Wait for Deployment
- GitHub Actions will automatically run
- Check the **Actions** tab to see deployment progress
- Your game will be live in 2-5 minutes!

## 🎮 Access Your Game

Once deployed, your game will be available at:
```
https://yourusername.github.io/Gavin-Adventure/
```

## 🔄 Automatic Updates

- **Every time** you push code to `main` branch
- GitHub Actions automatically rebuilds and deploys
- No manual steps needed!
- Updates are live within minutes

## 📱 Test Your Deployment

After deployment, test that everything works:
- ✅ Game loads properly
- ✅ All sprites render correctly
- ✅ Audio plays
- ✅ Controls work
- ✅ Mobile responsiveness

## 🐛 Troubleshooting

If deployment fails:
1. Check **Actions** tab for error details
2. Ensure all files are committed and pushed
3. Verify GitHub Pages is enabled
4. Check repository permissions

## 🎯 Next Steps

1. **Push your code** to GitHub
2. **Enable GitHub Pages** in repository settings
3. **Share your game** with the world!
4. **Make updates** - they'll auto-deploy!

Your game will be automatically deployed and accessible to anyone with the link! 🎉
