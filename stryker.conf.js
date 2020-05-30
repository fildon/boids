module.exports = {
  mutate: [
    'src/**/*.ts'
  ],
  mutator: 'typescript',
  testFramework: 'jest',
  testRunner: 'jest',
  transpilers: [
    'typescript'
  ],
  tsconfigFile: 'tsconfig.json'
};
