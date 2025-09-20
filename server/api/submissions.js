// Get all submissions endpoint for Vercel deployment
import mongoose from 'mongoose';

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

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Connect to database
    await connectToDatabase();
    const Submission = getSubmissionModel();

    // Get query parameters
    const { page = 1, limit = 50, sort = 'newest' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100); // Max 100 items per page
    const skip = (pageNum - 1) * limitNum;

    // Determine sort order
    let sortOption = { submittedAt: -1 }; // Default: newest first
    if (sort === 'oldest') {
      sortOption = { submittedAt: 1 };
    } else if (sort === 'name') {
      sortOption = { teamName: 1 };
    }

    // Fetch submissions with pagination
    const [submissions, total] = await Promise.all([
      Submission.find()
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .select('teamName githubLink deploymentLink driveLink solution submittedAt')
        .lean(),
      Submission.countDocuments()
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNext = pageNum < totalPages;
    const hasPrev = pageNum > 1;

    res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        current: pageNum,
        total: totalPages,
        count: submissions.length,
        totalItems: total,
        hasNext,
        hasPrev,
        limit: limitNum
      },
      meta: {
        timestamp: new Date().toISOString(),
        sort: sort
      }
    });

  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
