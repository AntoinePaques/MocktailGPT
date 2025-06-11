module.exports = [
  {
    files: ['**/*.ts'],
    ignores: ['generated/**', 'dist/**'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      semi: ['error', 'always'],
    },
  },
];
