# Niman2.0 Platform - Vercel Deployment Guide

## 🚀 Quick Deployment

### Prerequisites
- [Vercel CLI](https://vercel.com/cli) installed globally: `npm i -g vercel`
- MongoDB Atlas account for database
- GitHub repository (recommended)

### 1. Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Get your connection string (replace `<password>` with your actual password):
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/niman2-production?retryWrites=true&w=majority
   ```

### 2. Environment Variables

Set these environment variables in your Vercel dashboard:

#### Required Variables:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/niman2-production?retryWrites=true&w=majority
NODE_ENV=production
```

#### Optional Variables:
```bash
ALLOWED_ORIGINS=https://your-domain.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Deploy to Vercel

#### Option A: Deploy via GitHub (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy on every push to main branch

#### Option B: Deploy via Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name: niman2-platform
# - Directory: ./
```

### 4. Configure Environment Variables

```bash
# Set MongoDB URI
vercel env add MONGODB_URI production

# Set Node environment
vercel env add NODE_ENV production

# Redeploy to apply environment variables
vercel --prod
```

### 5. Custom Domain (Optional)

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your custom domain

## 📁 Project Structure

```
niman2-platform/
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.production
├── server/                 # Serverless API
│   ├── api/
│   │   ├── health.js      # Health check endpoint
│   │   ├── submit.js      # Submit project endpoint
│   │   └── submissions.js # Get submissions endpoint
│   └── package.json
├── vercel.json            # Vercel configuration
└── VERCEL_DEPLOYMENT.md   # This file
```

## 🔧 API Endpoints

After deployment, your API will be available at:

- **Health Check**: `https://your-app.vercel.app/api/health`
- **Submit Project**: `POST https://your-app.vercel.app/api/submit`
- **Get Submissions**: `GET https://your-app.vercel.app/api/submissions`

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Start frontend (from client directory)
cd client
npm start

# The API endpoints will work automatically with Vercel CLI
vercel dev
```

## 📊 Monitoring

### Vercel Analytics
Enable Vercel Analytics in your dashboard for:
- Page views and performance metrics
- Core Web Vitals
- Real user monitoring

### Function Logs
View serverless function logs in:
- Vercel Dashboard > Functions tab
- Real-time logs during development with `vercel dev`

## 🔒 Security Features

- **CORS Protection**: Configured for your domain
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Server-side validation for all inputs
- **Security Headers**: XSS protection, content type validation
- **Environment Variables**: Secure storage of sensitive data

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check MongoDB URI in environment variables
   - Ensure database user has correct permissions
   - Verify network access in MongoDB Atlas

2. **API Routes Not Working**
   - Ensure `vercel.json` is in project root
   - Check function logs in Vercel dashboard
   - Verify API files are in `server/api/` directory

3. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are listed in `package.json`
   - Review build logs in Vercel dashboard

### Debug Commands:

```bash
# Check deployment status
vercel ls

# View function logs
vercel logs

# Test API endpoints locally
vercel dev
```

## 📈 Performance Optimization

- **Static Assets**: Automatically optimized by Vercel
- **Edge Caching**: API responses cached at edge locations
- **Serverless Functions**: Auto-scaling based on demand
- **Image Optimization**: Built-in image optimization
- **Bundle Analysis**: Use `npm run build` to analyze bundle size

## 🔄 Updates and Maintenance

1. **Automatic Deployments**: Push to main branch for auto-deploy
2. **Environment Updates**: Use Vercel dashboard or CLI
3. **Database Maintenance**: Monitor MongoDB Atlas metrics
4. **Performance Monitoring**: Check Vercel Analytics regularly

## 📞 Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas Support**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Project Issues**: Create an issue in your GitHub repository

---

**🎉 Your Niman2.0 Platform is now ready for production on Vercel!**
