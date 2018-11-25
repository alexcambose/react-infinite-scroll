module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    'jest/globals': true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['react', 'jest'],
  rules: {
    // indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'react/destructuring-assignment': 'off'
    'react/sort-comp': 'off'
  }
};
