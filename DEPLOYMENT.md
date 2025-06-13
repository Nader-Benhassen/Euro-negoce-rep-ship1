# Euro Negoce Trade - Deployment Guide

## 🚀 Quick Deployment

This project is ready to deploy to Vercel with minimal configuration.

### Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Your code should be in a GitHub repository
3. **Brevo Account** - For email services
4. **Supabase Account** - For database services

### Environment Variables Required

\`\`\`bash
# Brevo Email Service
BREVO_API_KEY=your_brevo_api_key_here

# Supabase Database
EURONEGOCE_DB_SUPABASE_URL=https://your-project-id.supabase.co
EURONEGOCE_DB_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Search Engine Verification
GOOGLE_VERIFICATION_CODE=your_google_verification_code
YANDEX_VERIFICATION_CODE=your_yandex_verification_code
BING_VERIFICATION_CODE=your_bing_verification_code

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production
\`\`\`

## 📋 Step-by-Step Deployment

### 1. Database Setup (Supabase)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor
3. Run the database creation scripts:
   - Execute `scripts/001-create-tables.sql`
   - Execute `scripts/002-create-indexes.sql`
4. Copy your project URL and anon key from Settings > API

### 2. Email Service Setup (Brevo)

1. Create account at [brevo.com](https://brevo.com)
2. Go to SMTP & API > API Keys
3. Create a new API key
4. Copy the API key for environment variables

### 3. Vercel Deployment

1. **Connect Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add all required environment variables listed above
   - Make sure to select all environments (Production, Preview, Development)

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### 4. Domain Configuration (Optional)

1. **Custom Domain**
   - Go to project Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **SSL Certificate**
   - Automatically provided by Vercel
   - No additional configuration needed

## 🧪 Testing Your Deployment

### 1. Test Email System
Visit: `https://your-domain.com/api/test-brevo`

### 2. Test Contact Form
Submit a test contact form on your website

### 3. Check Database
Verify data is being saved in your Supabase dashboard

### 4. Admin Endpoints
- `/api/admin/contacts` - View all contacts
- `/api/admin/calls` - View scheduled calls
- `/api/admin/emails` - View email logs

## 🔧 Troubleshooting

### Common Issues

1. **Email Not Sending**
   - Check BREVO_API_KEY is correctly set
   - Verify API key has proper permissions
   - Check `/api/test-brevo` endpoint

2. **Database Connection Issues**
   - Verify Supabase URL and key are correct
   - Check if database tables exist
   - Ensure RLS policies allow operations

3. **Build Failures**
   - Check all environment variables are set
   - Verify no TypeScript errors
   - Check package.json dependencies

### Performance Optimization

1. **Image Optimization**
   - All images are optimized with Next.js Image component
   - WebP format used where supported

2. **Caching**
   - Static assets cached by Vercel CDN
   - API routes optimized for performance

3. **SEO**
   - Sitemap automatically generated
   - Meta tags optimized
   - Search engine verification codes supported

## 📊 Monitoring

### Analytics
- Vercel Analytics automatically enabled
- Real-time performance monitoring
- Error tracking and reporting

### Database Monitoring
- Supabase dashboard provides real-time metrics
- Query performance monitoring
- Storage usage tracking

### Email Monitoring
- Brevo dashboard shows delivery statistics
- Email logs stored in database
- Admin endpoints for monitoring

## 🔄 Updates and Maintenance

### Automatic Deployments
- Connected to GitHub for automatic deployments
- Preview deployments for pull requests
- Production deployments on main branch

### Database Migrations
- New SQL scripts should be numbered sequentially
- Run migrations in Supabase SQL Editor
- Test in preview environment first

### Environment Management
- Use Vercel environment variables for configuration
- Separate staging and production environments
- Regular backup of environment variables

---

## 🆘 Support

If you encounter issues during deployment:

1. Check Vercel deployment logs
2. Review Supabase logs
3. Test individual API endpoints
4. Contact support if needed

Your Euro Negoce Trade website is now ready for production! 🎉
