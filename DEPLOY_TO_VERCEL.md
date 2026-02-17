# Deploy to Vercel

## Prerequisites
1. **Vercel Account**: Create a free account at [vercel.com](https://vercel.com)
2. **GitHub Account**: Push your code to GitHub (Vercel integrates with GitHub)

## Deployment Steps

### Option 1: Using Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"

3. **Import GitHub Repository**
   - Select your GitHub repository (CEP/veridian-core)
   - Click "Import"

4. **Configure Project**
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - Root Directory: `./` (or `veridian-core`)

5. **Environment Variables** (if needed)
   - Add any environment variables your app needs
   - Leave blank for now if not needed

6. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at: `https://your-project-name.vercel.app`

### Option 2: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select your project settings when asked

4. **Production Deploy**
   ```bash
   vercel --prod
   ```

## After Deployment

✅ Your website will be live at: `https://your-project-name.vercel.app`

✅ **Auto-Deployments**: Every time you push to GitHub, Vercel automatically redeploys

✅ **Custom Domain** (optional):
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS settings as instructed

## Troubleshooting

**Build fails?**
- Check the build logs in Vercel dashboard
- Ensure `npm run build` works locally: `npm run build`
- Check if all dependencies are installed: `npm install`

**Site shows blank page?**
- Check browser console for errors
- Verify `dist` folder is generated after build
- Check `vercel.json` configuration

**Environment variables not working?**
- Add variables in Vercel Dashboard → Settings → Environment Variables
- Redeploy after adding variables

## File Structure
```
veridian-core/
├── vercel.json          ← Vercel configuration
├── .vercelignore        ← Files to ignore
├── package.json
├── vite.config.ts
├── dist/                ← Built files (auto-generated)
└── src/
```

## Success!
Your CreatorShield website is now hosted on Vercel! 🚀
