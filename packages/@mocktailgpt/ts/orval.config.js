// orval.config.js
// Généré ou édité par le CLI (mocktail generate)
// Jamais exposé à l’utilisateur final

const mocktailConfig = require(process.cwd() + '/mocktail.config.js');

module.exports = {
  [mocktailConfig.clientName || 'api']: {
    output: {
      mode: 'single',
      target: `${mocktailConfig.output || './generated'}/index.ts`,
      schemas: `${mocktailConfig.output || './generated'}/schemas`,
      client: 'react-query', // Peut être 'fetch', 'axios', 'react-query'...
      override: {
        mutator: mocktailConfig.mutators || undefined,
      },
    },
    input: {
      target: mocktailConfig.swagger,
    },
  },
};
