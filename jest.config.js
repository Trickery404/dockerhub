// jest.config.js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // 1) Tell Jest to ignore everything under /node_modules/ and /dist/
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],

  // 2) Instruct Jest to look for *.spec.ts (and also *.test.ts if you want):
  //    **/?(*.)+(spec|test).[jt]s?(x)
  //    └─> matches:     foo.spec.ts, bar.test.ts, baz.spec.tsx, qux.test.js
  //
  // If you only ever use *.spec.ts, you can tighten it to "**/*.spec.ts"
  testMatch: [
    '<rootDir>/**/*.spec.ts',
    '<rootDir>/**/*.test.ts'
  ],

  // (Optional) If your source lives under "app/" or "src/" and you do not want to search other folders,
  // you can restrict Jest’s “roots”:
  // roots: ['<rootDir>/app', '<rootDir>/src'],

  // 3) Make sure coverage is only collected from your TypeScript source (optional):
  // collectCoverageFrom: ['app/**/*.ts', 'src/**/*.ts']
};
