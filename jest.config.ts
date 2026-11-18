import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.ts and .env files in your test environment
  dir: "./",
});

const config: Config = {
  // Test environment that simulates a browser
  testEnvironment: "jest-environment-jsdom",

  // Setup files run after the test framework is installed
  setupFilesAfterFramework: ["<rootDir>/jest.setup.ts"],

  // Which files to collect coverage from
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
  ],

  // Coverage thresholds (adjust as project matures)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Module name mapper for @/ path alias and static assets
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    // Handle CSS modules
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    // Handle static files
    "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$":
      "<rootDir>/__mocks__/fileMock.ts",
  },

  // Transform patterns – next/jest handles most transforms; add more if needed
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          // Relax some strict options that cause issues in test environment
          exactOptionalPropertyTypes: false,
          noUncheckedIndexedAccess: false,
        },
      },
    ],
  },

  // Test file patterns
  testMatch: [
    "<rootDir>/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/**/*.{spec,test}.{ts,tsx}",
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/e2e/",
    "<rootDir>/__tests__/e2e/",
  ],

  // Module file extensions
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // Verbose output in CI
  verbose: true,

  // Automatically reset mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the
// Next.js config which is async.
export default createJestConfig(config);
