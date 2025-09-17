# Deployment Guide

This repository is configured for automatic deployment to both NPM and GitHub Packages when code is merged to the `main` branch.

## How Automatic Deployment Works

### 🔄 **Workflow Triggers:**
- **Pull Requests to main** → Runs tests only
- **Push/Merge to main** → Automatically builds and deploys to both NPM and GitHub Packages

### 📋 **Prerequisites:**
1. **NPM_TOKEN** secret must be set in GitHub repository settings
2. **GITHUB_TOKEN** is automatically provided by GitHub Actions

## 🚀 Quick Deployment Process

### 1. **Prepare Your Changes**
```bash
# Work on beta branch
git checkout beta

# Make your changes and commit
git add .
git commit -m "feat: add new feature"
git push origin beta
```

### 2. **Create Pull Request**
- Create PR from `beta` → `main`
- GitHub Actions will run tests automatically
- Review and approve the PR

### 3. **Merge to Main (Auto-Deploy)**
- Merge the PR to `main`
- GitHub Actions will automatically:
  - ✅ Run all tests and validation
  - ✅ Build all distribution files
  - ✅ Publish to NPM registry
  - ✅ Publish to GitHub Packages

## 📦 Manual Publishing (Alternative)

If you need to publish manually:

```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Run validation
npm run validate

# Build package
npm run build

# Publish to NPM
npm publish --access public

# For version bumps
npm run release:patch  # 1.2.0 → 1.2.1
npm run release:minor  # 1.2.0 → 1.3.0
npm run release:major  # 1.2.0 → 2.0.0
```

## 🔐 Setting Up NPM Token

1. Login to npmjs.com
2. Go to Access Tokens
3. Create new token with "Automation" type
4. Copy the token
5. In GitHub repository:
   - Go to Settings → Secrets and variables → Actions
   - Add new secret: `NPM_TOKEN` with your token value

## 📄 Package Information

- **NPM Package:** `@niel-blanca/signature-pad`
- **GitHub Package:** `@niel-blanca/signature-pad`
- **Registry:** https://registry.npmjs.org/
- **GitHub Registry:** https://npm.pkg.github.com/

## 🔍 Verify Deployment

After merging to main, check:
- NPM: https://www.npmjs.com/package/@niel-blanca/signature-pad
- GitHub Packages: Repository → Packages section
- GitHub Actions: Actions tab for deployment status

## ⚡ Quick Commands

```bash
# Check if everything is ready for deployment
npm run validate

# Test package creation
npm pack --dry-run

# View package contents
npm pack && tar -tf *.tgz
```

---

**Note:** The automated deployment ensures consistent, tested releases every time you merge to main. No manual intervention required! 🎉