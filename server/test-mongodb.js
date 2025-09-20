import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testMongoConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📋 Connection string:', process.env.MONGODB_URI?.replace(/\/\/.*:.*@/, '//***:***@'));
    
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database name:', connection.connection.db.databaseName);
    console.log('🌐 Connection state:', mongoose.connection.readyState);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error type:', error.constructor.name);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 8000) {
      console.log('\n🔧 Possible solutions:');
      console.log('1. Check if username/password are correct');
      console.log('2. Verify the database user exists in MongoDB Atlas');
      console.log('3. Check if your IP address is whitelisted');
      console.log('4. Ensure the database user has proper permissions');
    }
    
    process.exit(1);
  }
}

testMongoConnection();
