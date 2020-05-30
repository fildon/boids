module.exports = {
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: 'reports/coverage',
  testPathIgnorePatterns: [
    "<rootDir>/.stryker-tmp",
  ],
}
