# Deployment Guide

## Deploying to Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications. It's created by the same team that built Next.js.

### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free tier available)
- MongoDB Atlas account (for production database)

### Step 1: Prepare Your Repository

1. **Commit all changes**
```bash
git add .
git commit -m "Ready for deployment"
```

2. **Push to GitHub**
```bash
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign up/Sign in with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   Add all variables from your `.env` file:
   ```
   MONGO_URI
   JWT_SECRET
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   TWILIO_ACCOUNT_SID
   TWILIO_AUTH_TOKEN
   TWILIO_PHONE_NUMBER
   NEXT_PUBLIC_API_URL
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - Your site will be live at `https://your-project.vercel.app`

### Step 3: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for DNS propagation (up to 24 hours)

## Alternative: Deploy to Netlify

### Step 1: Build Configuration

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Step 2: Deploy

1. Go to https://netlify.com
2. Sign in with GitHub
3. Click "New site from Git"
4. Select repository
5. Add environment variables
6. Deploy

## Alternative: Deploy to Railway

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Deploy
```bash
railway login
railway init
railway up
```

## Alternative: Deploy to Your Own Server (VPS)

### Requirements
- Ubuntu 20.04+ server
- Node.js 18+
- MongoDB installed or Atlas connection
- Nginx (for reverse proxy)
- PM2 (for process management)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### Step 2: Clone and Build

```bash
# Clone repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# Install dependencies
npm install

# Create .env file
nano .env
# Add all environment variables

# Build application
npm run build
```

### Step 3: Start with PM2

```bash
# Start application
pm2 start npm --name "real-estate" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/real-estate
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/real-estate /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Environment Variables for Production

Update these for production:

```env
# Use production MongoDB
MONGO_URI=mongodb+srv://prod-user:password@cluster.mongodb.net/estatehub

# Generate new JWT secret
JWT_SECRET=production_secret_key_minimum_32_characters

# Update API URL
NEXT_PUBLIC_API_URL=https://your-domain.com

# Production Cloudinary
CLOUDINARY_CLOUD_NAME=prod_cloud_name
CLOUDINARY_API_KEY=prod_api_key
CLOUDINARY_API_SECRET=prod_api_secret

# Production Twilio (remove trial restrictions)
TWILIO_ACCOUNT_SID=prod_account_sid
TWILIO_AUTH_TOKEN=prod_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

## Database Setup for Production

### MongoDB Atlas

1. **Create Production Cluster**
   - Go to MongoDB Atlas
   - Create new cluster or use existing
   - Create database user
   - Whitelist IP addresses (or 0.0.0.0/0 for all)

2. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/estatehub
   ```

3. **Security**
   - Use strong passwords
   - Enable IP whitelisting
   - Use separate credentials for production

## Post-Deployment Checklist

- [ ] All environment variables set
- [ ] Database connection working
- [ ] File uploads to Cloudinary working
- [ ] SMS/OTP functionality working
- [ ] All pages loading correctly
- [ ] Authentication working
- [ ] Admin panel accessible
- [ ] API routes responding
- [ ] Images displaying correctly
- [ ] Mobile responsive
- [ ] SSL certificate installed
- [ ] Custom domain configured (if applicable)

## Monitoring & Maintenance

### Vercel Dashboard
- Monitor deployments
- Check build logs
- View analytics
- Monitor performance

### Application Monitoring
Consider adding:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Google Analytics** - User analytics
- **Uptime Robot** - Uptime monitoring

### Regular Maintenance
```bash
# Update dependencies monthly
npm update

# Check for security vulnerabilities
npm audit
npm audit fix

# Monitor database size
# Clean up old data periodically
```

## Rollback Strategy

### Vercel
- Go to Deployments
- Find previous successful deployment
- Click "Promote to Production"

### PM2 (VPS)
```bash
# Stop current version
pm2 stop real-estate

# Pull previous version
git reset --hard HEAD~1
npm install
npm run build

# Restart
pm2 restart real-estate
```

## Scaling

### Vercel
- Automatic scaling included
- Upgrade plan for higher limits

### VPS
- Use PM2 cluster mode:
```bash
pm2 start npm --name "real-estate" -i max -- start
```

- Add load balancer
- Use CDN for static assets
- Implement Redis for caching

## Troubleshooting Deployment Issues

### Build Fails
- Check Node.js version
- Review build logs
- Verify all dependencies installed
- Check for syntax errors

### Database Connection Issues
- Verify MongoDB URI
- Check IP whitelist
- Test connection string locally
- Ensure database user has proper permissions

### Environment Variables Not Working
- Restart deployment after adding variables
- Check variable names (case-sensitive)
- Verify NEXT_PUBLIC_ prefix for client-side variables

### Images Not Loading
- Add domain to next.config.js
- Check Cloudinary credentials
- Verify upload permissions

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Deployment completed!** Your application is now live! 🎉
