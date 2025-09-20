#!/bin/bash

# Niman2.0 Platform - Vercel Deployment Script

set -e

echo "🚀 Starting Niman2.0 Platform deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI is not installed.${NC}"
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo -e "${RED}❌ vercel.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${BLUE}🔍 Checking project structure...${NC}"

# Verify client directory
if [ ! -d "client" ]; then
    echo -e "${RED}❌ Client directory not found${NC}"
    exit 1
fi

# Verify server API directory
if [ ! -d "server/api" ]; then
    echo -e "${RED}❌ Server API directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project structure verified${NC}"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"

# Install client dependencies
echo -e "${YELLOW}Installing client dependencies...${NC}"
cd client
npm ci
cd ..

# Install server dependencies
echo -e "${YELLOW}Installing server dependencies...${NC}"
cd server
npm ci
cd ..

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Build client for production
echo -e "${BLUE}🏗️ Building client for production...${NC}"
cd client
npm run build:vercel
cd ..

echo -e "${GREEN}✅ Client build completed${NC}"

# Deploy to Vercel
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"

# Check if this is the first deployment
if [ ! -f ".vercel/project.json" ]; then
    echo -e "${YELLOW}📝 First time deployment - you'll need to configure the project${NC}"
    vercel --prod
else
    echo -e "${YELLOW}🔄 Redeploying existing project${NC}"
    vercel --prod
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls --scope=$(vercel whoami) | grep niman2-platform | head -1 | awk '{print $2}')

if [ ! -z "$DEPLOYMENT_URL" ]; then
    echo -e "${GREEN}🌐 Your application is live at: https://$DEPLOYMENT_URL${NC}"
    echo -e "${BLUE}📊 API Health Check: https://$DEPLOYMENT_URL/api/health${NC}"
else
    echo -e "${YELLOW}⚠️ Could not retrieve deployment URL. Check your Vercel dashboard.${NC}"
fi

echo -e "${BLUE}📋 Next steps:${NC}"
echo -e "1. Set up your MongoDB Atlas database"
echo -e "2. Configure environment variables in Vercel dashboard"
echo -e "3. Test your API endpoints"
echo -e "4. Set up custom domain (optional)"

echo -e "${GREEN}✨ Deployment script completed!${NC}"
