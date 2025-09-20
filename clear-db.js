import mongoose from 'mongoose';

// MongoDB Atlas connection
const MONGODB_URI = 'mongodb+srv://codemaverick143:<db_password>@submission.7xzuzqm.mongodb.net/?retryWrites=true&w=majority&appName=Submission';

// Connect to MongoDB
mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

db.once('open', async () => {
  console.log('Connected to MongoDB Atlas');
  
  try {
    // Clear all submissions
    const result = await mongoose.connection.db.collection('submissions').deleteMany({});
    console.log(`Cleared ${result.deletedCount} submissions from database`);
    
    // List all collections to verify
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    console.log('Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
});
