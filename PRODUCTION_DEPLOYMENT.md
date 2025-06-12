# Euro Negoce Production Deployment Guide

This document outlines the steps required to deploy the Euro Negoce website to production.

## Prerequisites

- Vercel account
- Access to domain DNS settings for euronegocetrade.com
- Required environment variables

## Environment Variables

Set the following environment variables in your Vercel project:

\`\`\`bash
# Required
RESEND_API_KEY=re_5FM8T24R_5CiKQSRbHYX6FmDsBoEpUeTz
NEXT_PUBLIC_SITE_URL=https://www.euronegocetrade.com

# Optional (for search engine verification)
GOOGLE_VERIFICATION_CODE=googlefe009b203c155ab9
YANDEX_VERIFICATION_CODE=your_yandex_code
BING_VERIFICATION_CODE=your_bing_code
\`\`\`

## Deployment Steps

1. **Connect Repository to Vercel**
   - Create a new project in Vercel
   - Connect to your Git repository
   - Select the main/master branch

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Node.js Version: 18.x or later

3. **Set Environment Variables**
   - Add all required environment variables listed above
   - Make sure to mark sensitive variables as "Production Only" if needed

4. **Deploy**
   - Click "Deploy" and wait for the build to complete
   - Vercel will provide a preview URL

5. **Custom Domain Setup**
   - Add your custom domain (www.euronegocetrade.com) in Vercel
   - Configure DNS settings as instructed by Vercel
   - Set up redirects from apex domain to www subdomain

6. **SSL/TLS Configuration**
   - Vercel automatically provisions SSL certificates
   - Ensure HTTPS is enforced

7. **Post-Deployment Verification**
   - Test all forms and email functionality
   - Verify Google Search Console verification
   - Check mobile responsiveness
   - Test loading performance

## Monitoring and Maintenance

- Set up Vercel Analytics for performance monitoring
- Configure alerts for build failures
- Regularly check email delivery status in Resend dashboard

## Troubleshooting

If you encounter issues with email delivery:
1. Check Resend dashboard for delivery status
2. Verify RESEND_API_KEY is correctly set
3. Check server logs in Vercel dashboard

For website performance issues:
1. Run Lighthouse audit
2. Check Vercel Analytics
3. Review server-side rendering performance

## Backup and Recovery

- Ensure Git repository is up to date
- Consider setting up automatic database backups if applicable
- Document recovery procedures
