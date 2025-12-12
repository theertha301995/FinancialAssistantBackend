import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeAll, afterEach, afterAll } from '@jest/globals';
let mongoServer: MongoMemoryServer;

// Connect to in-memory MongoDB before all tests
beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log('Test database connected');
  } catch (error) {
    console.error('Error connecting to test database:', error);
  }
});

// Clear all test data after each test
afterEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (error) {
    console.error('Error clearing test data:', error);
  }
});

// Disconnect and stop MongoDB after all tests
afterAll(async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('Test database disconnected');
  } catch (error) {
    console.error('Error disconnecting test database:', error);
  }
});