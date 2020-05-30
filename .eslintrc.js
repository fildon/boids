module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  root: true,
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'no-warning-comments': 'warn',
    'semi': 'error',
  }
};
