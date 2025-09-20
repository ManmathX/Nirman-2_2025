import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
let mockSubmissions = [
  {
    _id: '1',
    teamName: 'Demo Team',
    githubLink: 'https://github.com/demo/project',
    deploymentLink: 'https://demo-project.vercel.app',
    driveLink: 'https://drive.google.com/drive/folders/1234567890',
    solution: 'This is a demo project showcasing the new Google Drive integration feature. The project includes modern React components with professional styling.',
    submittedAt: new Date().toISOString()
  }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Mock server is running',
    timestamp: new Date().toISOString()
  });
});

// Get submissions endpoint
app.get('/api/submissions', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockSubmissions,
      pagination: {
        current: 1,
        total: 1,
        count: mockSubmissions.length,
        totalItems: mockSubmissions.length,
        hasNext: false,
        hasPrev: false,
        limit: 50
      },
      meta: {
        timestamp: new Date().toISOString(),
        sort: 'newest'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Submit project endpoint
app.post('/api/submit', (req, res) => {
  try {
    const { teamName, githubLink, deploymentLink, driveLink, solution } = req.body;

    // Basic validation
    if (!teamName || !githubLink || !deploymentLink || !driveLink || !solution) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        errors: []
      });
    }

    // Check if team already exists
    const existingSubmission = mockSubmissions.find(sub => 
      sub.teamName.toLowerCase() === teamName.toLowerCase()
    );

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'Team has already submitted a project'
      });
    }

    // Create new submission
    const newSubmission = {
      _id: Date.now().toString(),
      teamName: teamName.trim(),
      githubLink: githubLink.trim(),
      deploymentLink: deploymentLink.trim(),
      driveLink: driveLink.trim(),
      solution: solution.trim(),
      submittedAt: new Date().toISOString()
    };

    mockSubmissions.unshift(newSubmission);

    res.status(201).json({
      success: true,
      message: 'Project submitted successfully!',
      data: {
        id: newSubmission._id,
        teamName: newSubmission.teamName,
        submittedAt: newSubmission.submittedAt
      }
    });

  } catch (error) {
    console.error('Error submitting project:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock server running on http://localhost:${PORT}`);
  console.log('📝 Available endpoints:');
  console.log('  - GET  /api/health');
  console.log('  - GET  /api/submissions');
  console.log('  - POST /api/submit');
  console.log('');
  console.log('✅ Ready to test Google Drive integration!');
});
