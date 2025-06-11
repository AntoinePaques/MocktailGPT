module.exports = {
  swagger: './swagger.yaml',           // Path to your swagger file
  output: './generated',               // Output dir for generated SDK
  clientName: 'api',                   // Exported client variable name
  mock: false,                         // Enable MSW mocks (future)
  mutators: {
    // Example:
    // search: './src/mutators/searchMutator.js'
  },
  hooks: {
    // Example:
    // onRequest: './src/hooks/onRequest.js'
  }
};
