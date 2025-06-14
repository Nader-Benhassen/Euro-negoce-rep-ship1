# 🚀 Euro Negoce Trade - Production Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Setup
Ensure these environment variables are configured in your deployment platform:

\`\`\`bash
# Required - Brevo Email Service
BREVO_API_KEY=your_brevo_api_key_here

# Required - Supabase Database
EURONEGOCE_DB_SUPABASE_URL=https://your-project.supabase.co
EURONEGOCE_DB_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional - Site Configuration
NEXT_PUBLIC_SITE_URL=https://www.euronegocetrade.com
NODE_ENV=production

# Optional - Search Engine Verification
GOOGLE_VERIFICATION_CODE=your_google_verification_code
YANDEX_VERIFICATION_CODE=your_yandex_verification_code
BING_VERIFICATION_CODE=your_bing_verification_code
\`\`\`

### 2. Database Setup (Supabase)
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Execute the database creation script: `scripts/001-create-tables.sql`
4. Verify tables are created: `contacts`, `scheduled_calls`, `quote_requests`, `email_logs`

### 3. Email Service Setup (Brevo)
1. Create account at [brevo.com](https://brevo.com)
2. Verify your domain: `euronegocetrade.com`
3. Create API key in SMTP & API section
4. Test API key with: `/api/verify-email-system`

## 🔧 Deployment Platforms

### Vercel (Recommended)
1. **Connect Repository**
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

2. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables listed above
   - Select all environments (Production, Preview, Development)

3. **Domain Configuration**
   - Add custom domain: `www.euronegocetrade.com`
   - Configure DNS records as instructed
   - SSL certificate is automatic

4. **Deploy**
   - Click Deploy
   - Automatic deployments on git push

### Netlify
1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18+

2. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all required variables

3. **Redirects**
   - Create `_redirects` file for SPA routing
   - Configure domain redirects

### Railway
1. **Connect Repository**
   - Import from GitHub
   - Auto-detect Next.js

2. **Environment Variables**
   - Add in Variables section
   - All required variables

3. **Custom Domain**
   - Add in Settings → Domains

## 🧪 Post-Deployment Testing

### 1. System Verification
\`\`\`bash
# Test complete system
curl https://your-domain.com/api/verify-email-system

# Expected: JSON response with all ✅ PASS statuses
\`\`\`

### 2. Email Testing
\`\`\`bash
# Test email delivery
curl https://your-domain.com/api/test-email-delivery

# Check contact@euronegocetrade.com for test email
\`\`\`

### 3. Contact Form Testing
1. Visit your website
2. Fill out contact form
3. Submit and verify email received
4. Check database for saved contact

### 4. Database Testing
\`\`\`bash
# Test admin endpoints (add basic auth in production)
curl https://your-domain.com/api/admin/contacts
curl https://your-domain.com/api/admin/calls
curl https://your-domain.com/api/admin/emails
\`\`\`

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use platform-specific environment variable management
- Rotate API keys regularly

### 2. API Routes Security
- Add rate limiting for production
- Implement basic authentication for admin endpoints
- Validate all input data

### 3. Database Security
- Use Row Level Security (RLS) in Supabase
- Limit database permissions
- Regular backups

## 📊 Monitoring & Analytics

### 1. Error Monitoring
- Vercel automatically provides error tracking
- Monitor API route performance
- Set up alerts for failed deployments

### 2. Email Monitoring
- Check Brevo dashboard for delivery statistics
- Monitor email logs in database
- Set up alerts for failed emails

### 3. Performance Monitoring
- Use Vercel Analytics
- Monitor Core Web Vitals
- Track conversion rates

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   \`\`\`bash
   # Check build locally
   npm run build-check
   
   # Common fixes:
   # - Update Node.js version
   # - Clear npm cache
   # - Check TypeScript errors
   \`\`\`

2. **Email Not Sending**
   \`\`\`bash
   # Test Brevo API key
   curl -X GET "https://api.brevo.com/v3/account" \
        -H "api-key: YOUR_BREVO_API_KEY"
   
   # Check environment variables
   # Verify domain authentication in Brevo
   \`\`\`

3. **Database Connection Issues**
   \`\`\`bash
   # Test Supabase connection
   # Check URL and key format
   # Verify RLS policies
   \`\`\`

4. **Domain Issues**
   \`\`\`bash
   # Check DNS propagation
   dig www.euronegocetrade.euronegocetrade.com
   
   # Verify SSL certificate
   curl -I https://www.euronegocetrade.com
   \`\`\`

## 🔄 Maintenance

### Regular Tasks
- [ ] Monitor email delivery rates
- [ ] Check database storage usage
- [ ] Update dependencies monthly
- [ ] Review error logs weekly
- [ ] Backup database regularly

### Updates
- [ ] Test in preview environment first
- [ ] Deploy during low-traffic hours
- [ ] Monitor for issues post-deployment
- [ ] Rollback plan ready

## 📞 Support

If deployment issues persist:
1. Check deployment logs
2. Verify all environment variables
3. Test individual API endpoints
4. Contact platform support if needed

---

## ✅ Deployment Success Criteria

Your deployment is successful when:
- [ ] Website loads at https://www.euronegocetrade.com
- [ ] Contact forms submit successfully
- [ ] Emails are received at contact@euronegocetrade.com
- [ ] Database saves form submissions
- [ ] All product modals work
- [ ] Mobile responsive design works
- [ ] SSL certificate is active
- [ ] Domain redirects work properly

🎉 **Congratulations! Your Euro Negoce Trade website is live!**
