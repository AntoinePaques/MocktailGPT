const ts = require('typescript-eslint')

module.exports = [
  ...ts.configs.recommended,
  {
    ignores: ['dist/**/*', 'node_modules/**/*'],
    rules: {
      'no-console': 'off'
    }
  }
]
