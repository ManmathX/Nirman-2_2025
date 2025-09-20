# 🚀 Vercel Deployment Configuration Guide

## 📁 Vercel Configuration Files

### 1. **Root Level (`vercel.json`)**
- **Purpose**: Deploy both frontend and backend as a single project
- **Use Case**: When you want everything in one Vercel project
- **Configuration**: Monorepo setup with separate builds

### 2. **Backend (`server/vercel.json`)**
- **Purpose**: Deploy only the backend API
- **Use Case**: Separate backend deployment
- **Configuration**: Node.js serverless functions

### 3. **Frontend (`client/vercel.json`)**
- **Purpose**: Deploy only the frontend React app
- **Use Case**: Separate frontend deployment
- **Configuration**: Static site generation

## 🎯 **Recommended Deployment Strategy**

### **Option 1: Separate Projects (Recommended)**

#### **Backend Deployment:**
1. **Project Settings:**
   ```
   Framework Preset: Other
   Root Directory: server
   Build Command: npm install
   Output Directory: . (empty)
   Install Command: npm install
   ```

2. **Environment Variables:**
   ```
   MONGODB_URI = mongodb+srv://codemaverick143:codemaverick143@submission.7xzuzqm.mongodb.net/?retryWrites=true&w=majority&appName=Submission
   NODE_ENV = production
   PORT = 5000
   ALLOWED_ORIGINS = https://your-frontend-domain.vercel.app
   ```

#### **Frontend Deployment:**
1. **Project Settings:**
   ```
   Framework Preset: Create React App
   Root Directory: client
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

2. **Environment Variables:**
   ```
   REACT_APP_API_URL = https://your-backend-domain.vercel.app/api
   ```

### **Option 2: Single Project (Monorepo)**

1. **Project Settings:**
   ```
   Framework Preset: Other
   Root Directory: . (root)
   Build Command: (leave empty)
   Output Directory: (leave empty)
   Install Command: (leave empty)
   ```

2. **Environment Variables:**
   ```
   MONGODB_URI = mongodb+srv://codemaverick143:codemaverick143@submission.7xzuzqm.mongodb.net/?retryWrites=true&w=majority&appName=Submission
   NODE_ENV = production
   REACT_APP_API_URL = https://your-domain.vercel.app/api
   ```

## 🔧 **Configuration Details**

### **Backend Configuration (`server/vercel.json`)**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "index.js": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"]
}
```

### **Frontend Configuration (`client/vercel.json`)**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 🚀 **Step-by-Step Deployment**

### **For Separate Projects (Recommended):**

1. **Deploy Backend:**
   - Create new Vercel project
   - Set root directory to `server`
   - Add backend environment variables
   - Deploy and copy URL

2. **Deploy Frontend:**
   - Create new Vercel project
   - Set root directory to `client`
   - Add frontend environment variables with backend URL
   - Deploy and copy URL

3. **Update CORS:**
   - Go back to backend project
   - Update `ALLOWED_ORIGINS` with frontend URL
   - Redeploy backend

### **For Single Project:**

1. **Deploy Monorepo:**
   - Create new Vercel project
   - Use root directory
   - Add all environment variables
   - Deploy

## 🔍 **Troubleshooting**

### **Build Errors:**
- Check Vercel build logs
- Verify package.json scripts
- Ensure all dependencies are listed

### **Runtime Errors:**
- Check function logs in Vercel dashboard
- Verify environment variables
- Test API endpoints manually

### **CORS Issues:**
- Ensure `ALLOWED_ORIGINS` matches frontend URL exactly
- Check for trailing slashes
- Verify HTTPS protocol

## 📊 **Performance Optimization**

### **Backend:**
- Function timeout set to 30 seconds
- Region set to `iad1` (US East)
- Memory storage for file uploads

### **Frontend:**
- Static build optimization
- Security headers configured
- Proper routing for SPA

## 🎯 **Final URLs**

After successful deployment:
- **Backend**: `https://nirman-2-2025-backend.vercel.app`
- **Frontend**: `https://nirman-2-2025-frontend.vercel.app`
- **API Endpoint**: `https://nirman-2-2025-backend.vercel.app/api`

---

**Your Nirman-2_2025 submission portal is now ready for production! 🚀**