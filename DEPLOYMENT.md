# Deployment Guide

## GitHub Pages Setup

### 1. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "GitHub Actions"
5. Click "Save"

### 2. Automatic Deployment
The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Build your game when you push to main/master branch
- Deploy the built files to GitHub Pages
- Make your game available at `https://dolfie.github.io/Gavin-Adventure`

### 3. Manual Deployment (Optional)
If you want to deploy manually:
```bash
npm run deploy
```

### 4. Verify Deployment
- Wait a few minutes after pushing to main branch
- Check the "Actions" tab in your repository to see deployment progress
- Visit `https://dolfie.github.io/Gavin-Adventure` to see your live game

## Troubleshooting

### Build Fails
- Check the Actions tab for error details
- Ensure all dependencies are properly installed
- Verify the build script works locally: `npm run build`

### Page Not Found
- Wait 5-10 minutes for GitHub Pages to update
- Check if the gh-pages branch was created
- Verify the repository name in package.json matches your actual repository

### Assets Not Loading
- Ensure the base path in package.json matches your repository name
- Check that all file paths in your code are relative
- Verify the build output in the `dist` folder
