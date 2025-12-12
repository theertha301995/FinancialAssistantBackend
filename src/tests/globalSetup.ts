export default async (): Promise<void> => {
  console.log('\n🚀 Starting test suite...\n');
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.LOG_LEVEL = 'error';
  
  // Any other global setup logic
};