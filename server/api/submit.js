// Submit project endpoint for Vercel deployment
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';

// MongoDB connection helper
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    cachedConnection = connection;
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

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
  driveLink: {
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

// Get or create model
const getSubmissionModel = () => {
  return mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
};

// Validation functions
const validateSubmission = (data) => {
  const errors = [];

  if (!data.teamName || data.teamName.trim().length === 0) {
    errors.push({ field: 'teamName', message: 'Team name is required' });
  } else if (data.teamName.trim().length > 100) {
    errors.push({ field: 'teamName', message: 'Team name must be less than 100 characters' });
  }

  if (!data.githubLink || data.githubLink.trim().length === 0) {
    errors.push({ field: 'githubLink', message: 'GitHub link is required' });
  } else {
    try {
      new URL(data.githubLink);
      if (!data.githubLink.includes('github.com')) {
        errors.push({ field: 'githubLink', message: 'Please enter a valid GitHub repository URL' });
      }
    } catch {
      errors.push({ field: 'githubLink', message: 'Please enter a valid URL' });
    }
  }

  if (!data.deploymentLink || data.deploymentLink.trim().length === 0) {
    errors.push({ field: 'deploymentLink', message: 'Deployment link is required' });
  } else {
    try {
      new URL(data.deploymentLink);
    } catch {
      errors.push({ field: 'deploymentLink', message: 'Please enter a valid deployment URL' });
    }
  }

  if (!data.driveLink || data.driveLink.trim().length === 0) {
    errors.push({ field: 'driveLink', message: 'Google Drive link is required' });
  } else {
    try {
      new URL(data.driveLink);
      if (!data.driveLink.includes('drive.google.com') && !data.driveLink.includes('docs.google.com')) {
        errors.push({ field: 'driveLink', message: 'Please enter a valid Google Drive share link' });
      }
    } catch {
      errors.push({ field: 'driveLink', message: 'Please enter a valid URL' });
    }
  }

  if (!data.solution || data.solution.trim().length === 0) {
    errors.push({ field: 'solution', message: 'Solution/Description is required' });
  } else if (data.solution.trim().length < 10) {
    errors.push({ field: 'solution', message: 'Solution must be at least 10 characters long' });
  } else if (data.solution.trim().length > 2000) {
    errors.push({ field: 'solution', message: 'Solution must be less than 2000 characters' });
  }

  return errors;
};

// Rate limiting helper
const rateLimitMap = new Map();

const checkRateLimit = (ip) => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // 5 submissions per 15 minutes

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const requests = rateLimitMap.get(ip);
  const validRequests = requests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false;
  }

  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  return true;
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Rate limiting
    const clientIP = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        success: false,
        message: 'Too many submissions. Please try again later.',
        retryAfter: 900 // 15 minutes
      });
    }

    // Connect to database
    await connectToDatabase();
    const Submission = getSubmissionModel();

    // Validate input
    const validationErrors = validateSubmission(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const { teamName, githubLink, deploymentLink, driveLink, solution } = req.body;

    // Check if team already submitted
    const existingSubmission = await Submission.findOne({ 
      teamName: teamName.trim() 
    });
    
    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'Team has already submitted a project'
      });
    }

    // Create new submission
    const submission = new Submission({
      teamName: teamName.trim(),
      githubLink: githubLink.trim(),
      deploymentLink: deploymentLink.trim(),
      driveLink: driveLink.trim(),
      solution: solution.trim()
    });

    await submission.save();

    res.status(201).json({
      success: true,
      message: 'Project submitted successfully!',
      data: {
        id: submission._id,
        teamName: submission.teamName,
        submittedAt: submission.submittedAt
      }
    });

  } catch (error) {
    console.error('Error submitting project:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
