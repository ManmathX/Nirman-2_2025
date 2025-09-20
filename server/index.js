import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configure multer for file uploads
// For Vercel deployment, use memory storage instead of disk storage
const storage = NODE_ENV === 'production' 
  ? multer.memoryStorage() // Use memory storage for Vercel
  : multer.diskStorage({   // Use disk storage for local development
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.originalname.toLowerCase().endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('Only .zip files are allowed'), false);
    }
  }
});

// Security and Performance Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS Configuration
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://your-frontend-domain.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Request logging for production
if (NODE_ENV === 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
    next();
  });
}

// MongoDB connection with production optimizations
const mongoOptions = {
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE) || 10,
  minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE) || 5,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Use local MongoDB for now - replace with your MongoDB Atlas password
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/submission-portal';

mongoose.connect(MONGODB_URI, mongoOptions);

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  if (NODE_ENV === 'production') {
    process.exit(1);
  }
});

db.once('open', () => {
  console.log(`Connected to MongoDB - Environment: ${NODE_ENV}`);
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});

// Submission Schema
const submissionSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  githubLink: {
    type: String,
    required: true,
    trim: true
  },
  deploymentLink: {
    type: String,
    required: true,
    trim: true
  },
  zipFileName: {
    type: String,
    required: true,
    trim: true
  },
  zipFilePath: {
    type: String,
    required: true,
    trim: true
  },
  solution: {
    type: String,
    required: true,
    trim: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const Submission = mongoose.model('Submission', submissionSchema);

// Validation middleware
const validateSubmission = [
  body('teamName')
    .trim()
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Team name must be between 1 and 100 characters'),
  
  body('githubLink')
    .trim()
    .isURL()
    .withMessage('GitHub link must be a valid URL')
    .custom((value) => {
      if (!value.includes('github.com')) {
        throw new Error('GitHub link must be from github.com');
      }
      return true;
    }),
  
  body('deploymentLink')
    .trim()
    .notEmpty()
    .withMessage('Deployment link is required')
    .isURL()
    .withMessage('Deployment link must be a valid URL'),
  
  body('solution')
    .trim()
    .notEmpty()
    .withMessage('Solution/Description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Solution must be between 10 and 2000 characters')
];

// Routes

// Rate limiting for production
const rateLimit = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  requests: new Map(),
  
  middleware: (req, res, next) => {
    if (NODE_ENV !== 'production') return next();
    
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - rateLimit.windowMs;
    
    // Clean old entries
    for (const [ip, timestamps] of rateLimit.requests.entries()) {
      const validTimestamps = timestamps.filter(time => time > windowStart);
      if (validTimestamps.length === 0) {
        rateLimit.requests.delete(ip);
      } else {
        rateLimit.requests.set(ip, validTimestamps);
      }
    }
    
    // Check current IP
    const clientRequests = rateLimit.requests.get(clientIP) || [];
    const recentRequests = clientRequests.filter(time => time > windowStart);
    
    if (recentRequests.length >= rateLimit.maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(rateLimit.windowMs / 1000)
      });
    }
    
    recentRequests.push(now);
    rateLimit.requests.set(clientIP, recentRequests);
    next();
  }
};

// Apply rate limiting to API routes
app.use('/api', rateLimit.middleware);

// Health check with detailed status
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      database: dbStatus,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    };
    
    if (dbStatus === 'disconnected') {
      healthStatus.status = 'unhealthy';
      return res.status(503).json(healthStatus);
    }
    
    res.json(healthStatus);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

// Submit a new project
app.post('/api/submit', upload.single('zipFile'), validateSubmission, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { teamName, githubLink, deploymentLink, solution } = req.body;

    // Check if team already submitted
    const existingSubmission = await Submission.findOne({ teamName });
    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'Team has already submitted a project'
      });
    }

    // Prepare submission data
    const submissionData = {
      teamName,
      githubLink,
      deploymentLink,
      solution
    };

    // Handle file upload (required)
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Project files upload is required'
      });
    }
    
    submissionData.zipFileName = req.file.originalname;
    
    // For production (Vercel), store file in memory; for development, store on disk
    if (NODE_ENV === 'production') {
      // In production, we'll store the file buffer in the database or cloud storage
      // For now, we'll just store the filename and indicate it was uploaded
      submissionData.zipFilePath = 'uploaded-to-cloud';
    } else {
      // In development, store the local file path
      submissionData.zipFilePath = req.file.path;
    }

    // Create new submission
    const submission = new Submission(submissionData);
    await submission.save();

    res.status(201).json({
      success: true,
      message: 'Project submitted successfully!',
      data: submission
    });

  } catch (error) {
    console.error('Error submitting project:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      try {
        const fs = await import('fs');
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up uploaded file:', cleanupError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find()
      .sort({ submittedAt: -1 })
      .select('teamName githubLink deploymentLink zipFileName solution submittedAt');

    res.json({
      success: true,
      data: submissions
    });

  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
