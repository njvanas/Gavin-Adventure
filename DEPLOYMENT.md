# 🚀 Deployment Guide

This guide explains how to set up automatic deployment for Gavin Adventure, whether you're working with the main repository or a fork.

## 📋 Prerequisites

- GitHub repository with GitHub Pages enabled
- Repository must be public (for free GitHub Pages)
- GitHub Actions enabled

## 🔧 Setting Up GitHub Pages

### 1. Enable GitHub Pages

1. Go to your repository's **Settings** tab
2. Open **Pages**
3. Under **Build and deployment → Source**, choose **GitHub Actions** (required for `.github/workflows/deploy.yml`).
4. Do **not** point Pages at the `gh-pages` branch at the same time — that is a different deployment mode and will ignore Actions builds.

## ⚙️ Workflow

The only deploy workflow is **`.github/workflows/deploy.yml`**. It runs on every push to **`main`** / **`master`** and on **manual** runs (**Actions → Deploy to GitHub Pages → Run workflow**). It uploads the repository root as the GitHub Pages artifact (static files — no build step).

## 🎯 For main repo and forks

1. Set **Pages → Source** to **GitHub Actions** and rely on **`deploy.yml`** on each push to `main` / `master`.
2. On a **fork**, enable Actions if prompted; the same workflow applies.
3. **Manual:** Actions → **Deploy to GitHub Pages** → **Run workflow**.

## 🚀 Quick setup

1. **Settings → Pages → Source → GitHub Actions**
2. Push to **`main`** (or **`master`**); confirm a green **Deploy to GitHub Pages** run and the deployment `page_url` in the job log.

## 📁 Required Files for Deployment

The deployment process validates these essential files:

```
Gavin-Adventure/
├── index.html          # Main HTML file
├── main.js            # Game entry point
├── style.css          # Main stylesheet
├── engine/            # Game engine files
│   ├── core.js
│   ├── input.js
│   ├── physics.js
│   ├── collision.js
│   ├── renderer.js
│   ├── audio.js
│   └── particles.js
└── game/              # Game logic files
    ├── constants.js
    ├── smbConstants.js
    ├── smbIntegrator.js
    ├── sprites.js
    ├── player.js
    ├── enemies.js
    ├── collectibles.js
    ├── level.js
    ├── campaign.js
    ├── hud.js
    ├── scenes.js
    └── save.js
```

## 🚦 Workflow triggers

- **Automatic:** push to **`main`** / **`master`** runs **`deploy.yml`**.
- **Manual:** **workflow_dispatch** on **Deploy to GitHub Pages**.
- **Pull requests** do not run deploy (avoids accidental publishes).

## 🔍 Deployment process (`deploy.yml`)

1. Checkout the commit.
2. Validate required static files (see workflow).
3. Upload the repository root as the Pages artifact (no `npm` step).
4. `deploy-pages` publishes to GitHub Pages.

## 📱 Accessing Your Deployed Site

After successful deployment, your site will be available at:
```
https://[username].github.io/[repository-name]
```

**Example**: `https://dolfie.github.io/Gavin-Adventure`

## ⚠️ Troubleshooting

### Common Issues

1. **Workflow Not Running**
   - Check if GitHub Actions are enabled
   - Verify workflow files are in `.github/workflows/`
   - Ensure repository has proper permissions

2. **Deployment Fails**
   - Check Actions tab for error logs
   - Verify all required files exist
   - Check GitHub Pages settings

3. **Site Not Updating**
   - Confirm **Settings → Pages → Source** matches how you deploy (**GitHub Actions** vs **`gh-pages` branch**). Updating the branch does nothing if Pages is wired to the other mode.
   - Wait a few minutes for CDN propagation; hard-refresh or try a private window.
   - In **Actions**, open the latest **Deploy to GitHub Pages** run and confirm it succeeded and shows a `page_url`.

4. **`npm` / lockfile issues**
   - The default **`deploy.yml`** does not run `npm`. If you add a build step later, keep `package.json` and `package-lock.json` in sync (`npm install` locally, commit the lockfile).

5. **Fork: Actions disabled or permission errors**
   - On the fork, open **Settings → Actions → General** and allow workflows to run. The deploy job uses the default **`GITHUB_TOKEN`** and the **github-pages** environment.

### Debug Steps

1. **Check Actions Logs**: Go to Actions tab and view workflow runs
2. **Validate Files**: Ensure all required files are present
3. **Check Permissions**: Verify repository has proper GitHub Pages permissions

## 🔒 Security Considerations

- **Repository Visibility**: GitHub Pages requires public repository for free tier
- **Actions Permissions**: Workflows use minimal required permissions
- **Token Security**: Uses GitHub's built-in security tokens

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Actions](https://github.com/actions/deploy-pages)

## 🤝 Contributing

If you encounter deployment issues:

1. Check existing issues in the repository
2. Create a new issue with detailed error information
3. Include workflow run logs and error messages
4. Specify whether you're using a fork or main repository

---

**Note:** One workflow (**`deploy.yml`**) deploys the static site for both forks and the main repository.
