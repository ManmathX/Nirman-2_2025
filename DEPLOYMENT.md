# 🚀 Nirman-2_2025 Deployment Guide

## 📋 **Single Project Vercel Deployment (Recommended)**

### **Step 1: Push Code to GitHub**

Run these commands in your terminal:

```bash
# Navigate to your project directory
cd "/Users/manmathmohanty/Desktop/oniman2.0 submmision"

# Initialize Git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "first commit"

# Set main branch
git branch -M main

# Add remote origin
git remote add origin https://github.com/ManmathX/Nirman-2_2025.git

# Push to GitHub
git push -u origin main
```

### **Step 2: Deploy Both Backend & Frontend as One Project**

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "New Project"**

3. **Import from GitHub**
   - Click "Import Git Repository"
   - Select `ManmathX/Nirman-2_2025`
   - Click "Import"

4. **Configure Project Settings**
   ```
   Project Name: nirman2025
   Framework Preset: Other (or Create React App)
   Root Directory: . (leave empty - use root)
   Build Command: (leave empty - Vercel will auto-detect)
   Output Directory: (leave empty - Vercel will auto-detect)
   Install Command: (leave empty - Vercel will auto-detect)
   ```

5. **Add Environment Variables**
   Click "Environment Variables" and add these:
   ```
   MONGODB_URI = mongodb+srv://codemaverick143:codemaverick143@submission.7xzuzqm.mongodb.net/?retryWrites=true&w=majority&appName=Submission
   NODE_ENV = production
   PORT = 5000
   REACT_APP_API_URL = https://nirman2025.vercel.app/api
   ALLOWED_ORIGINS = https://nirman2025.vercel.app
   ```

6. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - **Your app will be available at**: `https://nirman2025.vercel.app`

> **💡 How it works**: Vercel will automatically detect your monorepo structure using the root `vercel.json` file. It will:
> - Deploy the React frontend from the `client/` directory
> - Deploy the Node.js backend from the `server/` directory as serverless functions
> - Route `/api/*` requests to your backend
> - Serve the React app for all other routes

### **Step 3: Test Your Deployment**

1. **Visit your app URL**: `https://nirman2025.vercel.app`
2. **Test the submission form** with all fields
3. **Check if submissions appear** in the table
4. **Verify file upload** is working

## 🔧 **Environment Variables Summary**

### **All Environment Variables in One Vercel Project:**
```
MONGODB_URI = mongodb+srv://codemaverick143:codemaverick143@submission.7xzuzqm.mongodb.net/?retryWrites=true&w=majority&appName=Submission
NODE_ENV = production
PORT = 5000
REACT_APP_API_URL = https://nirman2025.vercel.app/api
ALLOWED_ORIGINS = https://nirman2025.vercel.app
```

## ✅ **Deployment Checklist**

- [ ] ✅ Code pushed to GitHub successfully
- [ ] ✅ Single project deployed to Vercel
- [ ] ✅ All environment variables added
- [ ] ✅ Deployment successful
- [ ] ✅ Frontend accessible at main URL
- [ ] ✅ Backend API working at /api routes
- [ ] ✅ Form submission working
- [ ] ✅ MongoDB connection working
- [ ] ✅ File upload functionality tested

## 🐛 **Troubleshooting Common Issues**

### **Issue 1: CORS Errors**
**Symptoms**: Browser shows CORS error in console
**Solution**: 
- Check `ALLOWED_ORIGINS` in backend matches frontend URL exactly
- Ensure URL includes `https://` and no trailing slash
- Redeploy backend after updating environment variables

### **Issue 2: API Not Found (404)**
**Symptoms**: Frontend shows "API not found" error
**Solution**:
- Verify `REACT_APP_API_URL` includes `/api` at the end
- Check that backend is deployed and accessible
- Test backend URL directly in browser

### **Issue 3: MongoDB Connection Failed**
**Symptoms**: Backend logs show MongoDB connection error
**Solution**:
- Verify connection string is correct
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

### **Issue 4: Build Failures**
**Symptoms**: Vercel deployment fails during build
**Solution**:
- Check Vercel build logs for specific errors
- Verify all dependencies are in package.json
- Check for syntax errors in code

## 🔗 **Useful Links**

- [Vercel Dashboard](https://vercel.com/dashboard)
- [MongoDB Atlas](https://cloud.mongodb.com/)
- [GitHub Repository](https://github.com/ManmathX/Nirman-2_2025)

## 📱 **Your Final URLs**

After successful deployment, you'll have:
- **Main App**: `https://nirman2025.vercel.app`
- **API Endpoint**: `https://nirman2025.vercel.app/api`
- **Frontend**: `https://nirman2025.vercel.app` (same as main app)
- **Backend**: `https://nirman2025.vercel.app/api` (API routes)

## 🎉 **Success!**

Your **Nirman-2_2025** submission portal is now live and ready for students to submit their projects with:
- ✅ Team name submission
- ✅ GitHub repository links
- ✅ Deployment links
- ✅ Zip file uploads
- ✅ Project descriptions
- ✅ Real-time submission display

**Students can now visit your frontend URL and start submitting their projects!** 🚀

---

**Built with ❤️ for Nirman 2.0 2025**
