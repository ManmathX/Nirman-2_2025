# 🚀 Quick Deployment Reference

## 📋 **Step 1: Push to GitHub**
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/ManmathX/Nirman-2_2025.git
git push -u origin main
```

## 📋 **Step 2: Deploy Everything as One Project**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import: `ManmathX/Nirman-2_2025`
4. Settings:
   - **Project Name**: nirman2025
   - **Root Directory**: `.` (leave empty)
   - **Framework**: Other (or Create React App)
   - **Build Command**: (leave empty)
5. Environment Variables:
   ```
   MONGODB_URI = mongodb+srv://codemaverick143:codemaverick143@submission.7xzuzqm.mongodb.net/?retryWrites=true&w=majority&appName=Submission
   NODE_ENV = production
   PORT = 5000
   REACT_APP_API_URL = https://nirman2025.vercel.app/api
   ALLOWED_ORIGINS = https://nirman2025.vercel.app
   ```
6. Deploy

## ✅ **Final URLs**
- **Main App**: `https://nirman2025.vercel.app`
- **API**: `https://nirman2025.vercel.app/api`

## 🎯 **Test**
1. Visit main app URL
2. Submit a test project
3. Check if it appears in the table

---
**Ready to deploy! 🚀**
