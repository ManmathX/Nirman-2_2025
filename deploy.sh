#!/bin/bash

# Nirman-2_2025 Deployment Script
echo "🚀 Starting Nirman-2_2025 Deployment Process..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Nirman-2_2025 submission portal"
    git branch -M main
    git remote add origin https://github.com/ManmathX/Nirman-2_2025.git
    echo "✅ Git repository initialized"
else
    echo "📝 Adding changes to Git..."
    git add .
    git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "✅ Changes committed"
fi

# Push to GitHub
echo "🌐 Pushing to GitHub..."
git push -u origin main
echo "✅ Code pushed to GitHub"

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps for Vercel deployment:"
echo ""
echo "1. 🌐 Go to https://vercel.com/dashboard"
echo "2. 📥 Click 'New Project' and import from GitHub"
echo "3. 🔧 Select repository: ManmathX/Nirman-2_2025"
echo ""
echo "📦 SINGLE PROJECT DEPLOYMENT:"
echo "   - Root Directory: . (leave empty)"
echo "   - Framework: Other (or Create React App)"
echo "   - Build Command: (leave empty)"
echo "   - Environment Variables:"
echo "     MONGODB_URI = mongodb+srv://codemaverick143:codemaverick143@submission.7xzuzqm.mongodb.net/?retryWrites=true&w=majority&appName=Submission"
echo "     NODE_ENV = production"
echo "     PORT = 5000"
echo "     REACT_APP_API_URL = https://nirman-2-2025.vercel.app/api"
echo "     ALLOWED_ORIGINS = https://nirman-2-2025.vercel.app"
echo ""
echo "🎯 Your app will be available at: https://nirman-2-2025.vercel.app"
echo "🔗 Your repository: https://github.com/ManmathX/Nirman-2_2025"
echo "📖 Full deployment guide: Check DEPLOYMENT.md"