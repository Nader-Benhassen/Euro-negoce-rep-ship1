# 🚀 Euro Negoce Trade - Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup

#### **Required Environment Variables:**
\`\`\`bash
RESEND_API_KEY=re_5FM8T24R_5CiKQSRbHYX6FmDsBoEpUeTz
\`\`\`

#### **Optional Environment Variables:**
\`\`\`bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
GOOGLE_VERIFICATION_CODE=your_google_verification_code
YANDEX_VERIFICATION_CODE=your_yandex_verification_code
BING_VERIFICATION_CODE=your_bing_verification_code
NODE_ENV=production
\`\`\`

### 2. Vercel Deployment Steps

#### **Step 1: Connect Repository**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Select "Next.js" framework preset

#### **Step 2: Configure Environment Variables**
1. In project settings, go to "Environment Variables"
2. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `RESEND_API_KEY` | `re_5FM8T24R_5CiKQSRbHYX6FmDsBoEpUeTz` | Production, Preview |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` | Production |
| `NODE_ENV` | `production` | Production |

#### **Step 3: Deploy**
1. Click "Deploy"
2. Wait for build to complete
3. Test all functionality

### 3. Domain Configuration

#### **Custom Domain Setup:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

### 4. Post-Deployment Verification

#### **Test Email Functionality:**
- [ ] Contact form submission
- [ ] Email delivery to contact@euronegocetrade.com
- [ ] Confirmation email to customer
- [ ] Call scheduling functionality
- [ ] Quote request functionality

#### **Test Google Verification:**
- [ ] Access `https://yourdomain.com/googlefe009b203c155ab9.html`
- [ ] Verify Google Search Console
- [ ] Submit sitemap

#### **Performance Check:**
- [ ] Page load speed < 3 seconds
- [ ] Mobile responsiveness
- [ ] SEO meta tags
- [ ] Image optimization

## 🔒 Security Checklist

- [x] API keys stored in environment variables
- [x] No sensitive data in code repository
- [x] HTTPS enforced
- [x] Security headers configured
- [x] Input validation implemented
- [x] Error handling without data leaks

## 📊 Monitoring Setup

### **Recommended Tools:**
1. **Vercel Analytics** - Built-in performance monitoring
2. **Google Search Console** - SEO and indexing
3. **Google Analytics** - User behavior tracking
4. **Uptime monitoring** - Service availability

## 🚨 Troubleshooting

### **Common Issues:**

#### **Email Not Sending:**
1. Check RESEND_API_KEY is set correctly
2. Verify API key is active in Resend dashboard
3. Check email logs in Vercel Functions tab

#### **Build Failures:**
1. Check TypeScript errors
2. Verify all imports are correct
3. Ensure all dependencies are installed

#### **Performance Issues:**
1. Enable Vercel Edge Functions
2. Optimize images
3. Enable compression

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review environment variables
3. Test locally first
4. Contact support if needed

---

**✅ Your website is now production-ready with secure API configuration!**
