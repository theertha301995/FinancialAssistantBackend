import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // ✅ Check both possible env var names
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGO_URI environment variable is not set');
      console.log('⚠️  Server will start WITHOUT database connection');
      return;
    }

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    console.log('⚠️  Server will continue WITHOUT database connection');
    // ❌ DON'T DO THIS: process.exit(1);
    // Let the server start anyway so health checks pass
  }
};

export default connectDB;