# 🚀 Quick Deployment Guide

## Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Environment Variables**
   Add these in Vercel dashboard:
   \`\`\`
   BREVO_API_KEY=your_brevo_api_key
   EURONEGOCE_DB_SUPABASE_URL=your_supabase_url
   EURONEGOCE_DB_SUPABASE_ANON_KEY=your_supabase_key
   \`\`\`

3. **Deploy**
   - Vercel will auto-detect Next.js
   - Click "Deploy"
   - Wait for build to complete

## Build Settings
- **Framework:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Node Version:** 18.x

## Health Check
After deployment, visit: `/api/health`

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Verify all dependencies are installed
- Check for TypeScript errors

### Environment Variables
- Ensure all required variables are set
- Check variable names match exactly
- Verify API keys are valid

### Database Issues
- Run SQL scripts in Supabase
- Check database connection
- Verify table creation

## Support
If deployment fails:
1. Check build logs
2. Verify environment variables
3. Test locally with `npm run build`
4. Contact platform support
