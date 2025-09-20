# Nirman-2_2025

A modern student project submission portal built with React and Node.js for the Nirman 2.0 2025 competition.

## Features

- 🚀 **Modern UI**: Beautiful, responsive design with TailwindCSS
- 📝 **Project Submission**: Submit projects with team name, GitHub link, deployment link, and project files
- 📊 **Live Showcase**: View all submitted projects in real-time
- 🔒 **Secure**: Input validation and security headers
- ☁️ **Cloud Ready**: MongoDB Atlas integration and Vercel deployment ready

## Tech Stack

### Frontend
- React 18
- TailwindCSS
- Modern JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer for file uploads

## Project Structure

```
nirman-2-2025/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SubmissionForm.js
│   │   │   └── SubmissionsTable.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                 # Node.js backend
│   ├── uploads/           # File upload directory
│   ├── index.js
│   └── package.json
└── README.md
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=5000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-domain.vercel.app/api
```

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ManmathX/Nirman-2_2025.git
   cd Nirman-2_2025
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB Atlas connection string
   
   # Frontend
   cd ../client
   cp .env.example .env
   # Edit .env with your backend API URL
   ```

4. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

## Deployment

### Vercel Deployment

1. **Deploy Backend**
   - Connect your GitHub repository to Vercel
   - Set build command: `cd server && npm install`
   - Set output directory: `server`
   - Add environment variables in Vercel dashboard

2. **Deploy Frontend**
   - Create a new Vercel project for frontend
   - Set build command: `cd client && npm install && npm run build`
   - Set output directory: `client/build`
   - Add environment variables

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/submit` - Submit a new project
- `GET /api/submissions` - Get all submissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Powered by Revamp

Built with ❤️ for Nirman 2.0 2025# asdf
# asdf
# asdf
