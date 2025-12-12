import type { Config } from 'jest';

const config: Config = {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest',

  // Set test environment to Node.js
  testEnvironment: 'node',

  // Inject Jest globals automatically (fixes beforeAll, afterAll, etc.)
  injectGlobals: true,

  // Directories where Jest should look for tests
  roots: ['<rootDir>/src', '<rootDir>/tests'],

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts',
  ],

  // Transform TypeScript files
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },

  // Coverage collection patterns
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.type.ts',
    '!src/server.ts',
    '!src/index.ts',
  ],

  // Coverage output directory
  coverageDirectory: 'coverage',

  // Coverage report formats
  coverageReporters: ['text', 'lcov', 'html', 'json'],

  // Coverage thresholds (set to 0 initially, increase as you add tests)
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },

  // Module name mapping for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },

  // Setup files to run after Jest environment is set up
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

  // Test timeout (30 seconds for integration tests with DB)
  testTimeout: 30000,

  // Display individual test results
  verbose: true,

  // Allow running Jest even when no tests are found
  passWithNoTests: true,

  // Automatically clear mock calls and instances between tests
  clearMocks: true,

  // Reset mock state between tests
  resetMocks: true,

  // Restore original implementations between tests
  restoreMocks: true,

  // Indicates whether each individual test should be reported during the run
  notify: false,

  // Maximum number of workers for parallel test execution
  maxWorkers: '50%',

  // Files to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Disable coverage for specific files/directories
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/tests/',
    '.interface.ts',
    '.type.ts',
    '.d.ts',
  ],

  // Detect open handles (useful for debugging)
  detectOpenHandles: false,

  // Force exit after tests complete
  forceExit: false,

  // Collect coverage from test files
  collectCoverage: false,

  // Bail out on first test failure
  bail: false,

  // Error on deprecated APIs
  errorOnDeprecated: false,
};

export default config;