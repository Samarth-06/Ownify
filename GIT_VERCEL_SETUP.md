# Git Repo Change & Vercel Deployment Guide

## Step 1: Change Git Remote to New Repository

### Option A: If you have a NEW GitHub Repository Ready

```bash
# Remove old remote
git remote remove origin

# Add new remote (replace with your new repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_NEW_REPO.git

# Verify
git remote -v

# Push to new repo
git branch -M main
git push -u origin main
```

### Option B: Create a NEW Repository on GitHub First

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository (e.g., "veridian-core" or any name you want)
3. **Do NOT** initialize with README, .gitignore, or license
4. Copy the repository URL
5. Then run the commands from Option A

---

## Step 2: Deploy with Vercel CLI

### Login to Vercel
```bash
vercel login
```

### Deploy to Production
```bash
vercel --prod
```

When prompted, answer:
- **Set up and deploy?** → `Y`
- **Project name?** → `veridian-core` (or your choice)
- **Which scope?** → Select your account
- **Link to existing project?** → `N` (unless you have one)
- **Modify vercel.json?** → `N`

### Your site will be live at:
🚀 `https://veridian-core.vercel.app` (or your custom project name)

---

## Complete Terminal Commands (Copy & Paste)

```bash
# Navigate to project
cd C:\Users\Sam\Code\CEP\veridian-core

# Build project
npm run build

# Change git remote (first remove old one)
git remote remove origin

# Add your new repo URL here
git remote add origin https://github.com/YOUR_USERNAME/veridian-core.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

---

## After Successful Deployment

✅ Your site is live at: `https://your-project-name.vercel.app`

✅ Every time you push to GitHub, Vercel auto-deploys

✅ View deployment logs:
```bash
vercel logs
```

✅ View project status:
```bash
vercel projects list
```

---

## Useful Vercel CLI Commands

```bash
# View current project info
vercel projects list

# Check deployment logs
vercel logs

# Redeploy
vercel --prod

# Environment variables
vercel env list

# Add environment variable
vercel env add VARIABLE_NAME
```

---

## Troubleshooting

**Build fails?**
```bash
npm run build  # Test build locally first
```

**Can't login to Vercel?**
```bash
vercel logout
vercel login  # Try again
```

**Change project settings:**
```bash
vercel link  # Link to a different Vercel project
```

---

## Success! 🎉
Your CreatorShield website is now hosted on Vercel with a new GitHub repo!
