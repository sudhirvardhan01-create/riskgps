module.exports = {
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};