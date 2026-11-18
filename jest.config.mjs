import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '<rootDir>/__tests__/unit/**/*.{ts,tsx}',
    '<rootDir>/__tests__/integration/**/*.{ts,tsx}',
    '<rootDir>/**/*.test.{ts,tsx}',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/__tests__/e2e/',
    '<rootDir>/e2e/',
  ],
  verbose: true,
  clearMocks: true,
};

export default createJestConfig(config);
