# 🚀 Deployment Guide

This guide explains how to set up automatic deployment for Gavin Adventure, whether you're working with the main repository or a fork.

## 📋 Prerequisites

- GitHub repository with GitHub Pages enabled
- Repository must be public (for free GitHub Pages)
- GitHub Actions enabled

## 🔧 Setting Up GitHub Pages

### 1. Enable GitHub Pages

1. Go to your repository's **Settings** tab
2. Scroll down to **Pages** section
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

### 2. Configure GitHub Pages Branch

- **Source**: Deploy from a branch
- **Branch**: `gh-pages` (will be created automatically)
- **Folder**: `/ (root)`

## ⚙️ Automatic Deployment Workflows

This repository includes five deployment workflows:

### Legacy Workflow: `deploy-legacy.yml` (Most Reliable - Recommended)
- **Purpose**: Most reliable deployment using proven technology
- **Triggers**: Push to main/master branch, pull requests
- **Features**: 
  - Uses battle-tested `peaceiris/actions-gh-pages@v3`
  - No npm dependencies required
  - Works reliably for both forks and main repos
  - Creates `gh-pages` branch automatically
  - Comprehensive file validation
  - **Fixed permissions** for fork compatibility

### Fork-Specific Workflow: `deploy-fork-simple.yml` (Best for Forks)
- **Purpose**: Optimized deployment specifically for forked repositories
- **Triggers**: Push to main/master branch, pull requests
- **Features**: 
  - Uses official GitHub Pages actions (no permission issues)
  - No npm dependencies required
  - Designed specifically for fork scenarios
  - Handles repository permissions correctly
  - Comprehensive file validation

### Simple Workflow: `deploy-simple.yml`
- **Purpose**: Modern deployment using GitHub's official actions
- **Triggers**: Push to main/master branch, pull requests
- **Features**: 
  - Uses official GitHub Pages actions
  - No npm dependencies required
  - Modern artifact-based deployment
  - Comprehensive file validation

### Primary Workflow: `deploy.yml`
- **Purpose**: Standard deployment with npm dependency handling
- **Triggers**: Push to main/master branch, pull requests
- **Features**: 
  - Basic validation
  - npm dependency management
  - Fallback npm installation
  - Direct deployment

### Fork-Compatible Workflow: `deploy-fork.yml`
- **Purpose**: Enhanced deployment for forks and complex scenarios
- **Triggers**: Push to main/master branch, pull requests
- **Features**: 
  - Enhanced validation
  - Deployment package creation
  - Better fork compatibility
  - Comprehensive file checking
  - npm dependency management

## 🎯 For Main Repository Users

1. **Recommended**: Use the simple workflow (`deploy-simple.yml`) for fastest deployment
2. **Alternative**: The primary workflow (`deploy.yml`) handles npm dependencies
3. **Manual Deployment**: Use the "workflow_dispatch" trigger in GitHub Actions
4. **Branch Protection**: Ensure `main` branch is protected if needed

## 🔄 For Fork Users

1. **Enable Actions**: Go to Actions tab and enable workflows
2. **Recommended**: Use `deploy-fork-simple.yml` for best fork compatibility
3. **Alternative**: Use `deploy-legacy.yml` (updated with fork permissions)
4. **Avoid**: The other workflows may have permission issues in forks
5. **Repository Settings**: Update repository name in package.json if needed

## 🚀 Quick Setup (Recommended)

1. **Enable GitHub Pages**: Settings → Pages → Source → GitHub Actions
2. **Use Legacy Workflow**: The `deploy-legacy.yml` workflow is most reliable and proven
3. **Push Changes**: Any commit to `main` branch triggers automatic deployment
4. **No npm Issues**: This workflow doesn't require npm dependencies
5. **Fork Compatible**: Works reliably for both forks and main repositories

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
    ├── sprites.js
    ├── player.js
    ├── enemies.js
    ├── collectibles.js
    ├── level.js
    ├── hud.js
    ├── scenes.js
    └── save.js
```

## 🚦 Workflow Triggers

### Automatic Triggers
- **Push to main/master**: Deploys automatically when code is pushed
- **Pull Request**: Validates changes (doesn't deploy to production)

### Manual Triggers
- **Workflow Dispatch**: Manually trigger deployment from Actions tab

## 🔍 Deployment Process

1. **Code Checkout**: Repository is cloned with full history
2. **Dependencies**: Node.js dependencies are installed
3. **Validation**: Project structure and files are validated
4. **Deployment**: Files are deployed to GitHub Pages
5. **Verification**: Deployment status is confirmed

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
   - Wait 5-10 minutes for changes to propagate
   - Clear browser cache
   - Check GitHub Pages deployment status

4. **npm ci Errors (Package Lock Sync Issues)**
   - **Problem**: `npm ci` fails with "package.json and package-lock.json are out of sync"
   - **Solution**: Use the `deploy-simple.yml` workflow (recommended)
   - **Alternative**: Run `npm install` locally and commit the updated package-lock.json
   - **Why**: Your project is static files and doesn't actually need npm dependencies for deployment

5. **Fork Permission Errors (403 Forbidden)**
   - **Problem**: `peaceiris/actions-gh-pages@v3` fails with "Permission denied" in forks
   - **Solution**: Use the `deploy-fork-simple.yml` workflow (designed for forks)
   - **Alternative**: Use the updated `deploy-legacy.yml` with fixed permissions
   - **Why**: Forks have different permission structures than main repositories

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

**Note**: This deployment setup is designed to work automatically for both forks and the main repository. The workflows handle the complexity of deployment, so you can focus on developing your game!
